#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const {
  createDefaultState,
  loadState,
  saveStateAtomic,
  transition,
  assertCompatibleState,
  enforce
} = require("./sovereign-os");

const FORGE_DIR = path.resolve(".forge");
const STATE_FILE = path.join(FORGE_DIR, "state.json");
const TMP_FILE = path.join(FORGE_DIR, "state.tmp.json");

function log(step, msg) {
  console.log(`[${step}] ${msg}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_FAILED: ${message}`);
  }
}

function ensureForgeDir() {
  if (!fs.existsSync(FORGE_DIR)) {
    fs.mkdirSync(FORGE_DIR, { recursive: true });
  }
}

function backupExistingState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  const backupFile = path.join(FORGE_DIR, `state.backup.${Date.now()}.json`);
  fs.copyFileSync(STATE_FILE, backupFile);
  log("BACKUP", `Saved ${path.basename(backupFile)}`);
  return backupFile;
}

function restoreBackup(backupFile) {
  if (!backupFile) {
    if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);
    if (fs.existsSync(TMP_FILE)) fs.unlinkSync(TMP_FILE);
    return;
  }
  fs.copyFileSync(backupFile, STATE_FILE);
  if (fs.existsSync(TMP_FILE)) fs.unlinkSync(TMP_FILE);
  log("RESTORE", `Restored ${path.basename(backupFile)}`);
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function expectThrow(fn, expectedSubstring) {
  try {
    fn();
    throw new Error(`EXPECTED_THROW_MISSING: ${expectedSubstring}`);
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (!msg.includes(expectedSubstring)) {
      throw new Error(`EXPECTED_THROW_MISMATCH: wanted "${expectedSubstring}" but got "${msg}"`);
    }
  }
}

function simulateBootContract() {
  if (fs.existsSync(TMP_FILE)) {
    throw new Error("DIRTY_STATE_RECOVERY_REQUIRED");
  }
  const state = loadState();
  assertCompatibleState(state);
  return state;
}

function makeStateWithPhase(phase) {
  const s = createDefaultState();
  s.lifecycle.phase = phase;
  return s;
}

async function main() {
  let backupFile = null;

  try {
    console.log("\n=== SOVEREIGN OS: FAILURE-PATH VERIFICATION ===\n");

    ensureForgeDir();
    backupFile = backupExistingState();

    const clean = createDefaultState();
    saveStateAtomic(clean);

    log("TEST 1", "Dirty temp file must hard-fail boot");
    writeJson(TMP_FILE, { note: "orphan temp file" });
    expectThrow(() => simulateBootContract(), "DIRTY_STATE_RECOVERY_REQUIRED");
    fs.unlinkSync(TMP_FILE);
    log("PASS 1", "Dirty temp correctly blocked boot");

    log("TEST 2", "Legacy version must hard-fail boot");
    const legacy = createDefaultState();
    legacy.version = "3.1";
    writeJson(STATE_FILE, legacy);
    expectThrow(() => simulateBootContract(), "INCOMPATIBLE_STATE_VERSION");
    log("PASS 2", "Legacy version correctly blocked boot");

    saveStateAtomic(createDefaultState());

    log("TEST 3", "Illegal transition from IDLE using POLICY_PASS must throw");
    const s3 = createDefaultState();
    expectThrow(() => transition(s3, "POLICY_PASS"), "ILLEGAL TRANSITION: IDLE -> POLICY_PASS");
    log("PASS 3", "Illegal transition correctly rejected");

    log("TEST 4", "Forbidden tool outside governance must trap via INTERNAL_ERROR");
    const s4 = makeStateWithPhase("WAITING_FOR_SUBMISSION");
    const beforeEvents4 = s4.telemetry.recent_events.length;

    const verdict4 = enforce("I will use web_search to continue.", s4);

    assert(verdict4 && verdict4.ok === false, "verdict4 must be non-ok");
    assert(verdict4.reason === "FORBIDDEN_TOOL", "verdict4 reason mismatch");
    assert(s4.telemetry.last_error, "last_error must be set");
    assert(s4.telemetry.last_error.code === "FORBIDDEN_TOOL", "last_error.code mismatch");
    assert(s4.lifecycle.phase === "ERROR_RECOVERY", "phase must become ERROR_RECOVERY");
    assert(s4.control.requires_human === true, "requires_human must become true");
    assert(s4.control.gate_status === "RECOVERY_REQUIRED", "gate_status must become RECOVERY_REQUIRED");
    assert(s4.telemetry.recent_events.length === beforeEvents4 + 1, "one event must be appended");

    const event4 = s4.telemetry.recent_events[s4.telemetry.recent_events.length - 1];
    assert(event4.event === "INTERNAL_ERROR", "outside governance must use INTERNAL_ERROR");
    assert(event4.from === "WAITING_FOR_SUBMISSION", "event4.from mismatch");
    assert(event4.to === "ERROR_RECOVERY", "event4.to mismatch");
    assert(event4.payload.reason === "FORBIDDEN_TOOL", "event4.payload.reason mismatch");
    assert(event4.payload.tool === "web_search", "event4.payload.tool mismatch");
    log("PASS 4", "Forbidden tool outside governance correctly trapped");

    log("TEST 5", "Forbidden tool inside governance must trap via POLICY_FAIL");
    const s5 = makeStateWithPhase("GOVERNANCE_CHECK");
    const beforeEvents5 = s5.telemetry.recent_events.length;

    const verdict5 = enforce("Trying external_api next.", s5);

    assert(verdict5 && verdict5.ok === false, "verdict5 must be non-ok");
    assert(s5.telemetry.last_error, "last_error must be set");
    assert(s5.lifecycle.phase === "ERROR_RECOVERY", "phase must become ERROR_RECOVERY");
    assert(s5.control.requires_human === true, "requires_human must become true");
    assert(s5.control.gate_status === "RECOVERY_REQUIRED", "gate_status must become RECOVERY_REQUIRED");
    assert(s5.telemetry.recent_events.length === beforeEvents5 + 1, "one event must be appended");

    const event5 = s5.telemetry.recent_events[s5.telemetry.recent_events.length - 1];
    assert(event5.event === "POLICY_FAIL", "inside governance must use POLICY_FAIL");
    assert(event5.from === "GOVERNANCE_CHECK", "event5.from mismatch");
    assert(event5.to === "ERROR_RECOVERY", "event5.to mismatch");
    assert(event5.payload.reason === "FORBIDDEN_TOOL", "event5.payload.reason mismatch");
    assert(event5.payload.tool === "external_api", "event5.payload.tool mismatch");
    log("PASS 5", "Forbidden tool inside governance correctly trapped");

    log("TEST 6", "Recovery reset must clear error and reopen flow");
    const s6 = makeStateWithPhase("ERROR_RECOVERY");
    s6.control.requires_human = true;
    s6.control.gate_status = "RECOVERY_REQUIRED";
    s6.telemetry.last_error = {
      code: "FORBIDDEN_TOOL",
      message: "Forbidden tool attempted: web_search",
      at: new Date().toISOString()
    };

    transition(s6, "RECOVERY_RESET", {
      command: "!recover reset",
      source: "failure-test",
      actor: "operator"
    });

    assert(s6.lifecycle.phase === "WAITING_FOR_SUBMISSION", "RECOVERY_RESET must go to WAITING_FOR_SUBMISSION");
    assert(s6.telemetry.last_error === null, "RECOVERY_RESET must clear last_error");
    assert(s6.control.requires_human === false, "RECOVERY_RESET must clear requires_human");
    assert(s6.control.gate_status === "NONE", "RECOVERY_RESET must clear gate_status");
    log("PASS 6", "Recovery reset correctly cleared recovery state");

    console.log("\n=== FAILURE-PATH VERIFICATION: PASS ===");
    console.log("🟢 Kernel rejects corruption, rejects invalid transitions, and traps forbidden behavior safely.\n");
  } catch (err) {
    console.error("\n[FAIL] Failure-path verification failed.");
    console.error(err.stack || err.message || String(err));
    process.exitCode = 1;
  } finally {
    try {
      restoreBackup(backupFile);
    } catch (restoreErr) {
      console.error("\n[WARN] Restore failed:");
      console.error(restoreErr.stack || restoreErr.message || String(restoreErr));
      process.exitCode = 1;
    }
  }
}

main();
