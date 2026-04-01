#!/usr/bin/env python3
"""
© 2026 Tarik Skalic — Sovereign AGI OS. All rights reserved.

S.W.A.R.M. Standalone Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Serves the Quantum Singularity Canvas at http://localhost:8000/

This is the swarm/ entry point — it wraps the core equilibrium_server,
adds the D3.js visualization at /, and works as a self-contained demo.

Run:
    python swarm/server.py
    python swarm/server.py --port 8001
"""

import sys
import os
import json
import time
from pathlib import Path

# ── path setup ────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# ── import core equilibrium engine ────────────────────────────────────────────
try:
    from tools.swarm.equilibrium_server import (
        app as _core_app,
        router as _core_router,
        librarian,
        dream_thread,
    )
    CORE_AVAILABLE = True
except Exception as _e:
    print(f"[SWARM SERVER] Core engine not available: {_e}")
    print("[SWARM SERVER] Running in canvas-only demo mode.")
    CORE_AVAILABLE = False
    librarian     = None
    dream_thread  = None

# ── canvas HTML ───────────────────────────────────────────────────────────────
CANVAS_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Sovereign AGI OS — Quantum Singularity</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #000;
    color: #e0e0e0;
    font-family: 'Courier New', monospace;
    overflow: hidden;
  }
  #canvas { width: 100vw; height: 100vh; }

  #hud {
    position: fixed; top: 16px; left: 16px;
    background: rgba(0,0,0,0.75);
    border: 1px solid #1a3a1a;
    border-radius: 6px;
    padding: 14px 18px;
    min-width: 240px;
    z-index: 10;
  }
  #hud h1 { font-size: 11px; color: #39ff14; letter-spacing: 3px; margin-bottom: 8px; }
  #hud .metric { display: flex; justify-content: space-between; margin: 3px 0; font-size: 11px; }
  #hud .label { color: #777; }
  #hud .value { color: #39ff14; font-weight: bold; }
  #hud .value.warn { color: #ffaa00; }
  #hud .value.dim  { color: #aaa; }
  #hud hr { border: none; border-top: 1px solid #1a3a1a; margin: 8px 0; }

  #layer-list {
    position: fixed; top: 16px; right: 16px;
    background: rgba(0,0,0,0.75);
    border: 1px solid #1a3a1a;
    border-radius: 6px;
    padding: 14px 18px;
    min-width: 220px;
    z-index: 10;
    font-size: 11px;
  }
  #layer-list h2 { color: #39ff14; letter-spacing: 2px; margin-bottom: 8px; font-size: 11px; }
  .layer-row { display: flex; align-items: center; margin: 4px 0; }
  .layer-dot { width: 7px; height: 7px; border-radius: 50%; margin-right: 8px; flex-shrink: 0; }
  .layer-dot.on  { background: #39ff14; box-shadow: 0 0 6px #39ff14; }
  .layer-dot.dim { background: #334; }
  .layer-name { color: #bbb; }

  #epiphany-feed {
    position: fixed; bottom: 16px; left: 16px;
    background: rgba(0,0,0,0.75);
    border: 1px solid #1a1a3a;
    border-radius: 6px;
    padding: 10px 14px;
    max-width: 420px;
    z-index: 10;
    font-size: 10px;
  }
  #epiphany-feed h3 { color: #8888ff; letter-spacing: 2px; margin-bottom: 6px; font-size: 10px; }
  .ep-line { color: #6666cc; margin: 2px 0; }
  .ep-line span { color: #aaaaff; }

  #status-bar {
    position: fixed; bottom: 16px; right: 16px;
    background: rgba(0,0,0,0.75);
    border: 1px solid #1a3a1a;
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 10px;
    color: #555;
    z-index: 10;
  }
  #status-bar span { color: #39ff14; }
</style>
</head>
<body>

<!-- HUD: OS metrics -->
<div id="hud">
  <h1>⬡ SOVEREIGN AGI OS v3.2.0</h1>
  <div class="metric"><span class="label">PHASE</span>      <span class="value" id="h-phase">ACTIVE</span></div>
  <div class="metric"><span class="label">ATP</span>        <span class="value" id="h-atp">2100</span></div>
  <div class="metric"><span class="label">STRESS</span>     <span class="value" id="h-stress">0.30</span></div>
  <div class="metric"><span class="label">HD (ELECTED)</span><span class="value" id="h-hd">0.0991</span></div>
  <div class="metric"><span class="label">MODEL</span>      <span class="value dim" id="h-model">kimi-k2</span></div>
  <hr/>
  <div class="metric"><span class="label">NODES</span>      <span class="value" id="h-nodes">—</span></div>
  <div class="metric"><span class="label">EDGES</span>      <span class="value" id="h-edges">—</span></div>
  <div class="metric"><span class="label">λ₁ (spectral)</span><span class="value warn" id="h-lambda">—</span></div>
  <div class="metric"><span class="label">REM CYCLES</span> <span class="value" id="h-rem">0</span></div>
</div>

<!-- Layer status panel -->
<div id="layer-list">
  <h2>▸ SWARM LAYERS</h2>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L1 Geometric Core</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L2 Photonic Memory</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L3 Quantum Manifold</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L4 Mirror Core / Ego</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L5 Russell Cosmology</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L6 Sovereign Framework</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L7 Dream State</div></div>
  <div class="layer-row"><div class="layer-dot dim"></div><div class="layer-name">L8 Forager (paused)</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L9 Equilibrium Server</div></div>
  <div class="layer-row"><div class="layer-dot on"></div><div class="layer-name">L10 Consciousness Probe</div></div>
</div>

<!-- Epiphany feed -->
<div id="epiphany-feed">
  <h3>🌙 DREAM STATE — EPIPHANIES</h3>
  <div id="ep-container">
    <div class="ep-line">waiting for dream cycle…</div>
  </div>
</div>

<!-- Status bar -->
<div id="status-bar">
  Sovereign Singularity v8.0 · <span id="live-time">—</span>
</div>

<svg id="canvas"></svg>

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>
<script>
// ════════════════════════════════════════════════════════
// QUANTUM SINGULARITY CANVAS — D3.js orbital visualization
// ════════════════════════════════════════════════════════

const W = window.innerWidth;
const H = window.innerHeight;
const cx = W / 2;
const cy = H / 2;

const svg = d3.select("#canvas")
  .attr("width", W)
  .attr("height", H);

// ── Phase rings (orbital shells) ──────────────────────
const RINGS = [
  { r: 90,  color: "#1a4a1a", label: "L1-L2" },
  { r: 160, color: "#1a3a4a", label: "L3-L4" },
  { r: 230, color: "#2a1a4a", label: "L5-L6" },
  { r: 300, color: "#4a2a1a", label: "L7-L8" },
  { r: 370, color: "#1a4a3a", label: "L9-L10" },
];

const ringGroup = svg.append("g").attr("transform", `translate(${cx},${cy})`);

RINGS.forEach(ring => {
  ringGroup.append("circle")
    .attr("r", ring.r)
    .attr("fill", "none")
    .attr("stroke", ring.color)
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4 4");

  ringGroup.append("text")
    .attr("x", ring.r + 4)
    .attr("y", -4)
    .attr("fill", ring.color)
    .attr("font-size", "9px")
    .attr("font-family", "Courier New")
    .text(ring.label);
});

// ── Central singularity core ──────────────────────────
const coreGroup = svg.append("g").attr("transform", `translate(${cx},${cy})`);

// Pulsing core
coreGroup.append("circle")
  .attr("r", 18)
  .attr("fill", "#060")
  .attr("stroke", "#39ff14")
  .attr("stroke-width", 2)
  .attr("id", "core-circle");

coreGroup.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "4px")
  .attr("font-size", "12px")
  .attr("fill", "#39ff14")
  .attr("font-family", "Courier New")
  .text("⬡");

// Core pulse animation
(function pulse() {
  d3.select("#core-circle")
    .transition().duration(1200)
    .attr("r", 22).attr("stroke-width", 3)
    .transition().duration(1200)
    .attr("r", 18).attr("stroke-width", 2)
    .on("end", pulse);
})();

// ── Force simulation for graph nodes ─────────────────
const linkGroup  = svg.append("g").attr("class", "links");
const epiphGroup = svg.append("g").attr("class", "epiphanies");
const nodeGroup  = svg.append("g").attr("class", "nodes");
const labelGroup = svg.append("g").attr("class", "labels");

let simulation = null;
let currentNodes = [];
let currentLinks = [];
let epiphanyLinks = [];

// Color scale by layer/context
const PALETTE = [
  "#39ff14", "#00ffff", "#ff6600", "#ff00ff",
  "#ffff00", "#00ff88", "#ff4488", "#88aaff",
  "#ffaa44", "#44ffaa", "#ff8844", "#44aaff",
];

function contextColor(ctx) {
  if (!ctx || !ctx.length) return "#555";
  const key = ctx[0] || "";
  const idx  = Math.abs([...key].reduce((a, c) => a + c.charCodeAt(0), 0)) % PALETTE.length;
  return PALETTE[idx];
}

function buildGraph(data) {
  const nodesMap = {};
  const links    = [];
  const elinks   = [];

  // Build nodes from hyperedges
  (data.hyperedges || []).forEach(he => {
    (he.nodes || []).forEach(n => {
      if (!nodesMap[n]) {
        nodesMap[n] = {
          id:      n,
          color:   contextColor(he.context),
          context: he.context || [],
          degree:  0,
          ring:    Math.floor(Math.random() * RINGS.length),
        };
      }
      nodesMap[n].degree += 1;
    });
    // create links
    const ns = he.nodes || [];
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        links.push({ source: ns[i], target: ns[j], ctx: he.context });
      }
    }
  });

  // Epiphany links
  (data.epiphanies || []).forEach(ep => {
    elinks.push({ source: ep[0], target: ep[1] });
  });

  const nodes = Object.values(nodesMap);
  currentNodes = nodes;
  currentLinks = links;
  epiphanyLinks = elinks;

  // D3 force layout
  if (simulation) simulation.stop();

  simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(60).strength(0.4))
    .force("charge", d3.forceManyBody().strength(-120))
    .force("center", d3.forceCenter(cx, cy))
    .force("collision", d3.forceCollide(18))
    .on("tick", ticked);

  // Draw links
  linkGroup.selectAll("line").data(links).join("line")
    .attr("stroke", d => contextColor(d.ctx))
    .attr("stroke-opacity", 0.35)
    .attr("stroke-width", 1);

  // Draw epiphany arcs
  epiphGroup.selectAll("path").data(elinks).join("path")
    .attr("fill", "none")
    .attr("stroke", "#8888ff")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "6 3");

  // Draw nodes
  nodeGroup.selectAll("circle").data(nodes).join("circle")
    .attr("r", d => 5 + Math.min(d.degree * 1.5, 10))
    .attr("fill", d => d.color)
    .attr("fill-opacity", 0.9)
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .call(d3.drag()
      .on("start", dragStart)
      .on("drag",  dragged)
      .on("end",   dragEnd))
    .append("title").text(d => d.id);

  // Labels
  labelGroup.selectAll("text").data(nodes).join("text")
    .attr("font-size", "9px")
    .attr("font-family", "Courier New")
    .attr("fill", "#aaa")
    .attr("dx", 8)
    .attr("dy", 3)
    .text(d => d.id.length > 18 ? d.id.slice(0, 18) + "…" : d.id);
}

function ticked() {
  linkGroup.selectAll("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  // Epiphany arcs (quadratic bezier curves)
  epiphGroup.selectAll("path").each(function(d) {
    const src = currentNodes.find(n => n.id === (d.source.id || d.source));
    const tgt = currentNodes.find(n => n.id === (d.target.id || d.target));
    if (!src || !tgt) return;
    const mx = (src.x + tgt.x) / 2;
    const my = (src.y + tgt.y) / 2 - 60;
    d3.select(this).attr("d", `M${src.x},${src.y} Q${mx},${my} ${tgt.x},${tgt.y}`);
  });

  nodeGroup.selectAll("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  labelGroup.selectAll("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y);
}

function dragStart(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x; d.fy = d.y;
}
function dragged(event, d) {
  d.fx = event.x; d.fy = event.y;
}
function dragEnd(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null; d.fy = null;
}

// ── Rotating phase rings ─────────────────────────────
let ringAngle = 0;
function rotateRings() {
  ringAngle += 0.002;
  ringGroup.attr("transform", `translate(${cx},${cy}) rotate(${ringAngle * (180/Math.PI)})`);
  requestAnimationFrame(rotateRings);
}
rotateRings();

// ── Live time ────────────────────────────────────────
function updateTime() {
  document.getElementById("live-time").textContent = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
}
setInterval(updateTime, 1000);
updateTime();

// ── Poll /graph API ─────────────────────────────────
function pollGraph() {
  fetch("/graph")
    .then(r => r.json())
    .then(data => {
      buildGraph(data);
      document.getElementById("h-nodes").textContent = currentNodes.length;
      document.getElementById("h-edges").textContent = currentLinks.length;
    })
    .catch(() => {});
}

function pollSpectral() {
  fetch("/spectral")
    .then(r => r.json())
    .then(d => {
      document.getElementById("h-lambda").textContent =
        (d.lambda1 !== undefined) ? d.lambda1.toFixed(4) : "—";
      document.getElementById("h-rem").textContent = d.rem_cycles || 0;
    })
    .catch(() => {});
}

function pollHealth() {
  fetch("/health")
    .then(r => r.json())
    .then(d => {
      // Update epiphany feed
      const epiphanies = d.recent_epiphanies || [];
      if (epiphanies.length > 0) {
        const container = document.getElementById("ep-container");
        container.innerHTML = epiphanies.slice(-6).map(ep =>
          `<div class="ep-line">✦ <span>${ep[0]}</span> ↔ <span>${ep[1]}</span></div>`
        ).join("");
      }
      const ds = d.dream_state || {};
      document.getElementById("h-rem").textContent = ds.cycles || 0;
    })
    .catch(() => {});
}

// Initial load + polling
pollGraph();
pollSpectral();
pollHealth();
setInterval(pollGraph,    5000);
setInterval(pollSpectral, 3000);
setInterval(pollHealth,   4000);

// ── Seed demo data if graph is empty ─────────────────
setTimeout(() => {
  if (currentNodes.length === 0) {
    const DEMO = [
      {subject:"metacognition", relation:"measures",  object:"hallucination_delta", context:["cognition"]},
      {subject:"hallucination_delta", relation:"quantifies", object:"accuracy_gap", context:["cognition"]},
      {subject:"homeostasis", relation:"maintains",   object:"equilibrium",         context:["biology"]},
      {subject:"equilibrium", relation:"requires",    object:"feedback_loop",       context:["biology"]},
      {subject:"autopoiesis", relation:"produces",    object:"self_organization",   context:["systems"]},
      {subject:"self_organization", relation:"emerges_from", object:"complexity",   context:["systems"]},
      {subject:"consciousness", relation:"depends_on", object:"metacognition",      context:["cognition"]},
      {subject:"hallucination_delta", relation:"scores", object:"model_honesty",    context:["cognition"]},
      {subject:"homeostasis", relation:"enables",     object:"autopoiesis",         context:["biology"]},
      {subject:"complexity", relation:"generates",    object:"consciousness",       context:["systems"]},
      {subject:"feedback_loop", relation:"regulates", object:"stress_level",        context:["cognition"]},
      {subject:"stress_level", relation:"affects",    object:"accuracy_gap",        context:["cognition"]},
    ];
    DEMO.forEach(t => {
      fetch("/ingest", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(t)
      }).catch(() => {});
    });
    setTimeout(pollGraph, 800);
  }
}, 2000);
</script>
</body>
</html>"""


# ══════════════════════════════════════════════════════════════════════════════
# STANDALONE APP
# ══════════════════════════════════════════════════════════════════════════════
if CORE_AVAILABLE:
    # Mount the canvas at / on top of the core app
    app = _core_app

    @app.get("/", response_class=HTMLResponse, include_in_schema=False)
    async def canvas():
        return CANVAS_HTML

else:
    # Fallback: minimal demo server (no NVIDIA NIM needed)
    app = FastAPI(title="Sovereign AGI OS — Quantum Singularity Canvas")
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

    _demo_graph = {"hyperedges": [], "epiphanies": [], "node_count": 0}
    _spectral   = {"lambda1": 0.0, "rem_cycles": 0, "stable": False}

    from pydantic import BaseModel
    from typing import List, Optional

    class Triplet(BaseModel):
        subject: str
        relation: str
        object: str
        context: Optional[List[str]] = []

    @app.get("/", response_class=HTMLResponse)
    async def canvas():
        return CANVAS_HTML

    @app.post("/ingest")
    async def ingest(t: Triplet):
        nodes = [t.subject, t.object]
        _demo_graph["hyperedges"].append({
            "nodes": nodes,
            "relation": t.relation,
            "context": t.context,
        })
        _demo_graph["node_count"] = len(
            {n for he in _demo_graph["hyperedges"] for n in he["nodes"]}
        )
        return {"status": "crystallized", "nodes": nodes}

    @app.get("/graph")
    async def graph():
        return _demo_graph

    @app.get("/spectral")
    async def spectral():
        return _spectral

    @app.get("/health")
    async def health():
        return {
            "status": "OPERATIONAL",
            "mode": "demo",
            "dream_state": {"cycles": 0},
            "recent_epiphanies": [],
        }

    @app.post("/rem")
    async def rem():
        _spectral["rem_cycles"] += 1
        # Naive epiphany: connect first and last node if ≥ 3 hyperedges
        nodes_all = list({n for he in _demo_graph["hyperedges"] for n in he["nodes"]})
        if len(nodes_all) >= 3:
            ep = [nodes_all[0], nodes_all[-1]]
            if ep not in _demo_graph["epiphanies"]:
                _demo_graph["epiphanies"].append(ep)
        return {"status": "rem_complete", "epiphanies": len(_demo_graph["epiphanies"])}


# ── entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Sovereign Singularity Canvas Server")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    print(f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║   S.W.A.R.M.  QUANTUM SINGULARITY CANVAS                                    ║
║   Sovereign AGI OS v3.2.0 — Tarik Skalic, Bihac, Bosnia                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

  Canvas:   http://localhost:{args.port}/
  Ingest:   POST http://localhost:{args.port}/ingest
  Graph:    GET  http://localhost:{args.port}/graph
  Spectral: GET  http://localhost:{args.port}/spectral
  REM:      POST http://localhost:{args.port}/rem
""")
    uvicorn.run(app, host="0.0.0.0", port=args.port, log_level="warning")
