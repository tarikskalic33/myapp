---
name: evening-seal
description: End-of-session sealing ritual. Run before closing any session. Verifies all work is committed and pushed, README is synced, CLAUDE.md is accurate, and the working tree is clean. Invoked when the user says "done for today", "seal the session", "closing", "wrap up", "finish", or when the session is ending and gates have been built.
---

# Evening Seal — Session Completion Ritual

No session ends with dirty state. This skill enforces constitutional cleanliness before the session closes.

## Step 1 — Dirty State Check
```bash
git -C /home/user/myapp status --short
git -C /home/user/myapp stash list
```

For every untracked or modified file:
- If it's a new gate module (`*.rs`): commit it via `/ship`
- If it's CLAUDE.md or README.md: commit it
- If it's a skill file: commit it
- If it's a `.env` file: do NOT commit it — verify it's gitignored

Report: `DIRTY FILES: <list> / CLEAN`

## Step 2 — Test Count Sync
```bash
cd /home/user/myapp/aegis-cl-psi && cargo test 2>&1 | grep "test result" | head -1
```

Compare the output count against CLAUDE.md:
```bash
grep "tests)" /home/user/myapp/CLAUDE.md
```

If mismatch: update CLAUDE.md with correct test count and commit.

## Step 3 — Gate Count Sync
```bash
grep -c "^pub mod" /home/user/myapp/aegis-cl-psi/src/lib.rs
grep "Gates complete:" /home/user/myapp/CLAUDE.md
```

If mismatch: update CLAUDE.md gates count and commit.

## Step 4 — README Sync
```bash
git -C /home/user/myapp diff README.md | head -5
```

If README.md is modified (auto-updated by sync script): commit it.
```bash
# Fix gate module count in README if needed:
grep "gate modules" /home/user/myapp/README.md
# Update if stale, then:
git -C /home/user/myapp add README.md
git -C /home/user/myapp commit -m "Sync README: <N> gate modules, <T> Rust tests, <total> total
https://claude.ai/code/session_01WvFyntZArqThRgLczRutuM"
```

## Step 5 — Hash Integrity Seal
```bash
cd /home/user/myapp/sovereign-omega-v2 && node scripts/verify-hashes.mjs 2>&1 | tail -3
```

Assert: exits 0. Constitutional files unchanged.
Report: `HASH SEAL: PASS / BROKEN`

## Step 6 — Push All Commits
```bash
git -C /home/user/myapp push -u origin claude/aegis-setup-Lx7Ji
```

Verify: push succeeds. Report the commit hash range pushed.

## Step 7 — Final Clean Check
```bash
git -C /home/user/myapp status --short
git -C /home/user/myapp log --oneline -3
```

Assert: working tree is clean. The last 3 commits represent the session's work.

## Step 8 — Session Summary
Count gates built this session (compare starting and ending gate count from git log).

Report what was accomplished:
- Gates built: Gate X to Gate Y
- Tests added: N new tests
- Skills created: (if any)
- Other: (CLAUDE.md, design, docs)

## Evening Seal Report

```
EVENING SEAL — <date> <time>
════════════════════════════════
Working tree:      CLEAN ✓
Test count synced: <T> (CLAUDE.md updated: YES/NO)
Gate count synced: <N> (CLAUDE.md updated: YES/NO)
README synced:     YES/NO
Hash integrity:    SEALED ✓
All commits pushed: YES ✓ (<branch>)

SESSION BUILT:
  Gates: <start_N> → <end_N> (+<pairs> pairs)
  Tests: <start_T> → <end_T> (+<new> tests)
  Last commit: <hash>

TOMORROW BEGINS AT: Gate <N+1>
Active series: <gossip_broadcast_*>
CONSTITUTIONAL STATUS: SEALED ✓
════════════════════════════════
```
