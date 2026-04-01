#!/usr/bin/env node
// tools/biology-engine.js
// CIRCULATORY SYSTEM: ATP Metabolic Engine
// NERVOUS SYSTEM: TF-IDF Hippocampal Sleep Consolidation
// IMMUNE SYSTEM: Evolutionary antifragile adaptation
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PATHS = {
  auditLog: path.resolve(__dirname, '..', '.forge', 'docs', 'audit.jsonl'),
  stateFile: path.resolve(__dirname, '..', '.forge', 'state.json'),
  skillsFile: path.resolve(__dirname, '..', '.agent', 'skills.md'),
  workflowsFile: path.resolve(__dirname, '..', '.agent', 'workflows.md'),
  bountyBoard: path.resolve(__dirname, '..', '.forge', 'bounties.json'),
  archiveDir: path.resolve(__dirname, '..', '.memory', 'archive'),
  geneticArchive: path.resolve(__dirname, '..', '.memory', 'genetic-archive')
};

// ── ATOMIC STATE WRITE ────────────────────────────────────────
function saveStateAtomic(state) {
  const tmp = PATHS.stateFile + '.tmp';
  state.meta = state.meta || {};
  state.meta.last_updated = new Date().toISOString();
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
  const fd = fs.openSync(tmp, 'r');
  fs.fsyncSync(fd);
  fs.closeSync(fd);
  fs.renameSync(tmp, PATHS.stateFile);
}

// ── NERVOUS SYSTEM: TF-IDF SEMANTIC ENCODER ──────────────────
class SemanticEncoder {
  constructor() {
    this.documents = [];
    this.vocabulary = new Set();
    this.idf = new Map();
  }

  tokenize(text) {
    return String(text).toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  computeTF(tokens) {
    const freq = {};
    tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq), 1);
    Object.keys(freq).forEach(t => freq[t] = freq[t] / maxFreq);
    return freq;
  }

  fit(docs) {
    this.documents = docs.map(d => this.tokenize(d));
    this.vocabulary = new Set();
    this.documents.forEach(tokens =>
      tokens.forEach(t => this.vocabulary.add(t)));

    Array.from(this.vocabulary).forEach(term => {
      const docCount = this.documents
        .filter(tokens => tokens.includes(term)).length;
      this.idf.set(term,
        Math.log(this.documents.length / (docCount + 1)) + 1);
    });
    return this;
  }

  encode(text) {
    const tokens = this.tokenize(text);
    const tf = this.computeTF(tokens);
    const vector = new Map();
    this.vocabulary.forEach(term => {
      const value = (tf[term] || 0) * (this.idf.get(term) || 0);
      if (value > 0) vector.set(term, value);
    });
    return vector;
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    vecA.forEach((v, t) => {
      normA += v * v;
      if (vecB.has(t)) dot += v * vecB.get(t);
    });
    vecB.forEach(v => normB += v * v);
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}

// ── NERVOUS SYSTEM: HIPPOCAMPAL SLEEP CONSOLIDATION ──────────
async function sleepCycle() {
  console.log('SLEEP: Hippocampal consolidation initiated...');

  if (!fs.existsSync(PATHS.auditLog)) {
    return { success: false, reason: 'No audit log found' };
  }

  const rawLines = fs.readFileSync(PATHS.auditLog, 'utf8')
    .split('\n').filter(Boolean);
  if (rawLines.length < 5) {
    return { success: false, reason: 'Insufficient data (<5 episodes)' };
  }

  const audit = rawLines.map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);

  // Semantic clustering
  const encoder = new SemanticEncoder();
  const texts = audit.map(e => `${e.event} ${e.details || ''}`);
  encoder.fit(texts);

  const clusters = [];
  const processed = new Set();

  for (let i = 0; i < texts.length; i++) {
    if (processed.has(i)) continue;
    const cluster = [i];
    const vecA = encoder.encode(texts[i]);

    for (let j = i + 1; j < texts.length; j++) {
      if (processed.has(j)) continue;
      const vecB = encoder.encode(texts[j]);
      if (encoder.cosineSimilarity(vecA, vecB) > 0.65) {
        cluster.push(j);
      }
    }
    cluster.forEach(idx => processed.add(idx));
    clusters.push({
      centroid: texts[i],
      episodes: cluster.length,
      vectors: cluster.map(idx => audit[idx])
    });
  }

  // Archive, never delete
  fs.mkdirSync(PATHS.archiveDir, { recursive: true });
  const archivePath = path.join(PATHS.archiveDir,
    `audit-${Date.now()}.jsonl`);
  fs.renameSync(PATHS.auditLog, archivePath);
  console.log(`SLEEP: Archived ${audit.length} episodes to ${archivePath}`);

  // Reduce stress after consolidation
  const state = JSON.parse(fs.readFileSync(PATHS.stateFile, 'utf8'));
  if (state.cognition?.neuromodulators) {
    state.cognition.neuromodulators.stress_level =
      Math.max(0, state.cognition.neuromodulators.stress_level - 0.2);
    state.cognition.neuromodulators.attention_gain =
      Math.min(1.0, state.cognition.neuromodulators.attention_gain + 0.1);
  }
  saveStateAtomic(state);

  return {
    success: true,
    episodes_processed: audit.length,
    clusters_formed: clusters.length,
    archive_path: archivePath,
    stress_reduced: true
  };
}

// ── CIRCULATORY SYSTEM: METABOLIC ENGINE ─────────────────────
class MetabolicEngine {
  constructor() {
    const raw = fs.existsSync(PATHS.stateFile)
      ? fs.readFileSync(PATHS.stateFile, 'utf8') : '{}';
    this.state = JSON.parse(raw);
    if (!this.state.metabolism) {
      this.state.metabolism = {
        atp_balance: 3000,
        max_capacity: 10000,
        total_consumed: 0,
        total_earned: 0,
        hunger_state: 'HUNGRY',
        conservation_mode: true,
        objectives_completed: 0,
        objectives_failed: 0
      };
    }
    this.bounties = fs.existsSync(PATHS.bountyBoard)
      ? JSON.parse(fs.readFileSync(PATHS.bountyBoard, 'utf8'))
      : { active: [], completed: [] };
  }

  save() {
    saveStateAtomic(this.state);
    const tmp = PATHS.bountyBoard + '.tmp';
    fs.mkdirSync(path.dirname(PATHS.bountyBoard), { recursive: true });
    fs.writeFileSync(tmp,
      JSON.stringify(this.bounties, null, 2) + '\n');
    fs.renameSync(tmp, PATHS.bountyBoard);
  }

  updateHungerState() {
    const bal = this.state.metabolism.atp_balance;
    this.state.metabolism.hunger_state =
      bal < 500 ? 'STARVING' :
      bal < 2000 ? 'HUNGRY' :
      bal < 5000 ? 'SATIATED' : 'ABUNDANT';
    this.state.metabolism.conservation_mode = bal < 1000;
  }

  consumeATP(cost) {
    this.state.metabolism.atp_balance -= cost;
    this.state.metabolism.total_consumed += cost;
    this.updateHungerState();
    this.save();
    return this.state.metabolism.atp_balance > 0;
  }

  earnATP(amount) {
    this.state.metabolism.atp_balance = Math.min(
      this.state.metabolism.max_capacity,
      this.state.metabolism.atp_balance + amount
    );
    this.state.metabolism.total_earned += amount;
    this.updateHungerState();
    this.save();
  }

  canAfford(cost) {
    return {
      affordable: this.state.metabolism.atp_balance > cost,
      cost,
      balance: this.state.metabolism.atp_balance,
      state: this.state.metabolism.hunger_state,
      conservation: this.state.metabolism.conservation_mode
    };
  }

  postBounty(objective, tier = 500) {
    const id = crypto.randomUUID().substring(0, 8);
    this.bounties.active.push({
      id, objective, reward: tier,
      min_score: 50,
      posted_at: new Date().toISOString()
    });
    this.save();
    return id;
  }

  claimBounty(id, score) {
    const bounty = this.bounties.active.find(b => b.id === id);
    if (!bounty || score < bounty.min_score) return false;
    this.earnATP(bounty.reward);
    this.state.metabolism.objectives_completed++;
    this.bounties.completed.push({
      ...bounty, score,
      claimed_at: new Date().toISOString()
    });
    this.bounties.active =
      this.bounties.active.filter(b => b.id !== id);
    this.save();
    return true;
  }

  getStatus() {
    return {
      atp: this.state.metabolism.atp_balance,
      state: this.state.metabolism.hunger_state,
      conservation: this.state.metabolism.conservation_mode,
      completed: this.state.metabolism.objectives_completed,
      active_bounties: this.bounties.active.length
    };
  }
}

// ── IMMUNE SYSTEM: EVOLUTIONARY ADAPTATION ───────────────────
async function runEvolution() {
  console.log('EVOLUTION: Antifragile adaptation initiated...');

  const auditEvents = [];
  if (fs.existsSync(PATHS.auditLog)) {
    fs.readFileSync(PATHS.auditLog, 'utf8')
      .split('\n').filter(Boolean).forEach(l => {
        try { auditEvents.push(JSON.parse(l)); } catch {}
      });
  }

  const fatalBlockers = auditEvents
    .filter(e => e.event === 'FATAL_BLOCKER').length;
  const laneViolations = auditEvents
    .filter(e => e.event === 'LANE_VIOLATION').length;
  const contextRot = auditEvents
    .filter(e => e.event === 'CONTEXT_ROT').length;
  const planMutations = auditEvents
    .filter(e => e.event === 'PLAN_MUTATED').length;

  const proposals = [];

  if (fatalBlockers > 0) {
    proposals.push({
      type: 'WORKFLOW',
      name: `fatal-blocker-prevention-${Date.now()}`,
      trigger: `${fatalBlockers} FATAL_BLOCKER events`,
      proposal: 'Add pre-flight validation before EXECUTE phase',
      fitness_score: Math.min(100, 60 + fatalBlockers * 10)
    });
  }

  if (laneViolations > 0) {
    proposals.push({
      type: 'SKILL',
      name: `lane-discipline-${Date.now()}`,
      trigger: `${laneViolations} LANE_VIOLATION events`,
      proposal: 'Add explicit role confirmation before each task',
      fitness_score: Math.min(100, 60 + laneViolations * 10)
    });
  }

  if (contextRot > 0) {
    proposals.push({
      type: 'WORKFLOW',
      name: `context-preservation-${Date.now()}`,
      trigger: `${contextRot} CONTEXT_ROT events`,
      proposal: 'Increase session snapshot frequency',
      fitness_score: Math.min(100, 60 + contextRot * 15)
    });
  }

  if (proposals.length === 0 && planMutations > 2) {
    proposals.push({
      type: 'SKILL',
      name: `plan-stability-${Date.now()}`,
      trigger: `${planMutations} PLAN_MUTATED events`,
      proposal: 'Add constraint validation before plan.md',
      fitness_score: 70
    });
  }

  if (proposals.length > 0) {
    fs.mkdirSync(PATHS.geneticArchive, { recursive: true });
    const archivePath = path.join(PATHS.geneticArchive,
      `evolution-${Date.now()}.json`);
    fs.writeFileSync(archivePath, JSON.stringify({
      timestamp: new Date().toISOString(),
      evidence: { fatalBlockers, laneViolations, contextRot, planMutations },
      proposals
    }, null, 2));
    console.log(`EVOLUTION: ${proposals.length} proposals archived`);
    console.log('EVOLUTION: Human approval required');
  } else {
    console.log('EVOLUTION: No friction detected. System adapting well.');
  }

  return {
    success: true,
    evidence: { fatalBlockers, laneViolations, contextRot, planMutations },
    proposals_generated: proposals.length,
    proposals,
    approval_required: true
  };
}

module.exports = {
  SemanticEncoder,
  sleepCycle,
  MetabolicEngine,
  runEvolution,
  saveStateAtomic
};
