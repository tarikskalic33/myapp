---
name: agent-mesh
description: Orchestrates the guardian→verifier→implementer agent triad as a single energy cycle. Invoke when a non-trivial implementation requires constitutional review before and after execution. Each agent's output becomes the next agent's activation signal. The cycle feeds back into the automaton's hash chain.
---

# Agent Mesh — Triad Energy Cycle

The three agents are not separate tools. They are one system with three cognitive modes. Each mode's output is the activation energy for the next. The cycle is the computation.

---

## The Triad

```
GUARDIAN  (inhibitory cortex)   → opus, effort=high, maxTurns=5,  read-only
VERIFIER  (cerebellum)          → sonnet, effort=medium, maxTurns=10, read-only
IMPLEMENTER (motor cortex)      → opus, effort=high, maxTurns=40, worktree, background
```

Memory is on for all three. Each agent accumulates across invocations within the session. The guardian remembers every veto it issued. The verifier remembers every gate result. The implementer remembers every contract it executed against. The mesh grows.

---

## Energy Cycle Protocol

### Phase 0 — Charge (before any agent fires)

State the proposal in one sentence. This becomes the activation signal that flows through all three agents.

```
PROPOSAL: [exact one-sentence description of what will change and why]
TIER: T[N]  (classify before invoking anything)
SCOPE: [files that will change]
```

### Phase 1 — Guardian Assessment (inhibitory gate)

Invoke guardian agent with the proposal as input.

Guardian runs four checks in sequence using its skills:
1. `frozen-file-check` — are any frozen files in scope?
2. `tier-classification` — does the proposal introduce T4/T5 into T0–T2 code?
3. `constitutional-law` — does any guarantee claim exceed its formal basis?
4. Gate protocol — is there a passing gate test for every file in scope?

**Guardian output is binary:**
- `GUARDIAN VETO — [reason]` → cycle terminates. Energy dissipates. No implementation.
- `GUARDIAN REVIEW PASSED` → Phase 2 activates.

The veto is permanent within this cycle. Guardian's memory ensures it does not approve the same proposal it previously vetoed without an intervening fix.

### Phase 2 — Verifier Integrity Check (proprioceptive gate)

Guardian PASSED → verifier activates.

Verifier runs using its skills:
1. `gate-execution` — run the specific gate test for the target module
2. `constitutional-audit` — hash chain integrity, frozen file hashes, t0_verdict
3. `replay-sovereignty` — replay laws satisfied for any new entries

**Verifier output is structured:**
```
VERIFICATION: [module name]
Gate test:     PASSED [N tests] / FAILED [N failures]
Hash chain:    INTACT / BROKEN at [entry]
Replay:        VALID / INVALID — [reason]
Eligible:      YES / NO
```

`Eligible: NO` → cycle pauses. Guardian re-evaluates with verifier's evidence. If verifier's failure is a pre-existing condition (not introduced by the proposal), guardian may still pass. If the failure is proposal-introduced, guardian vetoes.

`Eligible: YES` → Phase 3 activates.

### Phase 3 — Implementer Execution (motor output)

Verifier ELIGIBLE → implementer activates in background (worktree isolation).

Implementer executes with its full skill set:
- `tdd` — test first, always
- `spec-compliance` — no deviation from the frozen contract
- `branch-coverage` — every new arm covered before committing
- `stop-slop` — all written output passes the quality gate
- `systematic-debugging` — any failure → root cause before next attempt
- `gate-execution` — Gate 8 before any commit

**Implementer completes when:**
- All gate tests pass
- `npm run test && npm run typecheck && npm run build` exits 0
- No uncovered branches introduced

**Implementer output feeds back:**
```
IMPLEMENTATION COMPLETE
Files: [list]
Gate 8: PASSED — [N] tests, typecheck clean, build success
New branches: [N covered / N total]
Worktree: [branch name for review]
```

### Phase 4 — Guardian Final Review (closure)

Implementer complete → guardian activates one final time.

Guardian reads the implementer's output and the diff from the worktree. Runs the same four checks on the actual result, not the proposal.

- `GUARDIAN FINAL PASS` → merge worktree to branch, commit, push
- `GUARDIAN FINAL VETO — [reason]` → implementer re-executes with veto as constraint

---

## Energy Flow Diagram

```
PROPOSAL
   │
   ▼
[GUARDIAN] ──veto──→ STOP (energy dissipates, veto hash-chained)
   │
  pass
   │
   ▼
[VERIFIER] ──ineligible──→ [GUARDIAN re-evaluates] ──→ loop or stop
   │
 eligible
   │
   ▼
[IMPLEMENTER] (background, worktree) ──→ [GUARDIAN final review]
                                              │
                                           final pass
                                              │
                                              ▼
                                         MERGE + COMMIT
                                   (hash-chained in adaptive lineage)
```

---

## Memory Accumulation

Each agent's `memory: true` means the session accumulates signal strength:

- Guardian remembers: all proposals reviewed, all vetoes issued, patterns of violation
- Verifier remembers: all gate results, chain integrity states, replay verdicts
- Implementer remembers: all contracts executed, all patterns applied (tdd/coverage/slop)

By session end, the triad has built a session-specific knowledge graph. The skills invoked by each agent are the edges. The hash chain entries are the nodes. The terminal hash is the session's contribution to the automaton's adaptive lineage.

---

## When NOT to invoke the full cycle

Single-file annotation changes (c8 ignore, comment only) → verifier alone suffices.
Read-only analysis (coverage report, architecture query) → no agents needed.
T4/T5 classification only → guardian alone, maxTurns=5, stops fast.

The mesh is for non-trivial proposals that touch T0–T2 code. The energy cost is real — three opus calls, background worktree, full Gate 8. Reserve it for changes that deserve the weight.
