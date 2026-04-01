class_name EventBusSingleton
extends Node
## Global signal bus for decoupled communication across the SYSTEM_REBUILD architecture.
## Emits events for core mechanics, UI updates, and narrative progression.

# --- Player & Mechanics Signals ---
## Emitted when the player takes damage.
signal player_damaged(amount: float)

## Emitted when the player parries successfully (restores Mental Mana).
signal player_parried

## Emitted when an enemy is defeated.
signal enemy_defeated(enemy_id: String)

## Emitted when a boss is defeated.
signal boss_defeated(boss_id: String)

# --- UI & Feedback Signals ---
## Emitted to trigger a screen shake effect.
signal shake_camera(intensity: float, duration: float)

## Emitted to flash the screen (e.g., on taking damage or completing a Synthesis combo).
signal flash_screen(color: Color, duration: float)

# --- Narrative & Progression Signals ---
## Emitted when Kael enters a new phase of visual evolution.
signal evolution_phase_changed(new_phase: int)

## Emitted when Kael interacts with an NPC (e.g., Discipline, Meaning).
signal npc_interacted(npc_id: String)

## Emitted when the act transitions.
signal act_transitioned(new_act: int)

## Emitted when transitioning between stages.
signal stage_transitioned(new_stage: String)

# --- State System Signals ---
## Generic signal for GameState changes.
signal state_changed(property_name: String, new_value: Variant)

# --- Ability Signals ---
## Emitted when Emotional Scan completes on a target.
signal emotional_scan_completed(target: Node2D, data: Dictionary)

# --- Synthesis System Signals ---
## Emitted when a Synthesis combo is triggered.
signal synthesis_combo_triggered(combo_id: String)
