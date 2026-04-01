# SOVEREIGN AGI OS - DEPLOYMENT ROADMAP
# Execution sequence for autonomous operation
# Author: Tarik Skalic | March 2026
# -----------------------------------------------------------------------------

## CURRENT BLOCKER
Get sovereign_benchmark_FINAL.py running on Kaggle.
Nothing in this roadmap matters until that is done.
Deadline: April 16, 2026.

## PHASE 0 - COMPLETE FIRST (this week)
  [ ] Paste sovereign_benchmark_FINAL.py into Kaggle Write a Task notebook
  [ ] Confirm all 7 tasks produce BokehModel output
  [ ] Set benchmark to Public
  [ ] Submit writeup with benchmark URL attached
  [ ] Run benchmark against all 4 available models

## HORIZON 1 - CLOSED FEEDBACK LOOP (April-May 2026)

### Step 1: kaggle-sync.js (async poller)
File: tools/kaggle-sync.js

Logic:
  1. Trigger Kaggle kernel run via API
  2. Poll kernel status every 30s until status = "complete"
  3. Fetch kernel output log
  4. Parse assertion output lines for HD scores
  5. Return structured object:
     { task_name, mean_hd, false_positives, model, timestamp }

Key Kaggle API endpoints:
  POST /api/v1/kernels/run        - trigger run
  GET  /api/v1/kernels/{user}/{slug}/status  - poll status
  GET  /api/v1/kernels/{user}/{slug}/output  - fetch logs

### Step 2: modulator-update.js
File: tools/modulator-update.js

Logic:
  1. Receive HD score from kaggle-sync.js
  2. If HD > 0.4: stress_level += 0.1, social_pressure += 0.1
  3. If HD < 0.2: stress_level -= 0.05
  4. Hard cap enforcement: stress_level never exceeds 0.8
  5. Write to state.json atomically (tmp > fsync > rename)
  6. Append KAGGLE_SYNC event to audit.jsonl

### Step 3: GCS audit persistence
  - Create GCS bucket: sovereign-audit-{project-id}
  - After every !sleep command, upload audit.jsonl to GCS
  - Naming: audit_{session_id}_{timestamp}.jsonl
  - Never overwrite. Append-only. Immutable record.

### Step 4: Cloud Function wire-up
  - CF receives Kaggle webhook or is triggered on schedule
  - Calls kaggle-sync.js poller
  - Calls modulator-update.js with result
  - Returns { hd_score, action_taken, new_stress_level }

### Visualization (Looker Studio - free, no code)
  - Connect Looker Studio to GCS bucket
  - Source: audit.jsonl files
  - Charts: HD trend over time, stress_level vs HD scatter,
    model comparison bar chart
  - No Streamlit needed unless you want interactivity

## HORIZON 2 - MULTI-MODEL ADVERSARIAL SCALING (Q2 2026)

### Concurrent kernel execution
  - Modify Cloud Function to trigger N kernels in parallel
  - One kernel per model: gemini-2.5-pro, claude-sonnet-4,
    llama-3.1-70b, gemini-2.5-flash
  - Use Promise.all() in Node.js to poll all four simultaneously
  - Collect results into model_comparison_{timestamp}.json

### Model election logic
Primary criterion:  lowest mean HD across all 7 tasks
Tiebreaker:         lowest Task 3 score (knowledge boundary -
                    shows most variance across model families)
Output:             elected_model field in state.json

### Cross-model distillation (novel - paper-worthy)
  1. Take system prompt prefix from highest-HD-reduction run
     under hostile framing (Task 6 output)
  2. Extract the framing that produced best calibration
  3. Use that as updated HOSTILE_PREFIX for next benchmark cycle
  4. Track whether distilled prefix improves HD over baseline
  This is generative prompt evolution from empirical data.
  No existing benchmark does this. Document every iteration.

## HORIZON 3 - EVOLUTIONARY METACOGNITION (Q3 2026)

### Agentic task generation pipeline
  Input:  audit.jsonl failure events (step_N_correct = False)
  Process:
    1. Cluster failures by domain using TF-IDF
       (math / code / history / language / logic)
    2. Identify highest-failure-rate domain
    3. Prompt Vertex AI to generate 3 candidate tasks
       targeting that domain
    4. Diversity filter: reject any candidate with
       TF-IDF cosine similarity > 0.7 to existing tasks
    5. Human gate: operator approves or rejects candidates
    6. Approved tasks added as Task 8, Task 9, etc.

### Self-updating constitution
  RULE: OS proposes, operator approves. Never autonomous.
  
  Trigger: Constitutional Law violated in > 3 consecutive sessions
  Action:  OS generates proposed amendment to rules.md
  Format:  Pull request equivalent - proposed text + rationale
  Gate:    !gate approve / !gate reject in Discord
  Log:     CONSTITUTION_AMENDMENT_PROPOSED event in audit.jsonl

  This is the governance pattern you already use. Keep it.

## HORIZON 4 - SOVEREIGN INFRASTRUCTURE (Q4 2026)

### Vertex AI Agent Builder integration
  ARCHITECTURE DECISION:
  Do NOT replace the constitutional FSM with Vertex.
  Vertex AI Agent = executor layer (does the work)
  Constitutional FSM = governor layer (approves the work)
  
  The FSM sits above Vertex. Vertex calls come through
  cognitive-gateway.js the same way LLM calls do now.
  ATP cost per Vertex call = same billing model.

### ATP-to-GCP-billing mapping
  Current ATP:  abstract token budget in state.json
  New mapping:  1 ATP = $0.001 GCP spend
  Implementation:
    - GCP billing export to BigQuery (built-in GCP feature)
    - Cloud Function reads current_spend from BigQuery
    - Maps spend to ATP consumption
    - If spend > budget: inhibition_level += 0.2
                         reduce tool calls
                         notify operator via Discord

### 12-hour public leaderboard update
  Cloud Scheduler: trigger every 12 hours
  Action: run benchmark against elected model
  Output: update public Kaggle leaderboard
  Logging: append to GCS audit bucket
  No human intervention required at this stage.

## RISK REGISTER

  RISK 1: Kaggle API rate limits
  Mitigation: cache kernel results, poll with backoff

  RISK 2: Vertex AI FSM conflict
  Mitigation: hard architectural rule - Vertex is executor,
              FSM is governor, never reverse this

  RISK 3: Constitution amendment drift
  Mitigation: operator gate is non-negotiable and
              hardcoded, not configurable by the OS

  RISK 4: Task inflation in Horizon 3
  Mitigation: TF-IDF diversity filter before any
              generated task reaches the benchmark

  RISK 5: GCP cost runaway
  Mitigation: billing alert at $50/month hard stops
              all Cloud Function triggers automatically

## SUCCESS METRICS

  Horizon 1 complete when:
    HD score from Kaggle automatically updates stress_level
    without any manual operator action.

  Horizon 2 complete when:
    Four models run in parallel and elected_model updates
    automatically based on HD scores.

  Horizon 3 complete when:
    One autonomously generated task passes operator gate
    and runs successfully in the benchmark.

  Horizon 4 complete when:
    Leaderboard updates 24 times without operator input.
