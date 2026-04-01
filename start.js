#!/usr/bin/env node
// start.js — Sovereign AGI OS Boot Sequence V3.2.0
// Usage: node start.js
'use strict';
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NODE_BIN = process.env.NODE_BIN ||
  'C:/Users/hhk33/AppData/Local/ms-playwright-go/1.50.1/node.exe';
const PROJECT_ROOT = process.env.PROJECT_ROOT || __dirname;
const TMP_FILE = path.join(PROJECT_ROOT, '.forge', 'state.tmp.json');

console.log('==========================================');
console.log('SOVEREIGN AGI OS V3.2.0 — BOOT');
console.log('==========================================\n');

// 0. Check for dirty state
if (fs.existsSync(TMP_FILE)) {
  console.error('DIRTY_STATE: state.tmp.json exists.');
  console.error('Manual intervention required before boot.');
  process.exit(1);
}

// 1. Validate state
try {
  execSync(`"${NODE_BIN}" tools/validate-state.js`, {
    stdio: 'inherit',
    cwd: PROJECT_ROOT
  });
  console.log('State: validated\n');
} catch {
  console.error('State validation failed.');
  console.error('Run: node genesis.js (if first boot)');
  process.exit(1);
}

// 2. Spawn sentinel
const sentinel = spawn(NODE_BIN, ['sentinel.js'], {
  stdio: 'inherit',
  cwd: PROJECT_ROOT
});

// 3. Spawn Discord bot with env file
const discord = spawn(
  NODE_BIN,
  ['--env-file=.env', 'sovereign-discord.js'],
  {
    stdio: 'inherit',
    cwd: PROJECT_ROOT
  }
);

console.log('Sentinel: running');
console.log('Discord bot: running');
console.log('\nType !status in Discord to verify.');
console.log('Type !health for full state validation.\n');

function shutdown() {
  console.log('\nShutting down Sovereign AGI OS...');
  sentinel.kill('SIGINT');
  discord.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
sentinel.on('close', code =>
  console.warn(`[SYSTEM] Sentinel exited: ${code}`));
discord.on('close', code =>
  console.warn(`[SYSTEM] Discord Shell exited: ${code}`));
