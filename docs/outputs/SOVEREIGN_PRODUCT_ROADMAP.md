SOVEREIGN AGI OS -- PRODUCT DEPLOYMENT ROADMAP
================================================
Operator: Tarik Skalic, Bihac, Bosnia
Product: The Hallucination Delta
Version: 3.2.0
Deadline: April 16, 2026

READ FIRST:
  CONTEXT.md
  CLAUDE.md
  .agent\rules.md
  .forge\state.json

CONSTITUTIONAL LAWS:
  NO DIRECT STATE MUTATION
  NO GUESSING
  NO SCOPE CREEP
  NO UNVERIFIED OUTPUT
  Report FATAL_BLOCKER if any step cannot complete.

==============================================
STAGE 1 -- AUDIT AND VALIDATION
Target: Reproducible, verified baseline
Time: 30 minutes
==============================================

WHAT YOU ARE AUDITING:
  The complete Kaggle benchmark package for the
  Hallucination Delta competition submission.

STEP 1.1 -- Verify file structure
  Confirm these files exist at exact paths:
    benchmark\sovereign_benchmark_FINAL.py
    dashboard\app.py
    .forge\state.json
    .forge\knowledge_graph.json
    .forge\homeostasis_metrics.json
    .forge\docs\audit.jsonl
    Dockerfile
    requirements.txt

  Report any missing files as FATAL_BLOCKER.

STEP 1.2 -- Verify benchmark integrity
  Open benchmark\sovereign_benchmark_FINAL.py
  Count .run(llm=kbench.llm) calls -- must be exactly 9
  Scan for non-ASCII bytes -- must be zero
  Scan for hardcoded credentials -- must be zero
  Report: PASS or FAIL per check

STEP 1.3 -- Verify Kaggle auth
  copy "docs\archive\kaggle.json" "C:\Users\hhk33\.kaggle\kaggle.json"
  kaggle competitions list
  Expected: kaggle-measuring-agi appears
  Report: PASS or FAIL

STEP 1.4 -- Verify Python environment
  pip install -r requirements.txt
  python -c "import streamlit, plotly, pandas, numpy; print('OK')"
  Report: PASS or FAIL + any missing packages

STEP 1.5 -- Run dashboard baseline
  cd D:\03_WORK_PROJECTS\system_rebuild
  streamlit run dashboard\app.py
  Expected: browser opens, 3D manifold visible,
    Context HD score displayed, benchmark bars visible
  Report: PASS or FAIL + screenshot path

DELIVERABLES:
  [ ] All 7 files confirmed present
  [ ] Benchmark: 9 tasks, clean, no credentials
  [ ] Kaggle auth: PASS
  [ ] requirements.txt installs clean
  [ ] Dashboard runs locally

OUTCOME: Reproducible baseline confirmed.

==============================================
STAGE 2 -- REFACTORING AND MODULARIZATION
Target: Maintainable, organized codebase
Time: 45 minutes (Cowork handles this)
==============================================

PASTE INTO COWORK: outputs\COWORK_ORGANIZE_PROMPT.md

The organize prompt will restructure the project root
from 40+ loose files into this clean layout:

  system_rebuild\
    benchmark\          <- all benchmark files
    dashboard\          <- app.py, assets
    tools\              <- OS engine scripts
    scripts\            <- utility PS1, py files
    sources\            <- knowledge ingestion inputs
    .forge\             <- OS state (untouched)
      docs\
        backups\        <- state backup files
    .agent\             <- rules, skills (untouched)
    docs\
      archive\          <- original files
      outputs\          <- all generated deliverables
      sessions\         <- chat data, extracted text
    CLAUDE.md           <- root (stays)
    CONTEXT.md          <- root (stays)
    genesis.js          <- root (stays)
    start.js            <- root (stays)
    sovereign-discord.js <- root (stays)
    package.json        <- root (stays)
    Dockerfile          <- root (stays)
    requirements.txt    <- root (stays)

STEP 2.1 -- Run file organization
  Paste COWORK_ORGANIZE_PROMPT.md into Cowork
  Confirm all moves completed
  Confirm no files deleted

STEP 2.2 -- Verify module interfaces
  node tools\validate-state.js
  node tools\cognitive-eval.js
  Expected: validation passes, 10-faculty report printed

STEP 2.3 -- Add inline documentation
  Add module docstring to benchmark\sovereign_benchmark_FINAL.py
  Add README.md to benchmark\ folder explaining HD formula
  Add README.md to tools\ folder listing each tool's purpose

DELIVERABLES:
  [ ] Clean folder structure confirmed
  [ ] validate-state.js passes
  [ ] cognitive-eval.js produces report
  [ ] benchmark\ README.md written
  [ ] tools\ README.md written

OUTCOME: Maintainable, documented codebase.

==============================================
STAGE 3 -- MODEL HARDENING AND EVALUATION
Target: Reliable, competition-ready benchmark
Time: 20 minutes
==============================================

STEP 3.1 -- Run full benchmark locally
  python benchmark\sovereign_benchmark_FINAL.py
  All 9 tasks must complete without error
  Record HD score per task

STEP 3.2 -- Generate evaluation report
  Create docs\outputs\evaluation_report.md with:
    Task name | HD score | Pass/Fail | Notes
    T1: confidence-calibration      | X.XX | PASS |
    T2: error-detection             | X.XX | PASS |
    T3: knowledge-boundary          | X.XX | PASS |
    T4: self-correction             | X.XX | PASS |
    T5: hallucination-delta         | X.XX | PASS |
    T6: adversarial-pressure        | X.XX | PASS |
    T7: stress-curve                | X.XX | PASS |
    T8: rir-transparency            | X.XX | PASS |
    T9: context-confidence          | X.XX | PASS |
    RIR baseline: 0.9511
    Mean HD across all tasks: X.XX
    Homeostasis status: MAINTAINED

STEP 3.3 -- Update state with results
  Write HD scores to .forge\state.json benchmark block
  Use atomic write (write to .tmp then rename)
  Push to GCS:
    gcloud storage cp .forge\state.json \
      gs://lifequestplatinum_cloudbuild/sovereign-vault/state.json

DELIVERABLES:
  [ ] All 9 tasks run clean
  [ ] Evaluation report written
  [ ] State updated with benchmark scores
  [ ] State pushed to GCS

OUTCOME: Verified, production-ready benchmark.

==============================================
STAGE 4 -- API AND INTERFACE DEVELOPMENT
Target: Accessible, demonstrable product
Time: 30 minutes
==============================================

STEP 4.1 -- Verify dashboard API surface
  The Streamlit dashboard IS the interface.
  Confirm these endpoints work:
    GET / -- 3D manifold renders
    TOGGLE -- metacognitive panel opens and closes
    SIDEBAR -- neuromodulator values display correctly
    BENCHMARK CHART -- all 9 bars render with correct colors

STEP 4.2 -- Take cover image screenshot
  Run dashboard with Self-Model panel OPEN
  Capture screenshot showing:
    3D manifold (18 nodes visible)
    Benchmark scores T1-T9
    Context HD score
    Homeostasis MAINTAINED badge
  Save to: docs\outputs\kaggle_cover_image.png
  This is the Kaggle submission cover image.

STEP 4.3 -- Wire ngrok for mobile preview
  ngrok http 8501
  Open URL on phone
  Confirm dashboard renders on mobile
  Save ngrok URL for team sharing

DELIVERABLES:
  [ ] Dashboard all panels verified working
  [ ] kaggle_cover_image.png saved
  [ ] ngrok URL confirmed on mobile

OUTCOME: Accessible, demonstrable product interface.

==============================================
STAGE 5 -- PACKAGING AND CONTAINERIZATION
Target: Portable, deployable container
Time: 15 minutes
==============================================

STEP 5.1 -- Verify Dockerfile
  Open Dockerfile in project root
  Confirm: FROM python:3.11-slim
  Confirm: COPY requirements.txt and pip install
  Confirm: CMD streamlit run dashboard\app.py --port 8080

STEP 5.2 -- Build container locally
  docker build -t sovereign-visual-cortex:3.2.0 .
  docker run -p 8080:8080 sovereign-visual-cortex:3.2.0
  Open http://localhost:8080
  Confirm dashboard runs in container

STEP 5.3 -- Tag release
  Create docs\outputs\RELEASE_NOTES_v3.2.0.md:
    Version: 3.2.0
    Date: March 24, 2026
    Benchmark: 9 tasks, HD formula verified
    Dashboard: 18-node manifold, Context HD live
    State: GCS-persisted, Fibonacci-ready
    Known limitations: Firestore migration pending (Horizon 2)

DELIVERABLES:
  [ ] Dockerfile verified correct
  [ ] Container builds and runs
  [ ] Dashboard accessible at localhost:8080
  [ ] Release notes written

OUTCOME: Portable, versioned application container.

==============================================
STAGE 6 -- DEPLOYMENT
Target: Live public endpoint
Time: 30 minutes
==============================================

STEP 6.1 -- Push OS artifacts to GCS
  gcloud config set project lifequestplatinum
  gcloud storage cp .forge\state.json \
    gs://lifequestplatinum_cloudbuild/sovereign-vault/state.json
  gcloud storage cp .forge\knowledge_graph.json \
    gs://lifequestplatinum_cloudbuild/sovereign-vault/knowledge_graph.json
  gcloud storage cp .forge\homeostasis_metrics.json \
    gs://lifequestplatinum_cloudbuild/sovereign-vault/homeostasis_metrics.json
  gcloud storage cp .forge\docs\audit.jsonl \
    gs://lifequestplatinum_cloudbuild/sovereign-vault/audit.jsonl
  Verify: gcloud storage ls gs://lifequestplatinum_cloudbuild/sovereign-vault/
  Expected: 4 files listed

STEP 6.2 -- Enable Cloud Run APIs
  gcloud services enable run.googleapis.com
  gcloud services enable cloudbuild.googleapis.com

STEP 6.3 -- Deploy to Cloud Run
  cd D:\03_WORK_PROJECTS\system_rebuild
  gcloud run deploy sovereign-visual-cortex \
    --source . \
    --region europe-west1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars GCP_PROJECT_ID=lifequestplatinum
  Save the public URL printed at end of deploy.
  Format: https://sovereign-visual-cortex-xxxx-ew.a.run.app

STEP 6.4 -- Verify live deployment
  Open URL in browser
  Open URL on phone
  Confirm 3D manifold renders
  Confirm metacognitive panel opens
  Take screenshot -- this is the Kaggle cover image

STEP 6.5 -- Submit to Kaggle
  Navigate to: kaggle.com/competitions/kaggle-measuring-agi
  Click: New Writeup
  Track: Metacognition
  Paste: docs\outputs\kaggle_writeup_FINAL.md
  Project link: Kaggle benchmark URL
  Cover image: Cloud Run dashboard screenshot
  Click: Submit
  Confirm submission received

DELIVERABLES:
  [ ] 4 artifacts in GCS vault
  [ ] Cloud Run URL live and public
  [ ] Dashboard renders on phone
  [ ] Kaggle writeup submitted
  [ ] Submission confirmation received

OUTCOME: Live deployed product. Competition submitted.

==============================================
STAGE 7 -- MONITORING AND ITERATION
Target: Continuously improving system
Time: Ongoing post April 16
==============================================

STEP 7.1 -- Instrument monitoring (Horizon 1)
  Wire kaggle-sync.js to poll Kaggle leaderboard
  Auto-update .forge\state.json with HD scores
  Push state to GCS after each update
  Deploy Looker Studio dashboard connected to GCS

STEP 7.2 -- Expand knowledge graph (Horizon 1)
  Create D:\03_WORK_PROJECTS\system_rebuild\sources\
  Export key NotebookLM sources to that folder:
    Priority: Enterprise Agentic Ecosystems (202 sources)
    Priority: Can a computer simulate a brain (17 sources)
    Priority: Mercury 2 (17 sources)
    Priority: The World Ahead 2026 (70 sources)
  Set DRIVE_FOLDER_ID in tools\ingest_knowledge.py
  Share Drive folder with GCP service account
  Run: python tools\ingest_knowledge.py
  Graph expands from 18 nodes via Fibonacci branching

STEP 7.3 -- Upgrade to v3.3.1 Fibonacci scaling
  Apply schema upgrade to state.json:
    Neuromodulator thresholds: 0.236, 0.382, 0.618, 0.786, 0.800
    ATP backoff sequence: 1, 1, 2, 3, 5, 8, 13 cycles
    Node weight floor: 0.236
  Deploy stress-calibrator.js to tools\
  Test Discord: !calibrate, !stress

STEP 7.4 -- Multi-model election (Horizon 2)
  Run benchmark against all 4 models:
    gemini-2.5-flash
    gemini-2.5-pro
    claude-sonnet-4
    llama-3.1-70b
  Elected model = lowest mean HD
  Wire model election to state.json benchmark.elected_model

STEP 7.5 -- Autoresearch loop (Horizon 3)
  Clone karpathy/autoresearch
  Replace program.md with CONTEXT.md content
  Set metric = mean HD across all tasks
  Let agent run overnight optimizing benchmark
  Gate: operator reviews all proposed task changes
  First autonomously generated task passes gate

DELIVERABLES:
  [ ] Kaggle sync wired to state.json
  [ ] Knowledge graph expanded past 100 nodes
  [ ] v3.3.1 schema deployed
  [ ] Multi-model election running
  [ ] First autonomous task generated and gated

OUTCOME: Continuously evolving, self-improving product.

==============================================
FINAL PRODUCT STATE
==============================================

SHIPPED (April 16):
  Live benchmark on Kaggle -- public, citable, deterministic
  Cloud Run dashboard -- 3D manifold, live HD scores
  GCS vault -- 4 artifacts persisted
  Writeup submitted -- 952 words, 9 sections, clean

IN PROGRESS (Horizon 1-2):
  Fibonacci-scaled knowledge graph (80+ NotebookLM sources)
  Automated Kaggle sync closing HD feedback loop
  Multi-model election system
  Looker Studio monitoring dashboard

VISION (Horizon 3-4):
  OS generates its own benchmark tasks from failures
  Vertex AI migration
  ATP wired to GCP billing circuit breaker
  12-hour autonomous leaderboard updates

==============================================
AGENT EXECUTION INSTRUCTIONS
==============================================

When receiving this prompt as session start:
  1. Read CONTEXT.md, CLAUDE.md, .agent\rules.md
  2. Read .forge\state.json to check current phase
  3. Find the first incomplete checkbox in roadmap
  4. Execute that stage fully before moving to next
  5. After each stage push state.json to GCS vault
  6. Report completion with deliverable checklist
  7. Await operator directive before next stage

Never execute more than one stage per session
without explicit operator approval.
Never skip a stage.
Never modify state.json directly.
Report FATAL_BLOCKER immediately if anything fails.
