#!/usr/bin/env node
// tools/parse-godot-logs.js — Read Godot runtime error logs
// Usage: node tools/parse-godot-logs.js <logfile>
'use strict';
const fs = require('fs');

const logPath = process.argv[2];
if (!logPath || !fs.existsSync(logPath)) {
  console.log(JSON.stringify({ success: false, error: 'No log file found' }));
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');
const errors = lines.filter(l =>
  l.includes('ERROR') || l.includes('SCRIPT ERROR')
);
const warnings = lines.filter(l => l.includes('WARNING'));

console.log(JSON.stringify({
  success: true,
  total_lines: lines.length,
  error_count: errors.length,
  warning_count: warnings.length,
  errors: errors.slice(0, 10),
  warnings: warnings.slice(0, 5),
  clean: errors.length === 0
}));
