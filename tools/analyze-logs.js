#!/usr/bin/env node
// tools/analyze-logs.js — Read sentinel + audit logs
// Usage: node tools/analyze-logs.js
'use strict';
const fs = require('fs');
const path = require('path');

const SENTINEL_LOG = path.resolve(__dirname, '..', '.forge', 'sentinel.log');
const AUDIT_LOG = path.resolve(__dirname, '..', '.forge', 'docs', 'audit.jsonl');

if (!fs.existsSync(SENTINEL_LOG) && !fs.existsSync(AUDIT_LOG)) {
  console.log('No logs found.');
  process.exit(0);
}

if (fs.existsSync(SENTINEL_LOG)) {
  const logs = fs.readFileSync(SENTINEL_LOG, 'utf8');
  console.log('=== SENTINEL LOG (last 500 chars) ===');
  console.log(logs.slice(-500));
}

if (fs.existsSync(AUDIT_LOG)) {
  const lines = fs.readFileSync(AUDIT_LOG, 'utf8')
    .trim().split('\n').filter(Boolean).slice(-10);
  console.log('\n=== AUDIT LOG (last 10 entries) ===');
  lines.forEach(line => {
    try {
      const e = JSON.parse(line);
      console.log(`[${e.timestamp}] ${e.event} — ${e.details || e.agent}`);
    } catch {
      console.log(line);
    }
  });
}
