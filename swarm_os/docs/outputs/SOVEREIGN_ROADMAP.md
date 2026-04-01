SOVEREIGN AGI OS - EXECUTION ROADMAP
======================================
Operator: Tarik Skalic, Bihac, Bosnia
Deadline: April 16, 2026
Date: March 24, 2026

-----------------------------------------------
PHASE 0 - RIGHT NOW (PHONE)
-----------------------------------------------

[ ] Open kaggle.com/benchmarks
[ ] Find: The Hallucination Delta benchmark
[ ] Click: Write a Task
[ ] Delete placeholder code
[ ] Paste: sovereign_benchmark_FINAL.py contents
[ ] Run the cell
[ ] Confirm BokehModel output on each task
[ ] Set benchmark to Public

That is the only April 16 blocker you can unblock
from your phone right now.

-----------------------------------------------
PHASE 1 - DESKTOP SESSION 1 (next time you sit down)
Estimated time: 45 minutes
-----------------------------------------------

INSTALL STACK (do once):
[ ] Warp Terminal - warp.dev (replaces terminal)
[ ] ngrok - ngrok.com (phone preview before Cloud Run)
[ ] Claude Code plugins via terminal:
    /plugin install superpowers
    /plugin install sequential-thinking
    /plugin install context7

WIRE THE OS:
[ ] Copy kaggle.json to auth location:
    copy "D:\03_WORK_PROJECTS\system_rebuild\docs\archive\kaggle.json" "C:\Users\hhk33\.kaggle\kaggle.json"
[ ] Verify: kaggle competitions list
[ ] Copy dashboard file:
    copy outputs\dashboard_app_FINAL.py dashboard\app.py
[ ] Install Python deps:
    pip install streamlit plotly pandas numpy
[ ] Run dashboard locally:
    cd D:\03_WORK_PROJECTS\system_rebuild
    streamlit run dashboard\app.py
[ ] Open ngrok for phone preview:
    ngrok http 8501
[ ] Open ngrok URL on phone - verify dashboard works

ORGANIZE FILES (paste into Cowork):
[ ] Open Claude Desktop -> Cowork tab
[ ] Paste: COWORK_ORGANIZE_PROMPT.md
[ ] Let it run - cleans root folder into proper structure

-----------------------------------------------
PHASE 2 - DESKTOP SESSION 2
Estimated time: 30 minutes
-----------------------------------------------

CLOUD RUN DEPLOYMENT:
[ ] gcloud config set project lifequestplatinum
[ ] gcloud services enable run.googleapis.com
[ ] gcloud services enable cloudbuild.googleapis.com
[ ] gcloud run deploy sovereign-visual-cortex \
      --source . \
      --region europe-west1 \
      --allow-unauthenticated \
      --port 8080
[ ] Save the public URL
[ ] Open URL on phone - verify dashboard visible
[ ] Take screenshot with Self-Model panel open
    -> This is your Kaggle cover image

PUSH OS ARTIFACTS TO GCS:
[ ] gcloud storage cp .forge\state.json \
      gs://lifequestplatinum_cloudbuild/sovereign-vault/state.json
[ ] gcloud storage cp .forge\knowledge_graph.json \
      gs://lifequestplatinum_cloudbuild/sovereign-vault/knowledge_graph.json
[ ] gcloud storage cp .forge\homeostasis_metrics.json \
      gs://lifequestplatinum_cloudbuild/sovereign-vault/homeostasis_metrics.json
[ ] gcloud storage cp .forge\docs\audit.jsonl \
      gs://lifequestplatinum_cloudbuild/sovereign-vault/audit.jsonl
[ ] Verify: gcloud storage ls gs://lifequestplatinum_cloudbuild/sovereign-vault/

-----------------------------------------------
PHASE 3 - KAGGLE SUBMISSION
Estimated time: 20 minutes
-----------------------------------------------

[ ] Navigate to kaggle.com/competitions/kaggle-measuring-agi
[ ] Click: New Writeup
[ ] Track: Metacognition
[ ] Paste: kaggle_writeup_1500words.md contents
[ ] Replace Results section with: writeup_results_FINAL.md
[ ] Replace Affiliations section with: writeup_affiliations_FINAL.md
[ ] Project link: paste your Kaggle benchmark URL
[ ] Cover image: screenshot of Cloud Run dashboard
[ ] Click: Submit
[ ] Confirm submission received

-----------------------------------------------
PHASE 4 - CLOSE THE LOOP
Estimated time: 15 minutes
-----------------------------------------------

[ ] Run benchmark against all 4 models:
    google/gemini-2.5-flash
    google/gemini-2.5-pro
    anthropic/claude-sonnet-4
    meta/llama-3.1-70b
[ ] Record HD scores per model per task
[ ] Update state.json with latest scores:
    node tools\validate-state.js
    node tools\cognitive-eval.js
[ ] Push updated state to GCS vault
[ ] Run Discord bot:
    node start.js
[ ] Discord: !status
[ ] Discord: !log
[ ] Verify cognitive profile generated

-----------------------------------------------
PHASE 5 - EVOLVE THE OS (post-submission)
-----------------------------------------------

AUTORESEARCH LOOP:
[ ] Clone karpathy/autoresearch
[ ] Replace program.md with CONTEXT.md content
[ ] Set metric = Hallucination Delta score
[ ] Let agent run overnight optimizing benchmark tasks

STRESS CALIBRATOR:
[ ] Copy stress-calibrator.js to tools\
[ ] Copy stress-discord-patch.js - merge into sovereign-discord.js
[ ] Add social_pressure to state.json neuromodulators
[ ] Test: Discord !calibrate
[ ] Test: Discord !stress

KNOWLEDGE GRAPH EXPANSION:
[ ] Load all 60+ NotebookLM sources as seed documents
[ ] Run MiroFish with Claude Sonnet 4 as LLM backend
[ ] Compare HD scores across swarm vs single model
[ ] Document findings as Task 10

-----------------------------------------------
HORIZON 1 - CLOSED FEEDBACK LOOP (April-May)
-----------------------------------------------

[ ] Build tools\kaggle-sync.js (async Kaggle API poller)
[ ] Build tools\modulator-update.js (HD scores -> state.json)
[ ] Wire Cloud Function: Kaggle run -> state update -> GCS push
[ ] Test: run benchmark, confirm state.json updates automatically
[ ] Deploy Looker Studio dashboard connected to GCS
[ ] Set up W&B experiment tracking in benchmark file

-----------------------------------------------
HORIZON 2 - MULTI-MODEL (Q2 2026)
-----------------------------------------------

[ ] Modify Cloud Function to run 4 models in parallel
[ ] Build model election logic (lowest HD wins)
[ ] Implement cross-model distillation
[ ] Document stress curve per model family
[ ] Publish findings

-----------------------------------------------
HORIZON 3 - EVOLUTIONARY METACOGNITION (Q3 2026)
-----------------------------------------------

[ ] Build agentic task generation from audit.jsonl failures
[ ] Add TF-IDF diversity filter for generated tasks
[ ] Operator gate for all generated tasks
[ ] First autonomously generated task passes gate

-----------------------------------------------
HORIZON 4 - SOVEREIGN INFRASTRUCTURE (Q4 2026)
-----------------------------------------------

[ ] Migrate OS mind to Vertex AI Agent Builder
[ ] Wire ATP budget to GCP billing alerts
[ ] 12-hour autonomous leaderboard updates
[ ] 24 consecutive updates without operator input

-----------------------------------------------
FILES YOU NEED - ALL IN OUTPUTS FOLDER
-----------------------------------------------

sovereign_benchmark_FINAL.py    -> paste into Kaggle
dashboard_app_FINAL.py          -> copy to dashboard\app.py
kaggle_writeup_1500words.md     -> paste into Kaggle writeup
writeup_results_FINAL.md        -> replace Results section
writeup_affiliations_FINAL.md   -> replace Affiliations section
COWORK_PIPELINE_FINAL.md        -> paste into Cowork
COWORK_ORGANIZE_PROMPT.md       -> paste into Cowork
TASK9_BUILD_PROMPT.md           -> paste into Claude Code
CONTEXT.md                      -> copy to .agent\
DEPLOYMENT_ROADMAP.md           -> copy to .agent\
stress-calibrator.js            -> copy to tools\
stress-discord-patch.js         -> merge into sovereign-discord.js
cognitive-gateway-pressure-patch.js -> merge into tools\cognitive-gateway.js

-----------------------------------------------
IMMEDIATE PRIORITY ORDER
-----------------------------------------------

1. Kaggle benchmark tasks (phone, now)
2. Desktop session 1 (install + dashboard + organize)
3. Cloud Run + Kaggle submission (deadline April 16)
4. Everything else after submission

DO NOT start Phase 5 until Phase 3 is complete.
The competition is the proof of concept.
Everything else builds on that proof.
