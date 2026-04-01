#!/usr/bin/env node
// tools/validate-godot-scene.js — Parse .tscn files, verify node wiring
// Usage: node tools/validate-godot-scene.js <path.tscn> [--find-node Name] [--check-signal Name]
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (!args.length) {
  console.error(JSON.stringify({ success: false, error: 'No file path provided' }));
  process.exit(1);
}

const filePath = path.resolve(args[0]);
if (!fs.existsSync(filePath)) {
  console.error(JSON.stringify({ success: false, file: args[0], error: 'File not found' }));
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const nodes = [];
const signals = [];
const extResources = [];

for (const line of lines) {
  const nodeMatch = line.match(/^\[node name="([^"]+)"/);
  if (nodeMatch) nodes.push(nodeMatch[1]);

  const signalMatch = line.match(/^\[connection signal="([^"]+)"/);
  if (signalMatch) signals.push(signalMatch[1]);

  const extMatch = line.match(/^\[ext_resource .* path="([^"]+)"/);
  if (extMatch) extResources.push(extMatch[1]);
}

const findNodeIdx = args.indexOf('--find-node');
const checkSignalIdx = args.indexOf('--check-signal');
const findNode = findNodeIdx !== -1 ? args[findNodeIdx + 1] : null;
const checkSignal = checkSignalIdx !== -1 ? args[checkSignalIdx + 1] : null;

const result = {
  success: true,
  file: args[0],
  total_nodes: nodes.length,
  nodes_found: nodes,
  total_signals: signals.length,
  signals_found: signals,
  ext_resources: extResources.length
};

if (findNode) {
  result.node_searched = findNode;
  result.node_found = nodes.includes(findNode);
}
if (checkSignal) {
  result.signal_searched = checkSignal;
  result.signal_found = signals.includes(checkSignal);
}

console.log(JSON.stringify(result, null, 2));
process.exit(0);
