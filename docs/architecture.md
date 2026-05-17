# AEGIS Architecture

## System Overview

```mermaid
graph TD
    HUB["🏠 hub/<br/>Landing Page<br/>(Vite + React)"]

    HUB --> PP["🎯 platform-picker/<br/>Platform Picker<br/>$19"]
    HUB --> HG["⚡ hook-generator/<br/>Hook Generator<br/>$19"]
    HUB --> CC["📅 content-calendar/<br/>Content Calendar<br/>$19"]

    PP --> SHARED["📦 packages/shared/<br/>callDashScope · useAsyncForm<br/>ErrorAlert · LoadingSpinner<br/>ScoreBar · ToolkitFooter"]
    HG --> SHARED
    CC --> SHARED

    SHARED --> DASH["☁️ DashScope API<br/>dashscope.aliyuncs.com<br/>Qwen model (buyer key)"]

    COCKPIT["🖥️ cockpit/<br/>AEGIS Cockpit<br/>Dual-mode streaming chat"]
    COCKPIT --> DASH
    COCKPIT --> OLLAMA["🦙 Ollama<br/>localhost:11434<br/>(ECS server)"]
    COCKPIT --> BRIDGE["🔌 sovereign-omega-v2/<br/>python/bridge.py<br/>port 7890"]

    BRIDGE --> MATRIX["🧠 CoreMatrix<br/>PGCS · TGCS · AFSE<br/>Epoch failsafe · VCG"]

    SOVTS["📐 sovereign-omega-v2/<br/>TypeScript Runtime<br/>8 gates · 101 tests"]
    SOVTS --> BRIDGE
```

## Products (Track B — Revenue)

| Product | Price | Stack | Deploy |
|---------|-------|-------|--------|
| Platform Picker | $19 | Vite + React + Tailwind + DashScope | Vercel |
| Hook Generator | $19 | Vite + React + Tailwind + DashScope | Vercel |
| Content Calendar | $19 | Vite + React + Tailwind + DashScope | Vercel |
| Bundle (any 2) | $29 | — | — |
| Full Toolkit (all 3) | $39 | — | — |

## Shared Infrastructure (`packages/shared/`)

| Module | Purpose |
|--------|---------|
| `lib/dashscope.ts` | Generic `callDashScope<T>()` — single DashScope fetch, JSON parse, fence-strip |
| `hooks/useAsyncForm.ts` | `idle → loading → results → error` state machine with `submit` / `reset` |
| `components/ErrorAlert.tsx` | Unified red error banner (lucide AlertCircle) |
| `components/LoadingSpinner.tsx` | Animated spinner with configurable color class and message |
| `components/ScoreBar.tsx` | Reusable 0–N score progress bar |
| `components/ToolkitFooter.tsx` | Cross-product "Also in the toolkit" footer strip |

## Sovereign Omega v2 (Track A — Governance)

```
TypeScript Runtime (src/)          Python Core Matrix (python/)
├── event substrate (append-only)  ├── pgcs.py   — swap I/O criterion
├── vcg.ts   — VCG calibration     ├── tgcs.py   — variance tracking
├── gate.ts  — Bernstein bounds    ├── afse.py   — R² estimation
├── reducer.ts — pure reducers     ├── core_matrix.py — M1/M2/M3
└── pipeline.ts — DecisionSchema  └── bridge.py  — HTTP port 7890
                                        GET /telemetry → cockpit
                                        POST /event
                                        POST /gate_signal
                                        GET /health
```

## Cockpit Telemetry Flow

```
sovereign-omega-v2/python/bridge.py
  └─ GET /telemetry (every 5s) ──→ cockpit/src/lib/telemetry.ts
                                      └─ subscribeTelemetry()
                                           └─ TelemetryPanel.tsx
                                                (Sidebar → Runtime section)
```

## Environment Variables

Every product uses the same key:
```
VITE_DASHSCOPE_API_KEY=sk-...       # required
VITE_DASHSCOPE_MODEL=qwen-plus      # optional, default: qwen-plus
```

Cockpit additionally uses:
```
VITE_OLLAMA_BASE_URL=http://ECS_IP:11434/v1
```
