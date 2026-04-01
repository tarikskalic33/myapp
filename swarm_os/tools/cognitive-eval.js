#!/usr/bin/env node
// © 2026 Tarik Skalic — Sovereign AGI OS. All rights reserved.
// tools/cognitive-eval.js — DeepMind 10-faculty cognitive self-evaluation
// Multiplier composite: metacognition × executive degrade all others
// Usage: node tools/cognitive-eval.js
'use strict';
const fs = require('fs');
const path = require('path');

const STATE_FILE = path.resolve(__dirname, '..', '.forge', 'state.json');
const AUDIT_FILE = path.resolve(__dirname, '..', '.forge', 'docs', 'audit.jsonl');
const SKILLS_FILE = path.resolve(__dirname, '..', '.agent', 'skills.md');
const WORKFLOWS_FILE = path.resolve(__dirname, '..', '.agent', 'workflows.md');
const EVAL_LOG = path.resolve(__dirname, '..', '.forge', 'cognitive-profile.json');

function readJSON(f) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch { return null; }
}

function readText(f) {
  try { return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : ''; }
  catch { return ''; }
}

function readAudit() {
  try {
    if (!fs.existsSync(AUDIT_FILE)) return [];
    return fs.readFileSync(AUDIT_FILE, 'utf8')
      .trim().split('\n').filter(Boolean)
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
  } catch { return []; }
}

const state = readJSON(STATE_FILE);
if (!state) {
  console.error('No state file found.');
  process.exit(1);
}

const auditEvents = readAudit();
const recentEvents = state.telemetry?.recent_events || [];
const allEvents = [...auditEvents, ...recentEvents];
const skills = readText(SKILLS_FILE);
const workflows = readText(WORKFLOWS_FILE);

function count(eventType) {
  return allEvents.filter(e =>
    e.event === eventType || (e.details && e.details.includes(eventType))
  ).length;
}

const lastError = state.telemetry?.last_error;
const planCreated = count('PLAN_CREATED');
const planMutations = count('PLAN_MUTATED');
const fatalBlockers = count('FATAL_BLOCKER');
const gateApprovals = count('GATE_APPROVED');
const laneViolations = count('LANE_VIOLATION');
const scopeCreep = count('SCOPE_CREEP');
const skillChecks = count('SKILL_CHECK');
const contextRot = count('CONTEXT_ROT');
const missingCap = count('MISSING_CAPABILITY');
const handoffs = count('HANDOFF');
const missionReports = count('MISSION_REPORT');

const hasSkills = skills.split('###').length > 2;
const hasWorkflows = workflows.split('###').length > 2;
const warnings = state.telemetry?.warnings?.length || 0;
const neuro = state.cognition?.neuromodulators || {};
const atpState = state.metabolism?.hunger_state || 'N/A';
const atp = state.metabolism?.atp_balance || 0;

// ── 1. PERCEPTION ────────────────────────────────────────
const perceptionScore = Math.min(100,
  (fs.existsSync(path.resolve(__dirname, 'validate-godot-scene.js')) ? 25 : 0) +
  (fs.existsSync(path.resolve(__dirname, 'parse-godot-logs.js')) ? 25 : 0) +
  (fs.existsSync(path.resolve(__dirname, 'analyze-logs.js')) ? 25 : 0) +
  (fs.existsSync(path.resolve(__dirname, 'validate-state.js')) ? 25 : 0)
);

// ── 2. GENERATION ────────────────────────────────────────
const generationScore = Math.min(100,
  (missionReports * 40) +
  (planCreated > 0 ? 30 : 0) +
  (!lastError ? 30 : 0)
);

// ── 3. ATTENTION ─────────────────────────────────────────
const attentionScore = Math.min(100,
  Math.max(0, 100 - (laneViolations * 30) - (scopeCreep * 40))
);

// ── 4. LEARNING ──────────────────────────────────────────
const learningScore = Math.min(100,
  (hasSkills ? 25 : 0) +
  (hasWorkflows ? 25 : 0) +
  (skillChecks * 15) +
  (count('WORKFLOW_USED') * 15)
);

// ── 5. MEMORY ────────────────────────────────────────────
const memoryScore = Math.min(100,
  (hasSkills ? 30 : 0) +
  (hasWorkflows ? 30 : 0) +
  (fs.existsSync(path.resolve(__dirname, '..', '.memory', 'session_snapshot.md')) ? 20 : 0) +
  (fs.existsSync(STATE_FILE) ? 20 : 0)
);

// ── 6. REASONING ─────────────────────────────────────────
const reasoningScore = Math.min(100,
  (planCreated > 0 ? 30 : 0) +
  (fatalBlockers === 0 ? 25 : 0) +
  (gateApprovals * 15) +
  (planMutations > 0 ? 30 : 0)
);

// ── 7. METACOGNITION (MULTIPLIER) ────────────────────────
const metacognitionScore = Math.min(100,
  (skillChecks * 20) +
  (contextRot * 20) +
  (missingCap * 20) +
  (!lastError ? 40 : 0)
);

// ── 8. EXECUTIVE FUNCTION (MULTIPLIER) ───────────────────
const executiveScore = Math.min(100,
  (planCreated > 0 ? 35 : 0) +
  (gateApprovals * 15) +
  (fatalBlockers > 0 ? 25 : 0) +
  (atpState !== 'STARVING' ? 10 : 0)
);

// ── 9. PROBLEM SOLVING (COMPOSITE) ──────────────────────
const problemSolvingScore = Math.round(
  (reasoningScore + executiveScore + attentionScore) / 3
);

// ── 10. SOCIAL COGNITION ─────────────────────────────────
const socialScore = Math.min(100,
  (handoffs * 20) +
  (missionReports * 30) +
  (warnings === 0 ? 20 : 0)
);

// ── COMPOSITE (multiplier model) ─────────────────────────
const composite = Math.round(
  (learningScore + generationScore + reasoningScore +
   attentionScore + socialScore) / 5
  * (metacognitionScore / 100)
  * (executiveScore / 100)
);

// ── EVOLUTION TRIGGERS ───────────────────────────────────
const triggers = [];
if (learningScore < 50) triggers.push('LEARNING → populate skills.md and workflows.md');
if (generationScore < 50) triggers.push('GENERATION → add MISSION_REPORT logging to loop');
if (reasoningScore < 50) triggers.push('REASONING → enforce plan.md + track PLAN_MUTATED');
if (attentionScore < 50) triggers.push('ATTENTION → add scope lock enforcement');
if (metacognitionScore < 50) triggers.push('METACOGNITION → add SKILL_CHECK logging to pre-flight');
if (executiveScore < 50) triggers.push('EXECUTIVE → enforce plan.md as hard gate');
if (socialScore < 50) triggers.push('SOCIAL → enforce Mission Report in output contract');
if (memoryScore < 50) triggers.push('MEMORY → populate skills.md and workflows.md');
if (perceptionScore < 50) triggers.push('PERCEPTION → build missing /tools/ perception scripts');

// ── BUILD PROFILE ────────────────────────────────────────
const profile = {
  timestamp: new Date().toISOString(),
  objective: state.context?.objective || 'unknown',
  composite,
  autonomy_level: 'Level 3 (Expert) — human gates active',
  faculties: {
    perception: perceptionScore,
    generation: generationScore,
    attention: attentionScore,
    learning: learningScore,
    memory: memoryScore,
    reasoning: reasoningScore,
    metacognition: metacognitionScore,
    executive_functions: executiveScore,
    problem_solving: problemSolvingScore,
    social_cognition: socialScore
  },
  multipliers: {
    metacognition: metacognitionScore,
    executive_functions: executiveScore
  },
  neuromodulators: neuro,
  metabolism: atpState,
  evolution_triggers: triggers
};

const existing = fs.existsSync(EVAL_LOG)
  ? (readJSON(EVAL_LOG) || { sessions: [] })
  : { sessions: [] };
existing.sessions.push(profile);
fs.mkdirSync(path.dirname(EVAL_LOG), { recursive: true });
fs.writeFileSync(EVAL_LOG, JSON.stringify(existing, null, 2));

const bar = n =>
  '█'.repeat(Math.round(n / 10)) +
  '░'.repeat(10 - Math.round(n / 10));

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║        SOVEREIGN AGI — COGNITIVE PROFILE              ║');
console.log('╠══════════════════════════════════════════════════════╣');
console.log(`║ Composite:  ${String(composite + '%').padEnd(10)} (meta×exec multiplier)        ║`);
console.log(`║ Autonomy:   Level 3 (Expert) — human gates active    ║`);
console.log('╠══════════════════════════════════════════════════════╣');
console.log(`║ 1. Perception:        ${bar(perceptionScore)} ${String(perceptionScore + '%').padEnd(5)}║`);
console.log(`║ 2. Generation:        ${bar(generationScore)} ${String(generationScore + '%').padEnd(5)}║`);
console.log(`║ 3. Attention:         ${bar(attentionScore)} ${String(attentionScore + '%').padEnd(5)}║`);
console.log(`║ 4. Learning:          ${bar(learningScore)} ${String(learningScore + '%').padEnd(5)}║`);
console.log(`║ 5. Memory:            ${bar(memoryScore)} ${String(memoryScore + '%').padEnd(5)}║`);
console.log(`║ 6. Reasoning:         ${bar(reasoningScore)} ${String(reasoningScore + '%').padEnd(5)}║`);
console.log(`║ 7. Metacognition [M]: ${bar(metacognitionScore)} ${String(metacognitionScore + '%').padEnd(5)}║`);
console.log(`║ 8. Executive Fn  [M]: ${bar(executiveScore)} ${String(executiveScore + '%').padEnd(5)}║`);
console.log(`║ 9. Problem Solving:   ${bar(problemSolvingScore)} ${String(problemSolvingScore + '%').padEnd(5)}║`);
console.log(`║10. Social Cognition:  ${bar(socialScore)} ${String(socialScore + '%').padEnd(5)}║`);
console.log('╠══════════════════════════════════════════════════════╣');
if (Object.keys(neuro).length > 0) {
  console.log(`║ ENDOCRINE: Stress: ${(neuro.stress_level || 0).toFixed(2)} | Attention: ${(neuro.attention_gain || 1).toFixed(2).padEnd(13)} ║`);
  console.log(`║ CIRCULATORY: ATP: ${String(atp).padEnd(8)} | State: ${(atpState || 'N/A').padEnd(15)} ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
}
if (triggers.length > 0) {
  console.log('║ EVOLUTION TRIGGERS:                                  ║');
  triggers.forEach(t =>
    console.log(`║ → ${t.slice(0, 52).padEnd(52)} ║`));
} else {
  console.log('║ ✅ All faculties healthy. No evolution triggers.     ║');
}
console.log('╚══════════════════════════════════════════════════════╝');
console.log('\nSaved → .forge/cognitive-profile.json\n');
process.exit(0);
