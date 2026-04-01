#!/usr/bin/env node
// tools/log-action.js
// Write cognitive events to audit trail
// Usage: node tools/log-action.js <EVENT_TYPE> "<details>"
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error(JSON.stringify({
    success: false,
    error: 'No event type provided'
  }));
  process.exit(1);
}

const eventType = args[0];
const details = args[1] || '';
const auditFile = path.resolve(__dirname, '..', '.forge', 'docs', 'audit.jsonl');

const logEntry = JSON.stringify({
  timestamp: new Date().toISOString(),
  event: eventType,
  agent: 'Sovereign-Local',
  details
}) + '\n';

try {
  fs.mkdirSync(path.dirname(auditFile), { recursive: true });
  fs.appendFileSync(auditFile, logEntry);
  console.log(JSON.stringify({ success: true, event: eventType }));
  process.exit(0);
} catch (e) {
  console.error(JSON.stringify({ success: false, error: e.message }));
  process.exit(1);
}
