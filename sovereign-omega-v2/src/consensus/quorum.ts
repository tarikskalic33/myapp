// ============================================================
// SOVEREIGN OMEGA — HotStuff Ω Quorum Logic
// EPISTEMIC TIER: T2 · Gate 19
//
// Pure functions over Vote sets. No state, no side effects.
// HotStuff safety threshold: 2f+1 votes, n ≥ 3f+1 validators.
// ============================================================

import { deepFreeze } from '../core/immutable.js'
import { hashValue } from '../core/hashing.js'
import { verifyVote } from './crypto.js'
import {
  ConsensusError,
  type ConsensusBlock,
  type Vote,
  type ValidatorSet,
  type QuorumCertificate,
} from './types.js'

// ─── Threshold ─────────────────────────────────────────────

/** BFT quorum threshold for HotStuff: 2f+1. */
export function quorumThreshold(f: number): number {
  return 2 * f + 1
}

/** Validate the ValidatorSet invariant: n ≥ 3f+1. */
export function validateValidatorSet(vs: ValidatorSet): void {
  if (vs.n !== vs.validators.length) {
    throw new ConsensusError(
      `ValidatorSet.n (${vs.n}) does not match validators.length (${vs.validators.length})`,
    )
  }
  if (vs.n < 3 * vs.f + 1) {
    throw new ConsensusError(
      `ValidatorSet violates n ≥ 3f+1: n=${vs.n}, f=${vs.f}, required n≥${3 * vs.f + 1}`,
    )
  }
}

// ─── Vote collection ───────────────────────────────────────

/**
 * Filter votes to those that:
 * - Belong to a known validator in vs
 * - Match the block's block_hash and sequence
 * - Carry a valid stub signature
 * Returns one vote per validator (first occurrence wins if duplicated).
 */
export function collectValidVotes(
  block: ConsensusBlock,
  votes: readonly Vote[],
  vs: ValidatorSet,
): readonly Vote[] {
  const validatorSet = new Set(vs.validators)
  const seen = new Set<string>()
  const valid: Vote[] = []

  for (const vote of votes) {
    if (!validatorSet.has(vote.validator)) continue
    if (vote.block_hash !== block.block_hash) continue
    if (vote.sequence !== block.sequence) continue
    if (!verifyVote(vote.validator, vote.block_hash, vote.signature)) continue
    if (seen.has(vote.validator)) continue

    seen.add(vote.validator)
    valid.push(vote)
  }

  return Object.freeze(valid)
}

/**
 * Returns true if the number of unique valid votes meets the 2f+1 threshold.
 */
export function isQuorum(validVotes: readonly Vote[], threshold: number): boolean {
  return validVotes.length >= threshold
}

// ─── QC Formation ──────────────────────────────────────────

/**
 * Form a QuorumCertificate from a validated set of votes that meets quorum.
 * Throws ConsensusError if votes.length < threshold.
 */
export async function formQC(
  block: ConsensusBlock,
  validVotes: readonly Vote[],
  threshold: number,
): Promise<QuorumCertificate> {
  if (validVotes.length < threshold) {
    throw new ConsensusError(
      `Cannot form QC: ${validVotes.length} votes < threshold ${threshold}`,
    )
  }

  const qcPayload = {
    block_hash: block.block_hash,
    sequence: block.sequence,
    votes: [...validVotes],
    threshold,
  }

  const qc_hash = await hashValue(qcPayload)

  return deepFreeze<QuorumCertificate>({
    block_hash: block.block_hash,
    sequence: block.sequence,
    votes: Object.freeze([...validVotes]),
    qc_hash,
    threshold,
  })
}
