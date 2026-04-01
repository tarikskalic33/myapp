# SystemCascadeManager — Central Nervous System Orchestrator
extends Node
## Coordinates complex system-spanning events.
## State lives in GameState; signals route through EventBus.
## SCM provides high-level methods that touch multiple systems at once.

func _ready() -> void:
	EventBus.state_changed.connect(_on_state_changed)
	print("SYSTEM_REBUILD: Architect Orchestrator Initialized.")

## Attempt to spend Mental Mana. Returns true if sufficient, false otherwise.
func spend_mana(amount: float) -> bool:
	if GameState.mental_mana >= amount:
		GameState.mental_mana -= amount
		return true
	return false

## Add one Behavioral Integrity stack. Caps at 10 per Bible.
func add_integrity_stack() -> void:
	if GameState.behavioral_integrity < 10:
		GameState.behavioral_integrity += 1

## Handle static overload — when static hits 1.0, punish the player.
func _on_state_changed(property_name: String, new_value: Variant) -> void:
	if property_name == "static_meter":
		var level: float = new_value
		if level >= 1.0:
			_on_static_overload()

## Static overload: drain mana, damage player, flash screen.
func _on_static_overload() -> void:
	GameState.mental_mana = max(0.0, GameState.mental_mana - 20.0)
	GameState.current_health -= 10.0
	EventBus.flash_screen.emit(Color.RED, 0.3)
	EventBus.shake_camera.emit(0.5, 0.3)
	print("STATIC OVERLOAD: Mana drained, integrity damaged.")
