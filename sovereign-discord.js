#!/usr/bin/env node
// © 2026 Tarik Skalic — Sovereign AGI OS. All rights reserved.
// sovereign-discord.js — Nervous System (FSM + Discord integration)

const fs = require("fs");
const path = require("path");

// === SINGLETON LOCK — prevents duplicate bot instances ===
const LOCK_FILE = path.join(__dirname, ".forge", "bot.lock");

function acquireLock() {
  const pid = String(process.pid);
  // Check if another instance is running
  if (fs.existsSync(LOCK_FILE)) {
    const existingPid = fs.readFileSync(LOCK_FILE, "utf8").trim();
    try {
      process.kill(Number(existingPid), 0); // signal 0 = check if alive
      console.error(`[BOOT] ABORT: Another bot instance running (PID ${existingPid}). Kill it first.`);
      process.exit(1);
    } catch {
      // Process is dead, stale lock — safe to overwrite
      console.log(`[BOOT] Cleaning stale lock (PID ${existingPid} is dead).`);
    }
  }
  fs.writeFileSync(LOCK_FILE, pid, "utf8");
}

function releaseLock() {
  try { fs.unlinkSync(LOCK_FILE); } catch {}
}

acquireLock();
process.on("exit", releaseLock);
process.on("SIGINT", () => { releaseLock(); process.exit(0); });
process.on("SIGTERM", () => { releaseLock(); process.exit(0); });
// === END SINGLETON LOCK ===

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const {
  Client,
  GatewayIntentBits,
  Partials
} = require("discord.js");

const {
  loadState,
  saveStateAtomic,
  transition,
  assertCompatibleState,
  deriveHealth,
  generateSelfAssessment,
  ensureCognition,
  VERSION
} = require("./sovereign-os");

const { validateRoleParity } = require("./boot-validator");

const MAX_LOG_EVENTS = 10;
const DISCORD_MESSAGE_LIMIT = 2000;

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`MISSING_ENV:${name}`);
  }
  return value;
}

function minutesAgo(isoTime) {
  const diffMs = Date.now() - new Date(isoTime).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

function renderGate(gateStatus) {
  return gateStatus === "NONE" ? "CLEAR" : gateStatus;
}

function renderStatus(state) {
  const health = deriveHealth(state);
  
  // Logic to calculate time elapsed since last move
  const diffMs = Date.now() - new Date(state.lifecycle.last_transition_at).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));

  const rows = [
    { label: "🎯 OBJ", value: state.context.objective || "None" },
    { label: "🩺 HEALTH", value: `${health.emoji} ${health.label}` },
    { label: "🔄 PHASE", value: state.lifecycle.phase },
    { label: "⚖️  GATE", value: state.control.gate_status || "NONE" },
    { label: "⏱️  LAST MOVE", value: `${minutes}m ago` },
    { label: "⚠️  WARNINGS", value: String(state.telemetry.warnings.length) }
  ];

  const innerWidth = 46; // Fixed width for the inner content area
  const boxLines = rows.map(row => {
    const content = `${row.label}: ${row.value}`;
    return `║ ${content.padEnd(innerWidth)} ║`;
  });

  return [
    "```text",
    "╔════════════════════════════════════════════════╗",
    ...boxLines,
    "╚════════════════════════════════════════════════╝",
    "```"
  ].join("\n");
}

function parseCommand(content) {
  const parts = String(content || "").trim().split(/\s+/);
  return {
    root: (parts[0] || "").toLowerCase(),
    args: parts.slice(1).map((s) => s.toLowerCase())
  };
}

function formatCommandError(err) {
  const msg = err?.message || "UNKNOWN_ERROR";

  switch (msg) {
    case "DIRTY_STATE_RECOVERY_REQUIRED":
      return "BOOT FAILURE: DIRTY_STATE_RECOVERY_REQUIRED";
    case "INCOMPATIBLE_STATE_VERSION":
      return "BOOT FAILURE: INCOMPATIBLE_STATE_VERSION";
    case "INVALID_STATE_OBJECT":
      return "BOOT FAILURE: INVALID_STATE_OBJECT";
    case "INVALID_STATE_SHAPE":
      return "BOOT FAILURE: INVALID_STATE_SHAPE";
    case "UNAUTHORIZED_RECOVERY":
      return "DENIED: operator authority required";
    case "RECOVERY_NOT_AVAILABLE":
      return "DENIED: system is not in ERROR_RECOVERY";
    case "INVALID_GATE_ACTION":
      return "USAGE: !gate <approve|reject>";
    case "INVALID_RECOVERY_ACTION":
      return "USAGE: !recover <ack|reset|abort>";
    default:
      if (msg.startsWith("ILLEGAL TRANSITION:")) {
        return `DENIED: ${msg}`;
      }
      if (msg.startsWith("MISSING_ENV:")) {
        return `BOOT FAILURE: ${msg}`;
      }
      return `ERROR: ${msg}`;
  }
}

async function withStateTransaction(commandName, handler) {
  const state = loadState();
  assertCompatibleState(state);

  const reply = await handler(state);

  saveStateAtomic(state);

  return reply;
}

function handleStatus() {
  const state = loadState();
  assertCompatibleState(state);
  return renderStatus(state);
}

function formatLogEvent(ev) {
  const time = new Date(ev.at).toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const payloadEntries = Object.entries(ev.payload || {});
  const payloadStr = payloadEntries.length
    ? payloadEntries.map(([k, v]) => `${k}=${String(v)}`).join(" ")
    : "";

  const line = `[${time}] ${ev.event}: ${ev.from}->${ev.to}${payloadStr ? ` (${payloadStr})` : ""}`;
  return line.slice(0, 240);
}

function buildLogsMessage(events, isCritical) {
  if (!events.length) {
    return isCritical ? "📂 No critical logs found." : "📂 No logs found.";
  }

  const totalFound = events.length;
  const displayEvents = events.slice(-MAX_LOG_EVENTS);
  const omitted = totalFound - displayEvents.length;

  const title = `📂 ${isCritical ? "CRITICAL " : ""}LOGS (Recent ${displayEvents.length} of ${totalFound})`;
  const prefix = `${title}\n\`\`\`text\n`;
  const suffixBase = "\n```";
  const omittedLine = omitted > 0 ? `\n+ ${omitted} older events omitted.` : "";

  let lines = [];
  let current = prefix;

  for (const ev of displayEvents) {
    const candidate = formatLogEvent(ev);
    const tentative = current + candidate + "\n" + suffixBase + omittedLine;

    if (tentative.length > DISCORD_MESSAGE_LIMIT) {
      break;
    }

    lines.push(candidate);
    current += candidate + "\n";
  }

  if (!lines.length) {
    return `${title}\n\`\`\`text\n[log output too long to render safely]\n\`\`\``;
  }

  return prefix + lines.join("\n") + suffixBase + omittedLine;
}

async function handleLogs(args) {
  const state = loadState();
  assertCompatibleState(state);

  const isCritical = args.includes("critical");
  let events = state.telemetry?.recent_events || [];

  if (isCritical) {
    events = events.filter((ev) =>
      ev.to === "ERROR_RECOVERY" ||
      ev.event === "INTERNAL_ERROR" ||
      ev.payload?.reason === "FORBIDDEN_TOOL"
    );
  }

  return buildLogsMessage(events, isCritical);
}

async function handleStart(args) {
  return withStateTransaction("start", async (state) => {
    const raw = args.length > 0 ? args.join(" ") : null;
    const objective = raw ? raw.replace(/^["']+|["']+$/g, "") : null;
    if (objective) {
      state.context.objective = objective;
    }

    transition(state, "START", {
      command: "!start",
      source: "discord"
    });

    const objText = objective ? ` Objective: "${objective}"` : "";
    return `🚀 START: Phase moved to PLANNING.${objText}`;
  });
}

async function handleSubmit() {
  return withStateTransaction("submit", async (state) => {
    transition(state, "SUBMIT", {
      command: "!submit",
      source: "discord"
    });

    return "📤 SUBMIT: Phase moved to GOVERNANCE_CHECK.";
  });
}

async function handleGate(action, actorId) {
  return withStateTransaction("gate", async (state) => {
    let eventType;
    if (action === "approve") eventType = "GATE_APPROVED";
    else if (action === "reject") eventType = "GATE_REJECTED";
    else throw new Error("INVALID_GATE_ACTION");

    transition(state, eventType, {
      command: `!gate ${action}`,
      actor: actorId,
      gate_decision: action,
      source: "discord"
    });

    return eventType === "GATE_APPROVED"
      ? "⚖️ GATE APPROVED: Returning to WAITING_FOR_SUBMISSION."
      : "⚖️ GATE REJECTED: Entering ERROR_RECOVERY.";
  });
}

async function handleRecover(action, actorId) {
  const operatorId = requireEnv("OPERATOR_DISCORD_ID");

  if (actorId !== operatorId) {
    throw new Error("UNAUTHORIZED_RECOVERY");
  }

  return withStateTransaction("recover", async (state) => {
    if (state.lifecycle.phase !== "ERROR_RECOVERY") {
      throw new Error("RECOVERY_NOT_AVAILABLE");
    }

    let eventType;
    if (action === "ack") eventType = "RECOVERY_ACK";
    else if (action === "reset") eventType = "RECOVERY_RESET";
    else if (action === "abort") eventType = "RECOVERY_ABORT";
    else throw new Error("INVALID_RECOVERY_ACTION");

    transition(state, eventType, {
      command: `!recover ${action}`,
      actor: actorId,
      source: "discord"
    });

    if (eventType === "RECOVERY_ABORT") {
      state.context.objective = null;
      state.pipeline.tasks = [];
      state.pipeline.task_cursor = 0;
    }

    if (eventType === "RECOVERY_ACK") {
      return "🛠️ RECOVERY ACK: Operator has acknowledged incident.";
    }
    if (eventType === "RECOVERY_RESET") {
      return "🛠️ RECOVERY RESET: Error cleared. Returning to WAITING_FOR_SUBMISSION.";
    }
    return "💀 RECOVERY ABORT: Session terminated. Phase moved to IDLE.";
  });
}

async function handleCancel(actorId) {
  const operatorId = requireEnv("OPERATOR_DISCORD_ID");

  if (actorId !== operatorId) {
    throw new Error("UNAUTHORIZED_CANCEL");
  }

  return withStateTransaction("cancel", async (state) => {
    transition(state, "CANCEL", {
      command: "!cancel",
      actor: actorId,
      source: "discord"
    });

    state.context.objective = null;
    state.pipeline.tasks = [];
    state.pipeline.task_cursor = 0;

    return "🛑 CANCEL: Mission aborted. Phase moved to IDLE.";
  });
}

const { execSync } = require("child_process");

const NODE_BIN = process.env.NODE_BIN ||
  "C:/Users/hhk33/AppData/Local/ms-playwright-go/1.50.1/node.exe";
const PROJECT_ROOT = process.env.PROJECT_ROOT || __dirname;

const HANDOVER_ROLES = {
  builder: "BUILDER", qa: "QA", debug: "DEBUG",
  architect: "ARCHITECT", orchestrator: "ORCHESTRATOR",
  reviewer: "REVIEWER", researcher: "RESEARCHER",
  "pre-ship": "PRE-SHIP", preship: "PRE-SHIP"
};

const ROLE_MODES = {
  ORCHESTRATOR: "Orchestrator Mode", ARCHITECT: "Architect Mode",
  BUILDER: "Code Mode", RESEARCHER: "Ask Mode",
  QA: "Debug Mode", DEBUG: "Debug Mode",
  REVIEWER: "Review Mode", "PRE-SHIP": "Review Mode"
};

function handleLaws() {
  return [
    "```",
    "SOVEREIGN AGI OS — CONSTITUTIONAL LAWS",
    "",
    "1. NO DIRECT STATE MUTATION",
    "2. NO UNAUTHORIZED TRANSITIONS",
    "3. NO SCOPE CREEP",
    "4. NO UNVERIFIED OUTPUT",
    "5. NO GUESSING",
    "",
    "Violations → STOP + report",
    "```"
  ].join("\n");
}

function handleHealth() {
  try {
    const result = execSync(
      `"${NODE_BIN}" tools/validate-state.js`,
      { encoding: "utf8", cwd: PROJECT_ROOT }
    );
    const parsed = JSON.parse(result);
    const state = loadState();
    const health = deriveHealth(state);
    return [
      "```",
      `State:   ${parsed.success ? "✅ VALID" : "❌ INVALID"}`,
      `Version: ${parsed.version}`,
      `Phase:   ${parsed.phase}`,
      `Health:  ${health.emoji} ${health.label}`,
      `Role:    ${parsed.role}`,
      `Obj:     ${parsed.objective}`,
      "```"
    ].join("\n");
  } catch (e) {
    return "❌ Health check failed: " + e.message;
  }
}

function handleHandover(args) {
  const key = String(args[0] || "").trim().toLowerCase();
  const role = HANDOVER_ROLES[key];
  if (!role) {
    throw new Error(
      "USAGE: !handover <builder|qa|architect|orchestrator|reviewer|researcher>"
    );
  }
  const state = loadState();
  assertCompatibleState(state);
  const health = deriveHealth(state);
  const mode = ROLE_MODES[role] || "Unknown Mode";

  return [
    "```text",
    `HANDOVER: ${state.context?.active_role || "UNKNOWN"} → ${role}`,
    `Phase: ${state.lifecycle?.phase}`,
    `Objective: ${state.context?.objective || "null"}`,
    `Required Mode: ${mode}`,
    `Health: ${health.emoji} ${health.label}`,
    "",
    "Receiver must confirm:",
    `Phase: <X> | Role: ${role} | Mode: ${mode}`,
    "I will not mutate lifecycle state directly.",
    "```"
  ].join("\n");
}

function deriveNextObjective() {
  // 1. Read CONTEXT.md incomplete items
  const contextPath = path.join(PROJECT_ROOT, "CONTEXT.md");
  const incompleteItems = [];
  if (fs.existsSync(contextPath)) {
    const lines = fs.readFileSync(contextPath, "utf8").split("\n");
    let inIncomplete = false;
    for (const line of lines) {
      if (line.startsWith("## WHAT IS INCOMPLETE")) { inIncomplete = true; continue; }
      if (inIncomplete && line.startsWith("## ")) break;
      if (inIncomplete && line.startsWith("- ")) {
        incompleteItems.push(line.replace(/^- /, "").trim());
      }
    }
  }

  // 2. Check active bounties
  const bountyPath = path.join(PROJECT_ROOT, ".forge", "bounties.json");
  let activeBounties = [];
  if (fs.existsSync(bountyPath)) {
    try {
      const b = JSON.parse(fs.readFileSync(bountyPath, "utf8"));
      activeBounties = (b.active || []).map(x => ({
        source: "bounty", text: x.objective, priority: x.reward || 500, id: x.id
      }));
    } catch {}
  }

  // 3. Check evolution proposals
  const geneticDir = path.join(PROJECT_ROOT, ".memory", "genetic-archive");
  let evolutionProposals = [];
  if (fs.existsSync(geneticDir)) {
    const files = fs.readdirSync(geneticDir).filter(f => f.endsWith(".json")).sort().reverse();
    for (const f of files.slice(0, 3)) {
      try {
        const evo = JSON.parse(fs.readFileSync(path.join(geneticDir, f), "utf8"));
        for (const p of (evo.proposals || [])) {
          evolutionProposals.push({
            source: "evolution", text: p.proposal, priority: p.fitness_score || 50,
            type: p.type, trigger: p.trigger
          });
        }
      } catch {}
    }
  }

  // 4. Check cognitive faculties needing attention
  const profilePath = path.join(PROJECT_ROOT, ".forge", "cognitive-profile.json");
  let cogTriggers = [];
  if (fs.existsSync(profilePath)) {
    try {
      const profile = JSON.parse(fs.readFileSync(profilePath, "utf8"));
      const triggers = profile.evolution_triggers || [];
      cogTriggers = triggers.map(t => ({
        source: "cognition", text: `Improve ${t.faculty}: ${t.proposal}`,
        priority: 100 - (t.score || 0), faculty: t.faculty
      }));
    } catch {}
  }

  // 5. Score and rank all candidates
  const candidates = [];

  // Bounties get top priority (someone explicitly posted them)
  activeBounties.forEach(b => candidates.push({ ...b, score: b.priority + 200 }));

  // Evolution proposals (system learned from friction)
  evolutionProposals.forEach(e => candidates.push({ ...e, score: e.priority + 100 }));

  // Cognitive triggers (weak faculties)
  cogTriggers.forEach(c => candidates.push({ ...c, score: c.priority + 50 }));

  // Incomplete items from CONTEXT.md (default backlog)
  incompleteItems.forEach((item, i) => candidates.push({
    source: "backlog", text: item, score: 80 - i * 5
  }));

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  return { candidates, top: candidates[0] || null };
}

async function handleNext() {
  const state = loadState();
  assertCompatibleState(state);

  if (state.lifecycle.phase !== "IDLE") {
    return `⚠️ Can't auto-select: phase is ${state.lifecycle.phase}, not IDLE. Use \`!cancel\` first.`;
  }

  const { candidates, top } = deriveNextObjective();

  if (!top) {
    return "✅ Nothing to do. All clear — no incomplete items, bounties, or evolution proposals found.";
  }

  // Show top 5 candidates with ranking
  const preview = candidates.slice(0, 5).map((c, i) => {
    const badge = c.source === "bounty" ? "💰" :
                  c.source === "evolution" ? "🧬" :
                  c.source === "cognition" ? "🧠" : "📋";
    return `${i + 1}. ${badge} [${c.source}] ${c.text} (score: ${c.score})`;
  }).join("\n");

  // Auto-start with the top candidate
  state.context.objective = top.text;
  transition(state, "START", { command: "!next", source: "discord", auto_selected: true });
  saveStateAtomic(state);

  return [
    "🎯 **AUTO-SELECT: Top objectives ranked:**",
    "```",
    preview,
    "```",
    `🚀 Started mission: **${top.text}**`,
    `Source: ${top.source} | Score: ${top.score}`,
    "",
    "Use `!cancel` to pick a different one."
  ].join("\n");
}

function handleEvaluate() {
  try {
    const result = execSync(
      `"${NODE_BIN}" tools/cognitive-eval.js`,
      { encoding: "utf8", cwd: PROJECT_ROOT }
    );
    return "```\n" + result + "\n```";
  } catch (e) {
    return "❌ Evaluation failed: " + e.message;
  }
}

async function handleLog(message) {
  const state = loadState();
  assertCompatibleState(state);

  // Reset session
  state.context.objective = null;
  state.lifecycle.phase = "IDLE";
  state.lifecycle.last_transition_at = new Date().toISOString();
  state.meta.last_updated = new Date().toISOString();
  saveStateAtomic(state);

  await message.reply("✅ SESSION CLOSED. Running cognitive evaluation...");

  try {
    const evalResult = execSync(
      `"${NODE_BIN}" tools/cognitive-eval.js`,
      { encoding: "utf8", cwd: PROJECT_ROOT }
    );
    // Split if too long for Discord
    const text = "```\n" + evalResult + "\n```";
    if (text.length > 1900) {
      await message.channel.send(text.slice(0, 1900));
      if (text.length > 1900) await message.channel.send(text.slice(1900));
    } else {
      await message.channel.send(text);
    }
  } catch (e) {
    await message.channel.send("⚠️ Cognitive eval error: " + e.message);
  }
}

function handleReflect() {
  const state = loadState();
  assertCompatibleState(state);
  const assessment = generateSelfAssessment(state);

  const mBar = (val) => {
    const filled = Math.round(val * 10);
    return "█".repeat(filled) + "░".repeat(10 - filled);
  };

  const metricsBlock = [
    `CLARITY    ${mBar(assessment.metrics.clarity)} ${(assessment.metrics.clarity * 100).toFixed(0)}%`,
    `MOMENTUM   ${mBar(assessment.metrics.momentum)} ${(assessment.metrics.momentum * 100).toFixed(0)}%`,
    `COHERENCE  ${mBar(assessment.metrics.coherence)} ${(assessment.metrics.coherence * 100).toFixed(0)}%`,
    `FRICTION   ${mBar(assessment.metrics.friction)} ${(assessment.metrics.friction * 100).toFixed(0)}%`,
  ];

  const composite = assessment.composite;
  const compositeEmoji = composite >= 0.8 ? "🟢" : composite >= 0.5 ? "🟡" : "🔴";

  const narrativeBlock = assessment.narrative.map(l => `  ${l}`).join("\n");

  const reflectionBlock = assessment.recent_reflections.length > 0
    ? assessment.recent_reflections.map(r => {
        const time = new Date(r.at).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" });
        return `  [${time}] ${r.type}: ${r.insight.slice(0, 120)}`;
      }).join("\n")
    : "  (no reflections yet)";

  return [
    `${compositeEmoji} **COGNITIVE SELF-ASSESSMENT** (composite: ${(composite * 100).toFixed(0)}%)`,
    "```text",
    "╔═══════════════════════════════════════════════════╗",
    ...metricsBlock.map(l => `║ ${l.padEnd(49)} ║`),
    "╠═══════════════════════════════════════════════════╣",
    `║ MISSIONS: ${String(assessment.patterns.completed_missions).padEnd(4)} TRANSITIONS: ${String(assessment.patterns.total_transitions).padEnd(15)} ║`,
    `║ CANCEL STREAK: ${String(assessment.patterns.cancel_streak).padEnd(2)}  ERROR STREAK: ${String(assessment.patterns.error_streak).padEnd(14)} ║`,
    "╚═══════════════════════════════════════════════════╝",
    "```",
    "**Narrative:**",
    "```",
    narrativeBlock,
    "```",
    "**Recent Reflections:**",
    "```",
    reflectionBlock,
    "```"
  ].join("\n");
}

async function dispatchCommand(message) {
  const { root, args } = parseCommand(message.content);

  switch (root) {
    case "!status":
      return handleStatus();
    case "!logs":
      return handleLogs(args);
    case "!start":
      return handleStart(args);
    case "!submit":
      return handleSubmit();
    case "!gate":
      return handleGate(args[0], message.author.id);
    case "!recover":
      return handleRecover(args[0], message.author.id);
    case "!cancel":
      return handleCancel(message.author.id);
    case "!next":
      return handleNext();
    case "!reflect":
      return handleReflect();
    case "!evaluate":
      return handleEvaluate();
    case "!laws":
      return handleLaws();
    case "!health":
      return handleHealth();
    case "!handover":
      return handleHandover(args);
    case "!log":
      await handleLog(message);
      return null;
    case "!handshake":
      return "🤝 HANDSHAKE: Session confirmed. Phase: " + loadState().lifecycle.phase + ". Ready.";
    case "!help":
      return [
        "**SOVEREIGN AGI OS — COMMANDS**",
        "",
        "**Governance:**",
        "`!status` — kernel health, phase, gate, last move",
        "`!start \"objective\"` — begin a mission (→ PLANNING)",
        "`!submit` — submit work (→ GOVERNANCE_CHECK)",
        "`!gate <approve|reject>` — operator gate decision",
        "`!cancel` — abort current mission (→ IDLE)",
        "`!next` — auto-derive next objective from project state",
        "`!recover <ack|reset|abort>` — error recovery",
        "`!log` — close session + cognitive evaluation",
        "",
        "**Cognition:**",
        "`!reflect` — self-assessment (clarity, momentum, friction)",
        "`!evaluate` — 10-faculty cognitive profile",
        "`!laws` — constitutional laws",
        "`!health` — validate state + health check",
        "",
        "**Navigation:**",
        "`!handshake` — confirm session alignment",
        "`!handover <role>` — generate lane handover template",
        "`!logs` — recent audit events",
        "`!help` — this message",
      ].join("\n");
    default:
      return null;
  }
}

async function main() {
  requireEnv("DISCORD_TOKEN");
  requireEnv("OPERATOR_DISCORD_ID");

  validateRoleParity();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  });

  client.once("ready", () => {
    console.log(`[DISCORD] Logged in as ${client.user.tag}`);
  });

  client.on("error", (err) => {
    console.error("[DISCORD] Client error:", err);
  });

  client.on("messageCreate", async (message) => {
    try {
      if (!message?.content || message.author?.bot) return;
      if (!message.content.trim().startsWith("!")) return;

      const reply = await dispatchCommand(message);
      if (reply && reply !== "UNKNOWN_COMMAND") await message.reply(reply);
    } catch (err) {
      const reply = formatCommandError(err);
      try {
        await message.reply(reply);
      } catch (replyErr) {
        console.error("[DISCORD] Reply failure:", replyErr);
      }
    }
  });

  await client.login(process.env.DISCORD_TOKEN);
}

if (require.main === module) {
  main().catch((err) => {
    console.error("[BOOT] sovereign-discord.js failed to start");
    console.error(err.stack || err.message || String(err));
    process.exit(1);
  });
}

module.exports = {
  main,
  parseCommand,
  renderStatus,
  formatCommandError,
  withStateTransaction,
  handleLogs,
  formatLogEvent,
  buildLogsMessage
};
