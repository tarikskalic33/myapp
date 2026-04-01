#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const {
  createDefaultState,
  loadState,
  saveStateAtomic,
  transition,
  assertCompatibleState
} = require("./sovereign-os");

const FORGE_DIR = path.resolve(".forge");
const STATE_FILE = path.join(FORGE_DIR, "state.json");
const TMP_FILE = path.join(FORGE_DIR, "state.tmp.json");

function log(step, msg) {
  console.log(`[${step}] ${msg}`);
}

function fail(msg, err) {
  console.error(`\n[FAIL] ${msg}`);
  if (err) {
    console.error(err.stack || err.message || String(err));
  }
  process.exitCode = 1;
}

function ensureForgeDir() {
  if (!fs.existsSync(FORGE_DIR)) {
    fs.mkdirSync(FORGE_DIR, { recursive: true });
    log("SETUP", `Created directory: ${FORGE_DIR}`);
  }
}

function backupExistingState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  const backupFile = path.join(FORGE_DIR, `state.backup.${Date.now()}.json`);
  fs.copyFileSync(STATE_FILE, backupFile);
  log("BACKUP", `Existing state backed up to ${path.basename(backupFile)}`);
  return backupFile;
}

function restoreBackup(backupFile) {
  if (!backupFile) return;
  fs.copyFileSync(backupFile, STATE_FILE);
  log("RESTORE", `Restored backup from ${path.basename(backupFile)}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_FAILED: ${message}`);
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function main() {
  let backupFile = null;

  try {
    console.log("\n=== SOVEREIGN OS: FIRST HEARTBEAT VERIFICATION ===\n");

    ensureForgeDir();

    if (fs.existsSync(TMP_FILE)) {
      throw new Error("DIRTY_STATE_RECOVERY_REQUIRED: state.tmp.json exists");
    }

    backupFile = backupExistingState();

    log("STEP 1", "Creating fresh default state");
    const initialState = createDefaultState();

    assert(initialState.version === "3.1.1", "default state version must be 3.1.1");
    assert(initialState.lifecycle.phase === "IDLE", "default phase must be IDLE");
    assert(initialState.control.gate_status === "NONE", "default gate status must be NONE");
    assert(initialState.control.requires_human === false, "default requires_human must be false");

    log("STEP 2", "Persisting fresh state via saveStateAtomic()");
    saveStateAtomic(initialState);

    assert(fs.existsSync(STATE_FILE), "state.json must exist after first save");
    assert(!fs.existsSync(TMP_FILE), "state.tmp.json must not remain after atomic save");

    log("STEP 3", "Reloading state via loadState()");
    const loadedState = loadState();
    assertCompatibleState(loadedState);

    assert(loadedState.version === "3.1.1", "loaded state version mismatch");
    assert(loadedState.lifecycle.phase === "IDLE", "loaded phase must be IDLE");

    const beforeTransitionAt = loadedState.lifecycle.last_transition_at;
    const beforeLastUpdated = loadedState.meta.last_updated;
    const beforeEventCount = loadedState.telemetry.recent_events.length;

    log("STEP 4", "Applying legal transition: IDLE -> START -> PLANNING");
    transition(loadedState, "START", {
      command: "!start",
      source: "first-heartbeat",
      actor: "kernel-test"
    });

    assert(loadedState.lifecycle.phase === "PLANNING", "phase must become PLANNING");
    assert(
      loadedState.lifecycle.last_transition_at !== beforeTransitionAt,
      "last_transition_at must change on transition"
    );
    assert(
      loadedState.meta.last_updated !== beforeLastUpdated,
      "meta.last_updated must change on transition"
    );
    assert(
      loadedState.telemetry.recent_events.length === beforeEventCount + 1,
      "recent_events must append exactly one event"
    );

    const lastEvent = loadedState.telemetry.recent_events[
      loadedState.telemetry.recent_events.length - 1
    ];

    assert(lastEvent.event === "START", "last event must be START");
    assert(lastEvent.from === "IDLE", "last event.from must be IDLE");
    assert(lastEvent.to === "PLANNING", "last event.to must be PLANNING");

    log("STEP 5", "Persisting transitioned state");
    saveStateAtomic(loadedState);

    assert(fs.existsSync(STATE_FILE), "state.json must still exist after second save");
    assert(!fs.existsSync(TMP_FILE), "state.tmp.json must not remain after second save");

    log("STEP 6", "Reloading committed state for final verification");
    const committedState = loadState();
    assertCompatibleState(committedState);

    assert(committedState.lifecycle.phase === "PLANNING", "committed phase must be PLANNING");
    assert(
      committedState.telemetry.recent_events.length >= 1,
      "committed state must contain transition history"
    );

    const committedLastEvent = committedState.telemetry.recent_events[
      committedState.telemetry.recent_events.length - 1
    ];

    assert(committedLastEvent.event === "START", "committed last event must be START");
    assert(committedLastEvent.to === "PLANNING", "committed last event target must be PLANNING");

    log("STEP 7", "Verifying persisted JSON directly");
    const rawState = readJson(STATE_FILE);
    assert(rawState.version === "3.1.1", "raw JSON version mismatch");
    assert(rawState.lifecycle.phase === "PLANNING", "raw JSON phase mismatch");

    console.log("\n=== FIRST HEARTBEAT: PASS ===");
    console.log("🟢 Kernel storage, transition engine, and atomic persistence are aligned.");
    console.log(`State file: ${STATE_FILE}`);
    console.log("Expected next status baseline: Phase PLANNING\n");
  } catch (err) {
    fail("First heartbeat verification failed.", err);

    try {
      restoreBackup(backupFile);
    } catch (restoreErr) {
      console.error("\n[WARN] Backup restore failed:");
      console.error(restoreErr.stack || restoreErr.message || String(restoreErr));
    }
  }
}

main();
