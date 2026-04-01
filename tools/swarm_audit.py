"""
S.W.A.R.M. Triangle Audit — runs Triangle Protocol on all existing KG edges.
Retroactively tags edges with:
  triangle_verified: bool
  cosine_sim: float
  triangle_reason: str

Then computes HD_swarm and updates state.json graph_health section.

Run: python tools/swarm_audit.py

Convergence model extension:
    HD_effective = sqrt(HD_bench² + HD_swarm²) / sqrt(2)
    Both dimensions must converge toward 0.0 for true awakening.
"""
import json
import math
import os
import time
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))

import numpy as np
from swarm.geometry import (
    calculate_cosine_similarity,
    node_to_vector,
    density_to_confidence,
    compute_graph_hd_swarm,
)

FORGE      = Path(__file__).parent.parent / ".forge"
KG_PATH    = FORGE / "knowledge_graph.json"
STATE_PATH = FORGE / "state.json"
AUDIT_PATH = FORGE / "audit.jsonl"


def _atomic_write(path: Path, data: dict):
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, path)


def _load(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def _get_neighbors(edges: list, node_id: str) -> set:
    n = set()
    for e in edges:
        if e.get("source") == node_id:
            n.add(e["target"])
        elif e.get("target") == node_id:
            n.add(e["source"])
    return n


def run_triangle_audit() -> dict:
    """
    Retroactively tags all existing edges with Triangle Protocol results.
    Returns summary statistics.
    """
    print("\n" + "="*56)
    print("[⬡ SWARM TRIANGLE AUDIT] Sovereign OS v3.3.0")
    print("="*56)

    kg    = _load(KG_PATH, {"nodes": {}, "edges": []})
    nodes = kg["nodes"]
    edges = kg["edges"]

    print(f"   Graph: {len(nodes)} nodes · {len(edges)} edges")

    verified_count, unverified_count = 0, 0
    sim_values = []
    results = []

    for e in edges:
        s = e.get("source", "")
        t = e.get("target", "")

        if s not in nodes or t not in nodes:
            e["triangle_verified"] = False
            e["triangle_reason"] = "MISSING NODE"
            unverified_count += 1
            continue

        vec_s = node_to_vector(nodes[s])
        vec_t = node_to_vector(nodes[t])
        sim   = calculate_cosine_similarity(vec_s, vec_t)

        # Structural check: shared neighbors
        ns = _get_neighbors(edges, s)
        nt = _get_neighbors(edges, t)
        ns.discard(t); nt.discard(s)
        shared = ns & nt

        # Confidence floor
        density    = nodes[t].get("semantic_density", "NOMINAL")
        conf_floor = density_to_confidence(density)

        if len(shared) > 0:
            reason   = f"2-simplex via {list(shared)[:2]}"
            verified = True
        elif sim >= conf_floor:
            reason   = f"Direct cosine ({sim:.3f} ≥ {conf_floor})"
            verified = True
        else:
            reason   = f"Unstable (sim={sim:.3f} < {conf_floor}, 0 anchors)"
            verified = False

        e["triangle_verified"] = verified
        e["cosine_sim"]        = round(sim, 4)
        e["triangle_reason"]   = reason

        if verified:
            verified_count += 1
            sim_values.append(sim)
            print(f"   ✅ {s[:20]:20s} ↔ {t[:20]:20s}  sim={sim:.3f}  {reason}")
        else:
            unverified_count += 1
            print(f"   ⚠️  {s[:20]:20s} ↔ {t[:20]:20s}  sim={sim:.3f}  {reason}")

        results.append({
            "source": s, "target": t, "verified": verified,
            "sim": round(sim, 4), "reason": reason,
        })

    # HD_swarm
    total = len(edges)
    ratio = round(verified_count / total, 4) if total else 0.0
    mean_sim = round(float(np.mean(sim_values)), 4) if sim_values else 0.0
    hd_swarm = round(1.0 - mean_sim, 4)

    # HD_effective (geometric mean of both HD dimensions)
    state = _load(STATE_PATH, {})
    bench_hd = state.get("benchmark", {}).get("last_hd_score", 0.0991)
    graph_hd = state.get("graph_health", {}).get("graph_hd", 0.0611)
    hd_effective = round(math.sqrt(bench_hd**2 + hd_swarm**2) / math.sqrt(2), 6)

    print("\n" + "-"*56)
    print(f"   Triangle verified:  {verified_count}/{total} ({ratio*100:.1f}%)")
    print(f"   Mean cosine sim:    {mean_sim:.4f}")
    print(f"   HD_swarm:           {hd_swarm:.4f}")
    print(f"   HD_bench:           {bench_hd:.4f}")
    print(f"   HD_effective:       {hd_effective:.4f}")
    print("-"*56)

    # Atomic write KG (with triangle tags)
    _atomic_write(KG_PATH, kg)

    # Update state.json graph_health + swarm section
    gh = state.get("graph_health", {})
    gh["triangle_verified"]   = verified_count
    gh["triangle_total"]      = total
    gh["triangle_ratio"]      = ratio
    gh["hd_swarm"]            = hd_swarm
    gh["hd_effective"]        = hd_effective
    gh["mean_cosine_sim"]     = mean_sim
    state["graph_health"]     = gh

    swarm = state.get("swarm", {})
    swarm["last_audit_at"]    = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    swarm["triangle_ratio"]   = ratio
    swarm["hd_swarm"]         = hd_swarm
    swarm["hd_effective"]     = hd_effective
    swarm["awakening_condition_swarm"] = (
        hd_swarm < 0.05 and ratio >= 0.90
    )
    state["swarm"] = swarm
    _atomic_write(STATE_PATH, state)

    # Audit log
    with open(AUDIT_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps({
            "ts": time.time(), "event": "swarm_triangle_audit",
            "verified": verified_count, "total": total, "ratio": ratio,
            "hd_swarm": hd_swarm, "hd_effective": hd_effective,
        }) + "\n")

    summary = {
        "nodes":              len(nodes),
        "edges_total":        total,
        "edges_verified":     verified_count,
        "edges_unverified":   unverified_count,
        "triangle_ratio":     ratio,
        "mean_cosine_sim":    mean_sim,
        "hd_swarm":           hd_swarm,
        "hd_bench":           bench_hd,
        "hd_effective":       hd_effective,
    }

    print(f"\n[⬡ SWARM AUDIT COMPLETE]")
    print(f"   HD_swarm={hd_swarm:.4f} | HD_effective={hd_effective:.4f}")
    print(f"   Files updated: {KG_PATH.name} · {STATE_PATH.name}")
    print("="*56)

    return summary


if __name__ == "__main__":
    result = run_triangle_audit()
    print(f"\nFull summary: {json.dumps(result, indent=2)}")
