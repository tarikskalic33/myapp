---
name: gate-pair
description: The core daily gate-building ritual. Build exactly 2 new aegis-cl-psi Rust gate modules per invocation, following the strict TDD → implement → test → ship sequence. Invoked when the user says "build gates", "next gates", "continue building", "gate pair", or after morning-audit declares a session target. Never build more than 2 gates per invocation.
---

# Gate Pair — Core Gate-Building Ritual

Build exactly 2 gates. No more, no fewer per session. The constraint creates quality.

## The Invariant Gate Pattern

Every aegis-cl-psi gate module MUST follow this exact structure:

```
EPISTEMIC TIER: T2 (engineering hypothesis)

Constants:
  pub const <NAME>_GENESIS_HASH: [u8; 32] = [0u8; 32];
  pub const <THRESHOLD_NAME>: <type> = <value>;

Entry struct:
  epoch_end:    u64
  <primary>:    u32
  <secondary>:  u32      (denominator or related metric)
  <rate>_pct:   u32      (derived: (primary*100)/max(secondary,1), capped 100)
  <flag>:       bool     (derived: rate_pct <op> THRESHOLD)
  entry_hash:   [u8; 32]
  prev_hash:    [u8; 32]

Hash formula:
  SHA-256(prev[32] ‖ epoch_end_be8 ‖ primary_be4 ‖ secondary_be4 ‖ rate_be4 ‖ flag_byte)

Log struct methods:
  new(), entry_count(), is_empty(), entries(), latest()
  record(epoch_end, primary, secondary) → &Entry
  <flag>_count() → usize        (filter on bool flag)
  total_<primary>() → u64       (accumulator)
  mean_<rate>_pct() → u32       (returns 0 if empty)
  verify_chain() → (bool, Option<usize>)
  impl Default

Tests: exactly 19 (groups: record fields, threshold, aggregates, hash chain, verify_chain, determinism)
```

## Build Sequence

### Phase A — Define the pair
Before writing any code, declare:
```
GATE <N+1>: gossip_broadcast_<name_a>
  Measures: <what physical phenomenon in the gossip layer>
  Primary field: <field_name>: u32
  Secondary field: <field_name>: u32 (denominator)
  Rate formula: (<primary>*100)/max(<secondary>,1), capped 100
  Threshold: <CONST_NAME>: u32 = <value> (<> operator, meaning)
  Flag: <flag_name>: bool — <when true means what>
  Aggregates: <flag>_count(), total_<primary>(), mean_<rate>_pct()

GATE <N+2>: gossip_broadcast_<name_b>
  [same structure]
```

### Phase B — Write Gate N+1
1. Write `aegis-cl-psi/src/gossip_broadcast_<name_a>.rs` (full implementation)
2. `cargo test gossip_broadcast_<name_a> 2>&1 | grep -E "FAILED|test result"`
3. Assert: 19 passed, 0 failed.

### Phase C — Write Gate N+2
1. Write `aegis-cl-psi/src/gossip_broadcast_<name_b>.rs` (full implementation)
2. `cargo test gossip_broadcast_<name_b> 2>&1 | grep -E "FAILED|test result"`
3. Assert: 19 passed, 0 failed.

### Phase D — Register both in lib.rs
Append to `aegis-cl-psi/src/lib.rs` before the `pub use` block:

```rust
// Gate <N+1> — Gossip Broadcast <Name A> Log (T2)
// Per-epoch <description>: <primary>, <secondary>, <rate>_pct = (<p>*100)/max(<s>,1) capped 100.
// <flag>: <rate>_pct <op> <THRESHOLD> (<value>).
// entry_hash = SHA-256(prev[32]‖epoch_end_be8‖<primary>_be4‖<secondary>_be4‖<rate>_be4‖<flag>_byte).
// Gossip<NameA>Log: record(), <flag>_count(), total_<primary>(), mean_<rate>_pct(), verify_chain().
pub mod gossip_broadcast_<name_a>;

// Gate <N+2> — Gossip Broadcast <Name B> Log (T2)
// [same format]
pub mod gossip_broadcast_<name_b>;
```

### Phase E — Full suite verification
```bash
cd /home/user/myapp/aegis-cl-psi && cargo test 2>&1 | grep "test result" | head -1
```
Assert: 0 failed. Note new total test count.

### Phase F — Ship
Invoke `/ship` skill or follow these steps:
```bash
git add aegis-cl-psi/src/gossip_broadcast_<a>.rs aegis-cl-psi/src/gossip_broadcast_<b>.rs aegis-cl-psi/src/lib.rs
git commit -m "Gates <N+1>-<N+2>: Gossip Broadcast <A> + <B> logs

Gate <N+1>: ...
Gate <N+2>: ...

Total: <T> tests passing.

https://claude.ai/code/session_01WvFyntZArqThRgLczRutuM"
```

Update CLAUDE.md: gates count + test count.

```bash
git add CLAUDE.md && git commit -m "Update CLAUDE.md: <N+2> gates complete
https://claude.ai/code/session_01WvFyntZArqThRgLczRutuM"
git push -u origin claude/aegis-setup-Lx7Ji
```

## Constitutional Checklist (verify before ship)

- [ ] `to_be_bytes()` — never `to_le_bytes()`
- [ ] `BTreeMap`/`BTreeSet` only — no `HashMap`
- [ ] `saturating_add`/`saturating_mul` — no overflow
- [ ] Genesis constant `[0u8; 32]` present
- [ ] `verify_chain()` present and tested
- [ ] `Default` impl present
- [ ] Exactly 19 tests per module
- [ ] Threshold is `>` (not `>=`) for "above threshold" flags, `<` (not `<=`) for "below threshold" flags
- [ ] `EPISTEMIC TIER: T2` in header comment
- [ ] NO `--all-features` flag used

## Gate Pair Report

```
GATE PAIR COMPLETE:
  Gate <N+1>: <name_a> — 19 tests PASS
    Threshold: <CONST> = <value>  Flag: <flag> when rate <op> <value>
  Gate <N+2>: <name_b> — 19 tests PASS
    Threshold: <CONST> = <value>  Flag: <flag> when rate <op> <value>
  Full suite: <T> tests, 0 failed
  Committed: <hash>
  Pushed: YES
  CLAUDE.md: UPDATED (<N+2> gates, <T> tests)
```
