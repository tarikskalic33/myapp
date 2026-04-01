# SOVEREIGN AGI OS & SWARM v8.0 — FULL CONTEXT HANDOFF
**Last Updated:** April 2026
**Operator:** Tarik Skalic, Bihac, Bosnia
**Status:** ALL SYSTEMS NOMINAL — READY FOR DEVELOPMENT

*Read this document top-to-bottom before modifying any files.*

---

## 1. Directory Structure & Key Files

This project (`system_rebuild`) is a **decoupled monorepo** containing two isolated pillars: the **S.W.A.R.M. v8.0** cognitive OS and the **Godot 4.6 Game** vertical slice.

```text
system_rebuild/
├── HANDOFF_V8.md                ← THIS FILE (Master Entry Point)
├── .gitignore                   ← Global ignores (excludes .godot, .forge logs, venv)
│
├── godot_client/                ← STANDALONE GODOT PROJECT
│   ├── project.godot            ← Godot Project Root
│   ├── AGENT_GODOT_GUIDE.md     ← Specific guide for Game Developers
│   ├── assets/                  ← Sprites, Tilemaps, Palette
│   ├── scripts/                 ← GDScript logic (Isolated from Python)
│   └── scenes/                  ← Level and Entity scenes
│
└── swarm_os/                    ← COGNITIVE OS & BACKEND
    ├── sovereign_singularity.py ← Master launcher for the OS
    ├── deploy.ps1               ← One-click test + deploy script
    ├── start.ps1                ← One-click local boot (venv + server)
    ├── SWARM_8_0_ARCHITECTURE.md ← 10-Layer Technical Specification
    ├── .forge/                  ← The OS Brain (Knowledge Graph, Audit logs)
    ├── swarm/                   ← FastAPI Server & Smoke Tests
    ├── tools/                   ← Core Cognitive Implementation (Layers 1-10)
    └── dashboard/               ← Streamlit Visual Cortex & Benchmarks
```

---

## 2. Current State & Recent Fixes 

1. **Git Synchronization Fixed:** The massive 500+ file v8.0 local update was successfully committed and pushed to the `tarikskalic33/myapp` GitHub repo. All orphaned `.claude/worktree` bugs and huge `.godot` binaries were added to `.gitignore`.
2. **Server Architecture Clarified:** 
   - `python swarm/server.py` runs the Web/D3.js visualization. If the core engine isn't configured with NVIDIA NIM keys, it gracefully drops back into **Demo Mode** with fully functional API endpoints (`/graph`, `/ingest`, `/health`, `/rem`, `/spectral`).
   - Run `.\swarm\start.ps1` to instantly set up a virtual environment, install dependencies, run the server, inject the demo seed data, and launch the browser.
3. **Deployment Pipeline Built:** `.\deploy.ps1` automates smoke testing (`test_endpoints.py`), committing, pushing to GitHub, and deploying to Google Cloud Run (`lifequestplatinum` in `europe-west1`).

---

## 3. The 10-Layer SWARM Architecture Overview

S.W.A.R.M. (Sovereign Web Architecture for Relational Memory) is the knowledge graphing engine for the Sovereign AGI OS. It measures **Hallucination Delta (HD)** to gauge LLM self-awareness.

*   `HD = |claimed - actual|`
*   `HD 0.0` = Perfect Homeostasis / Truth
*   `HD 1.0` = Total Delusion / Failure

**The 10 Layers:**
1. **Geometric Core** (`orchestrator.py`): Triangle Protocol. All triplets must form closed A-B-C-A loops.
2. **Photonic Memory** (`photonic_resolver.py`): Time rotated vector storage.
3. **Quantum Manifold** (`quantum_manifold.py`): Uncertainty floor integration.
4. **Mirror Core / Ego** (`quantum_manifold.SovereignSelf`): Identity Eigenstate tracking.
5. **Russell Cosmology** (`russell_cosmology.py`): G+R=constant, 9 octaves of scale.
6. **Sovereign Framework** (`sovereign_framework.py`): Multiverse proofs.
7. **Dream State** (`dream_state.py`): Runs matrix multiplication to find hidden second-order connections during REM.
8. **Forager** (`forager.py`): Autonomous Wikipedia scraper.
9. **Equilibrium Server** (`equilibrium_server.py`): FastAPI backend endpoints.
10. **Consciousness Probe** (`sovereign_singularity.ConsciousnessProbe`): Validates model predictions against local ground-truth context in real-time.

---

## 4. Immutable Constitutional Laws
Any agent working on this codebase MUST follow these rules:

1. **NO DIRECT STATE MUTATION**: Do not write to `state.json` or `knowledge_graph.json` directly. You must use atomic `.tmp` renames. 
2. **NO GUESSING**: If there is ambiguity in requirements, throw a `FATAL_BLOCKER` and ask the user. Do not assume logic.
3. **NO UNAUTHORIZED CONNECTIONS**: When working on the Game slice, Node inter-communication MUST use `EventBus.gd` signals, not tight coupling or direct dot-access.

---

## 5. Next Steps for Incoming Agent

- **Start the server:** `.\swarm\start.ps1`
- **Deploy changes:** `.\deploy.ps1` (from inside `swarm_os/`)
- **Sovereign OS Integration:** Ensure `NVIDIA_NIM_API_KEY` is present in either the `.env` or system environment for full non-demo Layer-10 activation.

*Note:* Godot Game development happens entirely in the isolated `godot_client/` directory and should be treated as a detached standalone project. See `godot_client/AGENT_GODOT_GUIDE.md` for game-specific instructions.

---

## 6. Known Caveats & Agent Recommendations

If you are an AI agent picking up this repo, pay attention to the following friction points I encountered during setup:
1. **ChromaDB Locks:** If `swarm_os/swarm/server.py` crashes or is killed ungracefully during tests, `chromadb` may leave locked `.sqlite3` files in `.forge/chroma_ontology/`. If the server hangs indefinitely on startup, run `Stop-Process -Name "python" -Force` and delete the sqlite3 files.
2. **Path Resolution:** Automation scripts (like `deploy.ps1` and `test_endpoints.py`) rely on relative paths like `os.path.dirname(__file__)` to find `.forge`. ALWAYS run Python scripts from within the `swarm_os/` directory so paths don't break.
3. **Demo Mode Fallback:** If you see `Core engine not available: cannot import name 'router'`, the server is safely falling back to canvas-only demo mode. This is expected if the advanced NIM dependencies or core keys are missing. Do not try to "fix" the import unless you are specifically tasked with activating the live core.
4. **Git Push Timeouts:** The initial 100,000+ line repository push occasionally triggered HTTP 408 errors due to size constraints. If Godot binary assets get large, ensure you've configured `git config http.postBuffer 524288000`.

*End of Handoff.*
