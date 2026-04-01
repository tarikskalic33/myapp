#!/usr/bin/env node
// genesis.js — Sovereign AGI OS Self-Assembly
// Usage: node genesis.js (run once to scaffold)
'use strict';
const fs = require('fs');
const path = require('path');

console.log('SOVEREIGN AGI OS — GENESIS');
console.log('==========================\n');

const dirs = [
  '.forge/docs',
  '.forge/sentinel-events',
  '.memory/archive',
  '.memory/genetic-archive',
  '.agent/templates',
  'tools',
  'ai_prompts',
  'docs'
];

dirs.forEach(dir => {
  const full = path.resolve(__dirname, dir);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
    console.log('created: ' + dir);
  } else {
    console.log('exists:  ' + dir);
  }
});

const stateFile = path.resolve(__dirname, '.forge', 'state.json');
if (!fs.existsSync(stateFile)) {
  const now = new Date().toISOString();
  const state = {
    version: '3.2.0',
    meta: {
      session_id: 'GENESIS',
      project_id: 'system_rebuild',
      created_at: now,
      last_updated: now
    },
    lifecycle: {
      phase: 'IDLE',
      last_transition_at: now,
      stall_threshold_ms: 3600000
    },
    control: {
      gate_status: 'NONE',
      requires_human: false
    },
    context: {
      active_role: 'BUILDER',
      objective: null,
      permissions: {
        authorized_tools: ['write_file', 'edit_code', 'git'],
        forbidden: ['read_discord']
      }
    },
    pipeline: {
      progress_percent: 0,
      task_cursor: 0,
      tasks: []
    },
    telemetry: {
      last_success_action: 'GENESIS',
      last_error: null,
      warnings: [],
      recent_events: []
    },
    cognition: {
      reflections: [],
      patterns: {
        cancel_streak: 0,
        error_streak: 0,
        avg_mission_duration_ms: 0,
        completed_missions: 0,
        total_transitions: 0
      },
      self_assessment: {
        clarity: 1.0,
        momentum: 1.0,
        friction: 0.0,
        coherence: 1.0
      },
      last_reflection_at: now,
      neuromodulators: {
        attention_gain: 1.0,
        learning_rate: 0.15,
        stress_level: 0.0,
        curiosity_drive: 0.5
      }
    },
    metabolism: {
      atp_balance: 3000,
      max_capacity: 10000,
      last_updated: Date.now(),
      total_consumed: 0,
      total_earned: 0,
      hunger_state: 'HUNGRY',
      conservation_mode: true,
      objectives_completed: 0,
      objectives_failed: 0
    }
  };
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + '\n');
  console.log('created: .forge/state.json');
} else {
  console.log('exists:  .forge/state.json (not overwritten)');
}

const bountyFile = path.resolve(__dirname, '.forge', 'bounties.json');
if (!fs.existsSync(bountyFile)) {
  fs.writeFileSync(bountyFile,
    JSON.stringify({ active: [], completed: [] }, null, 2) + '\n');
  console.log('created: .forge/bounties.json');
}

console.log('\nGENESIS COMPLETE');
console.log('Next: node tools/validate-state.js');
console.log('Then: node start.js');
