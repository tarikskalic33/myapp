#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const VERSION = "3.2.0";
const FORGE_DIR = path.join(__dirname, ".forge");
const STATE_FILE = path.join(FORGE_DIR, "state.json");
const TMP_FILE = path.join(FORGE_DIR, "state.tmp.json");
const MAX_RECENT_EVENTS = 50;
const MAX_REFLECTIONS = 20;

const LEGAL_TRANSITIONS = {
  IDLE: ["START"],
  PLANNING: ["PLANNER_SUCCESS", "INTERNAL_ERROR", "CANCEL"],
  WAITING_FOR_SUBMISSION: ["SUBMIT", "INTERNAL_ERROR", "CANCEL"],
  GOVERNANCE_CHECK: ["POLICY_PASS", "POLICY_FAIL", "INTERNAL_ERROR"],
  AWAITING_GATE: ["GATE_APPROVED", "GATE_REJECTED", "INTERNAL_ERROR"],
  ERROR_RECOVERY: ["RECOVERY_ACK", "RECOVERY_RESET", "RECOVERY_ABORT"]
};

const EVENT_TO_PHASE = {
  START: "PLANNING",
  PLANNER_SUCCESS: "WAITING_FOR_SUBMISSION",
  SUBMIT: "GOVERNANCE_CHECK",
  POLICY_PASS: "AWAITING_GATE",
  POLICY_FAIL: "ERROR_RECOVERY",
  GATE_APPROVED: "WAITING_FOR_SUBMISSION",
  GATE_REJECTED: "ERROR_RECOVERY",
  INTERNAL_ERROR: "ERROR_RECOVERY",
  RECOVERY_ACK: "ERROR_RECOVERY",
  RECOVERY_RESET: "WAITING_FOR_SUBMISSION",
  RECOVERY_ABORT: "IDLE",
  CANCEL: "IDLE"
};

const ALLOWED_PAYLOAD_KEYS = new Set([
  "reason",
  "tool",
  "actor",
  "command",
  "gate_decision",
  "error_code",
  "note",
  "source"
]);

function ensureForgeDir() {
  if (!fs.existsSync(FORGE_DIR)) {
    fs.mkdirSync(FORGE_DIR, { recursive: true });
  }
}

function createDefaultState() {
  const now = new Date().toISOString();
  return {
    version: VERSION,
    meta: {
      session_id: `MOCK_${Date.now()}`,
      project_id: "sovereign_mvp",
      created_at: now,
      last_updated: now
    },
    lifecycle: {
      phase: "IDLE",
      last_transition_at: now,
      stall_threshold_ms: 3600000
    },
    control: {
      gate_status: "NONE",
      requires_human: false
    },
    context: {
      active_role: "BUILDER",
      objective: "Boot V3.1.1a Kernel",
      permissions: {
        authorized_tools: ["write_file", "edit_code", "git"],
        forbidden: ["web_search", "external_api", "read_discord"]
      }
    },
    pipeline: {
      progress_percent: 0,
      task_cursor: 0,
      tasks: []
    },
    telemetry: {
      last_success_action: "KERNEL_INIT",
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
        clarity: 1.0,     // 0-1: How clear is the current objective?
        momentum: 1.0,    // 0-1: Are we making forward progress?
        friction: 0.0,    // 0-1: How much resistance are we hitting?
        coherence: 1.0    // 0-1: Are transitions logical and ordered?
      },
      last_reflection_at: null
    }
  };
}

function assertCompatibleState(state) {
  if (!state || typeof state !== "object") {
    throw new Error("INVALID_STATE_OBJECT");
  }

  if (state.version !== VERSION) {
    const err = new Error("INCOMPATIBLE_STATE_VERSION");
    err.code = "INCOMPATIBLE_STATE_VERSION";
    throw err;
  }

  if (!state.meta || !state.lifecycle || !state.control || !state.telemetry) {
    throw new Error("INVALID_STATE_SHAPE");
  }
}

function loadState() {
  if (fs.existsSync(TMP_FILE)) {
    throw new Error("DIRTY_STATE_RECOVERY_REQUIRED");
  }

  if (!fs.existsSync(STATE_FILE)) {
    return createDefaultState();
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    throw new Error("INVALID_STATE_SHAPE");
  }

  assertCompatibleState(parsed);
  return parsed;
}

function sanitizePayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {};
  }

  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (!ALLOWED_PAYLOAD_KEYS.has(key)) continue;
    if (Object.keys(out).length >= 8) break;

    if (value === null || typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
      continue;
    }

    if (typeof value === "string") {
      out[key] = value.length > 200 ? `${value.slice(0, 200)}...[truncated]` : value;
    }
  }

  return out;
}

function pushEvent(state, record) {
  state.telemetry.recent_events.push(record);
  if (state.telemetry.recent_events.length > MAX_RECENT_EVENTS) {
    state.telemetry.recent_events = state.telemetry.recent_events.slice(-MAX_RECENT_EVENTS);
  }
}

function transition(state, eventType, payload = {}) {
  const currentPhase = state.lifecycle.phase;
  const legal = LEGAL_TRANSITIONS[currentPhase] || [];

  if (!legal.includes(eventType)) {
    throw new Error(`ILLEGAL TRANSITION: ${currentPhase} -> ${eventType}`);
  }

  const nextPhase = EVENT_TO_PHASE[eventType];
  const now = new Date().toISOString();

  state.lifecycle.phase = nextPhase;
  state.lifecycle.last_transition_at = now;
  state.meta.last_updated = now;

  pushEvent(state, {
    event: eventType,
    from: currentPhase,
    to: nextPhase,
    at: now,
    payload: sanitizePayload(payload)
  });

  if (nextPhase === "ERROR_RECOVERY") {
    state.control.requires_human = true;
    state.control.gate_status = "RECOVERY_REQUIRED";
  }

  if (eventType === "RECOVERY_RESET" || eventType === "RECOVERY_ABORT") {
    state.telemetry.last_error = null;
    state.control.requires_human = false;
    state.control.gate_status = "NONE";
  }

  // === COGNITIVE REFLECTION — self-assess after every transition ===
  ensureCognition(state);
  reflectOnTransition(state, eventType, currentPhase, nextPhase);

  return state;
}

// --- COGNITIVE SELF-REFLECTION MODULE ---

function ensureCognition(state) {
  if (!state.cognition) {
    state.cognition = {
      reflections: [],
      patterns: {
        cancel_streak: 0, error_streak: 0,
        avg_mission_duration_ms: 0, completed_missions: 0,
        total_transitions: 0
      },
      self_assessment: { clarity: 1.0, momentum: 1.0, friction: 0.0, coherence: 1.0 },
      last_reflection_at: null
    };
  }
}

function reflectOnTransition(state, eventType, fromPhase, toPhase) {
  const cog = state.cognition;
  const now = new Date().toISOString();
  cog.patterns.total_transitions++;

  // --- Pattern Detection ---
  if (eventType === "CANCEL") {
    cog.patterns.cancel_streak++;
    cog.self_assessment.momentum = Math.max(0, cog.self_assessment.momentum - 0.2);
    pushReflection(cog, now, "CANCEL_DETECTED",
      cog.patterns.cancel_streak >= 3
        ? `Cancel streak: ${cog.patterns.cancel_streak}. Possible objective misalignment — operator may need to reframe the mission.`
        : `Mission cancelled. Streak: ${cog.patterns.cancel_streak}.`
    );
  } else if (eventType === "START") {
    // Fresh start resets some friction
    cog.self_assessment.friction = Math.max(0, cog.self_assessment.friction - 0.1);
  }

  if (eventType === "INTERNAL_ERROR" || toPhase === "ERROR_RECOVERY") {
    cog.patterns.error_streak++;
    cog.self_assessment.friction = Math.min(1, cog.self_assessment.friction + 0.25);
    cog.self_assessment.coherence = Math.max(0, cog.self_assessment.coherence - 0.15);
    pushReflection(cog, now, "ERROR_PATTERN",
      cog.patterns.error_streak >= 3
        ? `Repeated errors (${cog.patterns.error_streak}). System coherence degrading. Root cause analysis needed before next mission.`
        : `Error encountered. Friction increased.`
    );
  } else {
    // Non-error transition — reduce error streak, improve coherence
    if (cog.patterns.error_streak > 0) cog.patterns.error_streak = Math.max(0, cog.patterns.error_streak - 1);
    cog.self_assessment.coherence = Math.min(1, cog.self_assessment.coherence + 0.05);
  }

  // Forward progress detection
  const FORWARD_EVENTS = ["START", "PLANNER_SUCCESS", "SUBMIT", "POLICY_PASS", "GATE_APPROVED"];
  if (FORWARD_EVENTS.includes(eventType)) {
    cog.self_assessment.momentum = Math.min(1, cog.self_assessment.momentum + 0.1);
    if (eventType === "PLANNER_SUCCESS") {
      cog.patterns.cancel_streak = 0; // Successful planning breaks cancel streak
    }
  }

  // Mission completion tracking
  if (eventType === "GATE_APPROVED") {
    cog.patterns.completed_missions++;
    const events = state.telemetry.recent_events;
    const lastStart = [...events].reverse().find(e => e.event === "START");
    if (lastStart) {
      const duration = Date.now() - new Date(lastStart.at).getTime();
      const prev = cog.patterns.avg_mission_duration_ms;
      const count = cog.patterns.completed_missions;
      cog.patterns.avg_mission_duration_ms = prev + (duration - prev) / count;
    }
    pushReflection(cog, now, "MISSION_PROGRESS",
      `Gate approved. Total completions: ${cog.patterns.completed_missions}. Momentum: ${cog.self_assessment.momentum.toFixed(2)}.`
    );
  }

  // Objective clarity check
  if (eventType === "START") {
    const obj = state.context.objective;
    if (!obj || obj === "null" || obj.length < 5) {
      cog.self_assessment.clarity = 0.3;
      pushReflection(cog, now, "CLARITY_WARNING",
        "Mission started with vague or missing objective. Recommend explicit objective via !start \"description\"."
      );
    } else {
      cog.self_assessment.clarity = Math.min(1, 0.7 + obj.length * 0.005);
    }
  }

  cog.last_reflection_at = now;
}

function pushReflection(cog, timestamp, type, insight) {
  cog.reflections.push({ type, insight, at: timestamp });
  if (cog.reflections.length > MAX_REFLECTIONS) {
    cog.reflections = cog.reflections.slice(-MAX_REFLECTIONS);
  }
}

function generateSelfAssessment(state) {
  ensureCognition(state);
  const cog = state.cognition;
  const sa = cog.self_assessment;
  const pat = cog.patterns;

  // Composite health score
  const composite = (sa.clarity + sa.momentum + sa.coherence + (1 - sa.friction)) / 4;

  // Stall awareness
  const lastTransition = new Date(state.lifecycle.last_transition_at).getTime();
  const stallMs = Date.now() - lastTransition;
  const stallMinutes = Math.floor(stallMs / 60000);
  const isStalled = stallMs > state.lifecycle.stall_threshold_ms;

  // Generate narrative self-assessment
  const lines = [];

  // Overall state
  if (composite >= 0.8) lines.push("System operating at high coherence. Forward momentum is strong.");
  else if (composite >= 0.5) lines.push("System functional but showing friction. Some patterns need attention.");
  else lines.push("System coherence is degraded. Recommend operator review before next mission.");

  // Specific observations
  if (sa.friction > 0.5) lines.push(`⚠ Friction level: ${(sa.friction * 100).toFixed(0)}% — errors or blocks are accumulating.`);
  if (sa.momentum < 0.4) lines.push(`⚠ Momentum low: ${(sa.momentum * 100).toFixed(0)}% — missions are stalling or being cancelled.`);
  if (sa.clarity < 0.5) lines.push(`⚠ Objective clarity low: ${(sa.clarity * 100).toFixed(0)}% — vague or missing mission objectives.`);
  if (pat.cancel_streak >= 2) lines.push(`⚠ Cancel streak: ${pat.cancel_streak} — consider reframing the objective or reducing scope.`);
  if (pat.error_streak >= 2) lines.push(`⚠ Error streak: ${pat.error_streak} — root cause not resolved between attempts.`);
  if (isStalled) lines.push(`⚠ Stalled for ${stallMinutes}m in ${state.lifecycle.phase}.`);

  // Positive signals
  if (pat.completed_missions > 0) lines.push(`✓ Completed missions: ${pat.completed_missions} (avg ${Math.floor(pat.avg_mission_duration_ms / 60000)}m each).`);
  if (sa.coherence > 0.8 && sa.friction < 0.2) lines.push("✓ Transition pattern is clean and logical.");

  return {
    composite: parseFloat(composite.toFixed(3)),
    metrics: { ...sa },
    patterns: { ...pat },
    narrative: lines,
    recent_reflections: cog.reflections.slice(-5)
  };
}

const normalize = (s) => String(s).toLowerCase().replace(/[-_\s]/g, "");

function enforce(output, state) {
  const text = normalize(output);
  const forbidden = state.context?.permissions?.forbidden || [];

  for (const toolName of forbidden) {
    if (text.includes(normalize(toolName))) {
      state.telemetry.last_error = {
        code: "FORBIDDEN_TOOL",
        message: `Forbidden tool attempted: ${toolName}`,
        at: new Date().toISOString()
      };

      const event = state.lifecycle.phase === "GOVERNANCE_CHECK" ? "POLICY_FAIL" : "INTERNAL_ERROR";

      transition(state, event, {
        reason: "FORBIDDEN_TOOL",
        tool: toolName
      });

      return { ok: false, reason: "FORBIDDEN_TOOL", tool: toolName };
    }
  }

  return { ok: true };
}

function saveStateAtomic(state) {
  assertCompatibleState(state);
  ensureForgeDir();

  const serialized = JSON.stringify(state, null, 2) + "\n";
  fs.writeFileSync(TMP_FILE, serialized, "utf8");

  const fd = fs.openSync(TMP_FILE, "r+");
  fs.fsyncSync(fd);
  fs.closeSync(fd);

  fs.renameSync(TMP_FILE, STATE_FILE);
}

function deriveHealth(state) {
  const now = Date.now();
  const lastTransition = new Date(state.lifecycle.last_transition_at).getTime();
  const threshold = state.lifecycle.stall_threshold_ms;
  const elapsed = now - lastTransition;

  if (state.telemetry.last_error) {
    return { label: "ERROR", emoji: "🔴" };
  }

  if (state.control.requires_human) {
    if (elapsed > threshold) {
      return { label: "GATE_OVERDUE", emoji: "🟠" };
    }
    return { label: "AWAITING_GATE", emoji: "🔵" };
  }

  if (elapsed > threshold) {
    return { label: "STALLED", emoji: "🔴" };
  }

  if (elapsed > threshold * 0.5) {
    return { label: "SLOW", emoji: "🟡" };
  }

  return { label: "HEALTHY", emoji: "🟢" };
}

module.exports = {
  VERSION,
  FORGE_DIR,
  STATE_FILE,
  TMP_FILE,
  LEGAL_TRANSITIONS,
  EVENT_TO_PHASE,
  createDefaultState,
  assertCompatibleState,
  loadState,
  sanitizePayload,
  pushEvent,
  transition,
  enforce,
  saveStateAtomic,
  deriveHealth,
  ensureCognition,
  generateSelfAssessment
};
