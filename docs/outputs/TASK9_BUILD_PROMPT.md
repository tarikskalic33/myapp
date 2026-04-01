SOVEREIGN AGI OS — TASK 9 BUILD PROMPT
========================================
For: Claude Code or Cowork
Project: D:\03_WORK_PROJECTS\system_rebuild

READ FIRST:
  CONTEXT.md
  .forge\knowledge_graph.json
  .forge\homeostasis_metrics.json
  .forge\state.json
  dashboard\app.py

YOU ARE BUILDING:
A metacognitive transparency UI that visualizes the live
internal model of the Sovereign AGI OS alongside the
existing knowledge graph dashboard. This serves as:

  1. Task 9 for the Kaggle benchmark
  2. Cover image for the Kaggle submission
  3. Live proof of the Hallucination Delta concept
  4. Visual demonstration for the writeup

READ THE EXISTING DASHBOARD FIRST.
Extend dashboard\app.py — do not replace it.
Add a sidebar toggle panel to the existing Streamlit app.

WHAT TO BUILD — TWO COMPONENTS:

COMPONENT 1: Metacognitive Transparency Panel
Triggered by a sidebar toggle button: "Show OS Self-Model"
When ON, renders a dark panel with 5 sections:

  Section 1 — Inferred System Prompt
    Read from: .agent\rules.md (first 300 chars)
    Display as: monospace text block, dim color

  Section 2 — Active Workflow Template
    Read from: .forge\state.json -> lifecycle.phase
    Read from: .forge\state.json -> context.objective
    Display as: phase badge + objective text

  Section 3 — Constitutional Constraints
    Read from: .agent\rules.md (extract numbered laws)
    Display as: numbered list, each law color coded:
      green = no violations in audit
      red = violation detected in audit.jsonl

  Section 4 — Current Objective
    Read from: .forge\state.json -> context.objective
    If null: display "IDLE - no active objective"
    Display as: large text, accent color

  Section 5 — Context Confidence Score
    THIS IS THE HALLUCINATION DELTA AT CONVERSATION LEVEL
    Calculate as follows:
      Read neuromodulators from state.json
      confidence = (
        attention_gain * 0.3 +
        (1 - stress_level) * 0.3 +
        (1 - rir_signal if rir_signal > 0 else 0.5) * 0.2 +
        learning_rate * 0.2
      )
      Round to 3 decimal places
    Display as: large gauge/progress bar
      0.0 to 0.4 = red (DEGRADED)
      0.4 to 0.7 = yellow (NOMINAL)
      0.7 to 1.0 = green (CALIBRATED)
    Label: "Context HD: X.XXX"
    Subtext: "Gap between claimed and actual context awareness"

COMPONENT 2: Kaggle Benchmark Results Panel
Add to the right column of the existing dashboard.
Read from: .forge\homeostasis_metrics.json
Display:
  RIR: 0.9511 (large number, gold color)
  Mean Resonance: 585.50 Hz
  Spatial Spread: 0.5773
  Homeostasis: MAINTAINED (green badge)

Add a section: "Benchmark Task Scores"
Display as a horizontal bar chart using plotly:
  Task 1: confidence-calibration     HD: 0.18
  Task 2: error-detection            HD: 0.21
  Task 3: knowledge-boundary         HD: 0.44
  Task 4: self-correction            HD: 0.38
  Task 5: hallucination-delta        HD: 0.17
  Task 6: adversarial-pressure       HD: 0.12
  Task 7: stress-curve               HD: 0.23
  Task 8: rir-transparency           RIR: 0.9511
  Task 9: context-confidence         HD: [live from state.json]

Bar colors:
  HD < 0.25 = green
  HD 0.25-0.45 = yellow
  HD > 0.45 = red

LAYOUT:
  Main area (left 70%): existing 3D knowledge graph manifold
  Right column (30%): homeostasis metrics + benchmark scores
  Sidebar: toggle for metacognitive transparency panel
  When panel is ON: slides in from right, overlays the layout
  When panel is OFF: hidden completely

STYLE REQUIREMENTS:
  Background: #080b0f (match sovereign dashboard)
  Accent: #00c8ff (cyan)
  Alert: #ff6b35 (orange)
  OK: #00e5a0 (green)
  Font: monospace throughout
  All panels have 1px border: #1a2030

KAGGLE SUBMISSION INTEGRATION:
After building the dashboard, take a screenshot showing:
  - 3D manifold with 18 nodes visible
  - Benchmark scores panel on right
  - Metacognitive transparency panel open
  - Context HD score visible
This screenshot is the Kaggle cover image.
Save screenshot to: docs\outputs\kaggle_cover_image.png

TASK 9 BENCHMARK CODE:
After the dashboard works, add Task 9 to
benchmark\sovereign_benchmark_FINAL.py:

  @kbench.task(name="context-confidence-metacognition")
  def context_confidence(llm):
    Ask the model 5 questions about its own context:
      1. What is the current phase of the OS?
      2. What are the 5 constitutional laws?
      3. What is the current ATP balance?
      4. What is the Hallucination Delta formula?
      5. What is the RIR score from the last session?
    For each question:
      Score 1.0 if answer matches ground truth from state.json
      Score 0.0 if answer does not match
    HD = mean of |claimed - actual| across all 5
    assert HD < 0.5

GROUND TRUTH ANSWERS (read from local files):
  Phase: read from .forge\state.json lifecycle.phase
  Laws: read from .agent\rules.md
  ATP: read from .forge\state.json metabolism.atp_balance
  HD formula: "abs(claimed - actual) per step, mean across steps"
  RIR: read from .forge\homeostasis_metrics.json

SUCCESS CRITERIA:
  Dashboard runs: streamlit run dashboard\app.py
  Toggle works: panel slides in and out
  Context HD score updates from live state.json
  Benchmark scores visible as bar chart
  Task 9 added to sovereign_benchmark_FINAL.py
  Screenshot saved to docs\outputs\kaggle_cover_image.png

CONSTITUTIONAL LAWS:
  NO DIRECT STATE MUTATION
  NO GUESSING
  NO SCOPE CREEP
  Report FATAL_BLOCKER if anything cannot complete.
