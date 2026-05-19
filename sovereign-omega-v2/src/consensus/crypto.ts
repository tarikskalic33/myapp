// ============================================================
// SOVEREIGN OMEGA — Consensus Stub Cryptography
// EPISTEMIC TIER: T2 · Gate 19
//
// Synchronous deterministic stub for Ed25519 vote signing.
// Uses FNV-1a (64-bit) with four salt rounds to produce a
// 64-hex string that is structurally compatible with SHA256Hex
// but is NOT a real signature scheme.
//
// PRODUCTION NOTE: Replace with @noble/ed25519 before deployment.
// The ValidatorSignature branded type is the seam point.
// ============================================================

import type { SHA256Hex } from '../core/types.js'
import type { ValidatorId, ValidatorSignature } from './types.js'

// ─── FNV-1a constants (64-bit) ─────────────────────────────

const FNV_PRIME = 1099511628211n
const FNV_OFFSET_BASIS = 14695981039346656037n
const U64_MASK = 0xFFFFFFFFFFFFFFFFn

// ─── Internal helpers ──────────────────────────────────────

function fnv1a64(data: Uint8Array, seed: bigint = FNV_OFFSET_BASIS): bigint {
  let hash = seed & U64_MASK
  for (let i = 0; i < data.length; i++) {
    hash ^= BigInt(data[i]!)
    hash = (hash * FNV_PRIME) & U64_MASK
  }
  return hash
}

function bigintToHex16(n: bigint): string {
  return n.toString(16).padStart(16, '0')
}

// ─── Public API ────────────────────────────────────────────

/**
 * Produce a deterministic stub signature for a validator vote.
 * Synchronous — no WebCrypto, no async, no I/O.
 * Same inputs always produce the same 64-char hex output.
 */
export function signVote(validatorId: ValidatorId, blockHash: SHA256Hex): ValidatorSignature {
  const encoder = new TextEncoder()
  const msg = encoder.encode(`${validatorId}:${blockHash}`)

  // Four rounds with distinct salt offsets → 4 × 16 hex = 64 chars
  const h0 = fnv1a64(msg, FNV_OFFSET_BASIS)
  const h1 = fnv1a64(msg, FNV_OFFSET_BASIS ^ 0xDEADBEEFCAFEBABEn)
  const h2 = fnv1a64(msg, FNV_OFFSET_BASIS ^ 0xC0FFEE0000000001n)
  const h3 = fnv1a64(msg, FNV_OFFSET_BASIS ^ 0xFEEDFACEFEEDFACEn)

  return (bigintToHex16(h0) + bigintToHex16(h1) + bigintToHex16(h2) + bigintToHex16(h3)) as ValidatorSignature
}

/**
 * Verify a stub signature. Returns true iff signature matches the
 * expected FNV-1a stub output for (validatorId, blockHash).
 */
export function verifyVote(
  validatorId: ValidatorId,
  blockHash: SHA256Hex,
  signature: ValidatorSignature,
): boolean {
  return signature === signVote(validatorId, blockHash)
}
