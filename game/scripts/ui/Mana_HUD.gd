# Mana_HUD — Reactive feedback for Mental Mana
class_name ManaHUD
extends Control

@onready var fg_bar: TextureProgressBar = $ForegroundBar

func _ready() -> void:
	# Initial setup
	_on_mana_updated(GameState.mental_mana)
	# Connect to EventBus signals
	EventBus.state_changed.connect(_on_state_changed)

func _on_state_changed(property_name: String, new_value: Variant) -> void:
	if property_name == "mental_mana":
		_on_mana_updated(new_value)
	elif property_name == "max_mental_mana":
		_on_max_mana_updated(new_value)

func _on_mana_updated(val: float) -> void:
	var tween: Tween = create_tween()
	# Bible: Cyan color palette for cognitive abilities
	tween.tween_property(fg_bar, "value", val, 0.3).set_trans(Tween.TRANS_SINE)
	
	# Glow effect if mana is full/high?
	if val >= GameState.max_mental_mana * 0.9:
		fg_bar.modulate = Color(0.0, 1.5, 1.5, 1.0) # Overbright Cyan
	else:
		fg_bar.modulate = Color(0.0, 1.0, 1.0, 1.0) # Standard Cyan

func _on_max_mana_updated(new_max: float) -> void:
	fg_bar.max_value = new_max
	_on_mana_updated(GameState.mental_mana)
