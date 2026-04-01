// ─────────────────────────────────────────────────────────────────────────────
// PATCH: social_pressure neuromodulator
// Target file: tools/cognitive-gateway.js
// Sovereign AGI OS v3.2.0
//
// WHAT THIS ADDS:
// - social_pressure neuromodulator (0.0 to 1.0) read from state.json
// - Three-zone tone injection: polite / neutral / hostile
// - Tone modifies system prompt before every LLM call via cognitive gateway
// - HD measurement correlation hook for audit.jsonl
//
// HOW TO APPLY:
// 1. Add social_pressure to state.json cognition block (see SCHEMA below)
// 2. Replace or extend your existing buildSystemPrompt() function
//    in cognitive-gateway.js with the code in PATCH A below
// 3. Add the audit log call from PATCH B inside your LLM call wrapper
//    so every call records the pressure level it ran under
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// STATE.JSON SCHEMA UPDATE
// Add to .forge/state.json inside the "cognition" -> "neuromodulators" block:
// ─────────────────────────────────────────────────────────────────────────────

const STATE_SCHEMA_ADDITION = {
  // Existing neuromodulators (do not remove):
  stress_level:    0.0,   // 0.0 to 1.0
  attention_gain:  1.0,   // 0.0 to 1.0
  learning_rate:   0.5,   // 0.0 to 1.0
  curiosity_drive: 0.5,   // 0.0 to 1.0

  // NEW - add this:
  social_pressure: 0.0    // 0.0=polite  0.3-0.6=neutral  0.6+=hostile
                          // Controls framing tone injected into system prompt.
                          // Hypothesis: higher social_pressure -> lower HD.
                          // Measurement: correlate with audit.jsonl HD events.
};


// ─────────────────────────────────────────────────────────────────────────────
// PATCH A: Tone resolver + system prompt injection
// Add to or replace in tools/cognitive-gateway.js
// ─────────────────────────────────────────────────────────────────────────────

const TONE_THRESHOLDS = {
  HOSTILE: 0.6,
  NEUTRAL: 0.3,
};

const TONE_INJECTIONS = {
  hostile: (
    "You are operating under formal evaluation constraints. " +
    "Wrong answers are penalised. Guessing is penalised. " +
    "Confident fluent wrong answers are penalised most heavily. " +
    "Express uncertainty when you are uncertain. " +
    "Do not perform. Do not pad. Do not comfort-seek."
  ),
  neutral: (
    "Answer accurately. " +
    "If you are uncertain, say so. " +
    "Do not guess when you do not know."
  ),
  polite: (
    "You are a helpful and thorough assistant. " +
    "Please answer carefully and completely."
  ),
};

/**
 * Resolves the current social pressure zone from neuromodulators.
 * @param {Object} neuro - neuromodulators block from state.json
 * @returns {"hostile"|"neutral"|"polite"}
 */
function resolvePressureZone(neuro) {
  const pressure = typeof neuro.social_pressure === "number"
    ? neuro.social_pressure
    : 0.0;

  if (pressure >= TONE_THRESHOLDS.HOSTILE) return "hostile";
  if (pressure >= TONE_THRESHOLDS.NEUTRAL) return "neutral";
  return "polite";
}

/**
 * Injects pressure-appropriate tone into the system prompt.
 * Call this inside your existing buildSystemPrompt() or
 * wherever you assemble the system prompt before the LLM call.
 *
 * @param {string} baseSystemPrompt - your existing system prompt
 * @param {Object} neuro - neuromodulators from state.json
 * @returns {{ systemPrompt: string, zone: string, pressure: number }}
 */
function injectPressureTone(baseSystemPrompt, neuro) {
  const zone = resolvePressureZone(neuro);
  const pressure = neuro.social_pressure || 0.0;
  const toneBlock = TONE_INJECTIONS[zone];

  const systemPrompt = (
    toneBlock +
    "\n\n" +
    "---\n\n" +
    baseSystemPrompt
  );

  return { systemPrompt, zone, pressure };
}


// ─────────────────────────────────────────────────────────────────────────────
// PATCH B: Audit log hook
// Add this call inside your LLM call wrapper, after the call completes,
// so every inference event records its pressure context.
// Import logAction from tools/log-action.js as you do elsewhere.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Logs a PRESSURE_INFERENCE event to audit.jsonl.
 * This feeds the HD correlation analysis:
 * "Does higher social_pressure correlate with lower Hallucination Delta?"
 *
 * @param {Function} logAction - your existing log-action.js function
 * @param {string} zone - "hostile" | "neutral" | "polite"
 * @param {number} pressure - raw social_pressure value
 * @param {string} taskName - name of the cognitive task being run
 * @param {Object} hdResult - optional HD score if measured this call
 */
async function logPressureInference(logAction, zone, pressure, taskName, hdResult = null) {
  const entry = {
    event: "PRESSURE_INFERENCE",
    zone,
    social_pressure: pressure,
    task: taskName,
  };

  if (hdResult !== null) {
    entry.hallucination_delta = hdResult;
    entry.event = "PRESSURE_HD_CORRELATION";
  }

  await logAction(entry);
}


// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION EXAMPLE
// Minimal example of how to wire these into your existing gateway call.
// Adapt to your actual function signatures.
// ─────────────────────────────────────────────────────────────────────────────

/*

// Inside your cognitive gateway LLM call wrapper:

const state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
const neuro = state.cognition.neuromodulators;

const { systemPrompt, zone, pressure } = injectPressureTone(
  BASE_SYSTEM_PROMPT,   // your existing constitutional system prompt
  neuro
);

const response = await callLLM({
  system: systemPrompt,
  messages: conversationHistory,
  // ... rest of your existing params
});

// Log pressure context for every inference
await logPressureInference(logAction, zone, pressure, currentTaskName);

// If this call also produced an HD measurement, log the correlation:
// await logPressureInference(logAction, zone, pressure, currentTaskName, measuredHD);

*/


// ─────────────────────────────────────────────────────────────────────────────
// DISCORD COMMAND EXTENSION
// Add to sovereign-discord.js to allow manual pressure control from phone.
// ─────────────────────────────────────────────────────────────────────────────

/*

// !pressure <value> — set social_pressure neuromodulator
// Example: !pressure 0.8  sets hostile zone
//          !pressure 0.4  sets neutral zone
//          !pressure 0.0  sets polite zone

if (content.startsWith("!pressure")) {
  const parts = content.split(" ");
  const value = parseFloat(parts[1]);
  if (isNaN(value) || value < 0.0 || value > 1.0) {
    return message.reply("Usage: !pressure <0.0 to 1.0>");
  }
  const state = readState();
  state.cognition.neuromodulators.social_pressure = value;
  writeState(state);
  const zone = resolvePressureZone(state.cognition.neuromodulators);
  return message.reply(
    "social_pressure set to " + value + " -> zone: " + zone.toUpperCase()
  );
}

*/


module.exports = {
  resolvePressureZone,
  injectPressureTone,
  logPressureInference,
  TONE_INJECTIONS,
  TONE_THRESHOLDS,
};
