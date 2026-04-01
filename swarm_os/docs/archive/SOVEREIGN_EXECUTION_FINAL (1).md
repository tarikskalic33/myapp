SOVEREIGN AGI OS -- ZERO MANUAL WORK EXECUTION GUIDE
======================================================
Operator: Tarik Skalic | Deadline: April 16, 2026
Every command is copy-paste ready. Run in order.
Do not skip. Do not modify.

==============================================
PHASE 0 -- BEFORE YOU START (30 seconds)
==============================================

Open PowerShell as Administrator.
Navigate to project root:

cd D:\03_WORK_PROJECTS\system_rebuild

Verify you are in the right place:

dir CONTEXT.md

If CONTEXT.md is listed you are in the right place.
If not: cd D:\03_WORK_PROJECTS\system_rebuild

==============================================
PHASE 1 -- FIX DASHBOARD (2 minutes)
==============================================

Copy final dashboard to correct location:

copy "docs\outputs\dashboard_app_FINAL.py" "dashboard\app.py"

Install dependencies:

pip install streamlit plotly pandas numpy

Run dashboard:

streamlit run dashboard\app.py

Open browser at http://localhost:8501
Open the sidebar Self-Model panel.
Take a fullscreen screenshot.
Save it as:

docs\outputs\kaggle_cover_image.png

Close the streamlit server with Ctrl+C when done.

==============================================
PHASE 2 -- UPDATE STATE WITH BENCHMARK RESULTS (1 minute)
==============================================

Run this Python one-liner to update state atomically:

python -c "
import json, os
with open('.forge/state.json') as f:
    s = json.load(f)
s.setdefault('benchmark', {})
s['benchmark']['last_hd_score'] = 0.2074
s['benchmark']['last_rir_score'] = 0.9511
s['benchmark']['tasks_completed'] = 9
s['benchmark']['elected_model'] = 'kimi-k2-instruct'
s['lifecycle']['phase'] = 'ACTIVE'
s['metabolism']['atp_balance'] = 2100
s['cognition']['neuromodulators']['rir_signal'] = 0.9511
with open('.forge/state.tmp.json', 'w') as f:
    json.dump(s, f, indent=2)
os.replace('.forge/state.tmp.json', '.forge/state.json')
print('State updated.')
"

==============================================
PHASE 3 -- ADD LAYER 2 KNOWLEDGE NODES (2 minutes)
==============================================

Run this to add verified Layer 2 nodes to knowledge graph:

python -c "
import json, os, random

KG = '.forge/knowledge_graph.json'
with open(KG) as f:
    kg = json.load(f)

nodes = kg.get('nodes', {})
edges = kg.get('edges', [])

new_nodes = {
    'anatomy':           {'weight': 0.88, 'semantic_density': 'HIGH'},
    'mathematics':       {'weight': 0.88, 'semantic_density': 'HIGH'},
    'biology':           {'weight': 0.85, 'semantic_density': 'HIGH'},
    'physics':           {'weight': 0.86, 'semantic_density': 'HIGH'},
    'hallucination_delta_measurement': {'weight': 0.600, 'semantic_density': 'HIGH'},
    'saga_protocol':     {'weight': 0.618, 'semantic_density': 'HIGH'},
    'spsf_persistence':  {'weight': 0.525, 'semantic_density': 'HIGH'},
    'nhi_v2_identity':   {'weight': 0.507, 'semantic_density': 'NOMINAL'},
    'stress_calibration':{'weight': 0.612, 'semantic_density': 'HIGH'},
    'fibonacci_scaling': {'weight': 0.544, 'semantic_density': 'HIGH'},
    'reasoning_intensity_ratio': {'weight': 0.618, 'semantic_density': 'HIGH'},
    'constitutional_governance': {'weight': 0.593, 'semantic_density': 'HIGH'},
    'agentic_leap_2026': {'weight': 0.593, 'semantic_density': 'HIGH'},
    'adversarial_calibration': {'weight': 0.581, 'semantic_density': 'HIGH'},
}

new_edges = [
    {'source': 'metacognition', 'target': 'hallucination_delta_measurement', 'weight': 0.786},
    {'source': 'autopoiesis', 'target': 'saga_protocol', 'weight': 0.652},
    {'source': 'anatomy', 'target': 'spsf_persistence', 'weight': 0.685},
    {'source': 'biology', 'target': 'nhi_v2_identity', 'weight': 0.429},
    {'source': 'homeostasis', 'target': 'stress_calibration', 'weight': 0.786},
    {'source': 'mathematics', 'target': 'fibonacci_scaling', 'weight': 0.786},
    {'source': 'autopoiesis', 'target': 'reasoning_intensity_ratio', 'weight': 0.618},
    {'source': 'agentic_orchestration', 'target': 'constitutional_governance', 'weight': 0.786},
    {'source': 'agentic_orchestration', 'target': 'agentic_leap_2026', 'weight': 0.618},
    {'source': 'hallucination_delta', 'target': 'adversarial_calibration', 'weight': 0.786},
]

for nid, ndata in new_nodes.items():
    if nid not in nodes:
        nodes[nid] = {
            **ndata,
            'audio_resonance': '585.50 Hz',
            'visual_geometry': {
                'x': round(random.uniform(-1,1),3),
                'y': round(random.uniform(-1,1),3),
                'z': round(random.uniform(-1,1),3)
            }
        }

for e in new_edges:
    exists = any(x.get('source')==e['source'] and x.get('target')==e['target'] for x in edges)
    if not exists:
        edges.append(e)

kg['nodes'] = nodes
kg['edges'] = edges

with open(KG + '.tmp', 'w') as f:
    json.dump(kg, f, indent=2)
os.replace(KG + '.tmp', KG)

print(f'Graph updated: {len(nodes)} nodes, {len(edges)} edges')
"

==============================================
PHASE 4 -- PUSH TO GCS VAULT (1 minute)
==============================================

$PROJECT_ID = "lifequestplatinum"
$BUCKET = "lifequestplatinum_cloudbuild"
$VAULT = "sovereign-vault"

gcloud config set project $PROJECT_ID

gsutil cp .forge\state.json gs://$BUCKET/$VAULT/state.json
gsutil cp .forge\knowledge_graph.json gs://$BUCKET/$VAULT/knowledge_graph.json
gsutil cp .forge\homeostasis_metrics.json gs://$BUCKET/$VAULT/homeostasis_metrics.json
gsutil cp .forge\docs\audit.jsonl gs://$BUCKET/$VAULT/audit.jsonl

Verify:

gsutil ls gs://lifequestplatinum_cloudbuild/sovereign-vault/

Expected: 4 files listed.

==============================================
PHASE 5 -- CLOUD RUN DEPLOY (5 minutes)
==============================================

gcloud run deploy sovereign-visual-cortex `
    --source . `
    --region europe-west1 `
    --port 8080 `
    --allow-unauthenticated `
    --project lifequestplatinum

Wait for deploy to complete.
Copy the Service URL printed at the end.
Format: https://sovereign-visual-cortex-xxxx-ew.a.run.app

Open the URL in browser.
Open the sidebar Self-Model panel.
Take a screenshot -- this is the production cover image.
Save as: docs\outputs\kaggle_cover_image_cloudrun.png

==============================================
PHASE 6 -- KAGGLE SUBMISSION (5 minutes)
==============================================

1. Go to: https://www.kaggle.com/competitions/kaggle-measuring-agi
2. Click: New Writeup
3. Track: Metacognition
4. Title: The Hallucination Delta: A Biologically Grounded Framework for Metacognitive Accuracy
5. Paste: contents of docs\outputs\kaggle_writeup_FINAL.md
6. Project link: your Kaggle benchmark URL
7. Cover image: docs\outputs\kaggle_cover_image_cloudrun.png
8. Click: Submit

==============================================
PHASE 7 -- MULTI-MODEL BENCHMARK (background)
==============================================

Run while doing other things. No action needed after start.

python benchmark\multi_model_runner.py

Results saved to: docs\outputs\multi_model_HD_comparison.md
Runs against: deepseek-v3.2, nemotron-ultra-253b, devstral-2

==============================================
PHASE 8 -- POST SUBMISSION KNOWLEDGE INGESTION
==============================================

Run after April 16 only. Gets Drive folder IDs first.

Step 1: Find Drive folder IDs
  Open Google Drive
  Navigate to each research folder
  Copy ID from URL: drive.google.com/drive/folders/[THIS_PART]
  Folders to find: SAGA, SPSF, NHI, Agentic Leap 2026

Step 2: Update ingest_knowledge.py
  Open tools\ingest_knowledge.py
  Set DRIVE_FOLDER_ID = "[paste folder id here]"

Step 3: Share folders with GCP service account
  Find service account email in:
  https://console.cloud.google.com/iam-admin/serviceaccounts?project=lifequestplatinum
  Share each Drive folder with that email as Viewer.

Step 4: Run ingestion
  python tools\ingest_knowledge.py

Expected: 32+ nodes -> 100+ nodes after ingestion.

==============================================
PHASE 9 -- OS EVOLUTION (Horizon 1, post April 16)
==============================================

Download priority Kaggle datasets:

mkdir sources
cd sources
kaggle datasets download -d truthful-qa-benchmark
kaggle datasets download -d llm-hallucination-detection
kaggle datasets download -d human-stress-detection
kaggle datasets download -d chain-of-thought-traces
kaggle datasets download -d adversarial-nlp-dataset
cd ..

Then run ingestion again:

python tools\ingest_knowledge.py

Run Nexus agent test cycle:

python -c "
import sys
sys.path.insert(0, 'tools')
from nexus_loop import run_nexus_cycle
run_nexus_cycle(
    node_id='saga_governance_test',
    extracted_text='SAGA decentralized agent governance peer handshake',
    domain='autopoiesis',
    claimed_accuracy=0.95,
    actual_matches=0.93
)
"

Validate homeostasis after expansion:

node tools\validate_homeostasis.js

==============================================
SUCCESS CRITERIA
==============================================

Kaggle submission confirmed: userHasEntered True
Cloud Run URL live and publicly accessible
Knowledge graph: 32+ nodes
state.json: phase ACTIVE, benchmark scores present
GCS vault: 4 artifacts confirmed
Multi-model comparison report: written
Homeostasis: MAINTAINED

==============================================
FREE TIER LIMITS TO WATCH
==============================================

GCS: 5GB free -- your 4 files are under 1MB total. Safe.
Cloud Run: 2M requests/month free -- dashboard only. Safe.
NVIDIA NIM: free tier has rate limits -- if multi_model_runner
  hits limits, add time.sleep(2) between model calls.
Kaggle: unlimited datasets download with API key. Safe.
GCP Cloud Build: 120 build-minutes/day free -- deploy uses
  about 5 minutes. Safe for multiple deploys.
