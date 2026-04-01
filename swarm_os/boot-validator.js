#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { loadState, assertCompatibleState } = require("./sovereign-os");

const RULES_FILE = path.join(__dirname, ".agent", "rules.md");

const ALLOWED_ROLES = new Set([
  "ORCHESTRATOR",
  "ARCHITECT",
  "BUILDER",
  "RESEARCHER",
  "QA",
  "DEBUG",
  "REVIEWER",
  "PRE-SHIP"
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readRulesFile() {
  if (!fs.existsSync(RULES_FILE)) {
    throw new Error("MISSING_AGENT_RULES");
  }
  return fs.readFileSync(RULES_FILE, "utf8");
}

function extractMappedRoles(rulesContent) {
  const roles = new Set();
  const lines = String(rulesContent).split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^\|\s*([A-Z-]+)\s*\|/);
    if (match) {
      roles.add(match[1].trim().toUpperCase());
    }
  }

  return roles;
}

function verifyRoleParity(state, rulesContent) {
  const activeRole = String(state?.context?.active_role || "").toUpperCase();
  const mappedRoles = extractMappedRoles(rulesContent);

  assert(activeRole, "CRITICAL_MISMATCH: Missing context.active_role");
  assert(
    ALLOWED_ROLES.has(activeRole),
    `CRITICAL_MISMATCH: Role '${activeRole}' is not kernel-approved`
  );
  assert(
    mappedRoles.has(activeRole),
    `CRITICAL_MISMATCH: Role '${activeRole}' has no lane mapping in .agent/rules.md`
  );

  console.log(`[INIT] Role Parity Verified: ${activeRole}`);
}

function verifyKernelRoleSetCoverage(rulesContent) {
  const mappedRoles = extractMappedRoles(rulesContent);

  for (const role of ALLOWED_ROLES) {
    assert(
      mappedRoles.has(role),
      `CRITICAL_MISMATCH: Kernel role '${role}' missing from .agent/rules.md`
    );
  }

  console.log("[INIT] Rules coverage verified for all kernel roles");
}

function verifyObjectiveParity(state) {
  const objective = state?.context?.objective ?? null;
  // Objectives are user-defined via !start — no hardcoded anchor check needed
  console.log(`[INIT] Objective: ${objective === null ? "none (IDLE)" : objective}`);
}

function validateRoleParity() {
  console.log("\n=== SOVEREIGN OS: BOOT VALIDATOR ===\n");

  const state = loadState();
  assertCompatibleState(state);

  const rulesContent = readRulesFile();

  verifyRoleParity(state, rulesContent);
  verifyKernelRoleSetCoverage(rulesContent);
  verifyObjectiveParity(state);

  console.log("\n=== BOOT VALIDATOR: PASS ===");
  console.log("🟢 Kernel state, role map, and agent rules are aligned.\n");
}

if (require.main === module) {
  try {
    validateRoleParity();
  } catch (err) {
    console.error("\n[FAIL] Boot validation failed.");
    console.error(err.stack || err.message || String(err));
    process.exitCode = 1;
  }
}

module.exports = {
  validateRoleParity
};
