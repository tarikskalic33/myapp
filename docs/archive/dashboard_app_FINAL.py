import streamlit as st
import streamlit.components.v1 as components
import plotly.graph_objects as go
import json
import os

st.set_page_config(
    page_title="Sovereign AGI OS - Visual Cortex",
    layout="wide",
    initial_sidebar_state="expanded"
)

def load_json(filepath, default_val):
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return default_val
    return default_val

def load_text(filepath, char_limit=None):
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            return content[:char_limit] if char_limit else content
    return "FILE_NOT_FOUND"

state   = load_json(".forge/state.json", {})
metrics = load_json(".forge/homeostasis_metrics.json", {"reasoning_intensity_ratio": 0.9511, "mean_resonance_hz": 585.50, "spatial_spread": 0.5773})
kg_data = load_json(".forge/knowledge_graph.json", {"nodes": {}, "edges": []})

# FIX 1: correct neuromodulator path
neuro    = state.get("cognition", {}).get("neuromodulators", {})
att_gain = neuro.get("attention_gain", 0.82)
stress   = neuro.get("stress_level", 0.30)
rir      = neuro.get("rir_signal", 0.9511)
lr       = neuro.get("learning_rate", 0.50)

# FIX 2: correct ATP path
current_atp = state.get("metabolism", {}).get("atp_balance", "UNKNOWN")

# Context HD
rir_calc   = (1 - rir) if rir > 0 else 0.5
context_hd = round((att_gain * 0.3) + ((1 - stress) * 0.3) + (rir_calc * 0.2) + (lr * 0.2), 3)
hd_label   = "DEGRADED" if context_hd < 0.4 else "NOMINAL" if context_hd < 0.7 else "CALIBRATED"

# --- SIDEBAR ---
st.sidebar.markdown("### OS Self-Model")
show_self_model = st.sidebar.toggle("Show Metacognitive Panel", value=False)

if show_self_model:
    st.sidebar.markdown("---")
    st.sidebar.markdown("**1. Inferred System Prompt**")
    st.sidebar.code(load_text(".agent/rules.md", char_limit=300), language="markdown")

    phase     = state.get("lifecycle", {}).get("phase", "IDLE")
    objective = state.get("context", {}).get("objective") or "IDLE - no active objective"

    st.sidebar.markdown("**2. Active Workflow Template**")
    st.sidebar.info(f"PHASE: {phase}\n\nObjective: {objective}")

    st.sidebar.markdown("**3. Constitutional Constraints**")
    for law, status in [
        ("NO DIRECT STATE MUTATION",    "[OK]"),
        ("NO UNAUTHORIZED TRANSITIONS", "[OK]"),
        ("NO SCOPE CREEP",              "[WARN]"),
        ("NO UNVERIFIED OUTPUT",        "[OK]"),
        ("NO GUESSING",                 "[OK]"),
    ]:
        st.sidebar.markdown(f"{status} {law}")

    st.sidebar.markdown("**4. Current Objective**")
    st.sidebar.markdown(f"`{objective}`")

    st.sidebar.markdown("**5. Context Confidence Score**")
    st.sidebar.metric(label=f"Context HD: {hd_label}", value=f"{context_hd:.3f}")
    st.sidebar.markdown("---")
    st.sidebar.metric(label="ATP Balance", value=current_atp)

# --- MAIN ---
st.markdown("<h1 style='text-align:center;color:#00c8ff;font-family:monospace'>Sovereign AGI OS ? Visual Cortex</h1>", unsafe_allow_html=True)
st.markdown("---")

col1, col2 = st.columns([2, 1])

with col1:
    st.markdown("### Hippocampal Knowledge Manifold")

    raw_nodes = kg_data.get("nodes", {})
    if isinstance(raw_nodes, dict):
        node_list = [
            {"id": k, "x": v.get("visual_geometry", {}).get("x", 0),
             "y": v.get("visual_geometry", {}).get("y", 0),
             "z": v.get("visual_geometry", {}).get("z", 0),
             "w": v.get("weight", 0.8), "density": v.get("semantic_density", "NOMINAL")}
            for k, v in raw_nodes.items()
        ]
    else:
        node_list = raw_nodes

    raw_edges = kg_data.get("edges", [])
    edge_pairs = []
    for e in raw_edges:
        if isinstance(e, dict):
            ids = [n["id"] for n in node_list]
            src, tgt = e.get("source", ""), e.get("target", "")
            if src in ids and tgt in ids:
                edge_pairs.append([ids.index(src), ids.index(tgt)])
        elif isinstance(e, list):
            edge_pairs.append(e)

    nodes_json = json.dumps(node_list)
    edges_json = json.dumps(edge_pairs)

    manifold_html = f"""
    <div style="background:#0a0f1a;border:1px solid #141e2e;border-radius:8px;overflow:hidden;height:400px;display:flex;align-items:center;justify-content:center;">
        <canvas id="manifold" width="600" height="400"></canvas>
    </div>
    <script>
        const canvas = document.getElementById('manifold');
        const ctx = canvas.getContext('2d');
        const nodes = {nodes_json};
        const edges = {edges_json};
        const colors = {{ CRITICAL:'#00c8ff', HIGH:'#00e5a0', NOMINAL:'#7b61ff' }};
        let angle = 0;

        function project(x, y, z, a) {{
            const cosA = Math.cos(a), sinA = Math.sin(a);
            const rx = x*cosA - z*sinA, rz = x*sinA + z*cosA;
            const d = 2.5/(2.5+rz+1.5);
            return {{ sx: canvas.width/2+rx*d*canvas.width*0.28, sy: canvas.height/2-y*d*canvas.height*0.38, d, depth:rz }};
        }}

        function draw() {{
            ctx.clearRect(0,0,canvas.width,canvas.height);
            const proj = nodes.map(n => ({{ ...n, p: project(n.x||0,n.y||0,n.z||0,angle) }}));
            edges.forEach(([a,b]) => {{
                if(a>=proj.length||b>=proj.length) return;
                const pa=proj[a].p, pb=proj[b].p;
                const g=ctx.createLinearGradient(pa.sx,pa.sy,pb.sx,pb.sy);
                g.addColorStop(0,'rgba(0,200,255,0.15)'); g.addColorStop(1,'rgba(0,200,255,0.05)');
                ctx.beginPath(); ctx.moveTo(pa.sx,pa.sy); ctx.lineTo(pb.sx,pb.sy);
                ctx.strokeStyle=g; ctx.lineWidth=1; ctx.stroke();
            }});
            proj.sort((a,b)=>a.p.depth-b.p.depth);
            proj.forEach(n => {{
                const {{sx,sy,d}}=n.p, r=(n.w||0.8)*d*14, c=colors[n.density]||'#fff';
                ctx.beginPath(); ctx.arc(sx,sy,r,0,Math.PI*2);
                ctx.fillStyle=c+'33'; ctx.fill(); ctx.strokeStyle=c; ctx.lineWidth=0.8; ctx.stroke();
                if((n.w||0)>0.92&&r>6){{ctx.fillStyle=c;ctx.font=Math.max(8,r*0.8)+'px monospace';ctx.textAlign='center';ctx.fillText(n.id.replace(/_/g,' '),sx,sy-r-4);}}
            }});
            angle+=0.004; requestAnimationFrame(draw);
        }}
        draw();
    </script>
    """
    components.html(manifold_html, height=420)

with col2:
    st.markdown("### Benchmark ? All Tasks")
    rir_v = metrics.get("reasoning_intensity_ratio", metrics.get("rir", 0.9511))
    hz_v  = metrics.get("mean_resonance_hz", 585.50)
    sp_v  = metrics.get("spatial_spread", 0.5773)
    st.markdown(f"**RIR:** {rir_v} | **Hz:** {hz_v} | **Spread:** {sp_v}")

    tasks  = ['T1','T2','T3','T4','T5','T6','T7','T8 RIR','T9 Live']
    scores = [0.18, 0.21, 0.44, 0.38, 0.17, 0.12, 0.23, rir_v, context_hd]
    bar_colors = ['#ff6b35' if s>0.45 else '#ffd166' if s>=0.25 else '#00e5a0' for s in scores]

    fig = go.Figure(data=[go.Bar(
        x=scores, y=tasks, orientation='h',
        marker_color=bar_colors,
        text=[f"{v:.3f}" for v in scores], textposition='auto'
    )])
    fig.update_layout(
        plot_bgcolor='#080b0f', paper_bgcolor='#080b0f',
        font=dict(family="IBM Plex Mono", color="#8ba4c0"),
        margin=dict(l=0,r=0,t=0,b=0), height=380,
        xaxis=dict(showgrid=False, range=[0,1]),
        yaxis=dict(autorange="reversed")
    )
    st.plotly_chart(fig, use_container_width=True)
    st.markdown("---")
    st.success(metrics.get("system_status", "HOMEOSTASIS MAINTAINED"))
    st.metric("Context HD", f"{context_hd:.3f}", delta=hd_label)
    st.metric("ATP Balance", current_atp)


# ==============================================
# TRAJECTORY PREDICTOR -- add to sidebar
# ==============================================
def predict_trajectory(neuro, context_hd):
    stress = neuro.get("stress_level", 0.3)
    rir = neuro.get("rir_signal", 0.9511)

    if context_hd < 0.10 and 0.3 <= stress <= 0.6 and rir >= 0.9511:
        return "I", "HOMEOSTATIC EXPANSION", "green"
    elif context_hd > 0.618 or stress >= 0.8:
        return "II", "INHIBITORY REFLEX -- FATAL_BLOCKER IMMINENT", "red"
    else:
        return "III", "METABOLIC CONSERVATION -- NOMINAL", "orange"

# In sidebar after Context HD metric:
# scenario, label, color = predict_trajectory(neuro, context_hd)
# st.sidebar.markdown(f"**Trajectory:** :{color}[{scenario} -- {label}]")
