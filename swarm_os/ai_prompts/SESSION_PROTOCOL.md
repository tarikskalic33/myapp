# SESSION PROTOCOL — INITIALIZATION GUIDELINES

## ANTIGRAVITY IDE SETUP

### Agent Load Order
1. Create root agent → paste ORCHESTRATOR prompt
2. Create child agent → paste ARCHITECT prompt
3. Create child agent → paste BUILDER prompt
4. Create child agent → paste NARRATOR prompt
5. Create child agent → paste ART DIRECTOR prompt
6. In Orchestrator settings: set all four as sub-agents it can spawn

### Session Opening
Every session, speak to the ORCHESTRATOR only. It opens with: "What are we building today?"
State a single objective. Examples:
- "Player controller with Autonomy Dash"
- "Warden of Routine Phase 1 behavior tree"

### Task Routing Logic
| Task Type | Routed To |
|---|---|
| New mechanic design | Architect → Builder |
| GDScript implementation | Builder (with Architect brief) |
| Dialogue / lore / logs | Narrator |
| Image prompts / visual | Art Director |
| Bible conflict / drift | Orchestrator resolves |

### Session Closing Ritual
Before ending any session, ask the Orchestrator: "Generate ALIGNMENT_LOG entry."
Paste this into ALIGNMENT_LOG.md in your /docs folder.

### Critical Reminders
- One objective per session. Always.
- Builder never designs.
- Locked Terminology is non-negotiable.
- ALIGNMENT_LOG is written at the end of every session.
