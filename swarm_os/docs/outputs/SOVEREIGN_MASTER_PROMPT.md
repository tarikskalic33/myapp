SOVEREIGN AGI OS -- MASTER HANDSHAKE
======================================
Operator: Tarik Skalic, Bihac, Bosnia
Version: 3.2.0
Date: March 24, 2026
Deadline: April 16, 2026 11:59 UTC

READ THESE FILES FIRST BEFORE ACTING:
  CONTEXT.md
  CLAUDE.md
  .agent\rules.md
  .forge\state.json
  .forge\knowledge_graph.json
  .forge\homeostasis_metrics.json
  DEPLOYMENT_ROADMAP.md

==============================================
WHAT THIS SYSTEM IS
==============================================

The Sovereign AGI OS is a biologically-mapped cognitive
governance framework for LLM agents built in Node.js.

Four biological systems mapped to compute:
  Nervous System   -> sovereign-discord.js (FSM + Discord)
  Endocrine System -> cognition.neuromodulators in state.json
  Immune System    -> sentinel.js (TF-IDF anomaly detection)
  Circulatory      -> MetabolicEngine (ATP budget)
  HPA Axis         -> stress-calibrator.js (closed feedback loop)

Memory tiers:
  DNA              -> AGENT_BOOT.md + rules.md (permanent)
  Epigenetic       -> skills.md (long-term)
  Consolidation    -> workflows.md + audit archive (mid-term)
  Neurotransmitters-> state.json cognition block (short-term)

Constitutional Laws (hard-enforced, never bypass):
  1. NO DIRECT STATE MUTATION
  2. NO UNAUTHORIZED TRANSITIONS
  3. NO SCOPE CREEP
  4. NO UNVERIFIED OUTPUT
  5. NO GUESSING

Project root: D:\03_WORK_PROJECTS\system_rebuild
Node binary:  C:\Users\hhk33\AppData\Local\ms-playwright-go\1.50.1\node.exe
GCP project:  lifequestplatinum
GCS bucket:   lifequestplatinum_cloudbuild/sovereign-vault/

==============================================
KAGGLE COMPETITION
==============================================

Competition: Measuring Progress Toward AGI - Cognitive Abilities
URL: kaggle.com/competitions/kaggle-measuring-agi
Track: Metacognition
Prize: $10,000 per track, $25,000 grand prize
Deadline: April 16, 2026 11:59 UTC

Benchmark: The Hallucination Delta: Metacognitive Accuracy
File: benchmark\sovereign_benchmark_FINAL.py
Tasks: 9 (Tasks 1-8 complete, Task 9 = context-confidence)
Writeup: docs\outputs\kaggle_writeup_1500words.md

Core concept:
  HD = |claimed correctness - actual correctness|
  HD=0.0 = perfect self-awareness
  HD=1.0 = total metacognitive failure
  Deterministic. No human judges. Pure math.

Key findings to include in writeup:
  RIR = 95.11% (gemini-3-flash-preview)
  Hormetic stress curve confirmed
  Optimal pressure zone: 0.3-0.6
  Hard cap: 0.8
  Adversarial framing reduces HD
  Context HD (Task 9) = live self-model accuracy

==============================================
KNOWLEDGE GRAPH
==============================================

File: .forge\knowledge_graph.json
Nodes: 18 (all strength > 0.80)
Key edges:
  Kaggle_Leaderboard -> executive_function: 0.95
  metacognitive_oversight -> CA3: 0.90
  machine_learning -> vertex_ai_vector_search: 0.99
  spatio_acoustic_baseline -> homeostasis: 0.97

Homeostasis metrics (.forge\homeostasis_metrics.json):
  Mean resonance: 585.50 Hz
  Spatial spread: 0.5773
  RIR: 0.9511
  Status: HOMEOSTASIS MAINTAINED

==============================================
DASHBOARD (Visual Cortex)
==============================================

File: dashboard\app.py
Stack: Streamlit + Plotly + HTML5 canvas
Features:
  - Rotating 3D knowledge graph manifold (18 nodes)
  - Benchmark scores bar chart (Tasks 1-9)
  - Metacognitive transparency toggle panel (5 sections)
  - Live Context HD score from state.json
  - Neuromodulator state display
  - Homeostasis metrics

Run locally:
  streamlit run dashboard\app.py

Deploy to Cloud Run:
  gcloud run deploy sovereign-visual-cortex \
    --source . --region europe-west1 \
    --allow-unauthenticated --port 8080

The Cloud Run URL is the Kaggle cover image.

==============================================
EXECUTION ROADMAP
==============================================

PHASE 0 -- PHONE (NOW):
  [ ] kaggle.com/benchmarks -> The Hallucination Delta
  [ ] Write a Task -> paste benchmark\sovereign_benchmark_FINAL.py
  [ ] Run all tasks -> confirm output
  [ ] Set benchmark to Public

PHASE 1 -- DESKTOP SESSION 1 (45 min):
  [ ] Install Warp Terminal (warp.dev)
  [ ] Install Claude Code plugins:
      /plugin install superpowers
      /plugin install sequential-thinking
      /plugin install context7
  [ ] Copy kaggle.json:
      copy "docs\archive\kaggle.json" "C:\Users\hhk33\.kaggle\kaggle.json"
  [ ] Verify: kaggle competitions list
  [ ] Copy dashboard:
      copy outputs\dashboard_app_FINAL.py dashboard\app.py
  [ ] pip install streamlit plotly pandas numpy
  [ ] streamlit run dashboard\app.py
  [ ] ngrok http 8501 (phone preview)
  [ ] Paste COWORK_ORGANIZE_PROMPT.md into Cowork (file cleanup)

PHASE 2 -- DESKTOP SESSION 2 (30 min):
  [ ] gcloud config set project lifequestplatinum
  [ ] gcloud services enable run.googleapis.com
  [ ] gcloud run deploy sovereign-visual-cortex \
        --source . --region europe-west1 \
        --allow-unauthenticated --port 8080
  [ ] Save public URL
  [ ] Screenshot dashboard with Self-Model panel open
      -> This is the Kaggle cover image
  [ ] Push to GCS:
      gcloud storage cp .forge\state.json gs://lifequestplatinum_cloudbuild/sovereign-vault/state.json
      gcloud storage cp .forge\knowledge_graph.json gs://lifequestplatinum_cloudbuild/sovereign-vault/knowledge_graph.json
      gcloud storage cp .forge\homeostasis_metrics.json gs://lifequestplatinum_cloudbuild/sovereign-vault/homeostasis_metrics.json
      gcloud storage cp .forge\docs\audit.jsonl gs://lifequestplatinum_cloudbuild/sovereign-vault/audit.jsonl

PHASE 3 -- KAGGLE SUBMISSION (20 min):
  [ ] kaggle.com/competitions/kaggle-measuring-agi
  [ ] New Writeup -> Track: Metacognition
  [ ] Paste: docs\outputs\kaggle_writeup_1500words.md
  [ ] Replace Results with: writeup_results_FINAL.md
  [ ] Replace Affiliations with: writeup_affiliations_FINAL.md
  [ ] Project link: Kaggle benchmark URL
  [ ] Cover image: Cloud Run dashboard screenshot
  [ ] Submit

PHASE 4 -- CLOSE THE LOOP (15 min):
  [ ] Run benchmark against all 4 models
  [ ] Record HD scores
  [ ] node tools\validate-state.js
  [ ] node tools\cognitive-eval.js
  [ ] Push updated state.json to GCS
  [ ] Discord: !status, !log

PHASE 5 -- EVOLVE (post April 16):
  [ ] Install autoresearch (karpathy/autoresearch)
      Wire program.md = CONTEXT.md, metric = HD score
  [ ] Deploy stress-calibrator.js to tools\
  [ ] Merge stress-discord-patch.js into sovereign-discord.js
  [ ] Expand knowledge graph with all 60+ NotebookLM sources
  [ ] Wire MiroFish with Claude Sonnet 4 as LLM backend
  [ ] Build tools\kaggle-sync.js (Horizon 1 feedback loop)

HORIZON 1 (April-May 2026):
  [ ] Kaggle HD scores automatically update state.json
  [ ] Looker Studio dashboard connected to GCS
  [ ] W&B experiment tracking wired into benchmark

HORIZON 2 (Q2 2026):
  [ ] 4 models run in parallel via Cloud Function
  [ ] Elected model auto-selected by lowest HD
  [ ] Cross-model distillation loop

HORIZON 3 (Q3 2026):
  [ ] OS generates its own benchmark tasks from failures
  [ ] First autonomously generated task passes operator gate

HORIZON 4 (Q4 2026):
  [ ] Vertex AI Agent Builder migration
  [ ] ATP wired to GCP billing
  [ ] 12-hour autonomous leaderboard updates

==============================================
ALL OUTPUT FILES (D:\...\system_rebuild\outputs\)
==============================================

sovereign_benchmark_FINAL.py     -> paste into Kaggle
dashboard_app_FINAL.py           -> copy to dashboard\app.py
kaggle_writeup_1500words.md      -> paste into Kaggle writeup
writeup_results_FINAL.md         -> replace Results section
writeup_affiliations_FINAL.md    -> replace Affiliations section
COWORK_PIPELINE_FINAL.md         -> paste into Cowork
COWORK_ORGANIZE_PROMPT.md        -> paste into Cowork
TASK9_BUILD_PROMPT.md            -> paste into Claude Code
CONTEXT.md                       -> copy to .agent\
DEPLOYMENT_ROADMAP.md            -> copy to .agent\
SOVEREIGN_ROADMAP.md             -> reference doc
stress-calibrator.js             -> copy to tools\
stress-discord-patch.js          -> merge into sovereign-discord.js
cognitive-gateway-pressure-patch.js -> merge into cognitive-gateway.js
sovereign_dashboard_preview.html -> browser preview

==============================================
AGENT DIRECTIVES
==============================================

When receiving this prompt as a Claude Code or
Cowork session start:

1. Read all files listed under READ FIRST
2. Check current phase from state.json
3. Check what is incomplete in EXECUTION ROADMAP
4. Execute the next incomplete phase only
5. Do not skip phases
6. Report FATAL_BLOCKER if anything fails
7. After completing a phase push state.json to GCS

Do not fragment work across multiple sessions.
Complete each phase fully or stop and report.
Await operator directive if phase is unclear.

==============================================
CONSTITUTIONAL LAWS (REPEAT -- NON-NEGOTIABLE)
==============================================

1. NO DIRECT STATE MUTATION
2. NO UNAUTHORIZED TRANSITIONS
3. NO SCOPE CREEP
4. NO UNVERIFIED OUTPUT
5. NO GUESSING

Violations -> STOP + FATAL_BLOCKER report
Three violations -> session abort
