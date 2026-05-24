#!/usr/bin/env node
/**
 * Maqam Visualizer — UDP terminal display for resonance heartbeats
 *
 * Listens on UDP port 9090 for 64-byte ResonancePacket datagrams.
 * Decodes and renders each packet to the terminal.
 *
 * Usage:
 *   node scripts/maqam_visualizer.js [--port 9090]
 *
 * Packet layout (little-endian):
 *   [0..2]   RESONANCE_MAGIC: 0xE0E0
 *   [2..4]   schema_version
 *   [4..12]  sequence (u64 — split into two u32 for JS BigInt safety)
 *   [12..44] ledger_head_hash (32 bytes hex)
 *   [44..46] domain0_count
 *   [46..48] domain1_count
 *   [48..50] acoustic_state_ordinal
 *   [50..52] active_violations (0 = T0 pass)
 *   [52..64] reserved
 */

'use strict';

const dgram = require('dgram');

const RESONANCE_MAGIC = 0xE0E0;
const PACKET_SIZE = 64;
const DEFAULT_PORT = 9090;

const ACOUSTIC_STATES = ['Izhar', 'Ikhfa', 'Idgham', 'Madd', 'Qalqalah'];

const port = (() => {
  const idx = process.argv.indexOf('--port');
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : DEFAULT_PORT;
})();

/**
 * Decode a 64-byte Buffer into a resonance packet object.
 * Returns null on magic mismatch.
 */
function decodePacket(buf) {
  if (buf.length < PACKET_SIZE) return null;
  const magic = buf.readUInt16LE(0);
  if (magic !== RESONANCE_MAGIC) return null;

  const schemaVersion = buf.readUInt16LE(2);
  // u64 sequence — read as two u32 and combine via BigInt
  const seqLo = BigInt(buf.readUInt32LE(4));
  const seqHi = BigInt(buf.readUInt32LE(8));
  const sequence = (seqHi << 32n) | seqLo;

  const hashBytes = buf.slice(12, 44);
  const ledgerHeadHash = Buffer.from(hashBytes).toString('hex');

  const domain0Count = buf.readUInt16LE(44);
  const domain1Count = buf.readUInt16LE(46);
  const acousticStateOrdinal = buf.readUInt16LE(48);
  const activeViolations = buf.readUInt16LE(50);

  return {
    schemaVersion,
    sequence,
    ledgerHeadHash,
    domain0Count,
    domain1Count,
    acousticState: ACOUSTIC_STATES[acousticStateOrdinal] ?? `Unknown(${acousticStateOrdinal})`,
    activeViolations,
  };
}

function renderPacket(pkt, rinfo) {
  const t0Status = pkt.activeViolations === 0 ? '\x1b[32mT0_PASS\x1b[0m' : `\x1b[31mVIOLATIONS:${pkt.activeViolations}\x1b[0m`;
  const lines = [
    `\x1b[1m── Resonance Heartbeat ──────────────────────────────\x1b[0m`,
    `  Sequence:   ${pkt.sequence}`,
    `  Head hash:  ${pkt.ledgerHeadHash.slice(0, 16)}…`,
    `  Domain 0:   ${pkt.domain0Count} ayaat`,
    `  Domain 1:   ${pkt.domain1Count} tafsir entries`,
    `  Tajweed:    ${pkt.acousticState}`,
    `  T0 status:  ${t0Status}`,
    `  From:       ${rinfo.address}:${rinfo.port}`,
    ``,
  ];
  process.stdout.write(lines.join('\n'));
}

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  process.stderr.write(`UDP error: ${err.message}\n`);
});

server.on('message', (msg, rinfo) => {
  const pkt = decodePacket(msg);
  if (pkt) {
    renderPacket(pkt, rinfo);
  } else {
    process.stderr.write(`Bad packet from ${rinfo.address}:${rinfo.port} (${msg.length} bytes)\n`);
  }
});

server.bind(port, () => {
  process.stdout.write(`Maqam Visualizer — listening on UDP port ${port}\n`);
  process.stdout.write(`Awaiting resonance heartbeats (magic=0xE0E0, 64 bytes)...\n\n`);
});
