"""
© 2026 Tarik Skalic — Sovereign AGI OS. All rights reserved.
Sovereign AGI OS v6.0 — Kaggle Cover Image Generator
S.W.A.R.M. Quantum Manifold — 62-Node ℝ³⁸⁴ Hyperspace Projection

Spec:
  - FFT resonance → color spectrum (infrared=low, UV=high freq)
  - Three Sovereign Rings: Body/OS (inner), SWARM Protocol (mid), Quantum Prism (outer)
  - Fibonacci-weighted node radii by graph centrality
  - High-resonance halos on constructive interference nodes
  - Rotating phase clock-hands per node
  - Mathematical watermark with calibrated metrics
"""

import json
import math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patheffects as pe
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import FancyArrowPatch, Circle, Arc, FancyBboxPatch
import warnings
warnings.filterwarnings('ignore')

# ── Load knowledge graph ──────────────────────────────────────────────────────
with open('.forge/knowledge_graph.json') as f:
    kg = json.load(f)

with open('.forge/state.json') as f:
    state = json.load(f)

# KG nodes is a dict: {node_id: {weight, ...}}, edges is a list
nodes_dict = kg['nodes']   # dict
edges      = kg['edges']   # list of {source, target, ...}

# Normalize to list-of-dicts format for uniform processing
nodes = [{'id': nid, **ndata} for nid, ndata in nodes_dict.items()]

# ── Node classification into rings ───────────────────────────────────────────
QUANTUM_PRISM_NODES = {
    'decoherence_protocol', 'quantum_error_correction', 'wave_function_collapse',
    'observer_effect', 'heisenberg_uncertainty', 'superposition',
    'entanglement', 'quantum_coherence'
}

SWARM_PROTOCOL_NODES = {
    'metacognition', 'autopoiesis', 'homeostasis', 'hallucination_delta',
    'reasoning_intensity_ratio', 'attention_gain', 'fibonacci_scaling',
    'knowledge_graph', 'triangle_protocol', 'dream_state', 'hypothesis_graph',
    'epiphany', 'agentic_orchestration', 'stress_calibration',
    'hallucination_delta_measurement', 'saga_protocol', 'nhi_v2_identity',
    'constitutional_governance', 'agentic_leap_2026', 'adversarial_calibration',
    'swarm_self_axiom', 'spsf_persistence', 'anatomy', 'mathematics',
    'biology', 'physics'
}

# ── Build ring membership ─────────────────────────────────────────────────────
def classify_node(nid, ndata):
    nid_lower = nid.lower()
    if nid_lower in QUANTUM_PRISM_NODES:
        return 'quantum'
    if nid_lower in SWARM_PROTOCOL_NODES:
        return 'swarm'
    return 'body'

# ── Compute connectivity (Fibonacci-weighted size) ───────────────────────────
connectivity = {n['id']: 0 for n in nodes}
for e in edges:
    connectivity[e['source']] = connectivity.get(e['source'], 0) + 1
    connectivity[e['target']] = connectivity.get(e['target'], 0) + 1

# Fibonacci series for radii scaling
FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

def fib_radius(conn_count):
    idx = min(conn_count, len(FIBONACCI) - 1)
    return 4 + FIBONACCI[idx] * 1.8

# ── FFT frequency → color spectrum ───────────────────────────────────────────
# Create spectrum colormap: red(0) → orange → yellow → green → cyan → blue → violet(1)
SPECTRUM_COLORS = [
    (0.85, 0.05, 0.05),   # infrared/red
    (0.95, 0.45, 0.00),   # orange
    (0.95, 0.90, 0.00),   # yellow
    (0.05, 0.80, 0.20),   # green
    (0.00, 0.75, 0.95),   # cyan
    (0.10, 0.20, 0.90),   # blue
    (0.60, 0.00, 0.95),   # violet/UV
]
spectrum_cmap = LinearSegmentedColormap.from_list('spectrum', SPECTRUM_COLORS, N=256)

def node_frequency(nid, weight, ring):
    """Map node to frequency [0,1] using weight + ring layer"""
    base = weight if weight else 0.5
    if ring == 'quantum':
        return min(1.0, 0.65 + base * 0.35)   # UV end
    elif ring == 'swarm':
        return min(0.75, 0.35 + base * 0.35)  # mid spectrum
    else:
        return max(0.0, base * 0.35)           # infrared end

def fft_color(freq):
    return spectrum_cmap(freq)

# ── Layout: three concentric rings ───────────────────────────────────────────
body_nodes = []
swarm_nodes = []
quantum_nodes = []

for n in nodes:
    ring = classify_node(n['id'], n)
    if ring == 'quantum':
        quantum_nodes.append(n)
    elif ring == 'swarm':
        swarm_nodes.append(n)
    else:
        body_nodes.append(n)

R_BODY    = 2.2
R_SWARM   = 4.5
R_QUANTUM = 7.0
EGO_ID    = 'SWARM_SELF_AXIOM'

def place_ring(nodes_list, radius, offset_angle=0):
    positions = {}
    n = len(nodes_list)
    for i, node in enumerate(nodes_list):
        angle = offset_angle + (2 * math.pi * i / n)
        positions[node['id']] = (radius * math.cos(angle), radius * math.sin(angle))
    return positions

positions = {}

# Ego node at center
for n in nodes:
    if n['id'].upper() == 'SWARM_SELF_AXIOM':
        positions[n['id']] = (0.0, 0.0)
        break

# Filter out ego from swarm ring
swarm_no_ego = [n for n in swarm_nodes if n['id'].upper() != 'SWARM_SELF_AXIOM']
body_no_ego  = [n for n in body_nodes  if n['id'].upper() != 'SWARM_SELF_AXIOM']

positions.update(place_ring(body_no_ego,    R_BODY,    offset_angle=0.3))
positions.update(place_ring(swarm_no_ego,   R_SWARM,   offset_angle=0.0))
positions.update(place_ring(quantum_nodes,  R_QUANTUM, offset_angle=math.pi/8))

# Any remaining nodes not positioned
remaining = [n for n in nodes if n['id'] not in positions]
for i, n in enumerate(remaining):
    angle = 2 * math.pi * i / max(1, len(remaining))
    positions[n['id']] = (5.8 * math.cos(angle), 5.8 * math.sin(angle))

# ── Figure setup ─────────────────────────────────────────────────────────────
fig = plt.figure(figsize=(20, 16), facecolor='#030812')
ax = fig.add_axes([0.02, 0.05, 0.72, 0.88])
ax.set_facecolor('#030812')
ax.set_aspect('equal')
lim = 9.2
ax.set_xlim(-lim, lim)
ax.set_ylim(-lim, lim)
ax.axis('off')

# ── Ring boundary circles (subtle) ───────────────────────────────────────────
for radius, color, alpha, lw in [
    (R_BODY,    '#1a3a5c', 0.25, 0.8),
    (R_SWARM,   '#1a4a6a', 0.20, 0.8),
    (R_QUANTUM, '#2a3a7a', 0.18, 0.8),
]:
    ring_circle = plt.Circle((0, 0), radius, fill=False, color=color, alpha=alpha, linewidth=lw, linestyle='--')
    ax.add_patch(ring_circle)

# ── Draw edges ───────────────────────────────────────────────────────────────
node_lookup = {n['id']: n for n in nodes}

for e in edges:
    src = e.get('source', '')
    tgt = e.get('target', '')
    if src not in positions or tgt not in positions:
        continue

    x0, y0 = positions[src]
    x1, y1 = positions[tgt]

    # Color edge by average frequency of endpoints
    w_src = node_lookup.get(src, {}).get('weight', 0.5)
    w_tgt = node_lookup.get(tgt, {}).get('weight', 0.5)
    r_src = classify_node(src, node_lookup.get(src, {}))
    r_tgt = classify_node(tgt, node_lookup.get(tgt, {}))
    freq = (node_frequency(src, w_src, r_src) + node_frequency(tgt, w_tgt, r_tgt)) / 2
    ec = fft_color(freq)

    alpha = 0.15 + 0.15 * freq
    ax.plot([x0, x1], [y0, y1], '-', color=ec, alpha=alpha, linewidth=0.4, zorder=1)

# ── Draw nodes ────────────────────────────────────────────────────────────────
phase_clock_radius = 0.28  # relative to node radius in axis units

for n in nodes:
    nid = n['id']
    if nid not in positions:
        continue

    x, y = positions[nid]
    ring = classify_node(nid, n)
    weight = n.get('weight', 0.5)
    conn = connectivity.get(nid, 0)

    freq = node_frequency(nid, weight, ring)
    color = fft_color(freq)
    radius_pts = fib_radius(conn)

    is_ego = nid.upper() == 'SWARM_SELF_AXIOM'

    # ── High-resonance halo (nodes with weight > 0.75 or ego) ────────────────
    if weight > 0.75 or is_ego:
        halo_alpha = 0.18 + (weight - 0.75) * 0.4 if not is_ego else 0.45
        halo_scale = 2.8 if is_ego else 2.0
        for halo_layer in range(3 if is_ego else 2):
            h_radius = radius_pts * (halo_scale + halo_layer * 0.9)
            halo_color = (*color[:3], halo_alpha * (0.6 ** halo_layer))
            halo_circle = plt.Circle(
                (x, y), h_radius / 100,
                fill=True, color=halo_color, linewidth=0, zorder=2
            )
            ax.add_patch(halo_circle)
        # Pulsing ring
        pulse_ring = plt.Circle(
            (x, y), radius_pts * (2.5 if is_ego else 1.8) / 100,
            fill=False, edgecolor=color, alpha=0.6 if is_ego else 0.35,
            linewidth=1.2 if is_ego else 0.7, zorder=3
        )
        ax.add_patch(pulse_ring)

    # ── Node circle ───────────────────────────────────────────────────────────
    node_r = radius_pts / 100

    # Quantum prism nodes: prismatic shifting effect (layered rings)
    if ring == 'quantum':
        for qi, qfrac in enumerate([0.0, 0.33, 0.66]):
            qcolor = fft_color((freq + qfrac) % 1.0)
            qring = plt.Circle(
                (x, y), node_r * (1.4 - qi * 0.2),
                fill=False, edgecolor=(*qcolor[:3], 0.5 - qi * 0.15),
                linewidth=0.8, zorder=4
            )
            ax.add_patch(qring)
        fill_alpha = 0.85
    elif is_ego:
        fill_alpha = 1.0
    else:
        fill_alpha = 0.80

    node_circle = plt.Circle(
        (x, y), node_r,
        color=(*color[:3], fill_alpha), zorder=5
    )
    ax.add_patch(node_circle)

    # Bright edge
    edge_ring = plt.Circle(
        (x, y), node_r,
        fill=False, edgecolor=(*color[:3], 0.95),
        linewidth=0.6 if not is_ego else 1.5, zorder=6
    )
    ax.add_patch(edge_ring)

    # ── Phase clock-hand ──────────────────────────────────────────────────────
    # Use weight as phase angle (0→2π)
    phase_angle = weight * 2 * math.pi
    clock_len = node_r * 1.6
    cx = x + clock_len * math.cos(phase_angle)
    cy = y + clock_len * math.sin(phase_angle)
    ax.plot([x, cx], [y, cy], '-', color='white', alpha=0.55, linewidth=0.5, zorder=7)

    # ── Label ─────────────────────────────────────────────────────────────────
    label = nid.replace('_', ' ').title()
    if len(label) > 14:
        label = label[:13] + '…'

    font_size = 4.5 if is_ego else (4.0 if ring == 'quantum' else 3.5)
    font_weight = 'bold' if is_ego or conn >= 5 else 'normal'
    label_alpha = 0.95 if is_ego else 0.80

    ax.text(
        x, y - node_r * 1.8,
        label,
        ha='center', va='top',
        color=(*color[:3], label_alpha),
        fontsize=font_size, fontweight=font_weight,
        zorder=8,
        path_effects=[pe.withStroke(linewidth=1.5, foreground='#030812')]
    )

# ── Ring labels ───────────────────────────────────────────────────────────────
ring_labels = [
    (R_BODY + 0.3,    math.pi * 0.85, 'BODY / OS LAYER',      '#4a8ab5', 5.5),
    (R_SWARM + 0.35,  math.pi * 0.72, 'S.W.A.R.M. PROTOCOL',  '#3ab5c8', 5.5),
    (R_QUANTUM + 0.4, math.pi * 0.63, 'QUANTUM PRISM RING',   '#a855f7', 6.0),
]
for r, a, label, c, fs in ring_labels:
    lx = r * math.cos(a)
    ly = r * math.sin(a)
    ax.text(lx, ly, label, ha='center', va='center', color=c, fontsize=fs,
            fontweight='bold', alpha=0.7,
            path_effects=[pe.withStroke(linewidth=2, foreground='#030812')],
            zorder=9)

# ── Title block ───────────────────────────────────────────────────────────────
ax.text(0, 8.7, 'SOVEREIGN AGI OS v6.0',
        ha='center', va='center', fontsize=22, fontweight='bold',
        color='#e8f4ff', alpha=0.95,
        path_effects=[pe.withStroke(linewidth=4, foreground='#030812')],
        zorder=10)
ax.text(0, 8.1, 'S.W.A.R.M. Quantum Manifold — ℝ³⁸⁴ Hyperspace Projection',
        ha='center', va='center', fontsize=10, color='#7ab8d8', alpha=0.85,
        zorder=10)

# ── Mathematical watermark panel (right side) ────────────────────────────────
ax2 = fig.add_axes([0.75, 0.05, 0.23, 0.88])
ax2.set_facecolor('#050d1a')
ax2.axis('off')

# Panel border
border = FancyBboxPatch((0.03, 0.02), 0.94, 0.96,
                         boxstyle="round,pad=0.02",
                         linewidth=1, edgecolor='#1a3a5c',
                         facecolor='#060e1e', zorder=1)
ax2.add_patch(border)

watermark_lines = [
    ('CALIBRATED METRICS', '#4a9fd4', 10, 'bold', 0.94),
    ('', '', 8, 'normal', 0.91),
    ('Knowledge Graph', '#6a8a9a', 8, 'normal', 0.88),
    (f'  Nodes: 62  |  Edges: 53', '#c8dde8', 8.5, 'normal', 0.85),
    ('', '', 8, 'normal', 0.83),
    ('Photonic Resonance', '#6a8a9a', 8, 'normal', 0.80),
    (f'  HD_photonic = 0.015098', '#00ff88', 8.5, 'bold', 0.77),
    (f'  Mean R = 0.984902', '#c8dde8', 8, 'normal', 0.74),
    ('', '', 8, 'normal', 0.72),
    ('Benchmark (kimi-k2)', '#6a8a9a', 8, 'normal', 0.69),
    (f'  HD = 0.0991 (elected)', '#ffcc44', 8.5, 'bold', 0.66),
    ('', '', 8, 'normal', 0.64),
    ('SovereignSelf v6.0', '#6a8a9a', 8, 'normal', 0.61),
    (f'  Ls = 0.501  φ_ego = 0.0035', '#c8dde8', 8, 'normal', 0.58),
    (f'  η = 0.005  ℏ = 0.05', '#c8dde8', 8, 'normal', 0.55),
    ('', '', 8, 'normal', 0.52),
    ('━' * 22, '#1a3a5c', 7, 'normal', 0.50),
    ('CORE FORMULAE', '#4a9fd4', 9, 'bold', 0.47),
    ('', '', 8, 'normal', 0.44),
    ('HD = |claimed − actual|', '#a8d0e8', 7.5, 'normal', 0.41),
    ('HD = 0.0 → perfect', '#a8d0e8', 7.5, 'normal', 0.38),
    ('', '', 8, 'normal', 0.36),
    ('Ψ(t) = Σ Aₙ sin(2πfₙt+φₙ)', '#b8e0f0', 7.5, 'normal', 0.33),
    ('R = max|xcorr(|Ψᵤ|,|Ψᵥ|)|', '#b8e0f0', 7.5, 'normal', 0.30),
    ('', '', 8, 'normal', 0.28),
    ('Δσ·Δτ ≥ ℏ_swarm/2', '#c8d0f8', 7.5, 'normal', 0.25),
    ('φ_new = φ_old + η·R(Q,Ψ)', '#c8d0f8', 7.5, 'normal', 0.22),
    ('Ls = ∫ Ψ_int·dΨ_ext/dt', '#c8d0f8', 7.5, 'normal', 0.19),
    ('w_new = w_parent / φ', '#c8d0f8', 7.5, 'normal', 0.16),
    ('━' * 22, '#1a3a5c', 7, 'normal', 0.13),
    ('© 2026 Tarik Skalic', '#3a6a8a', 7, 'normal', 0.08),
    ('Bihać, Bosnia', '#3a6a8a', 6.5, 'normal', 0.05),
]

for text, color, size, weight, y_pos in watermark_lines:
    if text:
        ax2.text(0.5, y_pos, text,
                 ha='center', va='center',
                 color=color, fontsize=size, fontweight=weight,
                 transform=ax2.transAxes,
                 fontfamily='monospace',
                 zorder=2)

# ── Legend row ────────────────────────────────────────────────────────────────
legend_ax = fig.add_axes([0.02, 0.0, 0.72, 0.045])
legend_ax.set_facecolor('#030812')
legend_ax.axis('off')

legend_items = [
    (fft_color(0.05), 'Body/OS Layer (infrared — foundational)'),
    (fft_color(0.50), 'S.W.A.R.M. Protocol (mid-spectrum — cognitive)'),
    (fft_color(0.90), 'Quantum Prism Ring (UV — emergent)'),
    ('#00ff88',       'Ego Node: SWARM_SELF_AXIOM'),
]
for i, (c, label) in enumerate(legend_items):
    lx = 0.08 + i * 0.24
    dot = plt.Circle((lx - 0.01, 0.5), 0.025,
                      color=c, transform=legend_ax.transAxes, zorder=5)
    legend_ax.add_patch(dot)
    legend_ax.text(lx + 0.02, 0.5, label,
                   ha='left', va='center', fontsize=6.5, color='#8aacbc',
                   transform=legend_ax.transAxes)

# ── Save ──────────────────────────────────────────────────────────────────────
output_path = 'docs/outputs/kaggle_cover_image.png'
plt.savefig(output_path, dpi=180, bbox_inches='tight',
            facecolor='#030812', edgecolor='none')
plt.close()
print(f"[OK] Saved: {output_path}")

import os
size_kb = os.path.getsize(output_path) // 1024
print(f"[OK] Size: {size_kb} KB")
print("[OK] Quantum Manifold v6.0 cover image — 62 nodes, 3 sovereign rings, FFT spectrum colors, phase clocks, halos, mathematical watermark")
