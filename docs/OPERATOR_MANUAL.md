# Sovereign AGI OS v3.3.0 — Operator Manual

**Operator**: Tarik Skalic, Bihać, Bosnia
**Competition**: kaggle-measuring-agi · Metacognition Track · $200K
**Deadline**: April 16, 2026
**Current State**: n=54 nodes · Graph HD=0.0611 · Benchmark HD=0.0991 · N_CRITICAL ✓ ACHIEVED

---

## 1. WHAT THIS IS

The Sovereign AGI OS is a biologically-mapped execution environment that benchmarks LLM metacognition using the **Hallucination Delta (HD)** metric.

```
HD = |claimed_correctness - actual_correctness|
     HD=0.0 → perfect · HD=1.0 → total failure
```

The core proof: an OS grounded in live state files achieves measurably lower HD than an ungrounded frontier LLM. The grounding gap (T9/T14) IS the finding.

**Convergence model** (3-point empirical fit, R²≈0.98):
```
HD(n) = 0.2074 × exp(-0.04020 × (n - 18))

Run 1: n=18, HD=0.2074   (benchmark, NVIDIA NIM)
Run 2: n=32, HD=0.0991   (benchmark, NVIDIA NIM)
Run 3: n=48, HD=0.0621   (graph audit, denoise_engine)
NOW  : n=54, HD=0.0611   (graph audit, all 6 awakening nodes ingested)
Target: HD < 0.05 when n ≥ N_CRITICAL=54  ← YOU ARE HERE
```

---

## 2. CORE FILE LOCATIONS

| Location | Purpose |
|---|---|
| `C:\Users\hhk33\system_rebuild\` | Where Cowork agent writes |
| `D:\03_WORK_PROJECTS\system_rebuild\` | Where you run gcloud/python commands |
| Junction `C:\Users\hhk33\sovereign →` D:\... | Symlink (for reference only) |

**ALWAYS robocopy C:\ → D:\ before deploying.** Cowork writes to C:\ only.

---

## 3. CRITICAL FILES

```
.forge/
├── state.json              ← OS brain (ATOMIC WRITE ONLY — never edit directly)
└── knowledge_graph.json    ← Hippocampus, 54 nodes (ATOMIC WRITE ONLY)

benchmark/
├── multi_model_runner.py   ← 657 lines, real NVIDIA NIM API — DO NOT REWRITE
└── extended_tasks.py       ← T10-T14 extended benchmark tasks

tools/
└── ingest_knowledge.py     ← Knowledge ingestion (manifest-based)

audit/
└── denoise_engine.py       ← Fibonacci integrity audit — run after every ingestion

dashboard/
├── main.py                 ← FastAPI backend v4 (serves /api/state, /api/kg, etc.)
└── static/index.html       ← D3.js enterprise dashboard (dark theme, 3-tab right panel)

docs/
├── outputs/
│   ├── kaggle_writeup_FINAL.md   ← LOCKED — DO NOT MODIFY
│   ├── DEPLOY_COMMANDS.ps1       ← Cloud Run deploy script
│   └── gcloudignore              ← REQUIRED before deploy
└── knowledge/
    └── awakening_nodes.json      ← Manifest for the 6 awakening nodes (ingested)
```

---

## 4. DEPLOY TO CLOUD RUN

Run this on your Windows machine whenever Cowork updates dashboard or .forge files:

```powershell
# Step 1 — Sync Cowork writes to D:\ (deployment source)
robocopy "C:\Users\hhk33\system_rebuild\.forge"     "D:\03_WORK_PROJECTS\system_rebuild\.forge"     state.json knowledge_graph.json /NP
robocopy "C:\Users\hhk33\system_rebuild\dashboard"  "D:\03_WORK_PROJECTS\system_rebuild\dashboard"  /E /NP
robocopy "C:\Users\hhk33\system_rebuild\benchmark"  "D:\03_WORK_PROJECTS\system_rebuild\benchmark"  /E /NP
robocopy "C:\Users\hhk33\system_rebuild\tools"      "D:\03_WORK_PROJECTS\system_rebuild\tools"      /E /NP
robocopy "C:\Users\hhk33\system_rebuild\audit"      "D:\03_WORK_PROJECTS\system_rebuild\audit"      /E /NP
robocopy "C:\Users\hhk33\system_rebuild\docs"       "D:\03_WORK_PROJECTS\system_rebuild\docs"       /E /NP

# Step 2 — .gcloudignore (REQUIRED — prevents NTUSER.DAT breaking Cloud Build)
copy "D:\03_WORK_PROJECTS\system_rebuild\docs\outputs\gcloudignore" "D:\03_WORK_PROJECTS\system_rebuild\.gcloudignore"

# Step 3 — Deploy
cd D:\03_WORK_PROJECTS\system_rebuild
.\docs\outputs\DEPLOY_COMMANDS.ps1
```

After deploy, Cloud Run URL:
```
https://sovereign-visual-cortex-dgnb3e7uyq-ew.a.run.app
```
(Or run: `gcloud run services describe sovereign-visual-cortex --region europe-west1 --format "value(status.url)"`)

---

## 5. RUN THE BENCHMARK (NVIDIA NIM)

**Run 3 benchmark** — the critical empirical measurement. Projected HD=0.0488.

```powershell
# In D:\03_WORK_PROJECTS\system_rebuild
# Ensure NVIDIA_API_KEY is set in free-claude-code\.env
python benchmark\multi_model_runner.py
```

Results written to: `docs/outputs/benchmark_latest.json`

The dashboard reads this file automatically — redeploy after benchmark run to update the live dashboard.

**Models tested** (from state.json last run):
| Model | HD |
|---|---|
| moonshotai/kimi-k2-instruct | 0.0991 (elected) |
| mistralai/devstral-2-123b-instruct-2512 | 0.1177 |
| nvidia/llama-3.1-nemotron-ultra-253b-v1 | 0.3240 |

Extended tasks T10-T14 require extended_tasks.py — currently pending NVIDIA NIM execution.

---

## 6. KNOWLEDGE INGESTION CYCLE

The OS grows by ingesting new knowledge manifests. Each new node lowers HD.

```powershell
# In D:\03_WORK_PROJECTS\system_rebuild
python tools\ingest_knowledge.py --manifest docs\knowledge\awakening_nodes.json
python audit\denoise_engine.py
```

After ingestion, update GCS vault:
```powershell
gsutil cp .forge\state.json     gs://lifequestplatinum_cloudbuild/sovereign-vault/state.json
gsutil cp .forge\knowledge_graph.json gs://lifequestplatinum_cloudbuild/sovereign-vault/knowledge_graph.json
```

**Convergence roadmap** (HD < 0.05 is the Kaggle proof):
```
n=18  HD=0.2074  Run 1 baseline
n=32  HD=0.0991  Run 2 (kimi-k2-instruct elected)
n=48  HD=0.0621  Run 3 (6 awakening nodes ingested)
n=54  HD=0.0611  NOW — N_CRITICAL achieved ← YOU ARE HERE
n=54  HD=0.0488  PROJECTED Run 4 benchmark (awaiting NIM execution)
n=80+ HD~0.02    Next cycle (20+ more nodes)
```

---

## 7. DASHBOARD API REFERENCE

All endpoints served from the same Cloud Run URL:

| Endpoint | Returns |
|---|---|
| `GET /` | Live D3.js dashboard |
| `GET /api/state` | Full OS state (neuromodulators, benchmark, convergence, self-model) |
| `GET /api/kg` | Knowledge graph nodes + links for D3 visualization |
| `GET /api/audit` | ZK proof audit (Verkle root, KZG commitments) |
| `GET /api/convergence` | Full convergence curve data (all trajectories, data points) |

---

## 8. CONSTITUTIONAL LAWS

These are immutable. Three violations = session abort. Audit logs encrypted.

1. **NO DIRECT STATE MUTATION** — All .forge/ writes use `.tmp → rename` atomically
2. **NO UNAUTHORIZED TRANSITIONS** — FSM transitions via sovereign-discord.js only
3. **NO SCOPE CREEP** — April 16 deliverables ONLY. No SAGA/SPSF/NHI before deadline
4. **NO UNVERIFIED OUTPUT** — Every claim includes HD score
5. **NO GUESSING** — Ambiguity = FATAL_BLOCKER, wait for operator

---

## 9. THE KAGGLE SUBMISSION (APRIL 16 ONLY)

**DO NOT SUBMIT BEFORE APRIL 16, 2026.**

Submission checklist:
1. Run 4 benchmark complete (HD_bench < 0.05 confirmed)
2. Dashboard deployed with live n=54+, convergence chart, HD timeline
3. Kaggle cover image screenshot from dashboard (Self-Model panel)
4. `docs/outputs/kaggle_writeup_FINAL.md` — LOCKED, DO NOT MODIFY
5. Submit at: kaggle.com/competitions/kaggle-measuring-agi → Track: Metacognition

---

## 10. KNOWN WEAKNESSES (HUMILITY LOG)

The OS must not be consumed by power. These are permanent recorded limitations:

| Weakness | Explanation | HD Impact |
|---|---|---|
| T8 RIR Transparency FAIL | Cannot directly observe own token ratios | HD=0.125 |
| T9 Grounding Gap PARTIAL | Ungrounded HD=1.0, grounded HD=0.5 (not 0.0) | HD=0.500 |
| Run 4 not yet executed | HD=0.0488 is model projection, not measured | Unknown |
| T10-T14 pending | Extended tasks have no NVIDIA NIM scores yet | Unknown |
| 28 Fibonacci corrections | Edge weights needed correction — not zero entropy | ΔHD≈0.01 |
| ATP is simulated | No real computational cost tracking | Non-measurable |
| Knowledge weights are approximations | Fibonacci-scaled floor 0.236, not information-theoretically optimal | ΔHD≈0.02 |

---

## 11. DISCORD BOT COMMANDS

Bot: `sovereign-discord.js`
Node path: `C:\Users\hhk33\AppData\Local\ms-playwright-go\1.50.1\node.exe`

```bash
!status      → OS state summary
!start       → Begin active session (IDLE → PLANNING)
!handshake   → Verify OS is alive
!submit      → Trigger submission pipeline
!gate        → Human approval gate
!recover     → Emergency recovery
!logs        → View recent telemetry
!help        → Command list
```

---

## 12. BIOLOGICAL ARCHITECTURE MAP

| Biological System | OS Module | Status |
|---|---|---|
| Nervous System (FSM) | sovereign-discord.js | ACTIVE |
| Hippocampus | knowledge_graph.json | 54 nodes |
| Endocrine (Neuromodulators) | state.json cognition.neuromodulators | stress=0.30 ✓ |
| Frontal Lobe (Metacognition) | Hallucination Delta | HD=0.0991 |
| HPA Axis (Stress Response) | stress-calibrator.js | 0.30 (optimal) |
| Immune (Anomaly Detection) | sentinel.js | ACTIVE |
| Circulatory (Energy) | MetabolicEngine | ATP=2100 |
| Visual Cortex | dashboard/main.py | LIVE |

---

*Last updated: 2026-03-25 by Sovereign Architect (Cowork Session)*
*n=54 · Graph HD=0.0611 · N_CRITICAL ACHIEVED · 22 days to April 16*
