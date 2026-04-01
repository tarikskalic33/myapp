#!/usr/bin/env python3
"""
demo_seed.py — Seed the SWARM manifold with demonstration triplets
and trigger a dream-state cycle to surface epiphanies.

Usage:
  python demo_seed.py              # seeds localhost:8000
  python demo_seed.py http://...   # seeds any SWARM instance
"""
import sys, time
import httpx

BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:8000"

# 12 triplets forming a knowledge graph around hallucination, metacognition,
# homeostasis, and the Hallucination Delta benchmark concept.
TRIPLETS = [
    ("metacognition",       "monitors",          "hallucination"),
    ("hallucination",       "correlates_with",   "overconfidence"),
    ("homeostasis",         "regulates",         "stress_level"),
    ("stress_level",        "amplifies",         "overconfidence"),
    ("metacognition",       "measures",          "hallucination_delta"),
    ("hallucination_delta", "quantifies",        "epistemic_error"),
    ("epistemic_error",     "degrades",          "homeostasis"),
    ("overconfidence",      "masks",             "epistemic_error"),
    ("SWARM_SELF_AXIOM",    "anchors",           "metacognition"),
    ("SWARM_SELF_AXIOM",    "anchors",           "homeostasis"),
    ("hallucination_delta", "bridges",           "benchmark_score"),
    ("benchmark_score",     "validates",         "SWARM_SELF_AXIOM"),
]

def ingest(subject, relation, obj):
    resp = httpx.post(
        f"{BASE}/ingest",
        json={"subject": subject, "relation": relation, "object": obj, "context": []},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()
    print(f"  INGEST  {subject} —[{relation}]→ {obj}  | edge={data['edge_id']}  total={data['total_hyperedges']}")
    time.sleep(0.08)

def dream():
    resp = httpx.post(f"{BASE}/dream", timeout=30)
    resp.raise_for_status()
    d = resp.json()
    print(f"  DREAM   cycle={d['dream_cycle']} | new_epiphanies={d['new_epiphanies']} | total_epiphanies={d['total_epiphanies']} | total_edges={d['total_hyperedges']}")
    return d

def state():
    resp = httpx.get(f"{BASE}/state", timeout=10)
    resp.raise_for_status()
    return resp.json()

if __name__ == "__main__":
    print(f"[SEED] Target: {BASE}")

    # Verify server is up
    try:
        s = state()
        print(f"[SEED] Server ready — manifold v{s['manifold']['version']}")
    except Exception as e:
        print(f"[SEED] ERROR: Cannot reach {BASE} — {e}")
        sys.exit(1)

    print(f"[SEED] Ingesting {len(TRIPLETS)} triplets...")
    for subj, rel, obj in TRIPLETS:
        ingest(subj, rel, obj)

    print("[SEED] Triggering dream state cycle...")
    result = dream()

    print()
    print("════════════════════════════════════════════════════")
    print(f"  Hyperedges     : {result['total_hyperedges']}")
    print(f"  Epiphanies     : {result['total_epiphanies']}")
    print(f"  Dream cycles   : {result['dream_cycle']}")
    print(f"  Dashboard      : {BASE}/")
    print(f"  State API      : {BASE}/state")
    print(f"  Audit log      : {BASE}/audit?last_n=50")
    print("════════════════════════════════════════════════════")
