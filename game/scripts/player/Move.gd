# Move — Locomotion state
extends "res://scripts/core/State.gd"

var player: Player

func _ready() -> void:
    player = owner as Player
    assert(player != null, "Move state must be attached to a Player.")

func enter(_previous_state: String, _msg: Dictionary) -> void:
    pass

func physics_update(_delta: float) -> void:
    # Block all input during NPC dialogue
    if GameState.in_dialogue:
        player.velocity = Vector2.ZERO
        player.state_machine.transition_to("Idle", {})
        return

    if Input.is_action_just_pressed("attack"):
        player.state_machine.transition_to("Attack", {})
        return
        
    if Input.is_action_just_pressed("parry"):
        player.state_machine.transition_to("Parry", {})
        return

    var direction: Vector2 = player.get_input_direction()
    if direction == Vector2.ZERO:
        player.velocity = Vector2.ZERO
        player.state_machine.transition_to("Idle", {})
        return
    if Input.is_action_just_pressed("dash"):
        player.state_machine.transition_to("Dash", {})
        return
    
    StaticMeter.register_action(StaticMeter.ActionType.MOVE)
    player.velocity = direction * player.current_speed
    player.move_and_slide()
