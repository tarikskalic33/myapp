# RoutineTracker — Behavioral observer for pattern detection
class_name RoutineTracker
extends Node

## Emitted when a repetitive pattern is detected. Severity [0.0, 1.0].
signal routine_detected(severity: float)

@export var max_history: int = 10
@export var detection_threshold: int = 4

var history: Array[String] = []

func _ready() -> void:
	# Assume this is attached to a Player node or a child of one
	var sm = _find_state_machine(get_parent())
	if sm:
		sm.transitioned.connect(_on_player_transitioned)
		print("RoutineTracker: Wired to StateMachine.")
	else:
		push_warning("RoutineTracker: Could not find StateMachine in parent.")

func _find_state_machine(node: Node) -> StateMachine:
	if not node: return null
	for child in node.get_children():
		if child is StateMachine:
			return child
	return null

func _on_player_transitioned(to_state: String, _from_state: String) -> void:
	history.append(to_state)
	if history.size() > max_history:
		history.pop_front()
	
	_analyze_routine()

func _analyze_routine() -> void:
	if history.size() < detection_threshold:
		return
	
	var score: float = 0.0
	
	# Check for pure repetition (A-A-A-A)
	if _check_period(1):
		score = 1.0
	# Check for alternating (A-B-A-B)
	elif _check_period(2):
		score = 0.8
	# Check for triplets (A-B-C-A-B-C)
	elif _check_period(3):
		score = 0.6
		
	if score > 0.0:
		routine_detected.emit(score)
		# Optional: Add static burst if we are in a tension moment
		if StaticMeter.is_active:
			StaticMeter.add_static_burst(0.01 * score)

func _check_period(p: int) -> bool:
	if history.size() < p * 2: return false
	
	for i in range(p, history.size()):
		if history[i] != history[i - p]:
			return false
	return true
