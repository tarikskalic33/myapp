# CORPUS MINDMAP — Sovereign Omega Cognitive Substrate
## Replayable Semantic Lattice · Particle-Field Holonic Framework
## Branch: claude/aegis-setup-Lx7Ji · Operator: Tarik Skalić

> This document IS the cognitive substrate layer. It is not documentation of the system —
> it is the first operational instance of the architecture it maps. Every subagent entering
> this repository should read this document before reading any source file.

---

## 0. Initialization Sequence

The correct build order for cognitive orientation is not:

```
application → framework → orchestration
```

It is:

```
cognitive substrate          ← THIS DOCUMENT
  → deterministic workflow topology   ← INTEGRATED_SPEC_v2 §1-6
    → recursive subagent ecology      ← QWEN directives + Paperclip + SAGA
      → executable governance runtime ← sovereign-omega-v2 src/ + python/
        → application layer           ← cockpit/ + commercial products
```

**What this means in practice:**
- Read this document before reading any source file
- Read INTEGRATED_SPEC_v2 before writing any TypeScript
- Run Gate 1 before writing any file (RFC 8785 conformance is the foundation)
- The cognitive substrate and the governance runtime are co-dependent holons — neither
  is complete without the other

**Critical Non-Equivalence (must precede every external description of this system):**

> A perfectly replayable system can still replay catastrophic reasoning flawlessly.

| Concept | Meaning |
|---------|---------|
| Replayability | Reproducing identical outputs from identical inputs |
| Correctness | Producing true or optimal outputs |
| Calibration | Statistical correspondence between confidence and outcomes |
| Governance | Human or institutional oversight capability |
| Auditability | Ability to reconstruct historical execution lineage |
| Alignment | Stable correspondence with human values or intent |

---

## 1. Particle-Field Component Map

Every file, reducer, verifier, replay segment, and calibration primitive is simultaneously:
- A locally coherent particle-like unit (interior coherence, type contracts, invariants)
- A field interaction surface (public API, side effects, exported interface)
- A carrier of constrained authority (permissions, trust class, constitutional status)
- A participant in larger emergent deterministic structures

| Physical Analog | AEGIS Component | Location |
|-----------------|-----------------|----------|
| Molecular-state carrier | Reducer (pure function: frozen state → new frozen state) | `src/core/reducer.ts` |
| State-transition operator | EventEnvelope append + projection update | `src/event/store.ts` |
| Causal interaction chain | Append-only hash-chained event stream (E3 substrate) | `src/event/store.ts` |
| Observation layer | Verifier classes V1–V5 (classified trust) | `src/verifier/` |
| Probability-collapse boundary | Bernstein gate with K-bound enforcement | `src/gate/hoeffding.ts` |
| Entropy-collapse region | Bit-shifted integer arithmetic, WASM kernels | `python/core_matrix.py` |
| Conservation law | SHA-256 hash-chaining invariant (prev_hash → self_hash) | `src/core/canonicalize.ts` |
| Invariant-preserving field continuity | RFC 8785 JCS canonicalization | `src/core/canonicalize.ts` |
| Carrier of constrained authority | Constitutional frozen files (gate.py, dna.py, router.py) | `python/` (frozen) |
| Epoch clock | Sequence numbers (never wall clock) | `src/event/uuid.ts` |
| Measurement manifold | VCG calibration + rolling window | `src/calibration/vcg.ts` |
| Phase boundary | RuntimeVersionPin hard abort | `src/runtime/version.ts` |
| Interaction membrane | Python bridge HTTP (port 7890) | `python/bridge.py` |
| Forensic trace | AmbiguityTrace + InteractionMap projections | `src/forensics/` |

---

## 2. Holonic Scale Register

A holon (Koestler 1967) is simultaneously a whole and a part. Every component in this
system exists at a primary holonic scale and participates in all scales above it.

### Scale 0 — Subatomic (byte-level invariants)

These are the atoms below files — the constraints that govern raw computation.

| Invariant | Enforcement | Location |
|-----------|-------------|----------|
| RFC 8785 JCS byte ordering | `canonicalizeJCS()` | `src/core/canonicalize.ts` |
| SHA-256 hex encoding | `Array.from(bytes).map(b => b.toString(16).padStart(2,'0'))` | multiple |
| Bit-shifted integer arithmetic | `M1/M2/M3` functions throughout | `python/core_matrix.py` |
| UUIDv7 monotonic timestamp prefix | `generateUUIDv7()` | `src/event/uuid.ts` |
| NFC Unicode normalization | Inside `canonicalizeJCS` | `src/core/canonicalize.ts` |
| Non-BMP surrogate handling | `cp > 0xFFFF` check before surrogate range | `src/core/canonicalize.ts` |
| Fixed-point arithmetic precision | No floating-point in Python determinism paths | `python/core_matrix.py` |
| Sequence overflow guard | Virtual millisecond steal when `seq > 0xFFF` | `src/event/uuid.ts` |

### Scale 1 — Atomic (individual files as holons)

Each file is a complete unit of responsibility with a defined public surface.

| File | Role | Tier | Constitutional |
|------|------|------|---------------|
| `src/core/canonicalize.ts` | RFC 8785 JCS engine | T0 | No |
| `src/core/types.ts` | Branded types (UUIDv7, SHA256Hex, BoundedDelta, SequenceNumber) | T0 | No |
| `src/core/immutable.ts` | `deepFreeze` implementation | T0 | No |
| `src/core/reducer.ts` | Pure reducer framework | T0 | No |
| `src/event/store.ts` | Three-phase IDB append (readonly → hash → readwrite) | T0 | No |
| `src/event/uuid.ts` | UUIDv7 generation (only permitted `Date.now()` use) | T0 | No |
| `src/gate/hoeffding.ts` | Bernstein bounds gate (misnamed: implements Waudby-Smith & Ramdas 2024) | T0 | No |
| `src/calibration/vcg.ts` | VCG calibration tracker | T1 | No |
| `python/core_matrix.py` | M1/M2/M3 functions over contiguous byte array | T0 | No |
| `python/gate.py` | Python gate logic | T0 | **FROZEN** |
| `python/dna.py` | DNA structural definitions | T0 | **FROZEN** |
| `python/router.py` | Event routing | T0 | **FROZEN** |
| `python/epoch_failsafe.py` | Epoch corruption guard (`corruption_count == 0` invariant) | T0 | No |
| `python/pgcs.py` | PGCS telemetry source | T1 | No |
| `python/bridge.py` | HTTP bridge TS → Python (port 7890) | T1 | No |
| `python/gradient_anchor.py` | Zero-tolerance RuntimeError on anchor violation | T0 | No |
| `python/tgcs_afse.py` | Sequence-based variance (no `time.time()`) | T1 | No |
| `src/compliance/tombstone.ts` | GDPR tombstoning (KMS stub: one known non-blocking gap) | T1 | No |
| `formal/theories/Core/Hash.v` | Coq proof of hash invariants | T0 | No |
| `formal/theories/Core/Reducer.v` | Coq proof of reducer purity | T0 | No |
| `formal/theories/Core/Event.v` | Coq proof of event schema | T0 | No |
| `formal/theories/Bisimulation/ThreeWay.v` | Coq proof of three-way bisimulation | T0 | No |
| `formal/tlaplus/Omega.tla` | TLA+ temporal logic specification | T0 | No |
| `formal/tlaplus/Omega.cfg` | TLA+ configuration | T0 | No |

### Scale 2 — Molecular (modules as holons)

| Module | Single Responsibility | Key Exports | Coupling |
|--------|-----------------------|-------------|---------|
| `src/core/` | Deterministic computation primitives | `canonicalizeJCS`, `deepFreeze`, branded types | Zero external runtime deps |
| `src/event/` | Append-only event substrate | `EventStore`, `generateUUIDv7` | `src/core/` only |
| `src/gate/` | Bernstein statistical gating | `BernsteinGate`, `computeLCB` | `src/core/types.ts` |
| `src/calibration/` | VCG + rolling window | `VCGTracker`, `computeVCG` | `src/core/` |
| `src/verifier/` | Trust-partitioned verification | V1–V5 interfaces + registry | `src/core/types.ts` |
| `src/pipeline/` | Decision compilation | `DecisionPipeline`, `compile` | All modules |
| `src/projection/` | State projection algebra | Reducers over event streams | `src/core/`, `src/event/` |
| `src/runtime/` | Version pinning + hard abort | `RuntimeVersionPin` | `src/core/` |
| `src/forensics/` | AmbiguityTrace, InteractionMap | Forensic projections | `src/event/` |
| `src/compliance/` | GDPR tombstoning | `TombstoneManager` | `src/event/` |
| `python/` | Hardware inference layer | Core Matrix M1/M2/M3, bridge | Independent layer |
| `formal/` | Machine-verified proofs | Coq theorems, TLA+ spec | External proof checkers |

### Scale 3 — Cellular (subsystems as holons)

| Subsystem | Emergent Capability | Components |
|-----------|---------------------|------------|
| E3 Substrate | Cryptographically tamper-evident append-only event log | `store.ts`, `uuid.ts`, `canonicalize.ts` |
| VCG Calibration | Anytime-valid statistical confidence bounds (not Hoeffding — Bernstein) | `vcg.ts`, `hoeffding.ts`, verifier V1–V3 |
| Python Core Matrix | GPU-accelerated deterministic inference under bit-shifted arithmetic | `core_matrix.py`, `pgcs.py`, `tgcs_afse.py`, `epoch_failsafe.py` |
| Governance Bridge | Unidirectional TS → Python telemetry pipe | `bridge.py` (port 7890) |
| Formal Verification | Machine-verified properties for T0 claims | Coq + TLA+ in `formal/` |
| 8-Gate Build System | Ordered deployment gate sequence | All test files + CI config |

### Scale 4 — Organism (products as holons)

| Product | Role | T0 dependency | Revenue |
|---------|------|---------------|---------|
| `sovereign-omega-v2/` | Governance runtime — the organism's brain | Self-contained | Foundation |
| `cockpit/` | AI chat UI + telemetry dashboard | Polls `bridge.py` | $0 (free) |
| `platform-picker/` | Platform recommendation ($19) | None | $19 |
| `hook-generator/` | Viral hook generation ($19) | None | $19 |
| `content-calendar/` | Content calendar AI ($19) | None | $19 |
| `hub/` | Landing page connecting all 3 tools | None | Bundle sales |

### Scale 5 — Field (ecosystem as holon)

The field is the distributed semantic environment within which the organism operates.

| Field Node | Role | Trust Class |
|------------|------|-------------|
| Claude (coordinator) | Synthesis, coordination, code execution | Orchestration |
| ChatGPT (adversarial audit, temp 0.99) | Adversarial review, gap detection | Advisory |
| Qwen (implementation) | Implementation agent | Implementation |
| Tarik Skalić (operator) | Vision architect, guardian authority | T0 override authority |
| Google Drive corpus | Distributed semantic memory | Reference |
| This document | Cognitive substrate — first operational instance | T0 substrate |
| GitHub (tarikskalic33/myapp) | Persistent code state | Infrastructure |

---

## 3. Epistemic Tier Registry

Classification rationale: T0 = mechanically proven/enforced; T1 = empirically validated;
T2 = engineering hypothesis; T3 = research conjecture; T4 = speculative vision; T5 = creative.

Migration rule (from CLAUDE.md): **No T4/T5 construct may ground a T0–T2 claim without evidence review.**

### T0 — Mechanically Proven

| Document / File | Location | Key Claims |
|-----------------|----------|------------|
| `SOVEREIGN_OMEGA_INTEGRATED_SPEC_v2.md` | Drive: `1cfFY59zAczNPCL7mvr_TxFo1yR7xfDNh` | Canonical system definition, enforcement boundary, 6 primitives |
| `CLAUDE.md` (Drive copy) | Drive: `1gnM-TwrOHLUyon2sdBJpImAcZtV1pxzC` | Operator directives, invariants, build order |
| `src/core/canonicalize.ts` | Local repo | RFC 8785 JCS with NFC, surrogates, circular detection |
| `src/event/store.ts` | Local repo | Three-phase IDB append, race protection via unique index |
| `src/event/uuid.ts` | Local repo | UUIDv7 monotonic with overflow protection |
| `src/core/immutable.ts` | Local repo | `deepFreeze` — every state object frozen after construction |
| `src/core/types.ts` | Local repo | Branded primitives (UUIDv7, SHA256Hex, BoundedDelta, SequenceNumber) |
| `python/core_matrix.py` | Local repo | M1/M2/M3 bit-shifted functions over contiguous byte array |
| `python/gate.py` | Local repo (FROZEN) | Python gate logic — hash: `72196f38...` |
| `python/dna.py` | Local repo (FROZEN) | Structural definitions — hash: `9c4d38d8...` |
| `python/router.py` | Local repo (FROZEN) | Event routing — hash: `c96e566c...` |
| `python/epoch_failsafe.py` | Local repo | Epoch corruption guard, `corruption_count == 0` invariant |
| `python/gradient_anchor.py` | Local repo | Zero-tolerance RuntimeError on anchor violation |
| `formal/theories/Core/Hash.v` | Drive: `formal/` folder | Coq proof: hash invariants hold |
| `formal/theories/Core/Reducer.v` | Drive: `formal/` folder | Coq proof: reducer purity holds |
| `formal/theories/Core/Event.v` | Drive: `formal/` folder | Coq proof: event schema invariants |
| `formal/theories/Bisimulation/ThreeWay.v` | Drive: `formal/` folder | Coq: three-way bisimulation correctness |
| `formal/tlaplus/Omega.tla` | Drive: `formal/` folder | TLA+ temporal specification |

### T1 — Empirically Validated

| Document | Drive ID | Key Claims |
|----------|----------|------------|
| `SOVEREIGN_OMEGA_INTEGRATED_SPEC_v2.md` §§4-6 | `1cfFY59zAczNPCL7mvr_TxFo1yR7xfDNh` | VCG thresholds (0.35 alert, 0.50 suspend), window parameters (500 claims, 100 min) |
| `SOVEREIGN_OMEGA_IMPL_BRIEF_Qwen.md` | `1NScZu_7bc9nLXzSWG8Ul_O98KuHL5360` | Implementation targets for Qwen agent |
| `RALPH_LOOP_OMEGA_EXECUTION_SYNTHESIS.md` | `1TTzre0Oy1BEZ_g5lm926XJ2UiFtjfJsr` | Execution synthesis, 378-line audit trail |
| `python/pgcs.py` | Local repo | PGCS telemetry — must pass before TGCS telemetry valid |
| `python/tgcs_afse.py` | Local repo | TGCS variance, AFSE R² — sequence-based, no wall clock |
| `python/bridge.py` | Local repo | HTTP telemetry bridge: `/telemetry`, `/event`, `/gate_signal`, `/health` |
| `src/calibration/vcg.ts` | Local repo | VCG rolling window implementation |
| `research/omega_dynamics/harness.ts` | Drive: `1fM1s2Upc9pRltBjtcREBtqbXPqJQwi1h` | Dynamics research harness |

### T2 — Engineering Hypothesis

| Document | Drive ID | Key Claims |
|----------|----------|------------|
| `RALPH_LOOP_OMEGA2_INTEGRATION_AUDIT.md` | `11MWyKyAfBKHY9TXUZ_iDqilybuAZf_3M` | 422-line integration audit, gap analysis |
| `QWEN_01_EXECUTION_DIRECTIVE.md` | Drive root | First Qwen implementation directive |
| `QWEN_02_EXECUTION_DIRECTIVE.md` | Drive root | Second directive |
| `QWEN_03_EXECUTION_DIRECTIVE.md` | Drive root | Third directive |
| `QWEN_04_EXECUTION_DIRECTIVE.md` | Drive: `1oWL66eB30_yuaINeNY16P6Fnf1kMDNdd` | Final Qwen directive — non-negotiable invariants, prohibited actions |
| `paperclip/company.yaml` | Local repo | Company orchestration configuration |
| `saga/identity.py` | Local repo | SPIFFE/SVID identity stub (awaiting PKI) |
| `agent.config.yaml` | Drive: `agent.config.yaml` file | Agent configuration |
| Cockpit telemetry polling | `cockpit/src/lib/telemetry.ts` | 5s poll of bridge `/telemetry` |

### T3 — Research Conjecture (13 unique research PDFs)

| # | Title | Drive ID | Key Contribution |
|---|-------|----------|-----------------|
| 1 | Preserving Criticality in Holonic AI | `1LJ1KoT195nJDBLGyR9VRzrnVWlFCxgO8` | Holonic scale transitions; criticality preservation across decomposition |
| 2 | Quantum-Inspired Architecture | `10gBmzNovsKMWkqf2AiXJrAn0Mt197o9P` | Quantum probability amplitude analogs in classical AI governance |
| 3 | Verifying Agentic Reasoning | `1Kntuo_DbjzcJa8-BqPM90q-V5CKLFOah` | Formal verification of agentic decision chains |
| 4 | A Holon-Architected Compiler | `1lu31YCW-TW2SVr3IyGeQZBTB1YXbnCG5` | Compiler architecture using holonic decomposition — direct ancestor of AEGIS pipeline |
| 5 | From Local Task to Global Integration | `1xaKuiktzJWkTmwaoi_wCwunA4Y9HTZrb` | Multi-agent local→global coordination patterns |
| 6 | An Asymmetric Market for Uncertainty | `1uN2Ts3GBaa-YXe_vo7z4zs6e07mT4984` | Uncertainty pricing; basis for VCG calibration gap metric |
| 7 | Orchestrating Emergent Intelligence | `1OpO3JpYAHSWkyh0aOzRa_6agbfuPJVgl` | Emergence conditions in multi-agent systems |
| 8 | Decomposing the Monolith | `1LUu4IKCJK0RbcqZkgiwZa-Th7u2dl3vU` | Monolith → holon decomposition methodology |
| 9 | Orchestrating Long-Horizon Reasoning | `1eL8RkV43ynRi_0KAWewIpOPEDnXD7pMb` | Long-horizon coherence in agentic chains |
| 10 | From Divergence to Convergence | `1H5xrLV2M_HVdpzoHK5Czgdb5kQmsFdbJ` | Convergence conditions in calibrated multi-agent systems |
| 11 | Orchestrating Volatility | `1hv9jhS8ROs5selyvvFrhpqzx8s7CE8a5` | Volatility-aware orchestration; epoch failsafe theoretical basis |
| 12 | From Heterogeneity to Cohesion | `1oS83PDBGhdgo3LydaWC05fosXyzJXEmv` | Heterogeneous agent cohesion protocols |
| 13 | Resilience by Analogy | `1ozQ641HrGlOiW2jkMBxg-lBEZChJlYUb` | Resilience patterns from physical system analogies |

### T4 — Speculative Vision

| Document | Drive ID | Key Claims |
|----------|----------|------------|
| `SOVEREIGN_OMEGA_AGI_FRAMEWORK_CONCLUDED.md` | `1_gebxxUSk_OO0B575K7j03AX4YRkpvDq` | Archive 4 synthesis; 5-layer framework; 8 failure modes; EU AI Act deadline Aug 2026 |
| `SOVEREIGN_OMEGA_VISION_ASSEMBLED.md` | `1umR8RoWZwJQAQuG4uzU-N16HMOmCUK09` | 7-piece puzzle: Governance Substrate → Translation Layer → Council → Swarm → AEGIS → Research → Operator |

### T5 — Creative / Worldbuilding

No T5 documents identified in the Drive corpus. The "Cycle series" referenced in CLAUDE.md
is not present in the indexed files.

---

## 4. Semantic Ancestry Chains

Each T0 implementation node traced back through its epistemic lineage.

### Chain A: RFC 8785 Canonicalization

```
T0: src/core/canonicalize.ts (canonicalizeJCS)
  ↑ grounds: INTEGRATED_SPEC_v2 §1 Primitive 6 "UTF-8 encoding before hashing, byte-concatenation"
    ↑ grounds: Shapiro et al. 2011 (G-Set CRDT distributed convergence proof) [T3]
      ↑ grounds: "byte-identical hashes across Node.js, browser, and WASM environments" [T1 requirement]
```

### Chain B: Bernstein Bounds (misnamed hoeffding.ts)

```
T0: src/gate/hoeffding.ts (implements Bernstein, NOT Hoeffding)
  ↑ grounds: INTEGRATED_SPEC_v2 §5.2 "anytime-valid empirical Bernstein bounds"
    ↑ grounds: Howard et al. 2020 + Waudby-Smith and Ramdas 2024 (e-value literature) [T3]
      ↑ grounds: "Hoeffding assumes IID samples, which adaptive systems violate" [T2 observation]
        ↑ grounds: PDF #6 "An Asymmetric Market for Uncertainty" [T3]
          ↑ grounds: VISION_ASSEMBLED piece 1 "Governance Substrate" [T4]
```

**NOTE**: The naming discrepancy (hoeffding.ts implements Bernstein) is a **legacy artifact**.
The module must NOT be renamed — it is referenced by `risk.ts` and `fixedpoint.ts`. A clarifying
annotation (H-03) is required on the file.

### Chain C: Sequence Number Authority

```
T0: src/event/store.ts (IndexedDBSequenceAllocator in Phase 3 write transaction)
  ↑ grounds: INTEGRATED_SPEC_v2 §3 "sequence: bigint; atomic, persistent; never derived from array.length"
    ↑ grounds: CLAUDE.md invariant "No array.length for sequences"
      ↑ grounds: INTEGRATED_SPEC_v2 §1 Primitive 2 "sequence-authoritative replay ordering" [T1]
        ↑ grounds: QWEN 04 DIRECTIVE non-negotiable invariants [T2]
```

### Chain D: Python Core Matrix Determinism

```
T0: python/core_matrix.py (M1/M2/M3 bit-shifted arithmetic)
  ↑ grounds: INTEGRATED_SPEC_v2 §1 Primitive 6 "WASM-pinned floating-point arithmetic"
    ↑ grounds: PDF #11 "Orchestrating Volatility" — volatility-aware epoch stability [T3]
      ↑ grounds: VISION_ASSEMBLED piece 6 "quasicrystal-CDT spectral correspondence" [T4]
        ↑ MIGRATION RULE FLAG: T4 → T0 path requires evidence review (quasicrystal-CDT
          is T3 conjecture; does not ground core_matrix.py M1/M2/M3 directly)
```

### Chain E: Epoch Failsafe

```
T0: python/epoch_failsafe.py (corruption_count == 0 invariant)
  ↑ grounds: AGI_FRAMEWORK_CONCLUDED "three production-hardening vectors: Epoch Failsafe T0" [T4]
    ↑ grounds: PDF #11 "Orchestrating Volatility" [T3]
      ↑ MIGRATION RULE FLAG: T4 → T0 path — AGI_FRAMEWORK_CONCLUDED is T4;
        epoch_failsafe.py is T0. The hardening vector is grounded in T3 research, but
        the T4 framework document cannot be the authority for a T0 invariant.
        Resolution: epoch_failsafe.py's invariants are self-grounded by mechanical necessity;
        AGI_FRAMEWORK_CONCLUDED documents the rationale retrospectively.
```

### Chain F: VCG Calibration Layer

```
T1: src/calibration/vcg.ts (VCG rolling window, 500-claim default)
  ↑ grounds: INTEGRATED_SPEC_v2 §4 VCG(W) = (1/|W|) × Σ |confidence − correct|
    ↑ grounds: Vempala-Wilkes theorem (VCG floor non-zero for autoregressive models) [T3 external]
      ↑ grounds: ECE literature (VCG = ECE under deterministic verification) [T3]
        ↑ grounds: PDF #6 "Asymmetric Market for Uncertainty" [T3]
```

### Chain G: Trust Partitioning (V1–V5)

```
T0 rule: V4/V5 (LLM judges, human review) never used as calibration inputs
  ↑ grounds: INTEGRATED_SPEC_v2 §1 Primitive 5 "V4 (statistical evaluators: LLM judges)
             and V5 (human review) are Advisory-Excluded"
    ↑ grounds: QWEN 04 DIRECTIVE "V4/V5 never in VCG calibration" [T2]
      ↑ grounds: PDF #3 "Verifying Agentic Reasoning" [T3]
```

---

## 5. Dependency Lineage Graph

Directed graph: SOURCE [tier] → GROUNDS → TARGET [tier]

```
PDF #4 Holon-Architected Compiler [T3]
  → GROUNDS → INTEGRATED_SPEC_v2 §6 Ambiguity Routing / E1 design [T1]
    → GROUNDS → src/forensics/ (AmbiguityTrace, InteractionMap) [T0]

PDF #6 Asymmetric Market for Uncertainty [T3]
  → GROUNDS → INTEGRATED_SPEC_v2 §4 VCG definition [T1]
    → GROUNDS → src/calibration/vcg.ts [T0]
      → GROUNDS → Gate 5: npm run test -- test/unit/vcg.test.ts [T0 verified]

Howard et al. 2020 + Waudby-Smith & Ramdas 2024 [T3 external citations]
  → GROUNDS → INTEGRATED_SPEC_v2 §5.2 Bernstein bounds [T1]
    → GROUNDS → src/gate/hoeffding.ts [T0]
      → GROUNDS → Gate 6: npm run test -- test/unit/gate.test.ts [T0 verified]

Shapiro et al. 2011 G-Set CRDT [T3 external]
  → GROUNDS → INTEGRATED_SPEC_v2 §1 Primitive 1 E3 substrate [T1]
    → GROUNDS → src/event/store.ts + src/core/canonicalize.ts [T0]
      → GROUNDS → Gate 1 + Gate 2 [T0 verified]

VISION_ASSEMBLED §1 Governance Substrate [T4]
  → GROUNDS (via T2 bridge: QWEN 04 DIRECTIVE) → INTEGRATED_SPEC_v2 [T1]
    → GROUNDS → src/ implementation [T0]

AGI_FRAMEWORK_CONCLUDED 5-layer framework [T4]
  → GROUNDS (via T2 bridge: RALPH_LOOP docs) → INTEGRATED_SPEC_v2 [T1]
    → GROUNDS → src/ + python/ implementation [T0]
```

**MIGRATION RULE VIOLATIONS (T4/T5 → T0–T2 without evidence review):**

| Chain | Violation | Status |
|-------|-----------|--------|
| VISION_ASSEMBLED → core_matrix.py (via quasicrystal-CDT) | T4 claim attempting T0 grounding | MITIGATED: T0 invariants are self-grounded; T4 is retrospective framing only |
| AGI_FRAMEWORK_CONCLUDED → epoch_failsafe.py | T4 document naming T0 invariant | MITIGATED: epoch_failsafe.py is grounded by PDF #11 (T3) + mechanical necessity |
| VISION_ASSEMBLED §6 Research Dimension (quasicrystal-CDT) | T4 → T3 label accepted; T4 → T0 rejected | PENDING: Guardian review recommended if any T0 code references quasicrystal-CDT |

---

## 6. Contradiction Surfaces

Locations where two corpus documents make incompatible claims at the same tier.

| # | Document A | Claim A | Document B | Claim B | Resolution |
|---|-----------|---------|-----------|---------|------------|
| C-01 | INTEGRATED_SPEC_v2 §5.3 | Gate achieves Level 1-2 but NOT Level 3 (no forward invariance guarantee) | AGI_FRAMEWORK_CONCLUDED (T4) | Implies "constitutional stability" | RESOLVED: INTEGRATED_SPEC_v2 is authoritative (T1); AGI_FRAMEWORK is T4 vision framing only |
| C-02 | INTEGRATED_SPEC_v2 §1 Primitive 3 | "Bernstein bounds — NOT Hoeffding" | `src/gate/hoeffding.ts` filename | Suggests Hoeffding implementation | RESOLVED: File is misnamed for legacy reasons (H-03 annotation required); implementation is Bernstein |
| C-03 | QWEN 04 DIRECTIVE | "No speculative physics (Bekenstein bounds, Landauer limits, thermodynamic liquefaction) in T0-T2" | VISION_ASSEMBLED §6 | References quasicrystal-CDT spectral correspondence | RESOLVED: VISION_ASSEMBLED is T4; prohibited from grounding T0-T2 without evidence review |
| C-04 | INTEGRATED_SPEC_v2 §4.3 | "VCG floor is non-zero (Vempala-Wilkes theorem); target VCG below 0.05 unrealistic" | Hypothetical operator expectation | May expect VCG → 0 | RESOLVED: INTEGRATED_SPEC_v2 is authoritative; operators must be briefed on the non-zero floor |
| C-05 | CLAUDE.md | "MutationOperatorRegistry.seal() before gates" | No corresponding implementation found in src/ | Seal operation absent | PENDING: Verify `src/runtime/` or `mutation-registry.ts` for seal() implementation |

---

## 7. Invariant Overlap Register

Invariants appearing across multiple corpus documents — high occurrence indicates high stability.

| Invariant | Appears In | Tier Convergence | Authority |
|-----------|-----------|------------------|-----------|
| `No Date.now() except src/event/uuid.ts` | CLAUDE.md, INTEGRATED_SPEC_v2 §3, QWEN 04, core-invariants.md | T0 × 4 | Mechanically enforced |
| `No array.length for sequence numbers` | CLAUDE.md, INTEGRATED_SPEC_v2 §3, QWEN 04, core-invariants.md | T0 × 4 | Mechanically enforced |
| `deepFreeze every state object` | CLAUDE.md, INTEGRATED_SPEC_v2 §3, core-invariants.md | T0 × 3 | Mechanically enforced |
| `RFC 8785 JCS for all hashing` | CLAUDE.md, INTEGRATED_SPEC_v2 §1 & §3, core-invariants.md, QWEN 04 | T0 × 4 | Mechanically enforced |
| `Version mismatch = hard abort` | CLAUDE.md, INTEGRATED_SPEC_v2 §1 Primitive 2, core-invariants.md | T0 × 3 | Mechanically enforced |
| `Bernstein not Hoeffding` | CLAUDE.md, INTEGRATED_SPEC_v2 §1 Primitive 3 & §5.2, gate-protocol.md, QWEN 04 | T0 × 4 | Mechanically enforced |
| `V4/V5 never in VCG calibration` | CLAUDE.md, INTEGRATED_SPEC_v2 §1 Primitive 5, QWEN 04 | T0 × 3 | Policy-enforced |
| `No Set/Map in ProjectionState` | CLAUDE.md, core-invariants.md | T0 × 2 | Canonicalization requirement |
| `MutationOperatorRegistry.seal() before gates` | CLAUDE.md | T0 × 1 | Implementation pending verification |
| `PGCS must pass before TGCS valid` | CLAUDE.md, QWEN 04 | T1 × 2 | Empirically required |
| `corruption_count must equal 0` | CLAUDE.md, epoch_failsafe.py | T0 × 2 | Mechanically enforced |
| `No time.time() in Python determinism paths` | CLAUDE.md, QWEN 04 | T0 × 2 | Sequence-based replacement |
| `Bit-shifted integer arithmetic throughout Python` | CLAUDE.md, QWEN 04 | T0 × 2 | Cross-GPU determinism |
| `Replayability ≠ Correctness` | CLAUDE.md §Non-Equivalence Table, INTEGRATED_SPEC_v2 §Critical Non-Equivalence | T0 × 2 | Epistemic commitment |
| `No T4/T5 → T0–T2 without evidence review` | CLAUDE.md §Epistemic Tier Taxonomy, QWEN 04 prohibited actions | T0 × 2 | Migration rule |
| `Gate 8 must pass before deployment` | CLAUDE.md, gate-protocol.md, QWEN 04 | T0 × 3 | Build protocol |

---

## 8. Conceptual Gravity Map

Concepts ranked by number of corpus documents referencing them. High gravity = canonical reference point.

| Rank | Concept | Documents Referencing | Gravity | Role |
|------|---------|----------------------|---------|------|
| 1 | VCG calibration / Verifier-Grounded Calibration Gap | INTEGRATED_SPEC_v2 §4, CLAUDE.md, QWEN 04, PDFs #6 #10, AGI_FRAMEWORK, VISION_ASSEMBLED | ★★★★★ | Core statistical foundation |
| 2 | Bernstein bounds / anytime-valid sequences | INTEGRATED_SPEC_v2 §5, CLAUDE.md, gate-protocol.md, QWEN 04, Howard 2020, Waudby-Smith 2024 | ★★★★★ | Gate statistical basis |
| 3 | Epoch failsafe / corruption_count | CLAUDE.md, QWEN 04, AGI_FRAMEWORK, python/epoch_failsafe.py, PDF #11 | ★★★★☆ | System integrity floor |
| 4 | RFC 8785 JCS canonicalization | INTEGRATED_SPEC_v2 §1 & §3, CLAUDE.md, core-invariants.md, QWEN 04 | ★★★★☆ | Determinism foundation |
| 5 | RALPH loop / execution synthesis | RALPH_LOOP_SYNTHESIS (378 lines), RALPH_LOOP_AUDIT (422 lines), CLAUDE.md, QWEN 04 | ★★★★☆ | Execution methodology |
| 6 | Holonic substrate / holon-architected | PDFs #1 #4 #8, AGI_FRAMEWORK, VISION_ASSEMBLED | ★★★★☆ | Architectural paradigm |
| 7 | Cryptographic lineage / hash-chaining | INTEGRATED_SPEC_v2 §1 Primitive 1, CLAUDE.md, formal/Hash.v | ★★★★☆ | Tamper evidence |
| 8 | M1/M2/M3 functional definitions (Python) | CLAUDE.md, QWEN 04, AGI_FRAMEWORK, core_matrix.py | ★★★☆☆ | Python Layer B foundation |
| 9 | K-bound / capacity constraint | INTEGRATED_SPEC_v2 §5.4, formal/Omega.tla | ★★★☆☆ | Gate complexity bound |
| 10 | Deterministic replay / version pinning | INTEGRATED_SPEC_v2 §1 Primitive 2, CLAUDE.md, src/runtime/ | ★★★☆☆ | Reproducibility guarantee |
| 11 | PGCS telemetry / TGCS variance | CLAUDE.md, QWEN 04, python/pgcs.py, python/tgcs_afse.py | ★★★☆☆ | Runtime health signals |
| 12 | EU AI Act Article 12 compliance | CLAUDE.md, AGI_FRAMEWORK, VISION_ASSEMBLED piece 5 | ★★★☆☆ | Commercial deployment target |
| 13 | Three-way bisimulation | formal/ThreeWay.v, INTEGRATED_SPEC_v2 | ★★☆☆☆ | Formal equivalence proof |
| 14 | Quasicrystal-CDT spectral correspondence | VISION_ASSEMBLED piece 6 | ★☆☆☆☆ | T3 conjecture — isolated, no T0-T2 grounding |
| 15 | SAGA identity / SPIFFE/SVID | CLAUDE.md, saga/identity.py | ★☆☆☆☆ | T2 stub awaiting PKI |

---

## 9. Discarded Architecture Archive

Understanding rejected designs is as important as knowing what was adopted. These define
the boundary of the solution space.

| Rejected Approach | Why Rejected | Replaced By | Evidence |
|-------------------|-------------|-------------|---------|
| Hoeffding bounds for statistical gating | Assumes IID samples; adaptive systems violate this assumption | Bernstein anytime-valid bounds (Waudby-Smith & Ramdas 2024) | INTEGRATED_SPEC_v2 §5.2 |
| `Set`/`Map` in ProjectionState | Non-deterministic iteration order across JS engines breaks RFC 8785 | Arrays exclusively | core-invariants.md |
| `JSON.stringify` for integrity hashing | Not canonical — key ordering undefined, undefined/NaN/Infinity handled incorrectly | `canonicalizeJCS` from src/core/canonicalize.ts | core-invariants.md |
| Sequence numbers from `array.length` | Race-prone; not atomic with event append | `IndexedDBSequenceAllocator` inside IDB transaction | core-invariants.md |
| `Date.now()` in core logic | Wall clock creates non-deterministic replay | `event.timestamp_ms` exclusively | core-invariants.md |
| Async ops inside IDB callbacks | `await` crosses task boundary → `TransactionInactiveError` | Three-phase append (Phase 1 read / Phase 2 hash / Phase 3 write) | src/event/store.ts |
| Single-transaction IDB append | Async WebCrypto inside IDB tx silently aborts the transaction | Three-phase split (loses atomicity; race protection via unique index) | src/event/store.ts |
| `seq & 0xfff` sequence wrap | After 4096 IDs in same ms, seq wraps to 0 → duplicate UUIDs | Virtual millisecond steal: increment `lastMs`, reset seq | src/event/uuid.ts |
| Hoeffding codepoint-only surrogate handling | `codePointAt()` returns full scalar for valid pairs; surrogate branch never entered | `cp > 0xFFFF` check before surrogate range | src/core/canonicalize.ts |
| V4/V5 verifiers as calibration inputs | LLM judges and human review are gameable; break statistical independence | V4/V5 permanently Advisory-Excluded | INTEGRATED_SPEC_v2 §1 Primitive 5 |
| Autonomous version selection on pin failure | Silent degradation destroys replay guarantees | Hard abort on any `RuntimeVersionPin` mismatch | core-invariants.md |
| Default VCG fallback on CALIBRATION_STALE | Stale calibration used as if valid | CALIBRATION_STALE alert fires; gate inputs suspended | INTEGRATED_SPEC_v2 §4.3 |
| Component declaring K = ∞ | Unbounded proposal space invalidates probabilistic guarantee | Rejected at registration | INTEGRATED_SPEC_v2 §5.4 |

---

## 10. Unresolved Theoretical Compression Layers

Latent concepts in the corpus with no current T0–T2 implementation. These represent
potential future compression into production components. Classified T3–T5.

### T3 — Research Conjectures with Implementation Potential

| Concept | Source | Potential T0 Compression | Status |
|---------|--------|--------------------------|--------|
| G-Set CRDT distributed convergence (Shapiro 2011) | INTEGRATED_SPEC_v2 §1 Primitive 1 | Multi-node E3 substrate with CRDT-based merge | Not implemented; single-node only |
| Scrivens 2026 impossibility result | INTEGRATED_SPEC_v2 §5.5 | Formal bound on cumulative risk vs. beneficial improvement | Referenced but not implemented in gate logic |
| Ed25519 checkpoint signatures | INTEGRATED_SPEC_v2 §1 Primitive 1 | Merkle root anchoring with signing key infrastructure | Stub — signing keys not provisioned |
| WASM-pinned floating-point arithmetic | INTEGRATED_SPEC_v2 §1 Primitive 6 | Cross-engine determinism for VCG + Bernstein computation | Fallback JS path only; WASM not implemented |
| Vempala-Wilkes theorem | INTEGRATED_SPEC_v2 §4.3 | Formal VCG floor for autoregressive models | Stated assumption; no implementation needed |
| eBPF fallback (T1) | AGI_FRAMEWORK_CONCLUDED §production-hardening | Low-level telemetry collection for AMD RX 570 | Not implemented |
| OCRR online correction recovery | INTEGRATED_SPEC_v2 §6.2 | Online correction rate tracking projection | Forensics module incomplete |
| ReCAPA exponential decay | INTEGRATED_SPEC_v2 §6.2 | Correction recoverability decay model | Not implemented |
| TEE / Confidential Computing | INTEGRATED_SPEC_v2 §Layer 4 | Execution environment integrity | Architectural dependency; out of scope |

### T4 — Speculative with No Current Path to T0

| Concept | Source | Obstacle |
|---------|--------|---------|
| Council (Architect/Builder/Analyst/Strategist/Guardian) | VISION_ASSEMBLED piece 3 | Requires multi-agent orchestration framework not yet built |
| Swarm (multiple runtime instances, holonic scaling) | VISION_ASSEMBLED piece 4 | Requires CRDT merge + distributed E3 substrate |
| AEGIS civilisational governance | VISION_ASSEMBLED piece 5 | Requires EU AI Act certification infrastructure |
| Quasicrystal-CDT spectral correspondence | VISION_ASSEMBLED piece 6 | T3 conjecture; no implementation pathway defined |
| x402 micropayment protocol (SAGA Layer 3) | AGI_FRAMEWORK_CONCLUDED §Layer 3 | Awaiting PKI + x402 infrastructure |

### T5 — Creative / Worldbuilding (Deferred indefinitely)

| Concept | Migration Rule Status |
|---------|----------------------|
| Cycle series | No T0–T2 grounding permitted without evidence review |

---

## 11. Full Canonical Index

Complete inventory of all unique Drive documents and local repo components.

### Drive Documents (Unique — excluding replicated agent session copies)

| Drive ID | Name | MIME Type | Tier | Holonic Scale | Particle-Field Role | Status |
|----------|------|-----------|------|---------------|---------------------|--------|
| `1cfFY59zAczNPCL7mvr_TxFo1yR7xfDNh` | SOVEREIGN_OMEGA_INTEGRATED_SPEC_v2.md | Markdown | T0/T1 | Cellular | Conservation law document | Active — authoritative |
| `1NScZu_7bc9nLXzSWG8Ul_O98KuHL5360` | SOVEREIGN_OMEGA_IMPL_BRIEF_Qwen.md | Markdown | T1 | Cellular | State-transition operator spec | Active |
| `11MWyKyAfBKHY9TXUZ_iDqilybuAZf_3M` | RALPH_LOOP_OMEGA2_INTEGRATION_AUDIT.md | Markdown | T2 | Molecular | Observation layer audit | Active |
| `1TTzre0Oy1BEZ_g5lm926XJ2UiFtjfJsr` | RALPH_LOOP_OMEGA_EXECUTION_SYNTHESIS.md | Markdown | T2 | Molecular | Causal interaction trace | Active |
| `1_gebxxUSk_OO0B575K7j03AX4YRkpvDq` | SOVEREIGN_OMEGA_AGI_FRAMEWORK_CONCLUDED.md | Markdown | T4 | Field | Vision substrate | Active (T4 only) |
| `1umR8RoWZwJQAQuG4uzU-N16HMOmCUK09` | SOVEREIGN_OMEGA_VISION_ASSEMBLED.md | Markdown | T4 | Field | Vision substrate | Active (T4 only) |
| `1gnM-TwrOHLUyon2sdBJpImAcZtV1pxzC` | CLAUDE.md (Drive copy) | Markdown | T0 | Field | Conservation law | Active — sync with repo |
| `1oWL66eB30_yuaINeNY16P6Fnf1kMDNdd` | QWEN_04_EXECUTION_DIRECTIVE.md | Markdown | T2 | Cellular | State-transition operator spec | Active — final directive |
| Drive root | QWEN_01_EXECUTION_DIRECTIVE.md | Markdown | T2 | Cellular | Historical directive | Superseded by QWEN_04 |
| Drive root | QWEN_02_EXECUTION_DIRECTIVE.md | Markdown | T2 | Cellular | Historical directive | Superseded by QWEN_04 |
| Drive root | QWEN_03_EXECUTION_DIRECTIVE.md | Markdown | T2 | Cellular | Historical directive | Superseded by QWEN_04 |
| `1LJ1KoT195nJDBLGyR9VRzrnVWlFCxgO8` | Preserving Criticality in Holonic AI | PDF | T3 | Field | Research conjecture | Active |
| `10gBmzNovsKMWkqf2AiXJrAn0Mt197o9P` | Quantum-Inspired Architecture | PDF | T3 | Field | Research conjecture | Active |
| `1Kntuo_DbjzcJa8-BqPM90q-V5CKLFOah` | Verifying Agentic Reasoning | PDF | T3 | Field | Research conjecture | Active |
| `1lu31YCW-TW2SVr3IyGeQZBTB1YXbnCG5` | A Holon-Architected Compiler | PDF | T3 | Field | Architectural ancestor | Active |
| `1xaKuiktzJWkTmwaoi_wCwunA4Y9HTZrb` | From Local Task to Global Integration | PDF | T3 | Field | Research conjecture | Active |
| `1uN2Ts3GBaa-YXe_vo7z4zs6e07mT4984` | An Asymmetric Market for Uncertainty | PDF | T3 | Field | VCG theoretical basis | Active |
| `1OpO3JpYAHSWkyh0aOzRa_6agbfuPJVgl` | Orchestrating Emergent Intelligence | PDF | T3 | Field | Research conjecture | Active |
| `1LUu4IKCJK0RbcqZkgiwZa-Th7u2dl3vU` | Decomposing the Monolith | PDF | T3 | Field | Research conjecture | Active |
| `1eL8RkV43ynRi_0KAWewIpOPEDnXD7pMb` | Orchestrating Long-Horizon Reasoning | PDF | T3 | Field | Research conjecture | Active |
| `1H5xrLV2M_HVdpzoHK5Czgdb5kQmsFdbJ` | From Divergence to Convergence | PDF | T3 | Field | Research conjecture | Active |
| `1hv9jhS8ROs5selyvvFrhpqzx8s7CE8a5` | Orchestrating Volatility | PDF | T3 | Field | Epoch failsafe basis | Active |
| `1oS83PDBGhdgo3LydaWC05fosXyzJXEmv` | From Heterogeneity to Cohesion | PDF | T3 | Field | Research conjecture | Active |
| `1ozQ641HrGlOiW2jkMBxg-lBEZChJlYUb` | Resilience by Analogy | PDF | T3 | Field | Research conjecture | Active |
| `15xwR7e2QaZ8Urmb3rQvUf9XRt8DGF_Oi` | sovereign-omega-v2.0.zip | Zip | T0 | Organism | Source archive | Superseded by repo |
| `1fM1s2Upc9pRltBjtcREBtqbXPqJQwi1h` | research/omega_dynamics/harness.ts | TypeScript | T1 | Molecular | Research harness | Active |
| Drive `formal/` | Hash.v, Reducer.v, Event.v | Coq | T0 | Atomic | Proof units | Active |
| Drive `formal/` | ThreeWay.v | Coq | T0 | Atomic | Bisimulation proof | Active |
| Drive `formal/` | Omega.tla, Omega.cfg | TLA+ | T0 | Atomic | Temporal specification | Active |

**Note on replication**: Pages 2–3 of the Drive listing showed INTEGRATED_SPEC_v2 appearing in 3
different parent folder IDs (`1YidpasL0A7qGhlKCyGjqqpnk6yFEmhNb`, `1iGNPcjZdiyP6VhztE_Is6Js2M29Sw82b`,
`1jYTg53itN3svflR61pG_q8mPrRBVbEOc`). These are replicated copies sent to 3 different AI agent
sessions. The unique document count is ~65. The "200+" total is the replicated corpus.

### Local Repository T0 Components (sovereign-omega-v2/src/)

| File | Module | Tier | Gate |
|------|--------|------|------|
| `src/core/canonicalize.ts` | core | T0 | Gate 1 |
| `src/core/types.ts` | core | T0 | Gate 1 |
| `src/core/immutable.ts` | core | T0 | Gate 3 |
| `src/core/reducer.ts` | core | T0 | Gate 4 |
| `src/event/store.ts` | event | T0 | Gate 2 |
| `src/event/uuid.ts` | event | T0 | Gate 2 |
| `src/gate/hoeffding.ts` | gate | T0 | Gate 6 |
| `src/gate/risk.ts` | gate | T0 | Gate 6 |
| `src/calibration/vcg.ts` | calibration | T1 | Gate 5 |
| `src/verifier/registry.ts` | verifier | T1 | Gate 5 |
| `src/pipeline/index.ts` | pipeline | T1 | Gate 7 |
| `src/projection/` | projection | T1 | Gate 4 |
| `src/runtime/` | runtime | T0 | Gate 8 |
| `src/forensics/` | forensics | T1 | Gate 7 |
| `src/compliance/tombstone.ts` | compliance | T1 | Gate 8 |

### Local Repository T0 Components (sovereign-omega-v2/python/)

| File | Tier | Constitutional | Validation |
|------|------|---------------|------------|
| `python/core_matrix.py` | T0 | No | P1/P2/P3 stress tests |
| `python/gate.py` | T0 | **FROZEN** SHA256: `72196f38...` | `node scripts/verify-hashes.mjs` |
| `python/dna.py` | T0 | **FROZEN** SHA256: `9c4d38d8...` | `node scripts/verify-hashes.mjs` |
| `python/router.py` | T0 | **FROZEN** SHA256: `c96e566c...` | `node scripts/verify-hashes.mjs` |
| `python/epoch_failsafe.py` | T0 | No | P2 crash-loops test |
| `python/gradient_anchor.py` | T0 | No | P1 smoke test |
| `python/pgcs.py` | T1 | No | P1 smoke test |
| `python/tgcs_afse.py` | T1 | No | P1 smoke test |
| `python/bridge.py` | T1 | No | Manual: `curl localhost:7890/health` |

### Commercial Products

| Product | Root Dir | Build Command | Status |
|---------|----------|---------------|--------|
| platform-picker | `platform-picker/` | `npm run build` | Built — awaiting Vercel deploy |
| hook-generator | `hook-generator/` | `npm run build` | Built — awaiting Vercel deploy |
| content-calendar | `content-calendar/` | `npm run build` | Built — awaiting Vercel deploy |
| hub | `hub/` | `npm run build` | Built — awaiting Vercel deploy |
| cockpit | `cockpit/` | `npm run build` | Built — awaiting ECS IP for Ollama |

### Drive Folder Structure (IDs for navigation)

```
0AN5KMOWX21HUUk9PVA (Drive root)
└── sovereign-omega/ (1cZmb088t43o1yG4iI_4d7jhsNYtjs2kv)
    ├── docs/        (1YDne9fpnLZ-FdfdKS4D1wcxEPiZEg18B)
    ├── python/      (12bA-AY3-3_6yDLB7liptmvhKmKOS7r7f)
    ├── src/
    │   ├── core/        (1qPRtpzGvpQKP7izVhN9zNH-RBPwvk3BX)
    │   ├── event/       (1G7wvHmw4l7_RelB1izHGvKodnmrMa0mU)
    │   ├── gate/        (15OYBfYI5oQm9kf0eiKPJCv9eUpcMO0v1)
    │   ├── calibration/ (1xzHo4vjLgWdFspTiMEAiJrPC86jJv6cL)
    │   ├── verifier/    (1OWW0FYgLsUd-XTSLe3Et4VsNv7kA5U4B)
    │   ├── pipeline/    (1S5uhn98z1jyYq66BrQ5vzRAZuxewyMWJ)
    │   ├── projection/  (1O_tA_TFGOtIapy_yVKO2hvqKr3I9wJU-)
    │   ├── runtime/     (17vMGgEKsNrEuReOwM4kZhilaS58KFskL)
    │   ├── compliance/  (1SY2RVhfZE8I8-Z_dSAQRHuB8H11mANn9)
    │   └── forensics/   (1UUqNfKl8LedBW2jS9vNx849l4xFQdLrU)
    ├── test/
    │   ├── unit/        (1-AQuBmyZkHph8REo3aB7bDdNqOqCXtVd)
    │   ├── integration/ (1rYA6WC0aBKfoo11Cnz94WhA259g-RkUY)
    │   └── determinism/ (1mvR1V4yML8j_F2cTg9C-J8uIUT-G5M2s)
    ├── handoff/     (1SpE7HDvV_N3eSTl3yTMEvf2V0JLVlT2H)
    ├── .claude/
    │   ├── rules/   (13M73Rov-Bu4Lg70j9mJIR3yris4EZebm)
    │   ├── skills/  (11OQUFbujmXfTkvOhoKHhHej3KHkkGlRr)
    │   ├── commands/(1R-WAhX2IS6og6cNHgXE85N0vjP3uvYHw)
    │   ├── agents/  (1ZEpmYjuqqtx7Z3K0CykBcBhuG--LxvsQ)
    │   └── hooks/   (1nFlIt5deaGIs3M2rLiNFR6z57ziNX4P_)
    ├── formal/      (1IWFfNeKBuK390_jsCp8TszSFpcwl_jHe)
    │   ├── theories/Core/        (Hash.v, Reducer.v, Event.v)
    │   ├── theories/Bisimulation/(ThreeWay.v)
    │   └── tlaplus/              (Omega.tla, Omega.cfg)
    ├── paperclip/   (company.yaml)
    ├── saga/        (identity.py)
    ├── research/omega_dynamics/ (1fM1s2Upc9pRltBjtcREBtqbXPqJQwi1h)
    └── scripts/     (1Q_rtMzqRMSj0WpzjAbFkGfcbZ5UWGsqW)
```

---

## Appendix: Build Protocol Reference

```
# Gate 1 — must pass before any other file is written or modified
cd sovereign-omega-v2 && npm run test -- test/unit/jcs.test.ts

# Gate 2
npm run test -- test/unit/sequence.test.ts

# Gate 3
npm run test -- test/unit/immutable.test.ts

# Gate 4
npm run test -- test/unit/reducer.test.ts

# Gate 5
npm run test -- test/unit/vcg.test.ts

# Gate 6
npm run test -- test/unit/gate.test.ts

# Gate 7
npm run test -- test/integration/

# Gate 8 — deployment gate
npm run test && npm run typecheck && npm run build

# Verify constitutional files have not been modified
node scripts/verify-hashes.mjs

# Python Layer B smoke test (60s)
python python/tests/stress_test.py --quick
```

---

*This document was synthesized from: INTEGRATED_SPEC_v2 (44KB, May 2026), VISION_ASSEMBLED,
AGI_FRAMEWORK_CONCLUDED, QWEN_04_EXECUTION_DIRECTIVE, 13 research PDFs, formal verification
files (Coq + TLA+), and complete local repository analysis. It serves as the cognitive substrate
for all future agents operating in this repository.*
