#!/usr/bin/env node

/**
 * SOVEREIGN SENTINEL (SPEC-3.1.1a-Sentinel)
 * ========================================
 * Read-only observer for system integrity.
 * Polls .forge/state.json and reports drift/stalls.
 */

const fs = require('fs');
const path = require('path');

// CONFIG
const INTERVAL_MS = 5000;
const LOG_FILE = path.resolve('.forge', 'sentinel.log');
const EVENTS_DIR = path.resolve('.forge', 'sentinel-events');
const STATE_FILE = path.resolve('.forge', 'state.json');
const TMP_FILE = path.resolve('.forge', 'state.tmp.json');
const RULES_FILE = path.resolve('.agent', 'rules.md');
const VERSION = '3.2.0';
const EXPECTED_OBJECTIVE = null; // Objectives are user-defined via !start

const PRIMARY_FAULT_CODES = new Set([
  'DIRTY_STATE_RECOVERY_REQUIRED',
  'INVALID_STATE_SHAPE',
  'INCOMPATIBLE_STATE_VERSION',
  'STATE_MISSING'
]);

const { saveStateAtomic } = require('./sovereign-os');

let lastAlerts = new Map(); // For deduplication
let currentPollPrimaryCode = null;

function appendSentinelLog(line) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${line}\n`, 'utf8');
  } catch (err) {
    // Logging failure must not crash the process
  }
}

function captureIncidentSnapshot(code, level, message, state, isPrimary = false, parentCode = null) {
  try {
    if (!fs.existsSync(EVENTS_DIR)) {
      fs.mkdirSync(EVENTS_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const safeTimestamp = timestamp.replace(/:/g, '-');
    const filename = `${safeTimestamp}__${code}.json`;
    const filepath = path.join(EVENTS_DIR, filename);

    const snapshot = {
      timestamp,
      alert_code: code,
      severity: level,
      is_primary: isPrimary,
      root_cause_ref: parentCode,
      message,
      kernel_context: {
        version: state?.version || 'unknown',
        phase: state?.lifecycle?.phase || 'unknown',
        health: state?.telemetry?.last_error ? 'ERROR' : 'DERIVED',
        gate_status: state?.control?.gate_status || 'NONE',
        last_error: state?.telemetry?.last_error || null
      },
      recent_telemetry: (state?.telemetry?.recent_events || []).slice(-5)
    };

    fs.writeFileSync(filepath, JSON.stringify(snapshot, null, 2), 'utf8');
  } catch (err) {
    // Snapshot failure must not crash the process
  }
}

function emitFinding(level, code, message, state = null) {
  let isPrimary = PRIMARY_FAULT_CODES.has(code);
  let parentCode = (isPrimary || currentPollPrimaryCode === code) ? null : currentPollPrimaryCode;

  const alert = `[SENTINEL][${level}][${code}]${parentCode ? ` [DEP:${parentCode}]` : ''} ${message}`;
  
  // Deduplication: Only print/snapshot if code/level or message changed
  if (lastAlerts.get(code) === alert) return;
  
  console.log(alert);
  appendSentinelLog(alert);
  
  if (state && state !== 'MALFORMED') {
    captureIncidentSnapshot(code, level, message, state, isPrimary, parentCode);
  }

  lastAlerts.set(code, alert);
}

function readStateSnapshot(retryCount = 0) {
  if (!fs.existsSync(STATE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (err) {
    if (retryCount < 5) {
      // Small delay to account for renameSync millisecond gap
      const start = Date.now();
      while (Date.now() - start < 10);
      return readStateSnapshot(retryCount + 1);
    }
    return 'MALFORMED';
  }
}

function recordWarning(message, state) {
  try {
    if (!state || state === 'MALFORMED') return;
    const now = new Date().toISOString();
    state.telemetry.warnings.push({
      message,
      at: now,
      source: 'SENTINEL'
    });
    if (state.telemetry.warnings.length > 20) {
      state.telemetry.warnings = state.telemetry.warnings.slice(-20);
    }
    saveStateAtomic(state);
  } catch (err) {
    // Failure to write warning must not crash observer
  }
}

function checkDirtyTemp(state) {
  if (fs.existsSync(TMP_FILE)) {
    emitFinding('CRITICAL', 'DIRTY_STATE_RECOVERY_REQUIRED', 'state.tmp.json detected', state);
    return true;
  }
  return false;
}

function checkObjectiveDrift(state) {
  if (!state || state === 'MALFORMED') return;
  const obj = state.context?.objective;
  if (obj && obj !== EXPECTED_OBJECTIVE) {
    emitFinding('WARN', 'OBJECTIVE_DRIFT', `Objective '${obj}' differs from spec anchor`, state);
  }
}

function checkRecoveryState(state) {
  if (!state || state === 'MALFORMED') return;
  if (state.lifecycle?.phase === 'ERROR_RECOVERY') {
    emitFinding('ERROR', 'RECOVERY_ACTIVE', `Phase=ERROR_RECOVERY Gate=${state.control?.gate_status}`, state);
  }
}

function checkRecoveryLoop(state) {
  if (!state || state === 'MALFORMED') return;
  const events = state.telemetry?.recent_events || [];
  const entries = events.filter(e => e.to === 'ERROR_RECOVERY').length;
  
  if (entries >= 3) {
    emitFinding('CRITICAL', 'RECOVERY_LOOP', `${entries} entries into ERROR_RECOVERY in ring buffer`, state);
  }
}

function checkRoleParity(state, rulesContent) {
  if (!state || state === 'MALFORMED' || !rulesContent) return;
  const role = state.context?.active_role;
  if (!role) {
    emitFinding('ERROR', 'ROLE_PARITY_DRIFT', 'Missing context.active_role', state);
    return;
  }
  
  if (!rulesContent.includes(`| ${role.toUpperCase()}`)) {
    emitFinding('ERROR', 'ROLE_PARITY_DRIFT', `Role '${role}' has no mapping in .agent/rules.md`, state);
  }
}

function classifyHealth(state) {
  if (!state) {
    emitFinding('CRITICAL', 'STATE_MISSING', 'state.json not found', state);
    return;
  }
  if (state === 'MALFORMED') {
    emitFinding('CRITICAL', 'INVALID_STATE_SHAPE', 'state.json is malformed or unreadable', state);
    return;
  }

  if (state.version !== VERSION) {
    emitFinding('CRITICAL', 'INCOMPATIBLE_STATE_VERSION', `Found v${state.version || 'unknown'}, expected v${VERSION}`, state);
  }

  const now = Date.now();
  const lastTransition = new Date(state.lifecycle?.last_transition_at).getTime();
  const threshold = state.lifecycle?.stall_threshold_ms || 3600000;
  const elapsed = now - lastTransition;

  if (state.telemetry?.last_error) {
    emitFinding('ERROR', 'HEALTH_ERROR', 'Kernel reports ERROR state', state);
  } else if (state.control?.requires_human) {
    if (elapsed > threshold) {
      emitFinding('ERROR', 'GATE_OVERDUE', 'Human gate is overdue', state);
    } else {
      emitFinding('INFO', 'AWAITING_GATE', 'Awaiting human gate approval', state);
    }
  } else if (elapsed > threshold) {
    emitFinding('ERROR', 'STALLED', 'System has stalled (no transitions within threshold)', state);
  } else if (elapsed > threshold * 0.5) {
    emitFinding('WARN', 'SLOW', 'System transition frequency is slow', state);
  } else {
    emitFinding('INFO', 'HEALTHY', `Phase=${state.lifecycle?.phase} Health=HEALTHY`, state);
  }
}

function runSentinel() {
  console.log(`[SENTINEL] Booted. Polling every ${INTERVAL_MS}ms...`);
  console.log(`[SENTINEL] Observer Path: ${STATE_FILE}`);
  console.log(`[SENTINEL] Snapshot Path: ${EVENTS_DIR}`);
  
  function poll() {
    const state = readStateSnapshot();
    const rulesContent = fs.existsSync(RULES_FILE) ? fs.readFileSync(RULES_FILE, 'utf8') : null;

    currentPollPrimaryCode = null;
    // Detect Root Causes first
    if (fs.existsSync(TMP_FILE)) {
      currentPollPrimaryCode = 'DIRTY_STATE_RECOVERY_REQUIRED';
    } else if (!state) {
      currentPollPrimaryCode = 'STATE_MISSING';
    } else if (state === 'MALFORMED') {
      currentPollPrimaryCode = 'INVALID_STATE_SHAPE';
    } else if (state && state.version !== VERSION) {
      currentPollPrimaryCode = 'INCOMPATIBLE_STATE_VERSION';
    }

    checkDirtyTemp(state);
    classifyHealth(state);
    checkObjectiveDrift(state);
    checkRecoveryState(state);
    checkRecoveryLoop(state);
    checkRoleParity(state, rulesContent);
    
    setTimeout(poll, INTERVAL_MS);
  }

  poll();
}

// Ensure log dir exists
const forgeDir = path.dirname(STATE_FILE);
if (!fs.existsSync(forgeDir)) fs.mkdirSync(forgeDir, { recursive: true });

if (require.main === module) {
  runSentinel();
}
