SOVEREIGN AGI OS — COWORK PIPELINE
====================================
Operator: Tarik Skalic
Project root: D:\03_WORK_PROJECTS\system_rebuild
GCP Project: lifequestplatinum
Deadline: April 16, 2026

READ FIRST before doing anything:
  D:\03_WORK_PROJECTS\system_rebuild\CONTEXT.md
  D:\03_WORK_PROJECTS\system_rebuild\CLAUDE.md
  D:\03_WORK_PROJECTS\system_rebuild\.agent\rules.md
  D:\03_WORK_PROJECTS\system_rebuild\.forge\state.json
  D:\03_WORK_PROJECTS\system_rebuild\.forge\knowledge_graph.json
  D:\03_WORK_PROJECTS\system_rebuild\.forge\homeostasis_metrics.json

EXISTING GCS BUCKETS (do not create new ones):
  Sovereign vault:    lifequestplatinum_cloudbuild
  Cloud Run source:   run-sources-lifequestplatinum-europe-west1
  Cloud Run deploy:   already configured for europe-west1

═══════════════════════════════════════════════
PHASE 1 — LOCAL WIRING
═══════════════════════════════════════════════

STEP 1: Kaggle auth
  Copy: D:\03_WORK_PROJECTS\system_rebuild\docs\archive\kaggle.json
  To:   C:\Users\hhk33\.kaggle\kaggle.json
  Create directory if missing.
  Verify: kaggle competitions list
  Expected: kaggle-measuring-agi appears.
  STOP and report if FAIL.

STEP 2: Verify benchmark file
  Check: D:\03_WORK_PROJECTS\system_rebuild\benchmark\sovereign_benchmark_FINAL.py
  Must have 8 .run(llm=kbench.llm) calls.
  If missing: report FATAL_BLOCKER.

STEP 3: Test dashboard locally
  cd D:\03_WORK_PROJECTS\system_rebuild
  pip install streamlit plotly pandas numpy
  streamlit run dashboard\app.py
  Expected: browser opens with 18-node 3D manifold.
  Verify: Mean 585.50 Hz, Spread 0.5773, RIR 0.9511 visible.

═══════════════════════════════════════════════
PHASE 2 — PUSH OS ARTIFACTS TO GCS
═══════════════════════════════════════════════

Use existing bucket: lifequestplatinum_cloudbuild
Push under subfolder: sovereign-vault/

STEP 4: Set project and push artifacts
  gcloud config set project lifequestplatinum

  gcloud storage cp .forge\state.json gs://lifequestplatinum_cloudbuild/sovereign-vault/state.json
  gcloud storage cp .forge\knowledge_graph.json gs://lifequestplatinum_cloudbuild/sovereign-vault/knowledge_graph.json
  gcloud storage cp .forge\homeostasis_metrics.json gs://lifequestplatinum_cloudbuild/sovereign-vault/homeostasis_metrics.json
  gcloud storage cp .forge\docs\audit.jsonl gs://lifequestplatinum_cloudbuild/sovereign-vault/audit.jsonl

STEP 5: Verify
  gcloud storage ls gs://lifequestplatinum_cloudbuild/sovereign-vault/
  Expected: 4 files listed.

═══════════════════════════════════════════════
PHASE 3 — CLOUD RUN DEPLOYMENT (dashboard)
═══════════════════════════════════════════════

STEP 6: Enable APIs if not already enabled
  gcloud services enable run.googleapis.com
  gcloud services enable cloudbuild.googleapis.com

STEP 7: Deploy dashboard
  cd D:\03_WORK_PROJECTS\system_rebuild
  gcloud run deploy sovereign-visual-cortex \
    --source . \
    --region europe-west1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars GCP_PROJECT_ID=lifequestplatinum

  Expected: Service URL printed at end of deploy.
  Format: https://sovereign-visual-cortex-xxxx-ew.a.run.app
  Save this URL — it becomes the Kaggle cover image.

STEP 8: Verify deployment
  Open the URL in browser.
  Expected: 3D manifold dashboard with 18 nodes visible.
  Take a screenshot — this is the Kaggle submission cover image.

═══════════════════════════════════════════════
PHASE 4 — KAGGLE SUBMISSION
═══════════════════════════════════════════════

STEP 9: Run benchmark tasks
  Navigate to kaggle.com/benchmarks
  Open: The Hallucination Delta
  Click: Write a Task
  Paste: contents of benchmark\sovereign_benchmark_FINAL.py
  Run all 8 tasks.
  Confirm output on each task.

STEP 10: Submit writeup
  Navigate to kaggle.com/competitions/kaggle-measuring-agi
  Click: New Writeup
  Track: Metacognition
  Paste: contents of docs\outputs\kaggle_writeup_1500words.md
  Project link: your benchmark URL
  Cover image: screenshot of Cloud Run dashboard
  Click: Submit

═══════════════════════════════════════════════
PHASE 5 — CLOSE THE LOOP
═══════════════════════════════════════════════

STEP 11: Update state with benchmark results
  Read HD scores from benchmark output.
  Edit .forge\state.json neuromodulators:
    if HD > 0.5: stress_level += 0.1
    if HD < 0.2: stress_level -= 0.05, curiosity_drive += 0.1
    rir_signal = 0.9511
  Use atomic write: write to state.tmp.json first, then rename.
  Push updated state to GCS:
    gcloud storage cp .forge\state.json gs://lifequestplatinum_cloudbuild/sovereign-vault/state.json

STEP 12: Final OS validation
  node C:\Users\hhk33\AppData\Local\ms-playwright-go\1.50.1\node.exe tools\validate-state.js
  node C:\Users\hhk33\AppData\Local\ms-playwright-go\1.50.1\node.exe tools\cognitive-eval.js
  Report composite score to operator.

═══════════════════════════════════════════════
SUCCESS CRITERIA
═══════════════════════════════════════════════

Pipeline complete when ALL true:
  Kaggle auth: PASS
  8 tasks verified in benchmark file
  4 artifacts in gs://lifequestplatinum_cloudbuild/sovereign-vault/
  Cloud Run URL live and showing dashboard
  Kaggle writeup submitted with benchmark link attached
  state.json updated with latest HD and RIR scores

═══════════════════════════════════════════════
CONSTITUTIONAL LAWS
═══════════════════════════════════════════════

NO DIRECT STATE MUTATION
NO GUESSING
NO SCOPE CREEP
NO UNVERIFIED OUTPUT
Report FATAL_BLOCKER if any step cannot complete.
Do not proceed past a blocker without operator approval.
