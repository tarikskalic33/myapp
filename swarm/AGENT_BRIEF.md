# S.W.A.R.M. OS v6.0 — Agent Brief

**Sovereign Web Architecture for Relational Memory**
GCP project: `lifequestplatinum` | Region: `europe-west1` | Service: `swarm-manifold`

---

## What this system is

A self-organizing knowledge hypergraph with four live mechanisms:

| Mechanism | Description |
|---|---|
| **DREAM STATE** | NetworkX A² matrix scan every 45 s — finds hidden 2-hop paths. When A²[i,j] > 0.5 and A[i,j] == 0, fires an EPIPHANY and promotes both nodes up the frequency hierarchy. |
| **PHOTONIC RESONANCE** | FFT phase signature per concept. Retrieval = constructive interference, not cosine distance. |
| **QUANTUM TEMPORAL PHASE** | Time encoded as Ψ(t) = Ψ(0)·e^(−iωt). Conflicting states coexist at different phases — no overwrite, no catastrophic forgetting. |
| **OBSERVER EFFECT** | Every recall mutates the concept's phase by η·resonance (η=0.005). Querying the graph changes it. |

---

## Frequency hierarchy (z-levels)

| z | Name | Hz | Meaning |
|---|---|---|---|
| 4 | SOVEREIGN_EGO | 523.26 | Ego node (SWARM_SELF_AXIOM) — identity anchor |
| 3 | VECTOR_RESOLUTION | 415.05 | Verified, semantically aligned |
| 2 | EQUILIBRATION | 329.65 | Working short-term memory |
| 1 | RADIATION | 293.60 | Decaying hypotheses (high hallucination delta) |
| 0 | INERTIA | 261.63 | New unverified concepts |

Higher z = lower hallucination delta. The frequency level IS a continuous HD score per node.

---

## File map

```
swarm/
├── swarm_core.py      Core engine: PhotonicResolver, QuantumManifold, audit
├── server.py          FastAPI server (port 8000)
├── forager.py         Autonomous Gemini agent (requires GEMINI_API_KEY)
├── config.py          Constants: PORT, HOST, MAX_EVENTS, GEMINI_MODEL
├── index.html         Quantum singularity canvas dashboard (WebSocket)
├── demo_seed.py       Seeds 12 triplets + triggers dream (no API key needed)
├── start.sh           One-command local startup (installs deps, starts server, seeds)
├── deploy.sh          Cloud Run deployment to europe-west1
├── Dockerfile         python:3.12-slim, port 8080
├── requirements.txt   All Python dependencies
└── .forge/
    └── swarm_audit.jsonl   Append-only event log (71 entries as of session 2)
```

---

## API reference

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/` | — | `index.html` dashboard |
| GET | `/state` | — | Full snapshot: events, epiphanies, agents, manifold stats |
| POST | `/ingest` | `{subject, relation, object, context[]}` | `{ok, edge_id, total_hyperedges}` |
| POST | `/dream` | — | `{ok, dream_cycle, new_epiphanies, total_epiphanies, total_hyperedges}` |
| POST | `/event` | `{agent_id, type, content, cycle}` | `{ok, id}` |
| GET | `/audit` | `?last_n=N` | `{entries[], count}` |
| WS | `/ws` | — | Broadcasts all events in real time |

---

## Quick start (local, no GCP)

```bash
# One command:
bash start.sh

# Or manually:
pip install -r requirements.txt
python server.py &
python demo_seed.py
# Open http://localhost:8000
```

---

## Quick start (Cloud Run)

Requires: `gcloud` authenticated to `lifequestplatinum`, `GEMINI_API_KEY` in Secret Manager.

```bash
bash deploy.sh
# Expected URL: https://swarm-manifold-[hash].europe-west1.run.app
```

---

## Seeding via curl

```bash
# Ingest a triplet
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"subject":"metacognition","relation":"monitors","object":"hallucination","context":[]}'

# Trigger dream state
curl -X POST http://localhost:8000/dream

# Read audit log
curl http://localhost:8000/audit?last_n=20
```

---

## Audit log event types

`RESOLVER_INIT` `EGO_INIT` `RESOLVE_NEW` `RESOLVE_HIT` `INGEST`
`OBSERVER_EFFECT` `EPIPHANY` `SYNTROPY_PROMOTION` `DREAM_START`
`DREAM_COMPLETE` `DREAM_SKIPPED`

All events are append-only JSONL at `.forge/swarm_audit.jsonl`.

---

## Connection to Sovereign AGI OS

- Sovereign OS Cloud Run: `https://sovereign-visual-cortex-1086669432559.europe-west1.run.app`
- SWARM is the knowledge layer for Sovereign OS v4.0 (integration post April 17, 2026)
- Benchmark: 9 ARC tasks, mean HD = 0.2074, model: kimi-k2-instruct via NVIDIA NIM
- The frequency hierarchy maps directly to the Hallucination Delta score per concept

---

## Constitutional laws

1. No direct state mutation — all writes via `QuantumManifold.ingest()`
2. No unauthorized transitions
3. No scope creep
4. No unverified output
5. No guessing

Violations trigger `FATAL_BLOCKER` in audit log.

---

*Last updated: 2026-04-01 | Branch: main | Commit: dfe37b2*
