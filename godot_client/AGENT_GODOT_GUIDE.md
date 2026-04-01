# S.W.A.R.M. OS — Godot Client (Vertical Slice)
**Agent Development Guide**

Welcome to the `godot_client/` workspace. This is the Godot 4.6 client that interfaces with the Sovereignty AGI OS layer. 

## 1. Project Overview
- **Engine:** Godot 4.6
- **Language:** GDScript (`.gd`)
- **Render Engine:** Forward+
- **Architecture Base:** The game separates mechanics into discrete Node components using signals via `EventBus.gd`. Avoid tight-coupling. 

## 2. Directory Structure
- `assets/`: Sprites, tilemaps, shaders, and raw art.
- `scenes/`: All `.tscn` files. `Player.tscn` is the main character. `TestRoom.tscn` is the developer testing cell.
- `scripts/`: Implementation. Contains core logic (`GameState.gd`, `GameManager.gd`, `EventBus.gd`) and AI behaviors (`Warden.gd`).
- `shaders/`: Visual cortex and aesthetic modifiers (Chiaroscuro, static noise).

## 3. Core Principles & Laws (DO NOT BREAK)
1. **Never use `get_node()` or `$` for cross-scene communication.** Always use the `EventBus` singleton for decoupled communication (e.g., `EventBus.emit_signal("player_took_damage")`).
2. **State Machines:** Player and Bosses use strict hierarchical state machines. Do not add random boolean flags (`is_attacking`, `is_dashing`) to the root scripts. Add a new `State` node instead.
3. **Save/Load:** `GameState.gd` acts as the single source of truth for all Homeostasis and Homeostatic Metrics (Health, Mana, ATP, Stress). Do not manage health locally on the player script.

## 4. How to Run / Build
Godot handles project building internally.
- To run from CLI: `godot --path .`
- To run the main scene: `godot --path . scenes/levels/InnerSanctum.tscn`
- To export (headless): `godot --headless --export-release "Windows Desktop" build/game.exe`

## 5. Integrating with S.W.A.R.M. Python Backend
This client connects to the SWARM cognitive engine on `localhost:8000`.
- The Python OS must be running via `..\swarm_os\swarm\start.ps1`.
- Triplet ingestion from the game (e.g., player discovered a secret) is POSTed to the `/ingest` endpoint by triggers in the World logic.

*If you are lost, read this document, check `project.godot` for the main scene, and review `scripts/core/EventBus.gd` to trace the data flow.*
