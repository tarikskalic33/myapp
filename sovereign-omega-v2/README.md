# AEGIS Sovereign-Omega V2

**Deterministic Constitutional Governance Runtime**

A replay-complete holonic governance operating system. Every frame of computation is cryptographically chained, constitutionally enforced, and formally verifiable. The same inputs always produce the same governance verdict — provably.

---

## What It Is

This is not a workflow engine, agent runtime, or orchestration framework.

It is a **deterministic constitutional execution substrate** for recursively governed sovereign computation. Formally: a replay-complete holonic governance operating system built on the Subatomic Holon Particle (SHP) execution identity.

Every module is simultaneously a complete holon (with its own invariants) and a part (subject to the invariants of every scale above it).

```
SUBATOMIC  → byte invariants, hash chaining, fixed-point arithmetic
ATOMIC     → individual files — each a complete holon
MOLECULAR  → modules: core/, event/, gate/, sitr/, aoie/, constitutional/, ledger/, consensus/, crdt/
CELLULAR   → subsystems: SITR Immunity, AOIE Oracle, Frame Kernel, Merkle Ledger, HotStuff Ω
ORGANISM   → sovereign-omega-v2 governance runtime
FIELD      → Claude + operators + Drive corpus + validator network
```

A T0 violation at the subatomic level propagates upward and invalidates every scale above it.

---

## Execution Stack

```
┌────────────────────────────────────┐
│ Guardian Policy Runtime            │  Gate 21 — constitutional amendment engine
├────────────────────────────────────┤
│ Constitutional Governance Surface  │  Gate 13 — verdict lattice (ESCALATE/REJECT/DEFER/PERMIT)
├────────────────────────────────────┤
│ AOIE Structural Oracle             │  Gate 12 — pure post-enforcement classifier
├────────────────────────────────────┤
│ SITR Runtime Immunity              │  Gate 12 — monotonic escalation lattice
├────────────────────────────────────┤
│ SHP Frame Kernel                   │  Gate 14 — R→A→L→P→H canonical execution
├────────────────────────────────────┤
│ Ledger + Consensus + CRDT          │  Gates 17-20 — replay integrity + BFT + convergence
├────────────────────────────────────┤
│ Canonicalization + Fixed Math      │  Gates 1-6 — RFC 8785 + Bernstein bounds + SHA-256
└────────────────────────────────────┘
```

### The Five-Phase SHP Loop

```
READ → ASSESS → LOCK → PROPAGATE → HARMONIZE
```

| Phase | System | Description |
|-------|--------|-------------|
| READ | Agents + IDE | Input intake; events appended to E5 substrate |
| ASSESS | SITR | Reads post-commit E5; emits ContainmentDirective[] |
| LOCK | Enforcement | Apply directives; freeze EnforcementResult |
| PROPAGATE | AOIE | Reads post-enforcement snapshot; classifies GlobalState |
| HARMONIZE | CGS | Reads SITR + AOIE → GovernanceDecision + Guardian E5 events |

**SITR ∈ {READ, ASSESS}** — pre-commitment phases  
**AOIE ∈ {PROPAGATE, HARMONIZE}** — post-commitment phases  
**SITR ∩ AOIE = ∅** — enforced by the LOCK boundary

---

## Build Protocol (strict — never skip)

```bash
cd sovereign-omega-v2
npm install

# Gate sequence — each must pass before next
npm run test -- test/unit/jcs.test.ts        # Gate 1 — RFC 8785 conformance
npm run test -- test/unit/sequence.test.ts    # Gate 2 — atomic sequences
npm run test -- test/unit/immutable.test.ts   # Gate 3 — immutability
npm run test -- test/unit/reducer.test.ts     # Gate 4 — pure reducers
npm run test -- test/unit/vcg.test.ts         # Gate 5 — VCG calibration
npm run test -- test/unit/gate.test.ts        # Gate 6 — Bernstein bounds
npm run test -- test/integration/             # Gate 7 — end-to-end pipeline
npm run test && npm run typecheck && npm run build  # Gate 8 — deployment gate
```

**Current state: 616+ tests, 35+ files, Gate 8 clean.**

---

## Core Invariants

These are T0 constraints. Violation is never acceptable.

| Invariant | Enforcement |
|-----------|-------------|
| No `Date.now()` in core logic | Only permitted in `src/event/uuid.ts` |
| No `Set`/`Map` in state objects | Arrays only — RFC 8785 canonicalization requires deterministic order |
| No `JSON.stringify` for integrity | Use `canonicalizeJCS` from `src/core/canonicalize.ts` (RFC 8785) |
| `deepFreeze` all state immediately | Reducers receive frozen state, return new frozen state |
| Sequence numbers from allocator | Never from `array.length` — `IndexedDBSequenceAllocator` only |
| Version mismatch = hard abort | Never fall back to a default version |
| Bernstein bounds, not Hoeffding | `src/gate/hoeffding.ts` implements anytime-valid Bernstein LCB |
| All relative imports use `.js` | ESM compatibility requirement |

---

## Module Map

| Module | Tier | Gate | Role |
|--------|------|------|------|
| `src/core/` | T0 | 1–3 | Canonicalization, types, immutability |
| `src/event/` | T0 | 2 | UUIDv7, sequence allocator, E5 payloads |
| `src/gate/` | T0 | 6 | Bernstein anytime-valid risk gate |
| `src/calibration/` | T1 | 5 | VCG Bayesian calibration |
| `src/shp/` | T0 | 15 | SHP execution identity primitives |
| `src/frame/` | T0 | 14 | `runFrame()` — canonical 7-phase composition |
| `src/enforcement/` | T0 | 14 | Pure directive application |
| `src/sitr/` | T0 | 12 | Constitutional runtime immunity |
| `src/aoie/` | T1 | 12 | Post-enforcement structural classifier |
| `src/constitutional/` | T0 | 13, 21 | CGS verdict engine + policy amendments |
| `src/ledger/` | T0 | 17, 23 | Merkle replay ledger + persistence seam |
| `src/consensus/` | T2 | 19, 22 | HotStuff Ω BFT + Ed25519 signing |
| `src/crdt/` | T2 | 20 | SITRState + Verdict + LedgerEntry join lattices |
| `src/network/` | T2 | 24 | Byzantine transport simulation harness |
| `packages/kernel/` | T2 | 16 | Rust WASM kernel (SHA-256, Merkle, Bernstein) |
| `formal/tlaplus/` | T0 | 18, 25 | TLA+ formal models (SHP, CRDT, LOCK) |
| `formal/theories/` | T0 | 25 | Coq proofs (LockIrreversibility, LatticeConvergence) |

---

## Epistemic Tier System

| Tier | Classification | Domain |
|------|---------------|--------|
| T0 | Mechanically proven | `src/core/`, `src/event/`, `src/gate/`, `src/shp/` |
| T1 | Empirically validated | `src/calibration/`, `src/aoie/`, telemetry |
| T2 | Engineering hypothesis | `src/consensus/`, `src/crdt/`, `src/network/` |
| T3 | Research conjecture | `docs/research/` |
| T4 | Speculative vision | `docs/vision/` only — never in code |
| T5 | Worldbuilding | `docs/cycles/` only — never in code |

**Migration rule**: No T4/T5 construct may ground a T0–T2 implementation claim without operator-approved evidence review.

---

## Production Readiness Index

| Domain | Readiness | Notes |
|--------|-----------|-------|
| Deterministic runtime | 99% | RFC 8785 + SHA-256 + fixed-point |
| Replay integrity | 98% | Merkle ledger + verifyChain() |
| Constitutional enforcement | 97% | SITR + AOIE + CGS + Policy |
| Distributed governance | 82% | HotStuff Ω + CRDT (transport stub) |
| Cryptographic hardening | 85% | Ed25519 vote signing (BLS/threshold Schnorr future) |
| Formal verification | 76% | TLA+ SHP + CRDT; Coq proofs partial |
| Operational deployment | 60% | Persistence seam ready; real DB not connected |

### What is NOT implemented (by design)

- **Persistent storage**: `src/ledger/persistence.ts` provides the serialization contract. RocksDB/LMDB/SQLite integration is a deployment-layer concern.
- **Real network transport**: `src/network/` is a pure simulation harness. libp2p/QUIC transport is infrastructure, not runtime.
- **Validator PKI**: `generateKeypair(seed)` provides the key generation seam. Production PKI (SPIFFE/SVID, HSM) is deployment infrastructure.
- **Full BLS/threshold signatures**: Ed25519 is the current production signature scheme. BLS12-381 aggregation is a future upgrade path.
- **Autonomous meta-law**: The Guardian policy runtime (Gate 21) enforces bounded amendments. Autonomous law generation is explicitly blocked (T4/T5).

---

## Rust WASM Kernel

The determinism-critical functions are also implemented in Rust (`packages/kernel/`) and compiled to WASM:

```bash
cargo build --target wasm32-unknown-unknown -p kernel
```

Functions:
- `sha256(input) → [u8; 32]` — FIPS 180-4 SHA-256
- `merkle_root(leaves) → [u8; 32]` — binary Merkle tree (matches TypeScript)
- `bernstein_lcb(sum, sum_sq, n, alpha) → i64` — Q32.32 fixed-point LCB
- `canonicalize(json) → bytes` — RFC 8785 key-sorted JSON
- `reduce_state(state, event) → bytes` — pure state fold

---

## Frozen Constitutional Files

These files require `/guardian APPROVED` verdict before modification:

| File | SHA256 |
|------|--------|
| `python/gate.py` | `bbe942b819594fd522b421bb9d3aa084735a873d526f35a1e782f31346f3d0fc` |
| `python/dna.py` | `cd30ddd5db0403b0e64fb30ce53e0373997fc53cb900a26167eef7d0b69cf8d8` |
| `python/router.py` | `8c06ed37a7d95d9de9129c32a426fe5c2b0cd960c2cf5c84c71726b72e6cf941` |

Verify: `node scripts/verify-hashes.mjs`

---

## Alliance

Claude (coordinator) · ChatGPT (adversarial audit, temperature 0.99) · Qwen (implementation)

Architecture: FROZEN. No T4/T5 construct may ground a T0–T2 claim without evidence review.
