#!/usr/bin/env node
// © 2026 Tarik Skalic — Sovereign AGI OS. All rights reserved.
// tools/validate-state.js — Validate .forge/state.json
// Usage: node tools/validate-state.js
'use strict';
const fs = require('fs');
const path = require('path');
const STATE_FILE = path.resolve(__dirname, '..', '.forge', 'state.json');

try {
  const raw = fs.readFileSync(STATE_FILE, 'utf8');
  const state = JSON.parse(raw);

  if (state.version !== '3.2.0')
    throw new Error('Wrong version: ' + state.version + ' (expected 3.2.0)');
  if (!state.lifecycle || !state.meta || !state.telemetry)
    throw new Error('INVALID_STATE_SHAPE: missing required top-level fields');
  if (!state.cognition)
    throw new Error('Missing cognition layer');

  console.log(JSON.stringify({
    success: true,
    version: state.version,
    phase: state.lifecycle.phase,
    objective: state.context?.objective || 'none',
    role: state.context?.active_role || 'unknown',
    atp: state.metabolism?.atp_balance || 0,
    stress: state.cognition?.neuromodulators?.stress_level || 0
  }));
  process.exit(0);
} catch (e) {
  console.error(JSON.stringify({ success: false, error: e.message }));
  process.exit(1);
}
