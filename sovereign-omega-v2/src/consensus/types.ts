// ============================================================
// SOVEREIGN OMEGA — HotStuff Ω Consensus Types
// EPISTEMIC TIER: T2 · Gate 19
//
// Typed stub of the HotStuff BFT protocol (Yin et al. 2019).
// Validators vote on replay equivalence (matching frame_hash),
// not semantic truth. Quorum: n ≥ 3f+1, threshold: 2f+1 votes.
// No network I/O — consensus is a pure function over vote sets.
// ============================================================

import type { SHA256Hex, SequenceNumber } from '../core/types.js'

// ─── Branded Primitives ────────────────────────────────────

export type ValidatorId = string & { readonly __brand: 'ValidatorId' }

/** Stub Ed25519 signature — FNV-1a derived 64-hex string.
 *  Production deployments must replace with @noble/ed25519. */
export type ValidatorSignature = string & { readonly __brand: 'ValidatorSignature' }

// ─── Core Structures ───────────────────────────────────────

/** The unit of consensus — a frame_hash proposed for quorum commit. */
export interface ConsensusBlock {
  readonly block_hash: SHA256Hex
  readonly sequence: SequenceNumber
  readonly proposer: ValidatorId
  /** Previous QC hash (GENESIS_HASH for first block). */
  readonly parent_hash: SHA256Hex
  /** Injected from E5 event — never Date.now(). */
  readonly timestamp_ms: number
}

/** A single validator's vote on a block_hash. */
export interface Vote {
  readonly validator: ValidatorId
  readonly block_hash: SHA256Hex
  readonly sequence: SequenceNumber
  /** Deterministic stub signature: FNV-1a(validatorId + ":" + block_hash). */
  readonly signature: ValidatorSignature
}

/** A quorum certificate — proof that 2f+1 validators agreed. */
export interface QuorumCertificate {
  readonly block_hash: SHA256Hex
  readonly sequence: SequenceNumber
  readonly votes: readonly Vote[]
  /** JCS-canonical SHA-256 of the entire QC. */
  readonly qc_hash: SHA256Hex
  /** Quorum threshold used: 2f+1. */
  readonly threshold: number
}

/** Validator set definition — invariant: n ≥ 3f+1. */
export interface ValidatorSet {
  readonly validators: readonly ValidatorId[]
  readonly n: number
  readonly f: number
}

// ─── Result Types ──────────────────────────────────────────

export type ConsensusOutcome = 'COMMITTED' | 'NO_QUORUM' | 'INVALID_VOTES'

export interface ConsensusResult {
  readonly outcome: ConsensusOutcome
  /** Present only when outcome === 'COMMITTED'. */
  readonly qc?: QuorumCertificate
  readonly block: ConsensusBlock
  readonly votes_received: number
  readonly threshold: number
  readonly reason?: string
}

// ─── Error ─────────────────────────────────────────────────

export class ConsensusError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConsensusError'
  }
}
