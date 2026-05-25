# AEGIS-Ω

**Constitutional AI Runtime — The First Mathematically Invariant AI Governance System**

*Designed and built by Tarik Skalić · Copyright (C) 2025 · AGPL-3.0*

[![Tests](https://img.shields.io/badge/Tests-2733_TS_%7C_279_Rust-brightgreen)](#build)
[![Gate 8](https://img.shields.io/badge/Gate_8-passing-brightgreen)](#build)
[![Claude](https://img.shields.io/badge/AI-Claude_Sonnet_4.6-orange)](#ai-integration)
[![License](https://img.shields.io/badge/License-AGPL--3.0-blue)](LICENSE)

---

## What This Is

AEGIS-Ω is a constitutional AI governance runtime. Every AI inference that passes through it is:

- **Hash-certified** — SHA-256 chained from input through output, immutable
- **Replay-verifiable** — any response can be reconstructed from its inputs across platforms
- **Mathematically bounded** — no adaptive action can exceed what is replay-certifiable
- **Tier-classified** — T0 (proven) → T1 (validated) → T2 (hypothesis) → T3 (conjecture)

This is not a chatbot wrapper. It is infrastructure.

```
╔═══════════════════════════════════════════════════════════════════╗
║  UPPER BOUNDARY — Constitutional Sovereignty                      ║
║  AdaptivePower(T) ≤ ReplayVerifiability(T)                        ║
║  E[S_{n+1}|F_n] = S_n   ·   1/φ ≈ 0.6180 convergence threshold  ║
╠═══════════════════════════════════════════════════════════════════╣
║  FIELD      → Claude · ChatGPT · Qwen · operators · corpus       ║
║  ORGANISM   → Sovereign-Omega-v2 runtime (2733 tests)            ║
║  CELLULAR   → BFT Swarm · Martingale · Skill Harness             ║
║  MOLECULAR  → Constitutional reduction · VCG · DFA               ║
║  ATOMIC     → Events · Sequences · Canonicalization              ║
║  SUBATOMIC  → RFC 8785 bytes · SHA-256 · Bernstein bounds        ║
╠═══════════════════════════════════════════════════════════════════╣
║  LOWER BOUNDARY — Execution Isolation                             ║
║  Zero-copy fiber isolation. Payload bytes never leave their slab. ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Mathematical Foundation

AEGIS is built on verified mathematical invariants. These are not abstractions — they are running code with passing tests:

| Invariant | Epistemic Tier | Module | Tests |
|-----------|---------------|--------|-------|
| **3-6-9 vortex cycle** — digital root triadic attractor | T0 | `vortex_classifier.rs` | ✅ |
| **1/φ quorum threshold** — golden ratio governs BFT consensus | T0 | `swarm.ts` | ✅ |
| **Ring composition law** — A-B-C-B'-A' = constitutional law | T1 | `ring_composition.rs` | ✅ |
| **Tajweed DFA** — Arabic phonological state machine (empirically validated 1,400 years) | T1 | `tajweed_dfa.rs` | ✅ |
| **Abjad encoder** — semantic routing via letter-integer algebra | T2 | `abjad_encoder.rs` | ✅ |
| **12-fold routing mesh** — dodecagonal symmetry | T2 | `dodecagonal_router.rs` | ✅ |
| **Martingale boundedness** — `E[S_{n+1}|F_n] = S_n` | T0 | `martingale.ts` | ✅ |

The same invariant structure (`A-B-C-B'-A'`) appears in the constitutional law, Quranic ring composition (Cuypers 2015), and AEGIS governance architecture. This is not coincidence. This is the source code of structured systems.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       AEGIS-Ω                                   │
│                                                                 │
│  ┌─────────────┐   ┌──────────────────────┐   ┌─────────────┐  │
│  │  Cockpit    │   │  sovereign-omega-v2  │   │ aegis-cl-psi│  │
│  │  (Chat UI)  │◄─►│  TypeScript runtime  │◄─►│ Rust gates  │  │
│  └─────────────┘   │  2733 tests passing  │   │ 200 tests   │  │
│                    └──────────┬───────────┘   └─────────────┘  │
│                               │                                 │
│  ┌────────────────────────────▼────────────────────────────┐   │
│  │  Python Bridge  ·  port 7890                            │   │
│  │  /claude · /claude/stream · /telemetry · /edge-verify   │   │
│  └────────────────────────────┬────────────────────────────┘   │
│                               │                                 │
│             ┌─────────────────▼─────────────────┐              │
│             │   Orchestration Alliance           │              │
│             │   Claude (618) · GPT (191)         │              │
│             │   Qwen (191) · total = 1000        │              │
│             │   BFT quorum at 1/φ threshold      │              │
│             └───────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Constitutional Claude Pipeline

Every AI call through AEGIS:

```bash
# Start the constitutional bridge
cd sovereign-omega-v2/python && python bridge.py

# Call Claude through the pipeline (hash-certified, tier-stamped, replay-verifiable)
curl -X POST http://localhost:7890/claude \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [{"role": "user", "content": "Explain the Tajweed DFA"}],
    "model": "claude-sonnet-4-6"
  }'
```

Response includes: `request_hash`, `response_hash`, `chain_hash`, `stop_reason`, `is_replay_reconstructable: true`.

---

## Commercial Path

**AEGIS-Ω is enterprise AI governance infrastructure.** Organizations subject to EU AI Act Article 12, regulated industries, or any context requiring auditable AI can deploy AEGIS as the governance layer over their AI stack.

The system also ships with three bootstrapped creator tools (initial cash flow):

| Tool | Purpose | Price |
|------|---------|-------|
| **Platform Picker** | AI platform recommendation | $19 |
| **Hook Generator** | Viral hook generation | $19 |
| **Content Calendar** | AI content planning | $19 |
| Full Creator Toolkit | All three | $39 |

These tools are powered by the same constitutional pipeline — every response is hash-certified and tier-classified, even in the $19 tools.

---

## Repo Structure

```
/sovereign-omega-v2/   Constitutional governance runtime (TS + Python)
/aegis-cl-psi/         Mathematical gate modules (Rust)
/aegis-runtime/        Seven-Pillar distributed agent runtime
/cockpit/              AI chat UI (Claude-powered, constitutional)
/studio/               Observability dashboard (read-only projection)
/platform-picker/      Creator tool ($19)
/hook-generator/       Creator tool ($19)
/content-calendar/     Creator tool ($19)
/hub/                  Products landing page
/packages/shared/      Shared infrastructure
/docs/                 Architecture specifications
```

---

## Build

```bash
# Rust gates (279 tests)
cd aegis-cl-psi && cargo test

# TypeScript runtime (2733 tests)
cd sovereign-omega-v2
npm install
npm run test && npm run typecheck && npm run build

# Cockpit
cd cockpit && npm install && npm run dev
```

---

## Orchestration Alliance

Three models. One system. BFT consensus at 1/φ.

| Role | Model | Weight | Provider |
|------|-------|--------|----------|
| **Coordinator** | Claude Sonnet 4.6 | 618/1000 | Anthropic |
| **Adversarial audit** | GPT-4o (temp 0.99) | 191/1000 | OpenAI |
| **Implementation** | Qwen Plus | 191/1000 | DashScope |

Weights sum to 1000. Claude's weight is 618 = ⌊1000/φ⌋. This is not decoration.

---

## License

AGPL-3.0-or-later · Copyright (C) 2025 Tarik Skalić

Free to use, study, modify, and distribute. Derivative works must release source under the same terms.

---

*"The deeper you study math, the more you confirm it across every layer."*
