#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO="${CLAUDE_PROJECT_DIR:-/home/user/AEGIS--}"

# sovereign-omega-v2 TypeScript deps (Gate 8 / 2790 tests depend on this)
if [ -f "$REPO/sovereign-omega-v2/package.json" ] && [ ! -d "$REPO/sovereign-omega-v2/node_modules" ]; then
  cd "$REPO/sovereign-omega-v2"
  npm install --prefer-offline --no-audit --no-fund
fi

# Python bridge deps
if [ -f "$REPO/sovereign-omega-v2/requirements.txt" ]; then
  pip install --quiet -r "$REPO/sovereign-omega-v2/requirements.txt"
fi

# Verify constitutional file hashes
cd "$REPO/sovereign-omega-v2"
node scripts/verify-hashes.mjs
