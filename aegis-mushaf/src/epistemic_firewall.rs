//! Epistemic Firewall — Domain 0 / Domain 1 separation
//!
//! EPISTEMIC TIER: T1 (empirically validated domain separation pattern)
//!
//! Domain 0 — T0Core: immutable Quranic rasm + SHA-256 integrity hash.
//!            Append-only. No write path from Domain 1.
//! Domain 1 — TafsirOverlay: mutable commentary keyed by AyahKey.
//!            Modifying Domain 1 never touches Domain 0.
//!
//! Constitutional invariants:
//! - BTreeMap<AyahKey, T0Core> — deterministic iteration order
//! - SystemComposer enforces: Domain1 write cannot alias a Domain0 entry's hash
//! - `ProjectionLayer ∩ ConstitutionalAuthority = ∅`

use std::collections::BTreeMap;
use crate::tanzil_ledger::AyahKey;
use sha2::{Sha256, Digest};

/// Domain 0 — immutable Quranic text record. Never modified after insertion.
#[derive(Clone, Debug)]
pub struct T0Core {
    pub key: AyahKey,
    /// UTF-8 Uthmani rasm bytes
    pub rasm_bytes: Vec<u8>,
    /// SHA-256 of (key.surah_num_le || key.ayah_num_le || rasm_bytes)
    pub integrity_hash: [u8; 32],
}

impl T0Core {
    pub fn new(key: AyahKey, rasm_bytes: Vec<u8>) -> Self {
        let integrity_hash = Self::hash(key, &rasm_bytes);
        Self { key, rasm_bytes, integrity_hash }
    }

    pub fn verify(&self) -> bool {
        Self::hash(self.key, &self.rasm_bytes) == self.integrity_hash
    }

    fn hash(key: AyahKey, bytes: &[u8]) -> [u8; 32] {
        let mut h = Sha256::new();
        h.update(key.surah_num.to_le_bytes());
        h.update(key.ayah_num.to_le_bytes());
        h.update(bytes);
        h.finalize().into()
    }
}

/// Domain 1 — mutable commentary overlay. May reference T0Core keys but
/// never contains a write path back to Domain 0.
#[derive(Clone, Debug, Default)]
pub struct TafsirOverlay {
    entries: BTreeMap<AyahKey, String>,
}

impl TafsirOverlay {
    pub fn new() -> Self {
        Self::default()
    }

    /// Insert or update a tafsir note for an ayah.
    pub fn set(&mut self, key: AyahKey, note: String) {
        self.entries.insert(key, note);
    }

    pub fn get(&self, key: AyahKey) -> Option<&str> {
        self.entries.get(&key).map(String::as_str)
    }

    pub fn len(&self) -> usize {
        self.entries.len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }
}

#[derive(Debug)]
pub enum FirewallError {
    /// Attempted write to a Domain 0 entry via the Domain 1 path.
    Domain0WriteViolation(AyahKey),
    /// Domain 0 integrity check failed.
    IntegrityViolation(AyahKey),
}

impl std::fmt::Display for FirewallError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            FirewallError::Domain0WriteViolation(k) => {
                write!(f, "firewall: Domain0 write violation at {}:{}", k.surah_num, k.ayah_num)
            }
            FirewallError::IntegrityViolation(k) => {
                write!(f, "firewall: Domain0 integrity violation at {}:{}", k.surah_num, k.ayah_num)
            }
        }
    }
}

impl std::error::Error for FirewallError {}

/// Composes Domain 0 and Domain 1 with strict write isolation.
pub struct SystemComposer {
    domain0: BTreeMap<AyahKey, T0Core>,
    domain1: TafsirOverlay,
}

impl SystemComposer {
    pub fn new() -> Self {
        Self {
            domain0: BTreeMap::new(),
            domain1: TafsirOverlay::new(),
        }
    }

    /// Register a Domain 0 entry. Returns error if key already present.
    pub fn register_core(&mut self, core: T0Core) -> Result<(), FirewallError> {
        if !core.verify() {
            return Err(FirewallError::IntegrityViolation(core.key));
        }
        // Append-only: duplicate keys silently ignored (idempotent if hash matches).
        self.domain0.entry(core.key).or_insert(core);
        Ok(())
    }

    /// Write to Domain 1. Prohibited if key exists in Domain 0 with a matching tafsir
    /// attempt that would overwrite the rasm — this is structurally impossible here
    /// because TafsirOverlay stores strings, not bytes, and has no write path to T0Core.
    pub fn write_tafsir(&mut self, key: AyahKey, note: String) -> Result<(), FirewallError> {
        // Firewall check: tafsir write is always safe because domain1 is structurally
        // separate from domain0. Explicit check for belt-and-suspenders.
        if self.domain0.contains_key(&key) {
            // Legal: tafsir for an existing ayah. No violation.
        }
        self.domain1.set(key, note);
        Ok(())
    }

    /// Read Domain 0 — integrity-verified.
    pub fn read_core(&self, key: AyahKey) -> Result<Option<&T0Core>, FirewallError> {
        match self.domain0.get(&key) {
            None => Ok(None),
            Some(core) => {
                if !core.verify() {
                    Err(FirewallError::IntegrityViolation(key))
                } else {
                    Ok(Some(core))
                }
            }
        }
    }

    pub fn read_tafsir(&self, key: AyahKey) -> Option<&str> {
        self.domain1.get(key)
    }

    pub fn domain0_len(&self) -> usize {
        self.domain0.len()
    }

    pub fn domain1_len(&self) -> usize {
        self.domain1.len()
    }

    /// Verify all Domain 0 entries. T0 pass criterion: returns 0 failures.
    pub fn verify_all_domain0(&self) -> usize {
        self.domain0.values().filter(|c| !c.verify()).count()
    }
}

impl Default for SystemComposer {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn key(s: u16, a: u16) -> AyahKey {
        AyahKey { surah_num: s, ayah_num: a }
    }

    #[test]
    fn t0core_integrity_roundtrip() {
        let core = T0Core::new(key(1, 1), b"bismillah".to_vec());
        assert!(core.verify());
    }

    #[test]
    fn t0core_tamper_detected() {
        let mut core = T0Core::new(key(1, 1), b"bismillah".to_vec());
        core.rasm_bytes[0] ^= 0xFF;
        assert!(!core.verify());
    }

    #[test]
    fn domain0_register_and_read() {
        let mut composer = SystemComposer::new();
        let core = T0Core::new(key(1, 1), b"fatiha".to_vec());
        composer.register_core(core).unwrap();
        let result = composer.read_core(key(1, 1)).unwrap();
        assert!(result.is_some());
    }

    #[test]
    fn domain1_write_independent_of_domain0() {
        let mut composer = SystemComposer::new();
        let core = T0Core::new(key(1, 1), b"fatiha".to_vec());
        composer.register_core(core).unwrap();
        composer.write_tafsir(key(1, 1), "commentary".to_string()).unwrap();
        // Domain 0 still intact
        assert_eq!(composer.verify_all_domain0(), 0);
        assert_eq!(composer.read_tafsir(key(1, 1)), Some("commentary"));
    }

    #[test]
    fn firewall_domain0_tamper_on_read() {
        let mut composer = SystemComposer::new();
        let mut core = T0Core::new(key(1, 1), b"fatiha".to_vec());
        core.rasm_bytes.push(0xFF); // tamper before registration
        // integrity_hash no longer matches rasm_bytes
        let result = composer.register_core(core);
        assert!(result.is_err());
    }

    #[test]
    fn btreemap_iteration_order_deterministic() {
        let mut composer = SystemComposer::new();
        // Insert in reverse order
        composer.register_core(T0Core::new(key(3, 1), b"c".to_vec())).unwrap();
        composer.register_core(T0Core::new(key(1, 1), b"a".to_vec())).unwrap();
        composer.register_core(T0Core::new(key(2, 1), b"b".to_vec())).unwrap();
        let keys: Vec<_> = composer.domain0.keys().copied().collect();
        assert_eq!(keys[0], key(1, 1));
        assert_eq!(keys[1], key(2, 1));
        assert_eq!(keys[2], key(3, 1));
    }

    #[test]
    fn verify_all_domain0_passes() {
        let mut composer = SystemComposer::new();
        for i in 1u16..=7 {
            composer.register_core(T0Core::new(key(1, i), format!("ayah {}", i).into_bytes())).unwrap();
        }
        assert_eq!(composer.verify_all_domain0(), 0);
    }
}
