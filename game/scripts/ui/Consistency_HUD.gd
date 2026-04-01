# Consistency_HUD — Feedback for streaks and Behavioral Integrity
class_name ConsistencyHUD
extends Control

@onready var streak_label: Label = $StreakLabel
@onready var integrity_label: Label = $IntegrityLabel

func _ready() -> void:
	_update_displays()
	EventBus.state_changed.connect(_on_state_changed)

func _on_state_changed(property_name: String, _new_value: Variant) -> void:
	if property_name == "consistency_streak" or property_name == "behavioral_integrity":
		_update_displays()

func _update_displays() -> void:
	if streak_label:
		streak_label.text = "STREAK: %d" % GameState.consistency_streak
		# Bible: C2 Consistency Loop (3 hits = speed boost)
		if GameState.consistency_streak >= 3:
			streak_label.modulate = Color(0, 1, 1, 1) # Cyan glow
		else:
			streak_label.modulate = Color(1, 1, 1, 1) # White
			
	if integrity_label:
		integrity_label.text = "INTEGRITY: %d" % GameState.behavioral_integrity
