# KILO CODE — SOVEREIGN INTEGRATION GUIDE
## Full-context autonomous builder for SovereignOS
## Director: Tarik Skalić

---

## WHAT KILO CODE ACTUALLY IS

Kilo Code is a VS Code extension that reads your ENTIRE
codebase before acting. Unlike Aider (file-by-file) or 
Antigravity (rate-limited), Kilo:

- Reads all files simultaneously via codebase indexing
- Executes multi-file changes in one pass
- Runs on OpenRouter free tier (no rate limit hit)
- Respects .agent/rules.md as its operating constitution
- Streams output live in VS Code sidebar
- Supports tool use: file read, write, terminal, search

For SYSTEM_REBUILD: it can see Player.gd, 
SystemCascadeManager.gd, and RoutineTracker.gd 
simultaneously before writing a single line.

---

## STEP 1: INSTALL

1. Open VS Code
2. Extensions (Ctrl+Shift+X)
3. Search: "Kilo Code"
4. Install: Kilo Code by Kilo-Org
5. Reload VS Code

---

### STEP 2: CONNECT TO OPENROUTER (FREE)

1. Go to openrouter.ai → sign up (email only, no phone)
2. API Keys → Create Key → copy it
3. In VS Code: Kilo Code sidebar → Settings icon
4. Provider: OpenRouter
5. API Key: paste your key
6. Model: paste this exact model:
   `qwen/qwen3-coder-480b-a35b-instruct:free`

*Purpose: This is the strongest free coding model (262K context) for repository-level implementation.*

**Fallback if rate limited (200 req/day):**
- `mistralai/devstral-2-123b-instruct-2512:free`

---

## STEP 3: INJECT SOVEREIGN CONSTITUTION

Create this file in your project root:
`.kilocode/system-prompt.md`

(Already created by Sovereign OS setup)

---

## STEP 4: OPEN THE CORRECT PROJECT

File → Open Folder → D:\03_WORK_PROJECTS\system_rebuild

Kilo Code indexes all files automatically.
You'll see the file tree in the sidebar.

---

## STEP 5: YOUR FIRST KILO SESSION

Click the Kilo Code icon in VS Code sidebar.

Type this exactly:
```
Read .forge/state.json, CONTEXT.md and docs/GAME_BIBLE.md.
Follow SOVEREIGN CONSTITUTION rules.
What is the current objective?
```

---

## STEP 6: DISCORD + KILO WORKFLOW

This is the full loop:

1. **PHONE (Discord):** `!start "objective"` -> Bot routes pipeline.
2. **DESKTOP (Kilo):** Paste `!prompt` output. Kilo iterates.
3. **PHONE (Discord):** `!submit ROLE` + paste summary.
4. **PHONE (Discord):** `!gate approved`.
5. **PHONE (Discord):** `!log` -> Bot auto-generates **CONTEXT.md**.
