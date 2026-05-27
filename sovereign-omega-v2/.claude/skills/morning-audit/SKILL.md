---
name: morning-audit
description: Session-start constitutional audit. Run at the beginning of every session before any code is written. Orients to the current gate series, verifies system health, and declares the 2-gate target for the session. Invoked when the user says "start", "begin", "where were we", "morning", or when the session starts with no clear prior context.
---

# Morning Audit — Session Orientation Ritual

Run exactly once at the start of each session. Produces a signed orientation report before any gate work begins.

## Step 1 — Gate Progress & Test Health
```bash
grep "Gates complete:\|tests)" /home/user/myapp/CLAUDE.md | head -3
cd /home/user/myapp/aegis-cl-psi && cargo test 2>&1 | grep "test result" | head -1
```

Report: `GATES: <N> · RUST TESTS: <T> · STATUS: <ok/FAIL>`

If cargo test fails: HALT — invoke `/diagnose` before proceeding.

## Step 2 — Active Gate Series
```bash
tail -25 /home/user/myapp/aegis-cl-psi/src/lib.rs | grep "pub mod"
```

Identify the active naming series (e.g., `gossip_broadcast_*`, `compaction_*`, `phi_*`).
Report: `ACTIVE SERIES: <prefix>_*`
Identify the last gate number from lib.rs or CLAUDE.md.

## Step 3 — Uncommitted Work
```bash
git -C /home/user/myapp status --short
```

If any files are unstaged: commit them before proceeding (do NOT carry forward dirty state).
```bash
git -C /home/user/myapp stash list
```

Report: `WORKING TREE: CLEAN / DIRTY: <files>`

## Step 4 — Hash Integrity
```bash
cd /home/user/myapp/sovereign-omega-v2 && node scripts/verify-hashes.mjs 2>&1 | tail -3
```

If fails: HALT — invoke `/frozen-file-check`.
Report: `HASH INTEGRITY: PASS / FAIL`

## Step 5 — Recent Session History
```bash
git -C /home/user/myapp log --oneline -6
```

Read the last 6 commits to orient to momentum. Note which gate pair was last completed.

## Step 6 — Declare Session Target
Based on the last gate number (N), declare:

```
SESSION TARGET:
  Gate <N+1>: gossip_broadcast_<name_a> — <1-line description>
  Gate <N+2>: gossip_broadcast_<name_b> — <1-line description>
  Threshold A: <CONST_NAME> = <value> (<meaning>)
  Threshold B: <CONST_NAME> = <value> (<meaning>)
  Est. tests: ~19 per gate = 38 new tests
  Est. Rust total after: <T+38>
```

Choose the next two gate names by following the active series pattern. Do not invent a new series mid-session — complete the current one first.

## Morning Audit Report Format

```
MORNING AUDIT — <date> <time>
════════════════════════════════
Gates complete:    <N>
Rust tests:        <T> (all passing)
TS tests:          <T> (Gate 8 status)
Active series:     <prefix>_*
Working tree:      CLEAN / DIRTY
Hash integrity:    PASS / FAIL
Last commit:       <hash> <message>

SESSION TARGET:
  Gate <N+1>: <name> — <description>
  Gate <N+2>: <name> — <description>

CONSTITUTIONAL STATUS: GO / HOLD
════════════════════════════════
```

`GO` = all checks pass, ready to build gates.
`HOLD` = any check failed — fix before proceeding.
