// ─────────────────────────────────────────────────────────────────────────────
// STATE.JSON PATCH — v3.3.0
// Add the "stress_calibration" block inside your "cognition" object.
// The neuromodulators block already exists — just add social_pressure if
// you did not apply the previous patch yet.
// ─────────────────────────────────────────────────────────────────────────────

/*
FIND in .forge/state.json:

  "cognition": {
    "neuromodulators": {
      "stress_level": 0.0,
      "attention_gain": 1.0,
      "learning_rate": 0.5,
      "curiosity_drive": 0.5
    }
  }

REPLACE WITH:

  "cognition": {
    "neuromodulators": {
      "stress_level": 0.3,
      "attention_gain": 1.0,
      "learning_rate": 0.5,
      "curiosity_drive": 0.5,
      "social_pressure": 0.3
    },
    "stress_calibration": {
      "enabled": true,
      "current_zone": "optimal",
      "hd_trend": "stable",
      "sessions_analyzed": 0,
      "last_calibration": null,
      "hard_cap": 0.8,
      "optimal_min": 0.3,
      "optimal_max": 0.6,
      "auto_adjust": true
    }
  }

NOTE: stress_level and social_pressure both initialized to 0.3
(bottom of optimal zone) rather than 0.0.
Starting cold in the low zone means the first session will
likely nudge up — that is correct default behaviour.
*/


// ─────────────────────────────────────────────────────────────────────────────
// DISCORD COMMAND PATCH — sovereign-discord.js
// Add all five !calibrate / !stress commands.
// Wire stress-calibrator.js at the top of your Discord file alongside
// your other tool imports.
// ─────────────────────────────────────────────────────────────────────────────

/*
ADD TO IMPORTS at top of sovereign-discord.js:

const {
  calibrate,
  setStress,
  setAutoAdjust,
  getStatus,
  resolveZone,
  CURVE
} = require("./tools/stress-calibrator");

*/


// ─── !calibrate ──────────────────────────────────────────────────────────────
// Runs the stress calibration engine manually.
// Same logic triggered automatically after !log.

const handleCalibrate = async (message) => {
  try {
    const result = calibrate({ verbose: false });

    const zoneEmoji = {
      optimal:    "✅",
      low:        "⬇️",
      high:       "⚠️",
      breakdown:  "🚨",
    };

    const lines = [
      "**STRESS CALIBRATION**",
      "Action: `" + result.action + "`",
      "Reason: " + result.reason,
      "",
      "HD trend: `" + result.hd_trend + "` (last " + result.sessions_used + " sessions)",
      result.latest_hd !== null
        ? "Latest HD: `" + result.latest_hd + "`"
        : "Latest HD: `no data yet`",
      "",
      "Stress: `" + result.stress_before + "` → `" + result.stress_after + "`",
      "Zone: " + (zoneEmoji[result.zone_before] || "") + " `" + result.zone_before + "` → " +
               (zoneEmoji[result.zone_after]  || "") + " `" + result.zone_after + "`",
      "Pressure: `" + result.pressure_before + "` → `" + result.pressure_after + "`",
    ];

    if (result.atp_before !== null) {
      lines.push("ATP: `" + result.atp_before + "` → `" + result.atp_after + "`");
    }

    message.reply(lines.join("\n"));
  } catch (err) {
    message.reply("Calibration error: " + err.message);
  }
};


// ─── !stress ─────────────────────────────────────────────────────────────────
// Shows current stress zone + HD trend.

const handleStress = async (message) => {
  try {
    const s = getStatus();

    const bar = buildStressBar(s.stress_level);

    const lines = [
      "**STRESS STATUS**",
      "",
      "Stress level:  `" + s.stress_level + "` " + bar,
      "Zone:          `" + s.current_zone + "`",
      "Pressure:      `" + s.social_pressure + "`",
      "",
      "HD trend:      `" + s.hd_trend + "`",
      "Latest HD:     `" + (s.latest_hd !== null ? s.latest_hd : "no data") + "`",
      "Sessions used: `" + s.sessions_in_window + "`",
      "",
      "Auto-adjust:   `" + (s.auto_adjust ? "ON" : "OFF (locked)") + "`",
      "Optimal range: `" + s.optimal_range + "`",
      "Hard cap:      `" + s.hard_cap + "`",
      "Last run:      `" + (s.last_calibration || "never") + "`",
    ];

    message.reply(lines.join("\n"));
  } catch (err) {
    message.reply("Stress status error: " + err.message);
  }
};


// ─── !stress set <value> ──────────────────────────────────────────────────────
// Manually override stress level. Does not lock auto-adjust unless combined
// with !stress lock afterward.

const handleStressSet = async (message, value) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    return message.reply("Usage: `!stress set <0.0 to " + CURVE.HARD_CAP + ">`");
  }
  try {
    const result = setStress(parsed, false);
    message.reply(
      "Stress manually set to `" + result.value + "` — zone: `" + result.zone + "`\n" +
      "Auto-adjust is still ON. Use `!stress lock` to freeze at this level."
    );
  } catch (err) {
    message.reply("Set error: " + err.message);
  }
};


// ─── !stress lock ────────────────────────────────────────────────────────────
// Freezes stress at current level. Auto-calibration disabled until unlock.

const handleStressLock = async (message) => {
  try {
    const s = getStatus();
    setStress(s.stress_level, true);
    message.reply(
      "Stress LOCKED at `" + s.stress_level + "` (zone: `" + s.current_zone + "`). " +
      "Auto-calibration disabled. Use `!stress unlock` to re-enable."
    );
  } catch (err) {
    message.reply("Lock error: " + err.message);
  }
};


// ─── !stress unlock ──────────────────────────────────────────────────────────
// Returns to auto-calibration.

const handleStressUnlock = async (message) => {
  try {
    setAutoAdjust(true);
    message.reply(
      "Stress UNLOCKED. Auto-calibration re-enabled. " +
      "Run `!calibrate` to trigger an immediate adjustment."
    );
  } catch (err) {
    message.reply("Unlock error: " + err.message);
  }
};


// ─── Stress bar visual helper ─────────────────────────────────────────────────
function buildStressBar(level) {
  const TOTAL  = 20;
  const filled = Math.round(level * TOTAL);
  const bar    = "█".repeat(filled) + "░".repeat(TOTAL - filled);

  let label;
  if      (level >= 0.8) label = "🚨 BREAKDOWN";
  else if (level >= 0.6) label = "⚠️  HIGH";
  else if (level >= 0.3) label = "✅ OPTIMAL";
  else                   label = "⬇️  LOW";

  return "[" + bar + "] " + label;
}


// ─── Route all stress commands ────────────────────────────────────────────────
// Add this block inside your existing message handler in sovereign-discord.js,
// alongside your other command routing.

/*

if (content === "!calibrate") {
  return handleCalibrate(message);
}

if (content === "!stress") {
  return handleStress(message);
}

if (content.startsWith("!stress set ")) {
  const value = content.replace("!stress set ", "").trim();
  return handleStressSet(message, value);
}

if (content === "!stress lock") {
  return handleStressLock(message);
}

if (content === "!stress unlock") {
  return handleStressUnlock(message);
}

*/


// ─── Auto-trigger after !log ──────────────────────────────────────────────────
// Find your existing !log handler in sovereign-discord.js.
// After cognitive-eval.js runs, add this call:

/*

// After cognitiveEval(session) completes:
const calResult = calibrate({ verbose: false });
await logAction({
  event: "POST_LOG_CALIBRATION",
  action: calResult.action,
  stress_before: calResult.stress_before,
  stress_after: calResult.stress_after,
  hd_trend: calResult.hd_trend,
});

// Notify operator if stress changed significantly
if (calResult.action !== "maintain" && calResult.action !== "skipped") {
  message.channel.send(
    "Auto-calibration ran after !log: " +
    "stress `" + calResult.stress_before + "` → `" + calResult.stress_after + "` " +
    "(" + calResult.action + " — " + calResult.hd_trend + " HD trend)"
  );
}

*/

module.exports = {
  handleCalibrate,
  handleStress,
  handleStressSet,
  handleStressLock,
  handleStressUnlock,
  buildStressBar,
};
