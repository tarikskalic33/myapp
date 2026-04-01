# Idle — Default resting state
extends "res://scripts/core/State.gd"

var player: Player

func _ready() -> void:
    player = owner as Player

func enter(_previous_state: String, _msg: Dictionary) -> void:
    if player:
        player.velocity = Vector2.ZERO

func physics_update(_delta: float) -> void:
    if player == null:
        return

    # Block all input during NPC dialogue
    if GameState.in_dialogue:
        return

    if Input.is_action_just_pressed("attack"):
        player.state_machine.transition_to("Attack", {})
        return
        
    if Input.is_action_just_pressed("parry"):
        player.state_machine.transition_to("Parry", {})
        return
        
    if Input.is_action_just_pressed("dash"):
        player.state_machine.transition_to("Dash", {})
        return
        
    var direction: Vector2 = player.get_input_direction()
    if direction != Vector2.ZERO:
        player.state_machine.transition_to("Move", {})
        return
