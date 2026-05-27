---
name: systematic-debugging
description: Use before any bug, test failure, or unexpected behavior gets a proposed fix. Root cause investigation must precede any fix attempt. Never propose a fix without completing all four phases. Invoked when a test fails, build errors, or unexpected behavior appears.
---

# Systematic Debugging

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

After 3 failed fixes, stop patching. The problem is architectural — discuss instead.

## Phase 1 — Root Cause Investigation

- Read the full error message, not just the first line
- Reproduce the failure consistently (if it doesn't reproduce reliably, say so)
- Check what changed recently (`git log --oneline -5`)
- Gather diagnostic evidence at component boundaries
- Trace data flow backward through the call stack

For AEGIS Rust failures:
```bash
cargo test <failing_test> -- --nocapture 2>&1
```

For TypeScript failures:
```bash
cd sovereign-omega-v2 && npm run test -- <failing_file> 2>&1
```

Do NOT proceed to Phase 2 until you have a specific, concrete failure point identified.

## Phase 2 — Pattern Analysis

- Find similar working code in the same codebase
- Read the working implementation completely
- Identify the exact difference between working and broken
- Understand all dependencies involved

In AEGIS: compare the failing module against a passing module from the same gate series.

## Phase 3 — Hypothesis and Testing

State a single, specific hypothesis before touching any code:

```
HYPOTHESIS: <exact mechanism causing failure>
EVIDENCE:   <what observation supports this>
TEST:       <smallest possible change to confirm/refute>
```

Make one change. Observe. If refuted, return to Phase 1 with new evidence. Do NOT try multiple fixes simultaneously.

## Phase 4 — Implementation

Only after Phase 3 confirms the hypothesis:

1. Write a failing test that captures the bug (if no test exists yet)
2. Implement the single fix
3. Verify fix works without breaking other tests:
   ```bash
   cargo test <module> 2>&1 | grep -E "FAILED|test result"
   ```

## Red Flags — Stop and Return to Phase 1

- "Let me just try this and see" — stop
- Making more than one change at a time — stop
- Fix #3 still not working — stop, discuss architecture

## AEGIS-Specific Invariants to Check First

Before assuming logic bugs, verify these common AEGIS failure causes:
- `to_le_bytes()` instead of `to_be_bytes()` in hash input
- `HashMap` where `BTreeMap` required
- Integer overflow (missing `saturating_add`)
- Missing `impl Default` on a log struct
- Module not registered in `lib.rs`
