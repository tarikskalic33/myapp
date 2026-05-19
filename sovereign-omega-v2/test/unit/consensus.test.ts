// ============================================================
// Gate 19 — HotStuff Ω Consensus Stub Tests
// ~22 tests: validator set invariant, vote signing, quorum
//   threshold, QC formation, kernel outcomes, determinism.
// ============================================================

import { describe, it, expect } from 'vitest'
import type { SHA256Hex, SequenceNumber } from '../../src/core/types.js'
import { GENESIS_HASH } from '../../src/ledger/types.js'
import {
  type ValidatorId,
  type ConsensusBlock,
  type Vote,
  type ValidatorSet,
  ConsensusError,
} from '../../src/consensus/types.js'
import { signVote, verifyVote } from '../../src/consensus/crypto.js'
import {
  quorumThreshold,
  validateValidatorSet,
  collectValidVotes,
  isQuorum,
} from '../../src/consensus/quorum.js'
import { runConsensusRound } from '../../src/consensus/kernel.js'

// ─── Helpers ───────────────────────────────────────────────

const TS = 1_600_000_000_000

function vid(id: string): ValidatorId {
  return id as ValidatorId
}

function blockHash(n: number): SHA256Hex {
  return (n.toString(16).padStart(64, '0')) as SHA256Hex
}

function makeBlock(seq: bigint = 1n, proposer = vid('V1')): ConsensusBlock {
  return Object.freeze({
    block_hash: blockHash(1),
    sequence: seq as SequenceNumber,
    proposer,
    parent_hash: GENESIS_HASH,
    timestamp_ms: TS,
  })
}

function makeValidatorSet(n: number, f: number): ValidatorSet {
  const validators = Array.from({ length: n }, (_, i) => vid(`V${i + 1}`))
  return Object.freeze({ validators: Object.freeze(validators), n, f })
}

function castVote(validatorId: ValidatorId, block: ConsensusBlock): Vote {
  return Object.freeze({
    validator: validatorId,
    block_hash: block.block_hash,
    sequence: block.sequence,
    signature: signVote(validatorId, block.block_hash),
  })
}

function castAllVotes(vs: ValidatorSet, block: ConsensusBlock): Vote[] {
  return vs.validators.map(v => castVote(v, block))
}

// ─── Crypto ────────────────────────────────────────────────

describe('signVote / verifyVote', () => {
  it('signVote produces a 64-char hex string', () => {
    const sig = signVote(vid('V1'), blockHash(1))
    expect(sig).toHaveLength(64)
    expect(/^[0-9a-f]{64}$/.test(sig)).toBe(true)
  })

  it('signVote is deterministic — same inputs → same output 3×', () => {
    const s1 = signVote(vid('Alice'), blockHash(42))
    const s2 = signVote(vid('Alice'), blockHash(42))
    const s3 = signVote(vid('Alice'), blockHash(42))
    expect(s1).toBe(s2)
    expect(s2).toBe(s3)
  })

  it('different validators produce different signatures', () => {
    const bh = blockHash(1)
    expect(signVote(vid('V1'), bh)).not.toBe(signVote(vid('V2'), bh))
  })

  it('different block hashes produce different signatures', () => {
    const v = vid('V1')
    expect(signVote(v, blockHash(1))).not.toBe(signVote(v, blockHash(2)))
  })

  it('verifyVote returns true for valid signature', () => {
    const v = vid('V1')
    const bh = blockHash(7)
    expect(verifyVote(v, bh, signVote(v, bh))).toBe(true)
  })

  it('verifyVote returns false for tampered signature', () => {
    const v = vid('V1')
    const bh = blockHash(7)
    const sig = signVote(v, bh).replace('a', 'b').replace('b', 'c') as ReturnType<typeof signVote>
    // Only test if the replacement actually changed something
    if (sig !== signVote(v, bh)) {
      expect(verifyVote(v, bh, sig)).toBe(false)
    }
  })
})

// ─── ValidatorSet ──────────────────────────────────────────

describe('validateValidatorSet', () => {
  it('n=4,f=1 is valid (4 ≥ 3×1+1)', () => {
    expect(() => validateValidatorSet(makeValidatorSet(4, 1))).not.toThrow()
  })

  it('n=7,f=2 is valid (7 ≥ 3×2+1)', () => {
    expect(() => validateValidatorSet(makeValidatorSet(7, 2))).not.toThrow()
  })

  it('n=3,f=1 violates n ≥ 3f+1 → throws ConsensusError', () => {
    expect(() => validateValidatorSet(makeValidatorSet(3, 1))).toThrow(ConsensusError)
  })

  it('n ≠ validators.length → throws ConsensusError', () => {
    const bad: ValidatorSet = Object.freeze({
      validators: Object.freeze([vid('V1'), vid('V2')]),
      n: 5,
      f: 1,
    })
    expect(() => validateValidatorSet(bad)).toThrow(ConsensusError)
  })

  it('quorumThreshold(f=1) = 3', () => {
    expect(quorumThreshold(1)).toBe(3)
  })

  it('quorumThreshold(f=2) = 5', () => {
    expect(quorumThreshold(2)).toBe(5)
  })
})

// ─── collectValidVotes / isQuorum ──────────────────────────

describe('collectValidVotes', () => {
  it('all valid votes pass through', () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const votes = castAllVotes(vs, block)
    const valid = collectValidVotes(block, votes, vs)
    expect(valid.length).toBe(4)
  })

  it('duplicate validator votes deduplicated — first wins', () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const votes = [
      castVote(vid('V1'), block),
      castVote(vid('V1'), block),  // duplicate
      castVote(vid('V2'), block),
    ]
    const valid = collectValidVotes(block, votes, vs)
    expect(valid.length).toBe(2)
  })

  it('unknown validator rejected', () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const alien = vid('ALIEN')
    const vote: Vote = Object.freeze({
      validator: alien,
      block_hash: block.block_hash,
      sequence: block.sequence,
      signature: signVote(alien, block.block_hash),
    })
    const valid = collectValidVotes(block, [vote], vs)
    expect(valid.length).toBe(0)
  })

  it('wrong block_hash rejected', () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const wrongHash = blockHash(99)
    const vote: Vote = Object.freeze({
      validator: vid('V1'),
      block_hash: wrongHash,
      sequence: block.sequence,
      signature: signVote(vid('V1'), wrongHash),
    })
    const valid = collectValidVotes(block, [vote], vs)
    expect(valid.length).toBe(0)
  })

  it('isQuorum returns true when votes >= threshold', () => {
    const votes = [castVote(vid('V1'), makeBlock()), castVote(vid('V2'), makeBlock()), castVote(vid('V3'), makeBlock())]
    expect(isQuorum(votes, 3)).toBe(true)
  })

  it('isQuorum returns false when below threshold', () => {
    const votes = [castVote(vid('V1'), makeBlock()), castVote(vid('V2'), makeBlock())]
    expect(isQuorum(votes, 3)).toBe(false)
  })
})

// ─── runConsensusRound ─────────────────────────────────────

describe('runConsensusRound', () => {
  it('COMMITTED when all 4 validators vote (f=1, threshold=3)', async () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const votes = castAllVotes(vs, block)
    const result = await runConsensusRound(block, vs, votes)
    expect(result.outcome).toBe('COMMITTED')
    expect(result.qc).toBeDefined()
    expect(result.votes_received).toBe(4)
    expect(result.threshold).toBe(3)
  })

  it('COMMITTED when exactly 3 of 4 vote (quorum met)', async () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const votes = castAllVotes(vs, block).slice(0, 3)
    const result = await runConsensusRound(block, vs, votes)
    expect(result.outcome).toBe('COMMITTED')
    expect(result.votes_received).toBe(3)
  })

  it('NO_QUORUM when only 2 of 4 vote', async () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const votes = castAllVotes(vs, block).slice(0, 2)
    const result = await runConsensusRound(block, vs, votes)
    expect(result.outcome).toBe('NO_QUORUM')
    expect(result.qc).toBeUndefined()
    expect(result.reason).toContain('2 valid votes < threshold 3')
  })

  it('NO_QUORUM when zero votes', async () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const result = await runConsensusRound(block, vs, [])
    expect(result.outcome).toBe('NO_QUORUM')
  })

  it('QC is frozen', async () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const votes = castAllVotes(vs, block)
    const result = await runConsensusRound(block, vs, votes)
    expect(Object.isFrozen(result.qc)).toBe(true)
    expect(Object.isFrozen(result.qc!.votes)).toBe(true)
  })

  it('QC hash is deterministic — same inputs → same qc_hash 3×', async () => {
    const vs = makeValidatorSet(4, 1)
    const block = makeBlock()
    const votes = castAllVotes(vs, block)
    const r1 = await runConsensusRound(block, vs, votes)
    const r2 = await runConsensusRound(block, vs, votes)
    const r3 = await runConsensusRound(block, vs, votes)
    expect(r1.qc!.qc_hash).toBe(r2.qc!.qc_hash)
    expect(r2.qc!.qc_hash).toBe(r3.qc!.qc_hash)
    expect(r1.qc!.qc_hash).toHaveLength(64)
  })

  it('different block_hash → different qc_hash', async () => {
    const vs = makeValidatorSet(4, 1)
    const block1: ConsensusBlock = Object.freeze({ ...makeBlock(), block_hash: blockHash(1) })
    const block2: ConsensusBlock = Object.freeze({ ...makeBlock(), block_hash: blockHash(2) })
    const votes1 = vs.validators.map(v => castVote(v, block1))
    const votes2 = vs.validators.map(v => castVote(v, block2))
    const r1 = await runConsensusRound(block1, vs, votes1)
    const r2 = await runConsensusRound(block2, vs, votes2)
    expect(r1.qc!.qc_hash).not.toBe(r2.qc!.qc_hash)
  })

  it('throws ConsensusError on invalid ValidatorSet', async () => {
    const vs = makeValidatorSet(3, 1)  // 3 < 3×1+1 = 4
    await expect(runConsensusRound(makeBlock(), vs, [])).rejects.toThrow(ConsensusError)
  })

  it('result is frozen', async () => {
    const vs = makeValidatorSet(4, 1)
    const result = await runConsensusRound(makeBlock(), vs, [])
    expect(Object.isFrozen(result)).toBe(true)
  })
})
