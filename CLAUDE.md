# AEGIS Monorepo — Coordination Document
## Branch: claude/aegis-setup-Lx7Ji
## Operator: Tarik Skalić · Hardware: AMD RX 570, 8 GB RAM

Approach every component as a recursively nested atomic-scale holon governed by
invariant-preserving feedback loops. Each file is simultaneously a whole (with its
own invariants) and a part (subject to the invariants of every scale above it).
Scale hierarchy: SUBATOMIC → ATOMIC → MOLECULAR → CELLULAR → ORGANISM → FIELD.
A T0 violation at any scale propagates upward and invalidates everything above it.

---

## Repository Layout

```
/sovereign-omega-v2/   Governance runtime (Layer A: TypeScript, Layer B: Python)
/cockpit/              AI chat UI with sovereign-omega telemetry integration
/platform-picker/      Commercial product — platform recommendation ($19)
/hook-generator/       Commercial product — viral hook generator ($19)
/content-calendar/     Commercial product — content calendar ($19)
/hub/                  Landing page connecting all 3 products
/packages/shared/      Shared infrastructure (DashScope, useAsyncForm, components)
/docs/                 Architecture diagram (Mermaid)
```

---

## Build Order (strict — never skip)

### sovereign-omega-v2 (foundation — run first)
```
cd sovereign-omega-v2
npm install
npm run test -- test/unit/jcs.test.ts        # Gate 1 — must pass before writing any file
npm run test -- test/unit/sequence.test.ts    # Gate 2
npm run test -- test/unit/immutable.test.ts   # Gate 3
npm run test -- test/unit/reducer.test.ts     # Gate 4
npm run test -- test/unit/vcg.test.ts         # Gate 5
npm run test -- test/unit/gate.test.ts        # Gate 6
npm run test -- test/integration/             # Gate 7
npm run test && npm run typecheck && npm run build  # Gate 8 — deployment gate
```

### Commercial products (can build in parallel after Gate 8 passes)
```
cd platform-picker  && npm install && npm run build
cd hook-generator   && npm install && npm run build
cd content-calendar && npm install && npm run build
cd hub              && npm install && npm run build
cd cockpit          && npm install && npm run build
```

### Python Layer B (sovereign-omega-v2)
```
python python/tests/stress_test.py --quick        # P1 smoke (60s)
python python/tests/stress_test.py --crash-loops  # P2 epoch failsafe (~10 min)
python python/tests/stress_test.py                # P3 full stress (12h — pre-production only)
```

---

## Shared Infrastructure (packages/shared/)

All 3 commercial products import from `@shared` alias (resolved via vite.config.ts + tsconfig paths).

| Module | Purpose |
|--------|---------|
| `@shared/lib/dashscope` | Generic DashScope/Qwen API caller — replaces 3× duplicated fetch |
| `@shared/hooks/useAsyncForm` | idle→loading→results→error state machine |
| `@shared/components/ErrorAlert` | Unified error banner |
| `@shared/components/LoadingSpinner` | Unified spinner (colorClass prop) |
| `@shared/components/ScoreBar` | Reusable score bar (0–10 scale) |
| `@shared/components/ToolkitFooter` | Cross-product navigation footer |

---

## Python Bridge (sovereign-omega-v2)

`python/bridge.py` — HTTP server on port 7890. Already implemented.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/telemetry` | GET | Live runtime metrics (PGCS, VCG, epoch state) |
| `/event` | POST | Ingest governance events from TypeScript layer |
| `/gate_signal` | POST | Gate pass/fail signals |
| `/health` | GET | Liveness check |

Both cockpit and sovereign-omega-v2 governance dashboard subscribe to `/telemetry` (5s poll).

---

## Critical Invariants

### TypeScript (sovereign-omega-v2/src/, test/)
- No `Date.now()` except `src/event/uuid.ts`
- No `array.length` for sequence numbers — use `IndexedDBSequenceAllocator`
- No `Set`/`Map` in `ProjectionState` — arrays only (RFC 8785 canonicalization)
- No `JSON.stringify` for integrity — use `canonicalizeJCS` from `src/core/canonicalize.ts`
- `deepFreeze` every state object immediately after construction
- Version mismatch = hard abort (never fall back to default)
- Bernstein bounds, NOT Hoeffding

### Python (sovereign-omega-v2/python/)
- No `time.time()` in determinism-critical paths — use sequence numbers
- Bit-shifted integer arithmetic throughout
- PGCS must pass before TGCS telemetry is valid
- `corruption_count` must equal 0

---

## Constitutional Files (FROZEN — never modify without /guardian APPROVED)

| File | SHA256 |
|------|--------|
| `sovereign-omega-v2/python/gate.py` | `bbe942b819594fd522b421bb9d3aa084735a873d526f35a1e782f31346f3d0fc` |
| `sovereign-omega-v2/python/dna.py` | `cd30ddd5db0403b0e64fb30ce53e0373997fc53cb900a26167eef7d0b69cf8d8` |
| `sovereign-omega-v2/python/router.py` | `8c06ed37a7d95d9de9129c32a426fe5c2b0cd960c2cf5c84c71726b72e6cf941` |

Verify: `cd sovereign-omega-v2 && node scripts/verify-hashes.mjs`

---

## Environment Variables

Each product has an `.env` (gitignored) and `.env.example` (committed).

| Variable | Used by | Purpose |
|----------|---------|---------|
| `VITE_DASHSCOPE_API_KEY` | platform-picker, hook-generator, content-calendar | Qwen API key (buyer supplies) |
| `VITE_DASHSCOPE_MODEL` | all products | Override model (default: qwen-plus) |
| `VITE_OLLAMA_BASE_URL` | cockpit | Ollama endpoint (ECS server IP) |

---

## Never-Commit Files

```
cockpit/.env
platform-picker/.env
hook-generator/.env
content-calendar/.env
sovereign-omega-v2/.env
~/aegis/server-setup.sh
~/.hermes/config.yaml
~/.hermes/.env
~/.hermes/MEMORY.md
~/.clinerules
/root/.config/gdrive-mcp/credentials.json
```

---

## Deployment

All products deploy to Vercel (one project per product, Root Directory set per product).
Gate 8 must pass on sovereign-omega-v2 before any deployment proceeds.

```
vercel --prod  # from within each product directory after Gate 8
```

Gumroad: $19/product, $29 (any 2), $39 (all 3 — Full Creator AI Toolkit).

---

## Orchestration Alliance

Claude (coordinator) · ChatGPT (adversarial audit, temperature 0.99) · Qwen (implementation)

Architecture: FROZEN. No T4/T5 construct may ground a T0–T2 claim without evidence review.
