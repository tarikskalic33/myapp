#!/usr/bin/env bash
# start.sh — One-command local demo for S.W.A.R.M. OS v6.0
# Usage: bash start.sh
# No GEMINI_API_KEY required — runs core + demo seed without forager.

set -euo pipefail
cd "$(dirname "$0")"

echo "[SWARM] Installing dependencies..."
pip install -q -r requirements.txt

echo "[SWARM] Starting server on http://localhost:8000 ..."
python server.py &
SERVER_PID=$!
echo "[SWARM] Server PID: $SERVER_PID"

# Wait for server to be ready
for i in $(seq 1 10); do
  if curl -s http://localhost:8000/state > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "[SWARM] Seeding demo data..."
python demo_seed.py

echo ""
echo "════════════════════════════════════════"
echo "  SWARM is live at http://localhost:8000"
echo "  Dashboard : http://localhost:8000/"
echo "  State API : http://localhost:8000/state"
echo "  Audit log : http://localhost:8000/audit?last_n=100"
echo "  Dream     : curl -X POST http://localhost:8000/dream"
echo "════════════════════════════════════════"
echo "  Press Ctrl+C to stop."
wait $SERVER_PID
