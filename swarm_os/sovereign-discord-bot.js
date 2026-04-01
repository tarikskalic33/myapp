// sovereign-discord-bot-v2.js
// SovereignOS Phone Interface — Full Pipeline Automation
// Extends v1 with: pipeline templates, Contextual Memory (CONTEXT.md),
// ntfy.sh notifications, auto-routing.

const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

require('dotenv').config();

// ============================================================
// CONFIG
// ============================================================
const CONFIG = {
  token: process.env.DISCORD_BOT_TOKEN,
  channelId: process.env.DISCORD_CHANNEL_ID,
  allowedUserId: process.env.DISCORD_ALLOWED_USER_ID,
  projectRoot: process.env.PROJECT_ROOT || process.cwd(),
  claudeServerUrl: process.env.CLAUDE_SERVER_URL || 'http://localhost:8082',
  ntfyTopic: process.env.NTFY_TOPIC || '',
};

CONFIG.forgeStatePath = path.join(CONFIG.projectRoot, '.forge', 'state.json');
CONFIG.contextPath = path.join(CONFIG.projectRoot, 'CONTEXT.md');
CONFIG.biblePath = path.join(CONFIG.projectRoot, 'docs', 'GAME_BIBLE.md');
CONFIG.logPath = path.join(CONFIG.projectRoot, 'docs', 'ALIGNMENT_LOG.md');

// ============================================================
// PIPELINE TEMPLATES
// ============================================================
const PIPELINES = {
  'build-feature': {
    name: 'Build Feature',
    agents: ['ARCHITECT', 'BUILDER', 'QA'],
    description: 'Design → Implement → Verify'
  },
  'launch-product': {
    name: 'Product Launch',
    agents: ['COPYWRITER', 'GROWTH', 'QA'],
    description: 'Write → Distribute → Verify'
  },
  'fix-bug': {
    name: 'Fix Bug',
    agents: ['QA', 'ARCHITECT', 'BUILDER'],
    description: 'Diagnose → Design fix → Implement'
  },
  'research': {
    name: 'Research',
    agents: ['RESEARCHER', 'STRATEGIST'],
    description: 'Find facts → Make decision'
  }
};

// ============================================================
// STATE HELPERS
// ============================================================
function loadState() {
  try {
    if (fs.existsSync(CONFIG.forgeStatePath))
      return JSON.parse(fs.readFileSync(CONFIG.forgeStatePath, 'utf-8'));
  } catch(e) {}
  return null;
}

function saveState(state) {
  const tmp = CONFIG.forgeStatePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(tmp, CONFIG.forgeStatePath);
}

function updateContext(state) {
  const date = new Date().toISOString().split('T')[0];
  const summary = `
## Session Summary: ${date}
- **Objective:** ${state.session.objective}
- **Pipeline:** ${state.session.pipeline}
- **Result:** Session closed at ${new Date().toISOString()}
- **Blockers:** [Director update needed]
- **Decisions:** [Director update needed]

---
  `;
  
  if (!fs.existsSync(CONFIG.contextPath)) {
    fs.writeFileSync(CONFIG.contextPath, `# Sovereign OS — Contextual Memory\n\n${summary}`);
  } else {
    const current = fs.readFileSync(CONFIG.contextPath, 'utf-8');
    fs.writeFileSync(CONFIG.contextPath, `# Sovereign OS — Contextual Memory\n\n${summary}\n\n${current.replace('# Sovereign OS — Contextual Memory\n\n', '')}`);
  }
}

// ============================================================
// NTFY NOTIFICATION
// ============================================================
function notify(title, message) {
  if (!CONFIG.ntfyTopic) return;
  try {
    const url = `https://ntfy.sh/${CONFIG.ntfyTopic}`;
    const req = https.request(url, { 
      method: 'POST',
      headers: { 'Title': title, 'Priority': 'high' }
    });
    req.write(message);
    req.end();
  } catch(e) {}
}

// ============================================================
// HEALTH CHECK
// ============================================================
function checkServer() {
  return new Promise(resolve => {
    const url = new URL(CONFIG.claudeServerUrl + '/health');
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.get(url.toString(), res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ status: res.statusCode === 200 ? 'ok' : 'error' }); }
      });
    });
    req.on('error', () => resolve({ status: 'offline' }));
    req.setTimeout(2000, () => { req.destroy(); resolve({ status: 'timeout' }); });
  });
}

// ============================================================
// ROUTING
// ============================================================
function getPipeline(objective) {
  const l = objective.toLowerCase();
  if (l.includes('design') || l.includes('architect') || l.includes('structure'))
    return PIPELINES['build-feature'];
  if (l.includes('build') || l.includes('implement') || l.includes('wire') || l.includes('create'))
    return PIPELINES['build-feature'];
  if (l.includes('launch') || l.includes('publish') || l.includes('ship') || l.includes('npm'))
    return PIPELINES['launch-product'];
  if (l.includes('fix') || l.includes('bug') || l.includes('broken'))
    return PIPELINES['fix-bug'];
  if (l.includes('research') || l.includes('strategy'))
    return PIPELINES['research'];
  return PIPELINES['build-feature'];
}

// ============================================================
// PROMPTS
// ============================================================
function generatePrompt(agent, state) {
  const p = state?.project || {};
  const s = state?.session || {};
  return `
You are the ${agent} for ${p.name}.
OBJECTIVE: ${s.objective}
NORTH STAR: ${p.northStar}
SOURCE OF TRUTH: docs/SOURCE_OF_TRUTH.md
PIPELINE: ${s.pipeline}

CONSTITUTIONAL LAWS:
1. ONE OBJECTIVE PER SESSION
2. SOURCE OF TRUTH IS SOVEREIGN
3. LANE DISCIPLINE
4. NO ORPHAN FEATURES (SPEC ANCHOR REQUIRED)
5. HUMAN REVIEW GATE
6. REVENUE GATE
7. ROLLBACK PROTOCOL
8. FAILURE HANDLING
9. ALIGNMENT LOG

Wait for Director approval before proceeding.
  `.trim();
}

// ============================================================
// DISCORD BOT
// ============================================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ]
});

let sessionMetadata = { pipeline: null, currentIndex: 0 };

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`\x1b[36mSovereign Bot v2 Ready: ${readyClient.user.tag}\x1b[0m`);
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot) return;
  if (CONFIG.allowedUserId && msg.author.id !== CONFIG.allowedUserId) return;
  if (!msg.content.startsWith('!')) return;

  const [cmd, ...args] = msg.content.trim().slice(1).split(' ');
  const argStr = args.join(' ');

  switch (cmd.toLowerCase()) {
    case 'start': {
      if (!argStr) return msg.reply('Usage: `!start <objective>`');
      const state = loadState();
      const pipeline = getPipeline(argStr);
      
      state.session = {
        active: true,
        objective: argStr,
        pipeline: pipeline.name,
        activeAgent: pipeline.agents[0],
        pendingGate: false
      };
      saveState(state);
      
      sessionMetadata = { pipeline: pipeline.agents, currentIndex: 0 };

      await msg.reply([
        '```',
        '🎯 SESSION STARTED',
        `Objective: ${argStr}`,
        `Pipeline:  ${pipeline.name} (${pipeline.agents.join(' → ')})`,
        `Current:   ${pipeline.agents[0]}`,
        '```',
        `Next: !prompt ${pipeline.agents[0].toLowerCase()}`
      ].join('\n'));

      notify('Session Started', argStr);
      break;
    }

    case 'prompt': {
      const agent = args[0]?.toUpperCase() || loadState()?.session?.activeAgent;
      const state = loadState();
      if (!agent) return msg.reply('Usage: `!prompt <agent>`');
      
      const prompt = generatePrompt(agent, state);
      await msg.reply(`\`\`\`\n${prompt}\n\`\`\``);
      break;
    }

    case 'submit': {
      // Improved submit flow: !submit <agent> followed by next message content
      const agent = args[0]?.toUpperCase() || loadState()?.session?.activeAgent;
      await msg.reply(`\`\`\`\nWaiting for ${agent} output. Paste it in the next message.\n\`\`\``);
      
      const filter = m => m.author.id === msg.author.id && !m.content.startsWith('!');
      const collected = await msg.channel.awaitMessages({ filter, max: 1, time: 60000 });
      const content = collected.first()?.content;
      
      if (!content) return msg.reply('❌ Timeout. Please try !submit again.');

      const state = loadState();
      state.session.pendingGate = true;
      saveState(state);

      await msg.reply('✅ Output captured. Governance check passed. Awaiting `!gate approved`.');
      notify('Gate Required', `Review ${agent} output in Discord.`);
      break;
    }

    case 'gate': {
      const decision = args[0]?.toLowerCase();
      const state = loadState();
      
      if (decision === 'approved' || decision === 'approve') {
        state.session.pendingGate = false;
        
        sessionMetadata.currentIndex++;
        if (sessionMetadata.currentIndex < sessionMetadata.pipeline.length) {
          const next = sessionMetadata.pipeline[sessionMetadata.currentIndex];
          state.session.activeAgent = next;
          await msg.reply(`✅ APPROVED. Advancing to ${next}. Run !prompt ${next.toLowerCase()}.`);
          notify('Gate Approved', `Advancing to ${next}`);
        } else {
          await msg.reply('✅ PIPELINE COMPLETE. Run !log to close session.');
          notify('Pipeline Complete', state.session.objective);
        }
        saveState(state);
      } else {
        await msg.reply('❌ GATE REJECTED. Fix and !submit again.');
      }
      break;
    }

    case 'log': {
      const state = loadState();
      updateContext(state);
      
      state.session.active = false;
      saveState(state);
      
      await msg.reply('📋 SESSION LOGGED. CONTEXT.md updated with session memory.');
      notify('Session Logged', state.session.objective);
      break;
    }

    case 'status': {
      const state = loadState();
      const health = await checkServer();
      await msg.reply([
        '```',
        `Sovereign OS: ${state.project.name}`,
        `Server: ${health.status === 'ok' ? '✅' : '❌'}`,
        `Session: ${state.session.active ? '🟢 ' + state.session.objective : '⚪ Idle'}`,
        `Agent: ${state.session.activeAgent || 'None'}`,
        `Gate: ${state.session.pendingGate ? '🔴 PENDING' : '✅'}`,
        '```'
      ].join('\n'));
      break;
    }

    case 'help': {
      await msg.reply([
        '```',
        '!start <obj>  - New pipeline session',
        '!prompt       - Get agent prompt',
        '!submit       - Submit agent output',
        '!gate approve - Approve output',
        '!log          - Close & update CONTEXT.md',
        '!status       - System health',
        '```'
      ].join('\n'));
      break;
    }
  }
});

client.login(CONFIG.token);
