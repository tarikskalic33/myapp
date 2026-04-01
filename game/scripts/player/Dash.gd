# Dash — Burst movement state with ghost trail
extends "res://scripts/core/State.gd"

@export var dash_speed: float = 600.0
@export var dash_duration: float = 0.2
@export var ghost_interval: float = 0.05

var player: Player
var _elapsed: float = 0.0
var _ghost_elapsed: float = 0.0
var _direction: Vector2 = Vector2.ZERO

func _ready() -> void:
    player = owner as Player
    assert(player != null, "Dash state must be attached to a Player.")

func enter(_previous_state: String, _msg: Dictionary) -> void:
    _elapsed = 0.0
    _ghost_elapsed = 0.0
    _direction = player.get_input_direction()
    if _direction == Vector2.ZERO:
        _direction = player.last_direction
    _direction = _direction.normalized()
    StaticMeter.register_action(StaticMeter.ActionType.DASH)

func physics_update(delta: float) -> void:
    _elapsed += delta
    _ghost_elapsed += delta
    player.velocity = _direction * dash_speed
    player.move_and_slide()
    if _ghost_elapsed >= ghost_interval:
        _ghost_elapsed = 0.0
        _spawn_ghost()
    if _elapsed >= dash_duration:
        var input_dir: Vector2 = player.get_input_direction()
        if input_dir == Vector2.ZERO:
            player.state_machine.transition_to("Idle", {})
        else:
            player.state_machine.transition_to("Move", {})

func _spawn_ghost() -> void:
    var ghost: Sprite2D = Sprite2D.new()
    ghost.texture = player.sprite.texture
    ghost.hframes = player.sprite.hframes
    ghost.vframes = player.sprite.vframes
    ghost.frame = player.sprite.frame
    ghost.flip_h = player.sprite.flip_h
    ghost.flip_v = player.sprite.flip_v
    ghost.scale = player.sprite.scale
    ghost.z_index = player.sprite.z_index - 1
    ghost.global_position = player.global_position
    ghost.modulate = Color(1.0, 1.0, 1.0, 0.5)
    player.get_parent().add_child(ghost)
    var tween: Tween = ghost.create_tween()
    tween.tween_property(ghost, "modulate:a", 0.0, 0.3).set_trans(Tween.TRANS_LINEAR)
    tween.tween_callback(Callable(ghost, "queue_free"))
