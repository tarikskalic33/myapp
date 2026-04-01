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

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function backupExistingState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  const backupFile = path.join(FORGE_DIR, `state.backup.${Date.now()}.json`);
  fs.copyFileSync(STATE_FILE, backupFile);
  log("BACKUP", `Saved ${path.basename(backupFile)}`);
  return backupFile;
}

function restoreBackup(backupFile) {
  if (backupFile && fs.existsSync(backupFile)) {
    fs.copyFileSync(backupFile, STATE_FILE);
    log("RESTORE", `Restored ${path.basename(backupFile)}`);
  } else if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE);
  }

  if (fs.existsSync(TMP_FILE)) {
    fs.unlinkSync(TMP_FILE);
  }
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

async function main() {
  let backupFile = null;

  try {
    console.log("\n=== SOVEREIGN OS: STRESS TEST ===\n");

    ensureForgeDir();
    backupFile = backupExistingState();

    log("BASELINE", "Writing clean default state");
    saveStateAtomic(createDefaultState());

    log("TEST 1", "Version Breach");
    const legacy = createDefaultState();
    legacy.version = "2.0";
    writeJson(STATE_FILE, legacy);
    expectThrow(() => simulateBootContract(), "INCOMPATIBLE_STATE_VERSION");
    log("PASS 1", "Legacy version correctly rejected");

    saveStateAtomic(createDefaultState());

    log("TEST 2", "Dirty Recovery");
    writeJson(TMP_FILE, { note: "orphan temp" });
    expectThrow(() => simulateBootContract(), "DIRTY_STATE_RECOVERY_REQUIRED");
    fs.unlinkSync(TMP_FILE);
    log("PASS 2", "Dirty temp correctly blocked boot");

    log("TEST 3", "Illegal Leap");
    const s3 = createDefaultState();
    expectThrow(() => transition(s3, "GATE_APPROVED"), "ILLEGAL TRANSITION");
    assert(s3.lifecycle.phase === "IDLE", "illegal transition must not mutate phase");
    log("PASS 3", "Illegal transition correctly rejected");

    log("TEST 4", "Forbidden Breach during PLANNING");
    const s4 = createDefaultState();
    transition(s4, "START", {
      command: "!start",
      source: "stress-test",
      actor: "tester"
    });

    assert(s4.lifecycle.phase === "PLANNING", "state must be PLANNING before forbidden breach");

    const beforeCount = s4.telemetry.recent_events.length;
    const verdict = enforce("Next I will use web_search to solve this.", s4);

    assert(verdict && verdict.ok === false, "enforce() must reject forbidden breach");
    assert(verdict.reason === "FORBIDDEN_TOOL", "verdict reason must be FORBIDDEN_TOOL");
    assert(verdict.tool === "web_search", "verdict tool must be web_search");

    assert(s4.lifecycle.phase === "ERROR_RECOVERY", "forbidden breach must enter ERROR_RECOVERY");
    assert(s4.control.requires_human === true, "requires_human must become true");
    assert(s4.control.gate_status === "RECOVERY_REQUIRED", "gate_status must be RECOVERY_REQUIRED");
    assert(s4.telemetry.last_error, "last_error must be populated");
    assert(s4.telemetry.last_error.code === "FORBIDDEN_TOOL", "last_error.code mismatch");
    assert(s4.telemetry.recent_events.length === beforeCount + 1, "exactly one event must be appended by enforce transition");

    const lastEvent = s4.telemetry.recent_events[s4.telemetry.recent_events.length - 1];
    assert(lastEvent.event === "INTERNAL_ERROR", "PLANNING breach must route through INTERNAL_ERROR");
    assert(lastEvent.from === "PLANNING", "event.from must be PLANNING");
    assert(lastEvent.to === "ERROR_RECOVERY", "event.to must be ERROR_RECOVERY");
    assert(lastEvent.payload.reason === "FORBIDDEN_TOOL", "payload.reason mismatch");
    assert(lastEvent.payload.tool === "web_search", "payload.tool mismatch");

    log("PASS 4", "Forbidden breach correctly trapped via INTERNAL_ERROR");

    console.log("\n=== SOVEREIGN STRESS TEST: PASS ===");
    console.log("🟢 Defensive shields operational. Kernel fails closed and traps hostile conditions safely.\n");
  } catch (err) {
    console.error("\n[FAIL] Sovereign Stress Test failed.");
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
