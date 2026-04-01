# WhisperLayer — Cinematic psychological taunts with glitch visuals
class_name WhisperLayer
extends CanvasLayer

@onready var label: Label = $WhisperLabel
@onready var anim: AnimationPlayer = $AnimationPlayer

## Current agitation level from Warden (drives visual intensity)
var current_agitation: float = 0.0

## Typewriter state
var _full_text: String = ""
var _char_index: int = 0
var _typewriter_timer: float = 0.0
var _typewriter_active: bool = false

## Typewriter speed — seconds per character (faster at high agitation)
const BASE_CHAR_DELAY: float = 0.04
const MIN_CHAR_DELAY: float = 0.015

## Drift
var _drift_tween: Tween
var _base_offset_top: float = 0.0

## Scale punch
var _scale_tween: Tween

func _ready() -> void:
	if label:
		label.text = ""
		_base_offset_top = label.offset_top
	EventBus.state_changed.connect(_on_state_changed)

func _on_state_changed(property_name: String, value: Variant) -> void:
	if property_name == "whisper_triggered":
		display_whisper(value)
	elif property_name == "agitation_spike":
		current_agitation = clamp(float(value), 0.0, 1.0)
		_update_shader_intensity()

func _update_shader_intensity() -> void:
	if not label: return
	var mat = label.material as ShaderMaterial
	if mat:
		mat.set_shader_parameter("intensity", current_agitation)

func display_whisper(text: String) -> void:
	if not label: return

	# Kill any running effects
	_stop_effects()

	# Store full text, start typewriter
	_full_text = text
	_char_index = 0
	label.text = ""
	label.modulate.a = 1.0
	_typewriter_active = true
	_typewriter_timer = 0.0

	# Update shader intensity
	_update_shader_intensity()

	# Scale punch — pop in slightly large then settle
	label.scale = Vector2(1.08, 1.08)
	label.pivot_offset = label.size / 2.0
	_scale_tween = create_tween()
	_scale_tween.tween_property(label, "scale", Vector2.ONE, 0.3) \
		.set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_ELASTIC)

	# Vertical drift — float upward slightly during display
	var drift_distance = 6.0 + current_agitation * 10.0
	label.offset_top = _base_offset_top
	_drift_tween = create_tween()
	_drift_tween.tween_property(label, "offset_top",
		_base_offset_top - drift_distance, 2.0) \
		.set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_SINE)

func _process(delta: float) -> void:
	if not _typewriter_active: return

	# Character reveal
	var char_delay = lerpf(BASE_CHAR_DELAY, MIN_CHAR_DELAY, current_agitation)
	_typewriter_timer += delta

	while _typewriter_timer >= char_delay and _char_index < _full_text.length():
		_char_index += 1
		label.text = _full_text.substr(0, _char_index)
		_typewriter_timer -= char_delay

	# Once fully revealed, start hold + fade
	if _char_index >= _full_text.length() and _typewriter_active:
		_typewriter_active = false
		_start_hold_and_fade()

func _start_hold_and_fade() -> void:
	# Hold for 1.5s then fade out over 0.5s
	var tween = create_tween()
	tween.tween_interval(1.5)
	tween.tween_property(label, "modulate:a", 0.0, 0.5) \
		.set_ease(Tween.EASE_IN).set_trans(Tween.TRANS_SINE)
	tween.tween_callback(_on_whisper_finished)

func _on_whisper_finished() -> void:
	label.text = ""
	label.offset_top = _base_offset_top
	label.scale = Vector2.ONE

func _stop_effects() -> void:
	_typewriter_active = false
	if _drift_tween and _drift_tween.is_valid():
		_drift_tween.kill()
	if _scale_tween and _scale_tween.is_valid():
		_scale_tween.kill()
