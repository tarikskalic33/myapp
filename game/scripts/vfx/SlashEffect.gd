# SlashEffect — Directional procedural slash arc VFX
class_name SlashEffect
extends Node2D

@onready var arc_sprite: Sprite2D = $ArcSprite

var _tween: Tween
var _active: bool = false

## Duration of the slash sweep
@export var slash_duration: float = 0.25

func _ready() -> void:
	visible = false
	if arc_sprite:
		arc_sprite.modulate.a = 0.0

## Trigger slash VFX in the given direction
func play_slash(direction: Vector2) -> void:
	if _active:
		_stop()

	_active = true
	visible = true

	# Rotate arc to face the attack direction
	rotation = direction.angle()

	# Drive the shader progress uniform from 0 → 1
	var mat = arc_sprite.material as ShaderMaterial
	if mat:
		mat.set_shader_parameter("progress", 0.0)

	arc_sprite.modulate.a = 1.0

	_tween = create_tween()
	_tween.set_parallel(true)

	# Sweep the arc
	if mat:
		_tween.tween_method(
			func(val: float): mat.set_shader_parameter("progress", val),
			0.0, 1.0, slash_duration
		).set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_QUAD)

	# Scale punch — starts slightly small, expands
	scale = Vector2(0.8, 0.8)
	_tween.tween_property(self, "scale", Vector2(1.2, 1.2), slash_duration) \
		.set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_QUAD)

	# Fade out in the last third
	_tween.chain().tween_property(arc_sprite, "modulate:a", 0.0, 0.1)
	_tween.chain().tween_callback(_on_finished)

func _stop() -> void:
	if _tween and _tween.is_valid():
		_tween.kill()
	_active = false
	visible = false

func _on_finished() -> void:
	_active = false
	visible = false
	scale = Vector2.ONE
