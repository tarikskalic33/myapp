# SOVEREIGN OS — V4.0 MASTER HANDOFF

> Provide this file to any incoming agent to restore full operational context.
> Last updated: 2026-03-21

---

## 1. WHAT THIS IS

Psychological cyber-noir metroidvania in **Godot 4.6 + GDScript**.
Protagonist: **Kael** (The Transmuted Architect). Tagline: *"Architect Your Agency."*
Governed by **Sovereign OS** — a Node.js deterministic state machine with Discord bot interface.

**North Star:** Vertical slice playable and shareable.

---

## 2. BOOT SEQUENCE

```
# Read these files in order before acting:
1. .forge/state.json          → Current phase, role, objective
2. .agent/rules.md            → Constitutional laws (forbidden tools, lane constraints)
3. docs/ARCHITECTURE.md       → System blueprint (autoloads, FSM, signals)
4. docs/GAME_BIBLE.md         → Locked design spec (DO NOT MODIFY)
5. docs/SOVEREIGN_PROTOCOL_V4.md → Execution protocol (cognitive loop, output contract)
```

**Discord bot:** `sovereign-discord.js` (launch via `boot.js` or `.claude/launch.json`)
**Shell commands:** `!status` `!start` `!submit` `!cancel` `!gate` `!recover` `!reflect` `!handshake` `!logs` `!help`

---

## 3. LAWS (VIOLATIONS → ERROR_RECOVERY)

1. **No direct state mutation.** Phase transitions go through the OS shell, never by editing `state.json`.
2. **No scope creep.** Work only on the stated objective. Log adjacent issues, don't fix them.
3. **No silent failure.** If blocked, report friction immediately.
4. **No unverified output.** Test programmatically before reporting done.
5. **Bible is sovereign.** Any output contradicting `docs/GAME_BIBLE.md` is rejected.
6. **Builder cannot design.** Design decisions route to Architect first.

---

## 4. AGENT ROLES

| Role | Lane | Core Constraint |
|------|------|-----------------|
| **ORCHESTRATOR** | Read state, delegate | Never writes code or content. Routes tasks. Reviews against Bible. |
| **ARCHITECT** | Edit `.md` and docs | Pure design. Never writes GDScript. Defines node trees, signals, data flow. |
| **BUILDER** | Code + terminal | Implements specs. Never makes design decisions. No TODOs or stubs. |
| **NARRATOR** | Dialogue + lore | Voice of the world. Never designs mechanics. Bible is only lore source. |
| **ART DIRECTOR** | Visual prompts | 6 Design Laws are immutable. Midjourney/Leonardo output format. |

### Task Routing

| Task Type | Route |
|-----------|-------|
| New mechanic design | Architect → Builder |
| GDScript implementation | Builder (with Architect brief) |
| Dialogue / lore / logs | Narrator |
| Image prompts / visual | Art Director |
| Bible conflict / drift | Orchestrator resolves |

---

## 5. TECH STACK

| Component | Detail |
|-----------|--------|
| Engine | Godot 4.6, GDScript |
| Autoloads | EventBus → GameState → SaveSystem → GameManager → StaticMeter → SystemCascadeManager |
| Primary signal | `EventBus.state_changed(property_name: String, value: Variant)` |
| Player FSM | StateMachine.gd → Idle / Move / Dash / Attack / Parry |
| Node runtime | `C:/Users/hhk33/AppData/Local/ms-playwright-go/1.50.1/node.exe` |
| State file | `.forge/state.json` |
| Input map | WASD=move, Shift=dash, J=attack, K=parry, Q=system_cascade |

### Key GameState Variables

```gdscript
GameState.current_health: float      # Integrity (HP)
GameState.max_health: float           # Integrity ceiling
GameState.static_meter: float         # 0.0–1.0, fills on overthinking
GameState.mental_mana: float          # Ability resource
GameState.behavioral_integrity: int   # Reduces static fill rate (5% per stack, max 10)
GameState.consistency_streak: int     # Combat combo counter
```

---

## 6. WHAT'S WORKING

- Player FSM: Idle/Move/Dash/Attack/Parry — all functional
- Player visible: golden amber cloak shader, CanvasModulate full white
- RoutineTracker + Warden Phase 1 — detects patterns, feeds agitation
- Warden Phase 2 → WhisperLayer — whispers display with whisper_flicker animation
- HitBox/HurtBox — collision damage + parry system
- All HUDs: Integrity, Mana, Static, Consistency
- Environment_Flicker — scales with static meter
- StaticShadowBasic enemy — visibility/speed scale with static
- SystemCascadeManager — spend_mana(), add_integrity_stack(), static overload
- System_Cascade_Ability — costs 25 Mental Mana, flushes static
- StaticMeter action types: MOVE, DASH, ATTACK, PARRY, GAMBLE
- Sovereign OS kernel — !cancel, !handshake, !help all working
- Distortion shader — static-driven screen effects

## 7. WHAT'S BROKEN / INCOMPLETE

- ~~**Attack animation**~~ — FIXED: scale+modulate + slash arc VFX + camera shake + hit freeze
- ~~**GameManager**~~ — FIXED: `load_scene()` implemented with deferred scene change + stage mapping
- **Player sprite** — Upgraded from white rectangle to humanoid hooded silhouette (64x64). Still placeholder — needs proper art.

## 8. RECENTLY IMPLEMENTED (Bible Mechanics)

- ~~Emotional Scan~~ — DONE: Hold 'E' to scan nearest enemy. Progressive reveal (tier at 30%, motivation at 60%, weakness at 100%). Drains 15 mana/sec. Range 250px.
- ~~Pattern Recognition A1~~ — DONE: Intent trails project enemy's future path as dashed Line2D + ghost sprites. 1.5s default (3.5s with Pocket Watch). Reads GameState.pattern_recognition_active.
- **Attack VFX** — Slash arc shader (procedural crescent), directional based on last_direction, camera shake on swing (3.0) and hit (6.0), 50ms hit freeze on impact.
- **Parry VFX** — Camera shake on successful parry (5.0), cyan→yellow flash tween.
- **CameraShake** — Wired into TestRoom Camera2D (was script-only, now instanced).

## 9. RECENTLY IMPLEMENTED (Bible Mechanics — Batch 2)

- ~~Dimensional tier AI~~ — DONE: StaticShadow2D enemy (2D thinker). Flanks, predicts player trajectory, retreats when hurt. Purple tint, higher static threshold (0.3 vs 0.2). Placed in TestRoom at (600,250).
- ~~Gamble mechanic UI~~ — DONE: GambleUI.gd. Small (10pts/25%/×2), Medium (25pts/40%/×3), All-In (50-50/×2). Pauses game, uses Mental Mana. 3 All-In losses → corruption data unlock. Triggers StaticMeter.GAMBLE (instant max).
- ~~Maze layout variation~~ — DONE: MazeVariation.gd. Seed-based procedural room generation (5×4 grid). Seed derived from entry_count + behavioral_integrity + act + emotional_resonance. Room types: entrance, corridor, puzzle, ambush, sanctum, challenge, boss. Serializable.

## 10. RECENTLY IMPLEMENTED (Infrastructure)

- **RoomManager** — loads rooms within MazeRoot, spawns enemies from MazeVariation data, creates doors between rooms, handles room transitions. Enemy mix scales with depth (more 2D thinkers deeper in).
- **Inner Sanctum scene** — Hub/safe zone with 3 NPCs: DISCIPLINE (blue), MEANING (pink), Gambler (amber). Gambler opens GambleUI on interaction. SanctumExit door returns to maze.
- **SanctumNPC** — Base NPC class with proximity detection, interaction prompt, EventBus integration.
- **GamblerNPC** — Extends SanctumNPC, opens GambleUI. Bible: "No judgment. No warning popup."
- **GameManager stage mapping** — maze_of_thorns → MazeRoot.tscn, inner_sanctum → InnerSanctum.tscn, test_room → TestRoom.tscn
- **MazeRoot.tscn** — Now has RoomManager child + Enemies group tag

## 11. RECENTLY IMPLEMENTED (Dialogue + Boss)

- **DialogueUI** — CanvasLayer dialogue box with typewriter effect, [E] to advance/skip, blocks player input via GameState.in_dialogue
- **DisciplineNPC** — 3 dialogue tiers based on behavioral_integrity, restores Emotional Resonance, consistency streak bonus
- **MeaningNPC** — 3 dialogue tiers based on emotional_resonance, reduces static meter, resonance attunement
- **Boss room Warden** — RoomManager spawns Warden dynamically in boss rooms, cleans up on room exit

## 12. REMAINING WORK

- 3D Thinker AI (Shadow Self boss — design only, no implementation)
- Proper sprite art for Kael and enemies
- Save/load for MazeVariation state and room progress
- TileMap-based room visuals (currently using generated collision/ColorRect geometry)
- Sound design / audio

---

## 9. FSM TOPOLOGY

```
IDLE ──START──→ PLANNING ──PLANNER_SUCCESS──→ WAITING_FOR_SUBMISSION
                   │                                    │
                   │ CANCEL                      SUBMIT │ CANCEL
                   ▼                                    ▼
                 IDLE                          GOVERNANCE_CHECK
                                                  │         │
                                           POLICY_PASS  POLICY_FAIL
                                                  │         │
                                                  ▼         ▼
                                           AWAITING_GATE  ERROR_RECOVERY
                                              │    │        │    │    │
                                        APPROVE  REJECT   ACK  RESET ABORT
                                              │    │        │    │    │
                                              ▼    ▼        ▼    ▼    ▼
                                     WAITING  ERROR   ERROR WAITING IDLE
```

---

## 10. SCENE STRUCTURE

```
TestRoom.tscn (main playable scene)
├── CanvasModulate (Color(1,1,1,1) — full white for dev)
├── Background (TextureRect + chiaroscuro shader)
├── Lights/
│   ├── LeftLight (PointLight2D, amber, pos 200,360)
│   └── RightLight (PointLight2D, cyan, pos 1080,360)
├── Floor (StaticBody2D @ y=600, ColorRect visible)
├── Player (CharacterBody2D @ 200,360)
│   ├── Sprite2D (kael_placeholder + river_cloak shader)
│   ├── CollisionShape2D
│   ├── StateMachine/ (Idle, Move, Dash, Attack, Parry)
│   ├── HitBox (PackedScene)
│   ├── HurtBox (PackedScene)
│   ├── AnimationPlayer
│   ├── SystemFlushAbility
│   ├── RoutineTracker
│   ├── Camera2D/
│   │   └── CameraShake (Node2D)
│   └── SlashEffect (PackedScene — directional arc VFX)
├── Enemies/
│   └── StaticShadowBasic (@ 800,360)
│       └── IntentTrail (Node2D — A1 intent projection)
├── UILayer/
│   └── MainHUD
├── OverlayStack (CanvasLayer 10)/
│   ├── StaticOverlay
│   └── EnvironmentalDistortion
├── WhisperLayer (CanvasLayer 11)
├── EmotionalScan (Node — hold E to scan enemies)
└── Warden (Node2D, player_path="../Player")
```

---

## 11. FILE MAP

```
system_rebuild/
├── CLAUDE.md                    # Quick-start reference
├── CONTEXT.md                   # Auto-maintained state snapshot
├── HANDOFF.md                   # THIS FILE
├── POST-MORTEM.md               # Error recovery procedures
├── sovereign-discord.js         # Discord bot (shell interface)
├── sovereign-os.js              # FSM kernel (transitions, state)
├── sentinel.js                  # Stall/drift observer
├── boot.js                      # Master boot (spawns discord + sentinel)
├── .forge/state.json            # Live kernel state
├── .agent/rules.md              # Constitutional laws
├── .env                         # DISCORD_TOKEN, OPERATOR_DISCORD_ID
├── ai_prompts/
│   ├── ORCHESTRATOR.md          # Constitutional guardian
│   ├── ARCHITECT.md             # Pure design mind
│   ├── BUILDER.md               # GDScript implementation
│   ├── NARRATOR.md              # Voice of the world
│   ├── ART_DIRECTOR.md          # Visual direction + 6 Laws
│   └── SESSION_PROTOCOL.md      # Agent load order + routing
├── docs/
│   ├── GAME_BIBLE.md            # LOCKED design spec
│   ├── ARCHITECTURE.md          # System blueprint
│   ├── SOVEREIGN_PROTOCOL_V4.md # Execution protocol
│   ├── STAGE_1_ART_MANIFEST.md  # Visual tokens + prompts
│   ├── ALIGNMENT_LOG.md         # Session audit trail
│   ├── KILO_CODE_GUIDE.md       # Kilo Code toolchain
│   └── archive/                 # V3.1.1a-era docs
├── game/
│   ├── project.godot
│   ├── scenes/ (test/, player/, enemies/, core/, ui/, vfx/)
│   ├── scripts/ (core/, player/, bosses/, enemies/, ui/, vfx/, abilities/)
│   ├── shaders/ (kael_river_cloak, chiaroscuro, slash_arc, intent_trail)
│   └── assets/
└── free-claude-code/
    └── README.md                # External proxy tool
```

---

## 12. SESSION RULES

- One objective per session
- Do not widen scope mid-mission
- Do not redesign the OS mid-mission
- Treat friction as real output
- Read the project before working — do not fix reactively
- Every session ends with an ALIGNMENT_LOG entry

---

## 13. THE 6 DESIGN LAWS (Art Direction — Immutable)

1. **No Face Until Earned** — Kael has no visible face until The Ouroboros Core
2. **Landscape Over Portrait** — Psychological state expressed through environment
3. **Left/Right Non-Negotiable** — Left=shadow/past/amber, Right=light/future/cyan
4. **Symbols Earn Their Render** — Only if it has mechanical/narrative function in Bible
5. **The River Is Always Turbulent** — Kael's cloak: dark fluid, distorted star reflections
6. **White Light Is Earned** — Only source: tower top / Ouroboros Core

---

*"The system that governs itself honestly is the system that earns the right to grow."*
