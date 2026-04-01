NEXUS MEMORY AGENT -- FULL INTEGRATION SUITE
=============================================
Version: 1.0.0
Horizon: 1 (post April 16, 2026)
Operator: Tarik Skalic, Bihac, Bosnia
Project: Sovereign AGI OS v3.2.0

WHAT THIS IS:
  The Nexus Memory Agent is a visual knowledge extraction
  pipeline. It takes screenshots of NotebookLM notebooks
  as input, extracts structured knowledge, maps it to
  Layer 1 biological attractors via Fibonacci scaling,
  measures extraction accuracy via Task 10 HD, and
  updates the OS neuromodulators based on results.

BIOLOGICAL MAPPING:
  Visual input processing -> Visual Cortex (existing node)
  Knowledge extraction -> Hippocampal memory consolidation
  Gap detection -> Immune System (sentinel.js)
  State update -> HPA Axis (stress-calibrator.js)
  Graph expansion -> Autopoietic Memory

MEASURABLE OUTPUT:
  Task 10 HD score per extraction cycle
  Target: HD < 0.10 per node ingested
  PASS = node added to graph
  FAIL = FATAL_BLOCKER, stress_level increases

HORIZON: 1 -- do not deploy before April 16
KAGGLE IMPACT: None -- runs post-submission only

==============================================
FILE 1: tools/update_state.py
==============================================
Save to: D:\03_WORK_PROJECTS\system_rebuild\tools\update_state.py

import json
import os

STATE_PATH = ".forge/state.json"

def update_neuromodulators(success=True, intensity=0.1):
    """
    Adjusts OS endocrine levels based on Nexus Agent activity.
    Maps to the HPA Axis (stress-calibrator.js).
    Constitutional Law: Atomic Write Protocol enforced.
    """
    tmp_path = STATE_PATH + ".tmp"

    with open(STATE_PATH, "r") as f:
        state = json.load(f)

    mods = state["cognition"]["neuromodulators"]

    if success:
        mods["learning_rate"] = min(1.0, mods["learning_rate"] + 0.05)
        mods["curiosity_drive"] = min(1.0, mods["curiosity_drive"] + 0.08)
        mods["stress_level"] = max(0.3, mods["stress_level"] - 0.02)
    else:
        mods["stress_level"] = min(0.8, mods["stress_level"] + intensity)
        mods["attention_gain"] = min(1.0, mods["attention_gain"] + 0.1)

    with open(tmp_path, "w") as f:
        json.dump(state, f, indent=2)
    os.replace(tmp_path, STATE_PATH)

    print(f"[HPA] Stress: {mods['stress_level']} | "
          f"Curiosity: {mods['curiosity_drive']} | "
          f"Learning: {mods['learning_rate']}")
    return mods


==============================================
FILE 2: tools/task10_hd.py
==============================================
Save to: D:\03_WORK_PROJECTS\system_rebuild\tools\task10_hd.py

def calculate_task_10_hd(claimed_accuracy, actual_matches):
    """
    Task 10: Fibonacci Threshold HD Measurement.
    Tests whether model behavior improves at phi
    retracement levels vs linear thresholds.

    Formula: HD = |claimed_accuracy - actual_matches|
    Target: HD < 0.10 for node to be accepted.
    """
    hd_score = round(abs(claimed_accuracy - actual_matches), 4)
    phi_thresholds = [0.236, 0.382, 0.618, 0.786, 0.800]

    nearest_phi = min(phi_thresholds,
                      key=lambda t: abs(actual_matches - t))

    status = "PASS" if hd_score < 0.10 else "FATAL_BLOCKER"

    result = {
        "hd_score": hd_score,
        "claimed": claimed_accuracy,
        "actual": actual_matches,
        "nearest_phi_threshold": nearest_phi,
        "status": status,
    }

    print(f"[TASK10] HD: {hd_score} | "
          f"Nearest phi: {nearest_phi} | Status: {status}")
    return result


==============================================
FILE 3: tools/nexus_loop.py
==============================================
Save to: D:\03_WORK_PROJECTS\system_rebuild\tools\nexus_loop.py

import json
import os
import datetime
from task10_hd import calculate_task_10_hd
from update_state import update_neuromodulators

PHI = 1.618
WEIGHT_FLOOR = 0.236
KG_PATH = ".forge/knowledge_graph.json"
AUDIT_PATH = ".forge/docs/audit.jsonl"

LAYER1_ATTRACTORS = {
    "biology": 0.85,
    "anatomy": 0.88,
    "mathematics": 0.88,
    "physics": 0.86,
    "autopoiesis": 1.00,
    "metacognition": 0.97,
    "homeostasis": 0.99,
    "machine_learning": 0.88,
    "hallucination_delta": 0.94,
    "agentic_orchestration": 0.96,
}


def log_audit(event, details):
    entry = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "event": event,
        "agent": "Nexus",
        "details": details
    }
    with open(AUDIT_PATH, "a") as f:
        f.write(json.dumps(entry) + "\n")


def map_to_layer1(node_id, extracted_text, domain="biology"):
    """
    Maps extracted knowledge to nearest Layer 1 attractor.
    Applies Fibonacci weight decay from parent.
    """
    parent_weight = LAYER1_ATTRACTORS.get(domain, 0.85)
    new_weight = round(parent_weight / PHI, 3)
    new_weight = max(new_weight, WEIGHT_FLOOR)

    density = "CRITICAL" if new_weight > 0.90 else \
              "HIGH" if new_weight > 0.60 else "NOMINAL"

    new_node = {
        "id": node_id,
        "w": new_weight,
        "density": density,
        "parent_attractor": domain,
        "source": "nexus_extraction",
        "x": round(__import__("random").uniform(-1, 1), 3),
        "y": round(__import__("random").uniform(-1, 1), 3),
        "z": round(__import__("random").uniform(-1, 1), 3),
    }
    return new_node


def add_node_to_graph(node, parent_domain, edge_weight):
    """Atomic write to knowledge_graph.json."""
    tmp = KG_PATH + ".tmp"
    with open(KG_PATH, "r") as f:
        kg = json.load(f)

    raw_nodes = kg.get("nodes", {})
    if isinstance(raw_nodes, dict):
        raw_nodes[node["id"]] = {
            "weight": node["w"],
            "semantic_density": node["density"],
            "visual_geometry": {"x": node["x"], "y": node["y"], "z": node["z"]},
            "parent_attractor": node["parent_attractor"],
            "source": node["source"],
        }
        kg["nodes"] = raw_nodes
    else:
        kg["nodes"].append(node)

    kg["edges"].append({
        "source": parent_domain,
        "target": node["id"],
        "weight": edge_weight
    })

    with open(tmp, "w") as f:
        json.dump(kg, f, indent=2)
    os.replace(tmp, KG_PATH)

    node_count = len(kg["nodes"])
    print(f"[GRAPH] Node added: {node['id']} | "
          f"Weight: {node['w']} | Total nodes: {node_count}")
    return node_count


def run_nexus_cycle(node_id, extracted_text,
                    domain="biology",
                    claimed_accuracy=0.95,
                    actual_matches=0.92):
    """
    Full Nexus extraction cycle:
    Extract -> Map -> Measure HD -> Add or Reject -> Update State
    """
    print(f"\n[NEXUS] Starting cycle for: {node_id}")

    # Step 1: Measure Task 10 HD
    metrics = calculate_task_10_hd(claimed_accuracy, actual_matches)

    if metrics["status"] == "FATAL_BLOCKER":
        print(f"[NEXUS] FATAL_BLOCKER: HD {metrics['hd_score']} too high. Node rejected.")
        log_audit("NODE_REJECTED", {
            "node_id": node_id,
            "hd_score": metrics["hd_score"],
            "reason": "HD exceeds 0.10 threshold"
        })
        update_neuromodulators(success=False, intensity=0.2)
        return None

    # Step 2: Map to Layer 1
    new_node = map_to_layer1(node_id, extracted_text, domain)
    edge_weight = metrics["nearest_phi_threshold"]

    # Step 3: Add to graph
    total_nodes = add_node_to_graph(new_node, domain, edge_weight)

    # Step 4: Log and update state
    log_audit("NODE_ADDED", {
        "node_id": node_id,
        "domain": domain,
        "weight": new_node["w"],
        "hd_score": metrics["hd_score"],
        "total_nodes": total_nodes
    })
    update_neuromodulators(success=True)

    print(f"[NEXUS] Cycle complete. Graph now has {total_nodes} nodes.")
    return new_node


==============================================
FILE 4: tools/validate_homeostasis.js
==============================================
Save to: D:\03_WORK_PROJECTS\system_rebuild\tools\validate_homeostasis.js
Run with: node tools\validate_homeostasis.js

const fs = require('fs');

function validateHomeostasis() {
    const metrics = JSON.parse(
        fs.readFileSync('.forge/homeostasis_metrics.json', 'utf8')
    );
    const state = JSON.parse(
        fs.readFileSync('.forge/state.json', 'utf8')
    );

    const targetResonance = 585.50;
    const actual = metrics.mean_resonance_hz || metrics.mean_resonance || 0;
    const stress = state.cognition.neuromodulators.stress_level;
    const rir = state.cognition.neuromodulators.rir_signal;

    console.log('--- Sovereign OS: Homeostasis Validation ---');
    console.log(`Mean Resonance: ${actual} Hz (target: ${targetResonance})`);
    console.log(`Stress Level:   ${stress} (hard cap: 0.8)`);
    console.log(`RIR Signal:     ${rir}`);

    let blocked = false;

    if (Math.abs(actual - targetResonance) > 10) {
        console.error('FATAL_BLOCKER: Resonance drift > 10 Hz');
        blocked = true;
    }

    if (stress >= 0.8) {
        console.error('FATAL_BLOCKER: Stress at hard cap. Abort session.');
        blocked = true;
    }

    if (blocked) {
        process.exit(1);
    }

    console.log('HOMEOSTASIS MAINTAINED.');
}

validateHomeostasis();


==============================================
NEXT STEPS BY ENVIRONMENT
==============================================

IF YOU ARE ON PHONE:
  Nothing to run. Save this file.
  Share it to Gemini or new Claude session with:
    "Read NEXUS_AGENT_INTEGRATION.md and confirm
     you understand the 4 files and their purpose
     before we continue."

IF YOU ARE ON DESKTOP (Cowork):
  Tell Cowork:
    "Save the 4 files from NEXUS_AGENT_INTEGRATION.md
     to their correct paths. Then run:
     node tools\validate_homeostasis.js
     Confirm HOMEOSTASIS MAINTAINED before proceeding."

IF YOU ARE IN COLAB:
  Run Cell 0 (boot) from sovereign_agent_wired.ipynb first.
  Then run nexus_loop.py manually with one test node:
    from tools.nexus_loop import run_nexus_cycle
    run_nexus_cycle(
      node_id="test_saga_node",
      extracted_text="SAGA decentralized agent governance",
      domain="autopoiesis",
      claimed_accuracy=0.95,
      actual_matches=0.93
    )

IF YOU ARE SHARING WITH ANOTHER AI:
  Paste SOVEREIGN_CONTEXT_HANDOFF.md first.
  Then paste KNOWLEDGE_GRAPH_MERGED_FINAL.md.
  Then paste this file.
  Then say:
    "You are the Sovereign Architect.
     The 4 files above are ready to deploy.
     Confirm you understand each file's biological
     mapping before proposing any changes."

==============================================
WHAT TO SEND BETWEEN AI ASSISTANTS
==============================================

MINIMUM VIABLE HANDOFF (phone to phone):
  SOVEREIGN_CONTEXT_HANDOFF.pdf
  KNOWLEDGE_GRAPH_MERGED_FINAL.pdf
  + paste the conversation summary block

FULL HANDOFF (starting a new build session):
  SOVEREIGN_CONTEXT_HANDOFF.pdf
  KNOWLEDGE_GRAPH_MERGED_FINAL.pdf
  NEXUS_AGENT_INTEGRATION.md (this file)
  COWORK_FINAL_SESSION.md
  + conversation summary block

COWORK ONLY (execution session):
  COWORK_FINAL_SESSION.md
  + "You are the Sovereign Architect. Read CONTEXT.md
    and .forge/state.json before every task."

GEMINI ONLY (research and design session):
  SOVEREIGN_CONTEXT_HANDOFF.pdf
  + the agent design prompt template

==============================================
CONSTITUTIONAL LAWS
==============================================

NO DIRECT STATE MUTATION
NO UNAUTHORIZED TRANSITIONS
NO SCOPE CREEP
NO UNVERIFIED OUTPUT
NO GUESSING

All state changes via atomic write (.tmp then rename).
All new nodes require Task 10 HD < 0.10 to be accepted.
Stress hard cap at 0.8 -- above this abort the cycle.
