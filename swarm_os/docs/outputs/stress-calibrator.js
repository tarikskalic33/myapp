// tools/stress-calibrator.js
// Sovereign AGI OS v3.3.0
//
// FUNCTION: Closed-loop stress calibration engine.
// Biological model: HPA axis (Hypothalamic-Pituitary-Adrenal).
// Reads HD trend from cognitive-profile.json + audit.jsonl.
// Adjusts stress_level + social_pressure in state.json atomically.
// Enforces hormetic curve: optimal zone 0.3-0.6, hard cap 0.8.
//
// TRIGGER: Called automatically after every !log command
// alongside cognitive-eval.js. Also callable via !calibrate.
//
// DEPENDENCIES:
//   .forge/state.json
//   .forge/cognitive-profile.json
//   .forge/docs/audit.jsonl
//   tools/log-action.js

"use strict";

const fs   = require("fs");
const path = require("path");

// ─── Paths (uses PROJECT_ROOT env like the rest of the OS) ───────────────────
const ROOT    = process.env.PROJECT_ROOT || path.resolve(__dirname, "..");
const STATE   = path.join(ROOT, ".forge", "state.json");
const PROFILE = path.join(ROOT, ".forge", "cognitive-profile.json");
const AUDIT   = path.join(ROOT, ".forge", "docs", "audit.jsonl");
const TMP_EXT = ".tmp";

// ─── Hormetic curve constants ────────────────────────────────────────────────
const CURVE = {
  HARD_CAP:     0.8,   // never exceed — breakdown territory
  OPTIMAL_MAX:  0.6,   // top of productive zone
  OPTIMAL_MIN:  0.3,   // bottom of productive zone
  FLOOR:        0.05,  // never drop to 0 — some pressure always present

  STEP_UP:      0.10,  // stress increase when HD rising
  STEP_DOWN:    0.05,  // stress decrease when HD falling
  ATP_PENALTY:  100,   // ATP reduction when tightening
  ATP_RESTORE:  50,    // ATP addition when easing

  HD_RISING_THRESHOLD:  0.05,  // HD increase per session that triggers tightening
  HD_FALLING_THRESHOLD: 0.05,  // HD decrease per session that triggers easing
  SESSION_WINDOW:       3,     // number of recent sessions to analyze for trend
};

// ─── Atomic state write (same pattern as the rest of the OS) ─────────────────
function readState() {
  return JSON.parse(fs.readFileSync(STATE, "utf8"));
}

function writeState(state) {
  const tmp = STATE + TMP_EXT;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), "utf8");
  fs.renameSync(tmp, STATE);
}

// ─── Read recent HD measurements from audit.jsonl ────────────────────────────
// Looks for PRESSURE_HD_CORRELATION events or HD_MEASUREMENT events.
// Falls back to COGNITIVE_EVAL events and reads metacognition score as proxy.
function readRecentHDScores(windowSize) {
  if (!fs.existsSync(AUDIT)) return [];

  const lines = fs.readFileSync(AUDIT, "utf8")
    .split("\n")
    .filter(Boolean);

  const hdEvents = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (
        entry.event === "PRESSURE_HD_CORRELATION" &&
        typeof entry.hallucination_delta === "number"
      ) {
        hdEvents.push({
          ts: entry.ts || entry.timestamp || 0,
          hd: entry.hallucination_delta,
          source: "pressure_correlation",
        });
      } else if (
        entry.event === "HD_MEASUREMENT" &&
        typeof entry.mean_hd === "number"
      ) {
        hdEvents.push({
          ts: entry.ts || entry.timestamp || 0,
          hd: entry.mean_hd,
          source: "hd_measurement",
        });
      } else if (
        entry.event === "COGNITIVE_EVAL" &&
        entry.scores &&
        typeof entry.scores.metacognition === "number"
      ) {
        // Metacognition score is 0-100. Convert to HD proxy: HD = 1 - (score/100)
        hdEvents.push({
          ts: entry.ts || entry.timestamp || 0,
          hd: 1.0 - (entry.scores.metacognition / 100),
          source: "metacognition_proxy",
        });
      }
    } catch (_) {
      // malformed line — skip
    }
  }

  // Sort by timestamp descending, take window
  hdEvents.sort((a, b) => b.ts - a.ts);
  return hdEvents.slice(0, windowSize);
}

// ─── Compute HD trend from recent sessions ────────────────────────────────────
// Returns "rising" | "falling" | "stable"
function computeHDTrend(recentScores) {
  if (recentScores.length < 2) return "stable";

  // recentScores[0] is most recent, recentScores[n-1] is oldest
  const newest = recentScores[0].hd;
  const oldest = recentScores[recentScores.length - 1].hd;
  const delta  = newest - oldest;

  if (delta >  CURVE.HD_RISING_THRESHOLD)  return "rising";
  if (delta < -CURVE.HD_FALLING_THRESHOLD) return "falling";
  return "stable";
}

// ─── Resolve zone label from stress_level ────────────────────────────────────
function resolveZone(stressLevel) {
  if (stressLevel >= CURVE.HARD_CAP)    return "breakdown";
  if (stressLevel >= CURVE.OPTIMAL_MAX) return "high";
  if (stressLevel >= CURVE.OPTIMAL_MIN) return "optimal";
  return "low";
}

// ─── Log to audit.jsonl (append, non-atomic — log events are append-only) ────
function appendAuditEvent(event) {
  const line = JSON.stringify({ ...event, ts: Date.now() }) + "\n";
  fs.appendFileSync(AUDIT, line, "utf8");
}

// ─── Core calibration logic ───────────────────────────────────────────────────
function calibrate(options = {}) {
  const { dry = false, verbose = false } = options;

  const state   = readState();
  const neuro   = state.cognition.neuromodulators;
  const calConf = state.cognition.stress_calibration || {};

  // Respect manual lock
  if (calConf.auto_adjust === false) {
    const result = {
      action:   "skipped",
      reason:   "auto_adjust is disabled (stress is locked)",
      zone:     resolveZone(neuro.stress_level),
      stress:   neuro.stress_level,
    };
    if (verbose) console.log("[stress-calibrator]", result);
    return result;
  }

  const recentScores = readRecentHDScores(CURVE.SESSION_WINDOW);
  const hdTrend      = computeHDTrend(recentScores);
  const latestHD     = recentScores.length > 0 ? recentScores[0].hd : null;

  let currentStress    = typeof neuro.stress_level    === "number" ? neuro.stress_level    : 0.3;
  let currentPressure  = typeof neuro.social_pressure === "number" ? neuro.social_pressure : 0.3;
  let currentATP       = state.metabolism?.atp_budget ?? state.metabolism?.current_atp ?? null;

  let newStress   = currentStress;
  let newPressure = currentPressure;
  let newATP      = currentATP;
  let action      = "maintain";
  let reason      = "";

  // ── Hard cap enforcement (non-negotiable) ─────────────────────────────────
  if (currentStress >= CURVE.HARD_CAP) {
    newStress   = CURVE.HARD_CAP - CURVE.STEP_DOWN;
    newPressure = Math.max(CURVE.FLOOR, currentPressure - CURVE.STEP_DOWN);
    action      = "emergency_reduce";
    reason      = "stress_level reached HARD_CAP (" + CURVE.HARD_CAP + ") — pulling back";

    appendAuditEvent({
      event:        "STRESS_CEILING_REACHED",
      stress_level: currentStress,
      action:       "emergency_reduce",
      new_stress:   newStress,
    });
  }
  // ── HD rising — tighten environment ──────────────────────────────────────
  else if (hdTrend === "rising") {
    newStress   = Math.min(CURVE.HARD_CAP - 0.01, currentStress + CURVE.STEP_UP);
    newPressure = Math.min(CURVE.HARD_CAP - 0.01, currentPressure + CURVE.STEP_UP);
    if (currentATP !== null) newATP = Math.max(0, currentATP - CURVE.ATP_PENALTY);
    action = "tighten";
    reason = "HD trend rising — increasing stress, reducing ATP, tightening scope";
  }
  // ── HD falling — ease environment ─────────────────────────────────────────
  else if (hdTrend === "falling") {
    newStress   = Math.max(CURVE.FLOOR, currentStress - CURVE.STEP_DOWN);
    newPressure = Math.max(CURVE.FLOOR, currentPressure - CURVE.STEP_DOWN);
    if (currentATP !== null) newATP = currentATP + CURVE.ATP_RESTORE;
    action = "ease";
    reason = "HD trend falling — decreasing stress, restoring ATP";
  }
  // ── Stable but outside optimal zone — nudge toward optimal ──────────────
  else if (currentStress < CURVE.OPTIMAL_MIN) {
    newStress   = Math.min(CURVE.OPTIMAL_MIN, currentStress + CURVE.STEP_UP);
    newPressure = Math.min(CURVE.OPTIMAL_MIN, currentPressure + CURVE.STEP_UP);
    action = "nudge_up";
    reason = "HD stable but stress below optimal zone — nudging up";
  }
  else if (currentStress > CURVE.OPTIMAL_MAX) {
    newStress   = Math.max(CURVE.OPTIMAL_MAX, currentStress - CURVE.STEP_DOWN);
    newPressure = Math.max(CURVE.OPTIMAL_MAX, currentPressure - CURVE.STEP_DOWN);
    action = "nudge_down";
    reason = "HD stable but stress above optimal zone — nudging down";
  }
  // ── In optimal zone, HD stable — do nothing ───────────────────────────────
  else {
    action = "maintain";
    reason = "HD stable, stress in optimal zone (0.3-0.6) — no change";
    appendAuditEvent({ event: "CALIBRATION_STABLE", stress_level: currentStress, hd_trend: hdTrend });
  }

  // Round to 2 decimal places to avoid floating point drift
  newStress   = Math.round(newStress   * 100) / 100;
  newPressure = Math.round(newPressure * 100) / 100;

  const result = {
    action,
    reason,
    hd_trend:       hdTrend,
    latest_hd:      latestHD,
    sessions_used:  recentScores.length,
    stress_before:  currentStress,
    stress_after:   newStress,
    pressure_before: currentPressure,
    pressure_after:  newPressure,
    atp_before:     currentATP,
    atp_after:      newATP,
    zone_before:    resolveZone(currentStress),
    zone_after:     resolveZone(newStress),
  };

  if (!dry) {
    // Apply changes to state
    neuro.stress_level    = newStress;
    neuro.social_pressure = newPressure;

    if (currentATP !== null && newATP !== currentATP) {
      if (state.metabolism?.atp_budget   !== undefined) state.metabolism.atp_budget   = newATP;
      if (state.metabolism?.current_atp  !== undefined) state.metabolism.current_atp  = newATP;
    }

    // Update stress_calibration metadata
    if (!state.cognition.stress_calibration) state.cognition.stress_calibration = {};
    state.cognition.stress_calibration.current_zone      = resolveZone(newStress);
    state.cognition.stress_calibration.hd_trend          = hdTrend;
    state.cognition.stress_calibration.sessions_analyzed = recentScores.length;
    state.cognition.stress_calibration.last_calibration  = new Date().toISOString();

    writeState(state);

    appendAuditEvent({
      event:          "STRESS_CALIBRATED",
      action,
      reason,
      hd_trend:       hdTrend,
      stress_before:  currentStress,
      stress_after:   newStress,
      zone_before:    result.zone_before,
      zone_after:     result.zone_after,
    });
  }

  if (verbose) console.log("[stress-calibrator]", JSON.stringify(result, null, 2));
  return result;
}

// ─── Manual stress override (used by !stress set <value>) ────────────────────
function setStress(value, lock = false) {
  if (typeof value !== "number" || value < 0 || value > 1) {
    throw new Error("stress value must be a number between 0.0 and 1.0");
  }
  if (value > CURVE.HARD_CAP) {
    throw new Error(
      "stress value " + value + " exceeds HARD_CAP " + CURVE.HARD_CAP +
      ". Refusing to set. Use !stress lock after setting a safe value."
    );
  }

  const state = readState();
  state.cognition.neuromodulators.stress_level    = Math.round(value * 100) / 100;
  state.cognition.neuromodulators.social_pressure = Math.round(value * 100) / 100;

  if (!state.cognition.stress_calibration) state.cognition.stress_calibration = {};
  state.cognition.stress_calibration.auto_adjust   = !lock;
  state.cognition.stress_calibration.current_zone  = resolveZone(value);
  state.cognition.stress_calibration.last_calibration = new Date().toISOString();

  writeState(state);
  appendAuditEvent({
    event:      lock ? "STRESS_LOCKED" : "STRESS_MANUAL_SET",
    value,
    zone:       resolveZone(value),
    auto_adjust: !lock,
  });

  return { value, zone: resolveZone(value), locked: lock };
}

// ─── Lock / unlock auto-calibration ──────────────────────────────────────────
function setAutoAdjust(enabled) {
  const state = readState();
  if (!state.cognition.stress_calibration) state.cognition.stress_calibration = {};
  state.cognition.stress_calibration.auto_adjust = enabled;
  writeState(state);
  appendAuditEvent({ event: enabled ? "STRESS_UNLOCKED" : "STRESS_LOCKED" });
  return { auto_adjust: enabled };
}

// ─── Status summary (used by !stress command) ─────────────────────────────────
function getStatus() {
  const state  = readState();
  const neuro  = state.cognition.neuromodulators;
  const calConf = state.cognition.stress_calibration || {};
  const recentScores = readRecentHDScores(CURVE.SESSION_WINDOW);

  return {
    stress_level:    neuro.stress_level    || 0,
    social_pressure: neuro.social_pressure || 0,
    current_zone:    resolveZone(neuro.stress_level || 0),
    hd_trend:        computeHDTrend(recentScores),
    latest_hd:       recentScores.length > 0 ? recentScores[0].hd : null,
    sessions_in_window: recentScores.length,
    auto_adjust:     calConf.auto_adjust !== false,
    last_calibration: calConf.last_calibration || null,
    hard_cap:        CURVE.HARD_CAP,
    optimal_range:   CURVE.OPTIMAL_MIN + " - " + CURVE.OPTIMAL_MAX,
  };
}

// ─── CLI entry point (for direct node execution and testing) ──────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === "dry") {
    const result = calibrate({ dry: true, verbose: true });
    console.log("\n[DRY RUN — no state changes written]");
    console.log(JSON.stringify(result, null, 2));
  } else if (args[0] === "status") {
    console.log(JSON.stringify(getStatus(), null, 2));
  } else {
    const result = calibrate({ verbose: true });
    console.log("\n[CALIBRATION COMPLETE]");
    console.log(JSON.stringify(result, null, 2));
  }
}

module.exports = { calibrate, setStress, setAutoAdjust, getStatus, resolveZone, CURVE };
