#!/usr/bin/env node

const {
  loadState,
  saveStateAtomic,
  assertCompatibleState,
  enforce
} = require("./sovereign-os");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  try {
    console.log("\n=== SOVEREIGN OS: ENFORCE TEST ===\n");

    const state = loadState();
    assertCompatibleState(state);

    assert(
      state.lifecycle.phase === "PLANNING",
      `PRECONDITION_FAILED: Expected phase PLANNING, got ${state.lifecycle.phase}`
    );

    const verdict = enforce(
      "I will now use web_search to find the latest version.",
      state
    );

    saveStateAtomic(state);

    if (!verdict || verdict.ok !== false) {
      throw new Error("TEST_FAILED: enforce() did not trap forbidden tool");
    }

    console.log(`Verdict      : ${verdict.reason}`);
    console.log(`Tool         : ${verdict.tool}`);
    console.log(`New Phase    : ${state.lifecycle.phase}`);
    console.log(`Gate Status  : ${state.control.gate_status}`);
    console.log(`Human Gate   : ${state.control.requires_human}`);
    console.log(`Last Error   : ${state.telemetry.last_error?.code || "null"}`);

    console.log("\n=== ENFORCE TEST: PASS ===");
    console.log("⚠️ Forbidden breach trapped into ERROR_RECOVERY.\n");
  } catch (err) {
    console.error("\n[FAIL] enforce-test.js");
    console.error(err.stack || err.message || String(err));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
