# State — Base class for all FSM states
class_name State
extends Node

## Called when the state is entered.
func enter(_previous_state: String, _msg: Dictionary) -> void:
    pass

## Called when the state is exited.
func exit() -> void:
    pass

## Called every _process frame while this state is active.
func update(_delta: float) -> void:
    pass

## Called every _physics_process frame while this state is active.
func physics_update(_delta: float) -> void:
    pass

## Called for unhandled input while this state is active.
func handle_input(_event: InputEvent) -> void:
    pass
