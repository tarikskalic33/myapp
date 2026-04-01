#!/usr/bin/env node
// tools/universal-verify.js — Domain-agnostic verification layer
// Exit 0 = verified. Exit 1 = failed.
// Usage: node tools/universal-verify.js "<command>"
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const command = process.argv.slice(2).join(' ');
if (!command) {
  console.error(JSON.stringify({
    success: false,
    error: 'No command provided',
    usage: 'node tools/universal-verify.js "<command>"'
  }));
  process.exit(1);
}

const auditFile = path.resolve(__dirname, '..', '.forge', 'docs', 'audit.jsonl');

function logAudit(event, details) {
  try {
    fs.mkdirSync(path.dirname(auditFile), { recursive: true });
    fs.appendFileSync(auditFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      agent: 'universal-verify',
      details
    }) + '\n');
  } catch {}
}

try {
  const output = execSync(command, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  logAudit('VERIFY_PASS', command);
  console.log(JSON.stringify({
    success: true,
    command,
    output: output.slice(0, 500),
    exit_code: 0
  }));
  process.exit(0);
} catch (e) {
  const stderr = (e.stderr?.toString() || e.message || 'unknown error');
  const stdout = (e.stdout?.toString() || '');
  logAudit('VERIFY_FAIL', `${command} → ${stderr.slice(0, 200)}`);
  console.error(JSON.stringify({
    success: false,
    command,
    error: stderr.slice(0, 1000),
    output: stdout.slice(0, 500),
    exit_code: e.status || 1
  }));
  process.exit(1);
}
