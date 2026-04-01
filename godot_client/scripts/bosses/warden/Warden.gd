# Warden — Phase 1: The Observer
class_name Warden
extends Node2D

## The Warden of Routine. Phase 1 is strictly observing player patterns.
## The Warden becomes "agitated" (glowing) as player routine increases.

@export var player_path: NodePath
var player: Player

var agitation: float = 0.0 : set = set_agitation

func _ready() -> void:
	if player_path:
		player = get_node(player_path) as Player
	else:
		var players = get_tree().get_nodes_in_group("Player")
		if players.size() > 0:
			player = players[0]
	
	if player:
		var tracker = _find_routine_tracker(player)
		if tracker:
			tracker.routine_detected.connect(_on_routine_detected)
			print("Warden: Observing player via RoutineTracker.")
	
	StaticMeter.begin_tension()

func _find_routine_tracker(node: Node) -> RoutineTracker:
	for child in node.get_children():
		if child is RoutineTracker:
			return child
		var res = _find_routine_tracker(child)
		if res: return res
	return null

@export var whisper_threshold: float = 0.5
@export var mana_drain_rate: float = 2.0 # Per second at max agitation

var is_phase_2: bool = false
var whisper_timer: float = 0.0

const WHISPERS = [
	"You are repeating yourself.",
	"The pattern is set.",
	"Overthinking is your trap.",
	"Is this agency? Or habit?",
	"Break the cycle."
]

func _process(delta: float) -> void:
	if not player: return
	
	if not is_phase_2 and agitation > 0.4:
		is_phase_2 = true
		print("WARDEN PHASE 2: Whisper Protocol Active.")
		
	if is_phase_2:
		# 1. Mana Drain
		if agitation > 0.6:
			var drain = mana_drain_rate * agitation * delta
			GameState.mental_mana -= drain
			
		# 2. Whisper Logic
		whisper_timer -= delta
		if agitation > whisper_threshold and whisper_timer <= 0:
			_emit_whisper()
			whisper_timer = randf_range(3.0, 7.0) / agitation

func _emit_whisper() -> void:
	var whisper = WHISPERS[randi() % WHISPERS.size()]
	print("WARDEN WHISPER: ", whisper)
	# Trigger UI Distortion spike
	EventBus.emit_signal("state_changed", "agitation_spike", agitation)
	# Send to WhisperLayer UI
	EventBus.emit_signal("state_changed", "whisper_triggered", whisper)

func set_agitation(value: float) -> void:
	agitation = clamp(value, 0.0, 1.0)
	# Visual feedback directly in boss chamber
	# For now, print confirms logic
	if agitation > 0.9 and is_phase_2:
		print("WARDEN: Phase 2 Overdrive!")

func _on_routine_detected(severity: float) -> void:
	agitation += severity * (0.15 if is_phase_2 else 0.1)
	StaticMeter.add_static_burst(0.03 * severity if is_phase_2 else 0.02)
	if severity >= 0.6:
		print("WARDEN: Agitation Critical! Pattern Detected.")

func _exit_tree() -> void:
	StaticMeter.end_tension()
