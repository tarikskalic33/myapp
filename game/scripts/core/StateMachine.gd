# StateMachine — Generic FSM controller
class_name StateMachine
extends Node



signal transitioned(to_state_name, from_state_name)

@export var initial_state: NodePath

var current_state: Node
var states: Dictionary = {}

func _ready() -> void:
	for child in get_children():
		if child.has_method("enter"):
			states[child.name] = child
	if initial_state:
		current_state = get_node(initial_state)
	else:
		if get_child_count() > 0 and get_child(0).has_method("enter"):
			current_state = get_child(0)
	if current_state:
		current_state.enter("", {})

func _process(delta: float) -> void:
	if current_state and current_state.has_method("update"):
		current_state.update(delta)

func _physics_process(delta: float) -> void:
	if current_state and current_state.has_method("physics_update"):
		current_state.physics_update(delta)

func _unhandled_input(event: InputEvent) -> void:
	if current_state and current_state.has_method("handle_input"):
		current_state.handle_input(event)

## Transitions to another state by name, optionally passing a message dictionary.
func transition_to(target_state_name: String, msg: Dictionary = {}) -> void:
	if not states.has(target_state_name):
		push_warning("StateMachine: State '%s' not found." % target_state_name)
		return
	var previous_name: String = current_state.name if current_state else ""
	if current_state and current_state.has_method("exit"):
		current_state.exit()
	current_state = states[target_state_name]
	current_state.enter(previous_name, msg)
	transitioned.emit(target_state_name, previous_name)
