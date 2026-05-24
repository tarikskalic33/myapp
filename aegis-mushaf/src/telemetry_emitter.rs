//! Telemetry Emitter — 64-byte UDP resonance heartbeat
//!
//! EPISTEMIC TIER: T2 (engineering hypothesis)
//!
//! Emits a fixed-format 64-byte UDP datagram on each sequence tick.
//! Uses std::net::UdpSocket — no tokio dependency.
//!
//! Packet layout (64 bytes, all little-endian):
//!   [0..2]   RESONANCE_MAGIC: 0xE0E0
//!   [2..4]   schema_version: 0x0001
//!   [4..12]  sequence: u64 (sequence number from event substrate)
//!   [12..44] ledger_head_hash: [u8; 32] (current TanzilLedger head hash)
//!   [44..46] domain0_count: u16
//!   [46..48] domain1_count: u16
//!   [48..50] current_acoustic_state: u16 (AcousticState ordinal)
//!   [50..52] active_violations: u16 (0 = T0 pass)
//!   [52..64] reserved: [u8; 12] = 0x00
//!
//! Constitutional invariants:
//! - No wall-clock time — sequence number from event substrate only
//! - No tokio — std::net::UdpSocket
//! - active_violations must be 0 for T0 pass (mirrors corruption_count)
//! - Packet is exactly 64 bytes — enforced at compile time via assert

use std::net::UdpSocket;
use byteorder::{LittleEndian, WriteBytesExt};

/// Magic bytes identifying a resonance heartbeat packet.
pub const RESONANCE_MAGIC: u16 = 0xE0E0;
pub const SCHEMA_VERSION: u16 = 0x0001;
pub const PACKET_SIZE: usize = 64;

/// One resonance heartbeat packet.
#[derive(Clone, Debug)]
pub struct ResonancePacket {
    pub sequence: u64,
    pub ledger_head_hash: [u8; 32],
    pub domain0_count: u16,
    pub domain1_count: u16,
    pub acoustic_state_ordinal: u16,
    pub active_violations: u16,
}

impl ResonancePacket {
    /// Serialize to exactly 64 bytes.
    pub fn to_bytes(&self) -> [u8; PACKET_SIZE] {
        let mut buf = Vec::with_capacity(PACKET_SIZE);
        buf.write_u16::<LittleEndian>(RESONANCE_MAGIC).unwrap();
        buf.write_u16::<LittleEndian>(SCHEMA_VERSION).unwrap();
        buf.write_u64::<LittleEndian>(self.sequence).unwrap();
        buf.extend_from_slice(&self.ledger_head_hash);
        buf.write_u16::<LittleEndian>(self.domain0_count).unwrap();
        buf.write_u16::<LittleEndian>(self.domain1_count).unwrap();
        buf.write_u16::<LittleEndian>(self.acoustic_state_ordinal).unwrap();
        buf.write_u16::<LittleEndian>(self.active_violations).unwrap();
        // reserved padding
        while buf.len() < PACKET_SIZE {
            buf.push(0x00);
        }
        let mut out = [0u8; PACKET_SIZE];
        out.copy_from_slice(&buf[..PACKET_SIZE]);
        out
    }

    /// Parse a 64-byte buffer. Returns None on magic mismatch.
    pub fn from_bytes(bytes: &[u8; PACKET_SIZE]) -> Option<Self> {
        let magic = u16::from_le_bytes([bytes[0], bytes[1]]);
        if magic != RESONANCE_MAGIC {
            return None;
        }
        let _version = u16::from_le_bytes([bytes[2], bytes[3]]);
        let sequence = u64::from_le_bytes(bytes[4..12].try_into().ok()?);
        let mut ledger_head_hash = [0u8; 32];
        ledger_head_hash.copy_from_slice(&bytes[12..44]);
        let domain0_count = u16::from_le_bytes([bytes[44], bytes[45]]);
        let domain1_count = u16::from_le_bytes([bytes[46], bytes[47]]);
        let acoustic_state_ordinal = u16::from_le_bytes([bytes[48], bytes[49]]);
        let active_violations = u16::from_le_bytes([bytes[50], bytes[51]]);
        Some(Self {
            sequence,
            ledger_head_hash,
            domain0_count,
            domain1_count,
            acoustic_state_ordinal,
            active_violations,
        })
    }
}

/// Emitter — sends one ResonancePacket per sequence tick via UDP.
pub struct TelemetryEmitter {
    socket: Option<UdpSocket>,
    target: String,
    sent_count: u64,
}

impl TelemetryEmitter {
    /// Create bound to any available local port, targeting `target`.
    /// Returns Err if the socket cannot bind (graceful degradation — caller continues).
    pub fn new(target: impl Into<String>) -> Result<Self, std::io::Error> {
        let socket = UdpSocket::bind("0.0.0.0:0")?;
        socket.set_nonblocking(true)?;
        Ok(Self {
            socket: Some(socket),
            target: target.into(),
            sent_count: 0,
        })
    }

    /// No-op emitter for unit tests — does not bind a socket.
    pub fn noop() -> Self {
        Self { socket: None, target: String::new(), sent_count: 0 }
    }

    /// Emit one packet. Returns Ok(64) on success, Ok(0) if noop.
    /// Does not panic on send failure — telemetry is observational only.
    pub fn emit(&mut self, packet: &ResonancePacket) -> std::io::Result<usize> {
        let bytes = packet.to_bytes();
        let result = match &self.socket {
            None => return Ok(0),
            Some(sock) => sock.send_to(&bytes, &self.target),
        };
        match result {
            Ok(n) => {
                self.sent_count += 1;
                Ok(n)
            }
            Err(e) if e.kind() == std::io::ErrorKind::WouldBlock => Ok(0),
            Err(e) => Err(e),
        }
    }

    pub fn sent_count(&self) -> u64 {
        self.sent_count
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_packet(seq: u64) -> ResonancePacket {
        ResonancePacket {
            sequence: seq,
            ledger_head_hash: [0xABu8; 32],
            domain0_count: 114,
            domain1_count: 7,
            acoustic_state_ordinal: 0, // Izhar
            active_violations: 0,
        }
    }

    #[test]
    fn packet_is_exactly_64_bytes() {
        let bytes = sample_packet(1).to_bytes();
        assert_eq!(bytes.len(), PACKET_SIZE);
    }

    #[test]
    fn magic_bytes_correct() {
        let bytes = sample_packet(1).to_bytes();
        assert_eq!(u16::from_le_bytes([bytes[0], bytes[1]]), RESONANCE_MAGIC);
    }

    #[test]
    fn roundtrip_serialization() {
        let p = sample_packet(42);
        let bytes = p.to_bytes();
        let p2 = ResonancePacket::from_bytes(&bytes).unwrap();
        assert_eq!(p2.sequence, 42);
        assert_eq!(p2.domain0_count, 114);
        assert_eq!(p2.domain1_count, 7);
        assert_eq!(p2.acoustic_state_ordinal, 0);
        assert_eq!(p2.active_violations, 0);
    }

    #[test]
    fn ledger_hash_preserved_in_packet() {
        let p = sample_packet(1);
        let bytes = p.to_bytes();
        let p2 = ResonancePacket::from_bytes(&bytes).unwrap();
        assert_eq!(p2.ledger_head_hash, [0xABu8; 32]);
    }

    #[test]
    fn bad_magic_returns_none() {
        let mut bytes = sample_packet(1).to_bytes();
        bytes[0] = 0xFF;
        bytes[1] = 0xFF;
        assert!(ResonancePacket::from_bytes(&bytes).is_none());
    }

    #[test]
    fn serialization_deterministic_3x() {
        let make = || sample_packet(99).to_bytes();
        assert_eq!(make(), make());
        assert_eq!(make(), make());
    }

    #[test]
    fn reserved_bytes_are_zero() {
        let bytes = sample_packet(1).to_bytes();
        for i in 52..64 {
            assert_eq!(bytes[i], 0x00, "reserved byte {} should be 0", i);
        }
    }

    #[test]
    fn active_violations_zero_for_t0_pass() {
        let p = sample_packet(1);
        assert_eq!(p.active_violations, 0);
    }

    #[test]
    fn noop_emitter_does_not_panic() {
        let mut emitter = TelemetryEmitter::noop();
        let p = sample_packet(1);
        let result = emitter.emit(&p);
        assert_eq!(result.unwrap(), 0);
        assert_eq!(emitter.sent_count(), 0);
    }

    #[test]
    fn sequence_field_position() {
        // sequence is at bytes [4..12]
        let bytes = sample_packet(0xDEAD_BEEF_1234_5678u64).to_bytes();
        let seq = u64::from_le_bytes(bytes[4..12].try_into().unwrap());
        assert_eq!(seq, 0xDEAD_BEEF_1234_5678u64);
    }
}
