# AEGIS Implementation Traceability Register
## Epistemic Tier: T1
## Adversarial audit: ChatGPT (CONFIDENCE 0.95) — applied 2026-05-19

Every T0–T2 implementation decision traces to at least one research source.
Format: `IMPLEMENTATION → [tier] → SOURCE DOCUMENT (Drive ID) → key claim`

Absence of a traceability entry for a T0/T1 component is a migration rule violation.
New T0/T1 components must add an entry here in the same commit.

---

## Layer B — Python Core Matrix

### core_matrix.py — M1/M2/M3 functional decomposition
`M1 (state) | M2 (calibration) | M3 (inference)` →
**T1** → SOVEREIGN_OMEGA_INTEGRATED_SPEC_v2.md (`1cfFY59zAczNPCL7mvr_TxFo1yR7xfDNh`)
→ §3: "Three functional regions over a contiguous byte array, partitioned by role."

### core_matrix.py — Q16.16 fixed-point arithmetic
`to_fixed / from_fixed / fixed_mul throughout` →
**T0** → hardware_config.py (self-grounding, mechanically enforced) +
SOVEREIGN_OMEGA_INTEGRATED_SPEC_v2.md (`1cfFY59zAczNPCL7mvr_TxFo1yR7xfDNh`)
→ §2: "Bit-shifted integer arithmetic for cross-GPU determinism."

### core_matrix.py — SHA-256 hash chaining (M1)
`chain_hash = SHA256(prev_hash || payload_hash)` →
**T0** → A Holon-Architected Compiler (`1lu31YCW-TW2SVr3IyGeQZBTB1YXbnCG5`)
→ "Cryptographic lineage is the only valid substrate for replay integrity."

### pgcs.py — swap page-size correction (F-08)
`disk_swap_bytes = swap.sin * resource.getpagesize()` →
**T0** → Linux kernel documentation (external) + AUDIT_FINDINGS.md F-08

### epoch_failsafe.py — quick-consensus rounds = 3
`QUICK_CONSENSUS_ROUNDS = 3` →
**T1** → RALPH_LOOP_OMEGA2_INTEGRATION_AUDIT.md (`11MWyKyAfBKHY9TXUZ_iDqilybuAZf_3M`)
→ "Three-round consensus sufficient for Byzantine fault tolerance under the cascade
   failure model (single operator, no adversarial nodes)."

### gradient_anchor.py — momentum β = 0.9
`_momentum_beta = to_fixed(0.9)` →
**T1** → Empirically validated: convergence_epochs > 0 at β=0.9 in P1 smoke test.
No external source — T2 engineering hypothesis elevated to T1 via stress test.

### hardware_config.py — Shannon entropy (information-theoretic substrate)
`shannon_entropy_fixed / kl_divergence_fixed / mutual_information_fixed` →
**T3** → Orchestrating Emergent Intelligence (`1OpO3JpYAHSWkyh0aOzRa_6agbfuPJVgl`)
→ "Information-theoretic measures ground the calibration layer's self-awareness."
Note: T3 source. Elevated to T0 implementation status because the math is
mechanically verified (pure functions, no external state). Migration rule satisfied:
T3 research grounds T0 math — not T0 architecture decisions.

---

## Layer A — TypeScript Governance Runtime

### src/core/canonicalize.ts — RFC 8785 JCS
`canonicalizeJCS` →
**T0** → RFC 8785 (external standard) + jcs.test.ts (17/17 tests including emoji/surrogate)
→ "Canonical JSON Serialization for cryptographic integrity."

### src/gate/hoeffding.ts — Bernstein bounds (named hoeffding for historical reasons)
`ConfidenceSequence / computeLCBFromSamples` →
**T1** → Waudby-Smith & Ramdas (2024) "Anytime-Valid Confidence Sequences" (external)
→ "Bernstein e-process bounds valid at every stopping time, not just fixed sample sizes."
Named `hoeffding.ts` for legacy compatibility. H-03 resolved: comment in file documents this.

### src/calibration/vcg.ts — VCG tracker with Wilson CI
`getConfidenceInterval / getCalibrationBias / getBrierScore` →
**T1** → An Asymmetric Market for Uncertainty (`1uN2Ts3GBaa-YXe_wo7z4zs6e07mT4984`)
→ "Calibration error markets require confidence intervals, not point estimates."
Wilson score interval: Agresti & Coull (1998) (external).

### src/core/ralph-loop.ts — Ralph Loop state machine
`RalphLoop / RalphCycle / RalphPhase` →
**T2** → RALPH_LOOP_OMEGA_EXECUTION_SYNTHESIS.md (`1TTzre0Oy1BEZ_g5lm926XJ2UiFtjfJsr`)
→ "Review → Analyze → Link → Patch → Harmonize as the iterative governance protocol."

### src/core/invariant-checker.ts — 8 runtime invariants
`INV-01..INV-08` →
**T0** → sovereign-omega-v2/CLAUDE.md (Critical Invariants section) +
SOVEREIGN_OMEGA_INTEGRATED_SPEC_v2.md (`1cfFY59zAczNPCL7mvr_TxFo1yR7xfDNh`)
→ §6: "Invariant set for Layer A TypeScript runtime."

### src/core/types.ts — HolonMetadata + HolonicScale
`HolonicScale / EpistemicTier / HolonMetadata / RalphLoopState` →
**T2** → Preserving Criticality in Holonic AI (`1LJ1KoT195nJDBLGyR9VRzrnVWlFCxgO8`) +
A Holon-Architected Compiler (`1lu31YCW-TW2SVr3IyGeQZBTB1YXbnCG5`)
→ "Holon hierarchy from Koestler; scale taxonomy from AEGIS field architecture."
→ ChatGPT adversarial audit (CONFIDENCE 0.95): "canonical holonic phrase" applied.

### src/event/store.ts — three-phase IDB append (F-03 fix)
`Phase 1 (readonly tx) → Phase 2 (WebCrypto) → Phase 3 (readwrite tx)` →
**T0** → IndexedDB spec (external): "Transactions auto-commit when no IDB requests are
pending during a microtask boundary. async/await inside IDB callbacks crosses this boundary."

### python/gate.py / dna.py / router.py — constitutional files
`FROZEN — SHA-256 verified` →
**T0** → SOVEREIGN_OMEGA_INTEGRATED_SPEC_v2.md (`1cfFY59zAczNPCL7mvr_TxFo1yR7xfDNh`)
→ §7: "Three constitutional files form the immutable governance substrate."
→ verify-hashes.mjs enforces mechanically.

---

## Conceptual Lineage (theoretical grounding)

| AEGIS concept | Theoretical ancestor | Source |
|--------------|---------------------|--------|
| Holon / holonic scale | Koestler (1967) *The Ghost in the Machine* | External |
| Anytime-valid bounds | Waudby-Smith & Ramdas (2024) | External |
| VCG mechanism | Vickrey (1961), Clarke (1971), Groves (1973) | External |
| Fixed-point determinism | IEEE 754 critique + GPU non-determinism literature | T3 corpus |
| Entropy as calibration signal | Shannon (1948) *A Mathematical Theory of Communication* | External |
| Constitutional governance | Constitutional AI research (Anthropic, 2022) | External |
| Recursive knowledge graphs | From Local Task to Global Integration (`1xaKuiktzJWkTmwaoi_wCwunA4Y9HTZrb`) | T3 Drive |
| Epoch failsafe / cascade isolation | Resilience by Analogy (`1ozQ641HrGlOiW2jkMBxg-lBEZChJlYUb`) | T3 Drive |
| Holonic AI criticality | Preserving Criticality in Holonic AI (`1LJ1KoT195nJDBLGyR9VRzrnVWlFCxgO8`) | T3 Drive |

---

## Open Provenance Gaps (migration rule violations requiring resolution)

| Component | Gap | Resolution path |
|-----------|-----|----------------|
| gradient_anchor.py β=0.9 | No external source — T1 by stress test only | Run formal convergence analysis or cite momentum literature |
| pipeline/backpressure.ts HWM/LWM values | Constants chosen heuristically | Cite queuing theory (Little's Law) or empirical load test |
| tgcs_afse.py holonic_scaling_score() | Novel composite metric, no prior art cited | Add reference to effective bandwidth literature |
| src/core/invariant-checker.ts INV-03..INV-07 | Derived from CLAUDE.md, no Drive document | Promote relevant sections of INTEGRATED_SPEC to primary source |

These gaps do NOT violate T0 — the implementations are mechanically correct.
They violate the provenance completeness requirement and must be closed before
the system claims full epistemic traceability.
