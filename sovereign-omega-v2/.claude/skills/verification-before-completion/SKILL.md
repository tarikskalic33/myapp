---
name: verification-before-completion
description: Use before claiming any work is complete, fixed, or passing — before any commit, push, or PR. Requires running the actual verification command and reading the output. "Should work" is not verification. Evidence before claims, always.
---

# Verification Before Completion

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**

If you haven't run the verification command in this exact message, you cannot claim it passes.

## The Iron Law

```
Run the command. Read the output. THEN make the claim.
```

## Gate Function — 5 Steps (all required)

1. **Identify** the exact command that proves the claim
2. **Run** it fresh and complete (not cached, not assumed)
3. **Read** the full output — exit code, failure count, error text
4. **Verify** the output actually confirms what you're claiming
5. **Only then** make the claim

## Claim → Required Verification Mapping

| Claim | Required command |
|-------|-----------------|
| "Tests pass" | `cargo test 2>&1 \| grep "test result"` or `npm run test` |
| "Gate 8 passes" | `npm run test && npm run typecheck && npm run build` |
| "Hash integrity OK" | `node scripts/verify-hashes.mjs` |
| "Build succeeds" | Full build command with exit code check |
| "Bug is fixed" | Run the specific failing test, see it pass |
| "All tests passing" | Full suite, not just the module |

## What Is NOT Verification

- "It should work because I fixed the logic" — not verification
- "I tested it earlier" — not verification (run it again)
- "The test probably passes" — not verification
- Reading code and concluding it's correct — not verification

## Red Flag Phrases — Stop Before Using

If you're about to write any of these, run the verification command first:
- "should work"
- "probably passes"
- "seems to be fixed"
- "looks correct"
- "I believe"

## AEGIS Gate Verification Commands

```bash
# Single module
cargo test <module_name> 2>&1 | grep -E "test result|FAILED"

# Full Rust suite
cargo test 2>&1 | grep "test result" | head -1

# TypeScript Gate 8
cd sovereign-omega-v2 && npm run test && npm run typecheck && npm run build

# Hash integrity
cd sovereign-omega-v2 && node scripts/verify-hashes.mjs

# Working tree clean before commit
git status --short
```

Honesty is not optional. If the command fails, report the failure — don't soften it.
