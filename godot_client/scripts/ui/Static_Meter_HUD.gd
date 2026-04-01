# Static_Meter_HUD — Visualizing the overthinking tension
class_name StaticMeterHUD
extends Control

@onready var progressBar: TextureProgressBar = $ProgressBar
@onready var glyph: Sprite2D = $Glyph # A decorative symbol that jitters

func _ready() -> void:
	_on_static_updated(GameState.static_meter)
	EventBus.state_changed.connect(_on_state_changed)

func _on_state_changed(property_name: String, new_value: Variant) -> void:
	if property_name == "static_meter":
		_on_static_updated(new_value)

func _on_static_updated(val: float) -> void:
	var tween: Tween = create_tween()
	tween.tween_property(progressBar, "value", val * 100.0, 0.2).set_trans(Tween.TRANS_QUART)
	
	# Color shift: Blue (Past/Habit) to Amber (Execution/Tension)
	# Bible: Left (Shadow/Amber) vs Right (Light/Cyan). Actually Law 03 says Left=Amber, Right=Cyan.
	# But Static is "tension". Let's use Amber for high static.
	var color_low = Color("#00ffff") # Cyan (Baseline)
	var color_high = Color("#b8860b") # Amber (Tension)
	
	progressBar.modulate = color_low.lerp(color_high, val)
	
	# Tension jitter
	if val > 0.7:
		_apply_jitter(val)
	else:
		if glyph:
			glyph.position = Vector2.ZERO # Reset

func _apply_jitter(intensity: float) -> void:
	var offset = (intensity - 0.7) * 10.0
	if glyph:
		glyph.position = Vector2(randf_range(-offset, offset), randf_range(-offset, offset))
	# Screen shake could also be triggered here via EventBus if static is critical
