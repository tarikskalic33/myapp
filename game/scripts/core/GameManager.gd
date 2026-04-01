class_name GameManagerSingleton
extends Node
## Central coordinator that orchestrates transitions and overall game state flow.
## Responsible for Act/Stage transitions, player restarts, and critical game loop logic.

func _ready() -> void:
	# Connect to EventBus for critical progression signals
	EventBus.act_transitioned.connect(_on_act_transitioned)
	EventBus.stage_transitioned.connect(_on_stage_transitioned)

## Handles initialization logic when starting a brand new run.
func start_new_run() -> void:
	GameState.current_act = 1
	GameState.current_stage = "maze_of_thorns"
	GameState.static_meter = 0.0
	GameState.mental_mana = GameState.max_mental_mana
	GameState.emotional_resonance = 0.0
	# Behavioral_integrity partially persists, so we don't reset it to 0 here directly
	# unless it's a hard wipe, but let's reset streak.
	GameState.consistency_streak = 0
	
	EventBus.act_transitioned.emit(GameState.current_act)
	EventBus.stage_transitioned.emit(GameState.current_stage)
	
	# Load the first stage scene
	var path: String = _stage_to_scene_path(GameState.current_stage)
	if path != "":
		load_scene(path)

## Handles player defeat (Zero Integrity or Overwhelming Static).
func on_player_defeated() -> void:
	print("GameManager: Player Defeated. Processing Run Restart.")
	
	# Partial persistence logic for Behavioral Integrity (e.g., retain 50%)
	GameState.behavioral_integrity = clampi(int(float(GameState.behavioral_integrity) / 2.0), 0, GameState.MAX_BEHAVIORAL_INTEGRITY)
	
	# Save partial progress
	SaveSystem.save_game()
	
	# Restart routine...
	start_new_run()

func _on_act_transitioned(new_act: int) -> void:
	print("GameManager: Moving to Act %d" % new_act)
	# Handle visual evolution unlock triggers here based on act

func _on_stage_transitioned(new_stage: String) -> void:
	print("GameManager: Moving to Stage '%s'" % new_stage)
	var path: String = _stage_to_scene_path(new_stage)
	if path != "":
		load_scene(path)

## Maps stage name to scene file path.
func _stage_to_scene_path(stage_name: String) -> String:
	match stage_name:
		"maze_of_thorns":
			return "res://scenes/test/MazeRoot.tscn"
		"inner_sanctum":
			return "res://scenes/levels/InnerSanctum.tscn"
		"test_room":
			return "res://scenes/test/TestRoom.tscn"
		_:
			push_warning("GameManager: No scene mapped for stage '%s'" % stage_name)
			return ""

## Loads a scene by resource path. Defers the call to avoid mid-frame tree changes.
func load_scene(path: String) -> void:
	if not ResourceLoader.exists(path):
		push_error("GameManager: Scene not found at '%s'" % path)
		return
	print("GameManager: Loading scene '%s'" % path)
	get_tree().call_deferred("change_scene_to_file", path)
