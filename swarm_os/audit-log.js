#!/usr/bin/env node

const { loadState, assertCompatibleState } = require("./sovereign-os");

function formatAge(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.max(0, Math.floor(ms / 60000));
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  const rem = min % 60;
  return `${hrs}h ${rem}m ago`;
}

function formatPayload(payload) {
  const entries = Object.entries(payload || {});
  if (!entries.length) return "";
  return entries.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(", ");
}

function printHeader(state) {
  console.log("=== SOVEREIGN OS AUDIT LOG ===\n");
  console.log(`Version     : ${state.version}`);
  console.log(`Session ID  : ${state.meta.session_id}`);
  console.log(`Project ID  : ${state.meta.project_id}`);
  console.log(`Objective   : ${state.context.objective ?? "null"}`);
  console.log(`Role        : ${state.context.active_role}`);
  console.log(`Phase       : ${state.lifecycle.phase}`);
  console.log(`Gate        : ${state.control.gate_status}`);
  console.log(`Human Gate  : ${state.control.requires_human}`);
  console.log(`Created     : ${state.meta.created_at}`);
  console.log(`Updated     : ${state.meta.last_updated}`);
  console.log("");
}

function printEvents(state) {
  const isCriticalOnly = process.argv.includes("--critical");
  let events = state.telemetry?.recent_events || [];

  if (isCriticalOnly) {
    events = events.filter((ev) =>
      ev.to === "ERROR_RECOVERY" ||
      ev.event === "INTERNAL_ERROR" ||
      ev.payload?.reason === "FORBIDDEN_TOOL"
    );
  }

  if (!events.length) {
    console.log(isCriticalOnly ? "No critical events found." : "No recent events.");
    return;
  }

  console.log("Timeline:");
  for (const ev of events) {
    const payload = formatPayload(ev.payload);
    const line =
      `- ${ev.at} (${formatAge(ev.at)}) :: ${ev.event} :: ${ev.from} -> ${ev.to}` +
      (payload ? ` :: ${payload}` : "");
    console.log(line);
  }
}

function main() {
  const asJson = process.argv.includes("--json");

  try {
    const state = loadState();
    assertCompatibleState(state);

    if (asJson) {
      console.log(JSON.stringify({
        summary: {
          version: state.version,
          session_id: state.meta.session_id,
          project_id: state.meta.project_id,
          objective: state.context.objective,
          active_role: state.context.active_role,
          phase: state.lifecycle.phase,
          gate_status: state.control.gate_status,
          requires_human: state.control.requires_human,
          created_at: state.meta.created_at,
          last_updated: state.meta.last_updated
        },
        last_error: state.telemetry.last_error,
        warnings: state.telemetry.warnings,
        recent_events: state.telemetry.recent_events || []
      }, null, 2));
      return;
    }

    printHeader(state);

    if (state.telemetry.last_error) {
      console.log("Last Error:");
      console.log(`- ${state.telemetry.last_error.code}: ${state.telemetry.last_error.message}`);
      console.log(`- at ${state.telemetry.last_error.at}\n`);
    }

    console.log(`Warnings    : ${(state.telemetry.warnings || []).length}\n`);
    printEvents(state);
    console.log("\n=== END AUDIT LOG ===");
  } catch (err) {
    console.error("[FAIL] audit-log.js");
    console.error(err.stack || err.message || String(err));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
