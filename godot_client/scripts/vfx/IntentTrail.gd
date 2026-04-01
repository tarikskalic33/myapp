# IntentTrail — Projects enemy movement path as ghostly dashed trail
# Bible: A1 Pattern Recognition — 1.5s intent trails on enemies
# Reads owner's velocity and projects forward path
class_name IntentTrail
extends Node2D

## How many ghost markers in the trail
@export var ghost_count: int = 6

## Color of the ghost sprites (semi-transparent, desaturated cyan)
@export var ghost_color: Color = Color(0.5, 0.85, 1.0, 0.0)

var _ghosts: Array[Sprite2D] = []
var _enemy: CharacterBody2D
var _line: Line2D

func _ready() -> void:
	_enemy = owner as CharacterBody2D
	visible = false

	# Create Line2D for the projected path
	_line = Line2D.new()
	_line.width = 3.0
	_line.default_color = Color(0.5, 0.85, 1.0, 0.35)
	_line.begin_cap_mode = Line2D.LINE_CAP_ROUND
	_line.end_cap_mode = Line2D.LINE_CAP_ROUND
	# Gradient: bright near enemy, fades at projection end
	var grad = Gradient.new()
	grad.set_color(0, Color(0.0, 1.0, 1.0, 0.5))
	grad.set_color(1, Color(0.5, 0.85, 1.0, 0.0))
	_line.gradient = grad
	add_child(_line)

	# Create ghost sprites along the trail
	for i in ghost_count:
		var ghost = Sprite2D.new()
		ghost.modulate = Color(0.5, 0.85, 1.0, 0.0)
		ghost.z_index = -1
		# Use the enemy's texture if available
		add_child(ghost)
		_ghosts.append(ghost)

func _process(delta: float) -> void:
	if not _enemy or not GameState.pattern_recognition_active:
		visible = false
		return

	# Only show trail when enemy is at least partially visible
	if _enemy.modulate.a < 0.15:
		visible = false
		return

	visible = true
	var trail_duration: float = GameState.intent_trail_duration

	# Project future positions along current velocity
	var vel: Vector2 = _enemy.velocity
	if vel.length_squared() < 1.0:
		visible = false
		return

	# Build projected path points
	var points: PackedVector2Array = PackedVector2Array()
	points.append(Vector2.ZERO)  # Start at enemy position (local space)

	var speed: float = vel.length()
	var dir: Vector2 = vel.normalized()
	var total_dist: float = speed * trail_duration

	for i in ghost_count:
		var t: float = float(i + 1) / float(ghost_count)
		var projected_offset: Vector2 = dir * total_dist * t
		points.append(projected_offset)

		# Position ghost sprites
		if i < _ghosts.size():
			var ghost = _ghosts[i]
			ghost.global_position = _enemy.global_position + projected_offset
			# Fade: closer ghosts are brighter
			var alpha: float = (1.0 - t) * 0.4 * _enemy.modulate.a
			# Pulse effect
			alpha *= 0.7 + 0.3 * sin(Time.get_ticks_msec() * 0.004 + t * 3.0)
			ghost.modulate = Color(0.5, 0.85, 1.0, alpha)
			ghost.scale = Vector2(1.0 - t * 0.5, 1.0 - t * 0.5)

			# Copy enemy texture on first frame if available
			if ghost.texture == null and _enemy.has_node("Sprite2D"):
				var enemy_sprite: Sprite2D = _enemy.get_node("Sprite2D") as Sprite2D
				if enemy_sprite and enemy_sprite.texture:
					ghost.texture = enemy_sprite.texture

	_line.points = points

	# Pulsing line width
	_line.width = 2.0 + sin(Time.get_ticks_msec() * 0.005) * 1.0
	_line.default_color.a = 0.3 * _enemy.modulate.a
