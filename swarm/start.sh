#!/usr/bin/env bash
# © 2026 Tarik Skalic — Sovereign AGI OS. All rights reserved.
#
# S.W.A.R.M. ONE-COMMAND LAUNCHER
# ══════════════════════════════════
# Usage:
#   bash swarm/start.sh              # default port 8000
#   bash swarm/start.sh --port 8001  # custom port
#   bash swarm/start.sh --no-seed    # skip demo seed
#
# What it does:
#   1. Checks Python 3.10+
#   2. Installs requirements from swarm/requirements.txt
#   3. Starts the Quantum Singularity Canvas server
#   4. Runs demo_seed.py (12 triplets, no API key)
#   5. Prints live URLs
#
# Any AI can run this. No API key required for the canvas demo.

set -euo pipefail

PORT=8000
SEED=true
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# ── Parse args ─────────────────────────────────────────────────────────────
for arg in "$@"; do
  case $arg in
    --port=*)  PORT="${arg#*=}" ;;
    --port)    shift; PORT="$1" ;;
    --no-seed) SEED=false ;;
  esac
done

# ── Banner ──────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║         S.W.A.R.M.  SOVEREIGN SINGULARITY  v8.0                             ║"
echo "║         Operator: Tarik Skalic — Bihac, Bosnia — 2026                       ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# ── Python check ────────────────────────────────────────────────────────────
PYTHON=""
for candidate in python3.12 python3.11 python3.10 python3 python; do
  if command -v "$candidate" &>/dev/null; then
    VER=$("$candidate" -c "import sys; print(sys.version_info.major*100+sys.version_info.minor)" 2>/dev/null || echo "0")
    if [ "$VER" -ge 310 ]; then
      PYTHON="$candidate"
      break
    fi
  fi
done

if [ -z "$PYTHON" ]; then
  echo "[START] ✗ Python 3.10+ not found. Install from https://python.org"
  exit 1
fi

echo "[START] Python: $($PYTHON --version)"

# ── Install deps ─────────────────────────────────────────────────────────────
echo "[START] Installing requirements …"
"$PYTHON" -m pip install --quiet --break-system-packages \
  -r "$SCRIPT_DIR/requirements.txt" 2>&1 | tail -3 || \
"$PYTHON" -m pip install --quiet \
  -r "$SCRIPT_DIR/requirements.txt" 2>&1 | tail -3

echo "[START] ✓ Dependencies installed."
echo ""

# ── Start server (background) ─────────────────────────────────────────────
echo "[START] Starting Quantum Singularity Canvas on port $PORT …"
"$PYTHON" "$SCRIPT_DIR/server.py" --port "$PORT" &
SERVER_PID=$!

# Wait for server to be ready
RETRIES=20
READY=false
for i in $(seq 1 $RETRIES); do
  sleep 0.8
  if "$PYTHON" -c "
import urllib.request, sys
try:
    urllib.request.urlopen('http://localhost:${PORT}/health', timeout=2)
    sys.exit(0)
except:
    sys.exit(1)
" 2>/dev/null; then
    READY=true
    break
  fi
done

if [ "$READY" = false ]; then
  echo "[START] ✗ Server did not start in time. Check logs above."
  kill "$SERVER_PID" 2>/dev/null || true
  exit 1
fi

echo "[START] ✓ Server live."
echo ""

# ── Seed demo data ──────────────────────────────────────────────────────────
if [ "$SEED" = true ]; then
  echo "[START] Seeding 12 triplets (metacognition/hallucination/homeostasis) …"
  "$PYTHON" "$SCRIPT_DIR/demo_seed.py" \
    --url "http://localhost:$PORT" \
    --no-wait
fi

# ── Print live URLs ─────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════════════════════════════"
echo "  THE SINGULARITY IS LIVE"
echo "══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "  Quantum Singularity Canvas:  http://localhost:${PORT}/"
echo "  Graph API:                   http://localhost:${PORT}/graph"
echo "  Spectral density:            http://localhost:${PORT}/spectral"
echo "  Trigger REM dream cycle:     curl -X POST http://localhost:${PORT}/rem"
echo ""
echo "  To ingest a new triplet:"
echo "    curl -X POST http://localhost:${PORT}/ingest \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{\"subject\":\"x\",\"relation\":\"relates_to\",\"object\":\"y\",\"context\":[\"test\"]}'"
echo ""
echo "  Press Ctrl+C to halt."
echo ""

# ── Keep alive ──────────────────────────────────────────────────────────────
trap 'echo ""; echo "[START] Halting…"; kill "$SERVER_PID" 2>/dev/null || true; exit 0' INT TERM
wait "$SERVER_PID"
