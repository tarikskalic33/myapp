# SYSTEM_REBUILD — CLAUDE.md

## Project
Psychological cyber-noir metroidvania. Godot 4.6 + GDScript.
Protagonist: Kael (The Transmuted Architect).

## Key Paths
- Game project: `game/` (open in Godot)
- Main test scene: `game/scenes/test/TestRoom.tscn`
- Discord bot: `sovereign-discord.js`
- State file: `.forge/state.json`
- Game Bible: `docs/GAME_BIBLE.md`
- Architecture: `docs/ARCHITECTURE.md`

## Run Commands
- **Godot game**: Open `game/project.godot` in Godot 4.6, run TestRoom.tscn
- **Discord bot**: `"C:/Users/hhk33/AppData/Local/ms-playwright-go/1.50.1/node.exe" --env-file=.env sovereign-discord.js`
- **node is NOT in PATH** — always use the full path above

## Input Map
- WASD: Move | Shift: Dash | J: Attack | K: Parry | Q: System Cascade

## Autoload Singletons (load order matters)
EventBus → GameState → SaveSystem → GameManager → StaticMeter → SystemCascadeManager

## Architecture Pattern
- State lives in GameState (setters clamp + emit via EventBus)
- EventBus.state_changed(property_name, value) is the universal signal
- StaticMeter owns tension mechanics (ActionType enum: MOVE, DASH, ATTACK, PARRY, GAMBLE)
- SystemCascadeManager orchestrates multi-system events (spend_mana, static overload)
- Player uses FSM (StateMachine → Idle/Move/Dash/Attack/Parry states)

## Godot Gotchas
- `type=` on CollisionShape2D in packed scene overrides = name clash warning (omit it)
- `signal` declarations must be at top of GDScript class
- Duplicate class_name/extends = parse error
- NodePath in .tscn is relative to the node, not scene root — use `../Sibling` for siblings
- CanvasModulate multiplies ALL canvas colors — Color(1,1,1,1) = no darkening
- Shader cloak_color gets multiplied by 0.8–1.2 — values below 0.3 are invisible

## What's Working
- Player FSM (Idle/Move/Dash/Attack/Parry)
- RoutineTracker + Warden Phase 1 boss
- HitBox/HurtBox collision + damage
- All HUDs (Integrity, Mana, Static, Consistency)
- StaticShadowBasic enemy (visibility scales with static)
- WhisperLayer (Warden taunts on screen)
- System Cascade ability (Q key, costs 25 mana)
- Sovereign OS Discord bot (!status !start !handshake !submit !gate !recover !logs !help)

## What's Incomplete
- Warden Phase 2 → WhisperLayer whispers print but visual animation needs work
- GameManager lifecycle hooks defined but scene loading commented out
- Attack animation is a scale pulse fallback (no sprite sheet yet)
