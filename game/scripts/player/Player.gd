# Player — Main character controller (FSM-driven)
class_name Player
extends CharacterBody2D

@export var base_speed: float = 200.0
var current_speed: float = base_speed
var last_direction: Vector2 = Vector2.RIGHT
var state_machine: StateMachine
var sprite: Sprite2D
var animation_player: AnimationPlayer
var hitbox: HitBox
var hurtbox: HurtBox

var ghost_timer: Timer
var consecutive_hits: int = 0
var consistency_speed_multiplier: float = 1.0
var _hit_registered: bool = false

func _ready() -> void:
	state_machine = get_node("StateMachine") as StateMachine
	sprite = get_node("Sprite2D") as Sprite2D
	animation_player = get_node("AnimationPlayer") as AnimationPlayer
	hitbox = get_node("HitBox") as HitBox
	hurtbox = get_node("HurtBox") as HurtBox
	
	if hurtbox:
		hurtbox.damage_taken.connect(_on_hurtbox_damage_taken)
		hurtbox.parried.connect(_on_parry_success)
	
	if hitbox:
		hitbox.area_entered.connect(_on_hitbox_area_entered)
	
	EventBus.state_changed.connect(_on_state_changed)

func start_attack_sequence() -> void:
	_hit_registered = false

func register_hit() -> void:
	if _hit_registered: return # Only count first hit per attack for streak stability
	
	_hit_registered = true
	consecutive_hits += 1
	GameState.consistency_streak = consecutive_hits
	
	# C2 Consistency Loop: 3-streak triggers speed boost
	if consecutive_hits % 3 == 0:
		consistency_speed_multiplier = 1.2
		print("CONSISTENCY LOOP: Speed Boost Active!")
		get_tree().create_timer(2.0).timeout.connect(func(): consistency_speed_multiplier = 1.0)
		
	if consecutive_hits >= 10:
		consecutive_hits = 0
		GameState.behavioral_integrity += 1
		print("BEHAVIORAL INTEGRITY INCREASED: ", GameState.behavioral_integrity)

func notify_miss() -> void:
	if not _hit_registered:
		consecutive_hits = 0
		GameState.consistency_streak = 0
		print("CONSISTENCY LOOP: Miss! Streak Reset.")

func _on_hitbox_area_entered(area: Area2D) -> void:
	if area is HurtBox and area.owner != self:
		register_hit()
		_on_hit_impact()

func _on_state_changed(property_name: String, _new_value: Variant) -> void:
	if property_name == "static_meter":
		_update_speed()

func _update_speed() -> void:
	var clamped_level: float = clamp(GameState.static_meter, 0.0, 1.0)
	# Base speed reduced by static, boosted by consistency loop
	current_speed = base_speed * max(0.1, 1.0 - clamped_level) * consistency_speed_multiplier

## Returns the current normalized input direction based on player input axes.
func get_input_direction() -> Vector2:
	var dir: Vector2 = Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_up", "move_down")
	)
	if dir.length_squared() > 0.0:
		last_direction = dir.normalized()
		return last_direction
	return Vector2.ZERO

func _on_hurtbox_damage_taken(amount: float) -> void:
	GameState.current_health -= amount
	consecutive_hits = 0 # Streak reset
	GameState.consistency_streak = 0
	print("PLAYER DAMAGED: ", amount, " | Streak Reset.")

## Hit impact — freeze frame + stronger screen shake on landing a hit
func _on_hit_impact() -> void:
	# Screen shake — heavier on hit than on swing
	var camera = get_node_or_null("Camera2D")
	if camera:
		var shake = camera.get_node_or_null("CameraShake")
		if shake and shake.has_method("apply_shake"):
			shake.apply_shake(6.0)

	# Hit freeze — brief engine pause for impact feel (50ms)
	Engine.time_scale = 0.05
	await get_tree().create_timer(0.05, true, false, true).timeout
	Engine.time_scale = 1.0

func _on_parry_success(_attacker: Node) -> void:
	# Bible: "Parry restores Mental Mana"
	GameState.mental_mana += 15.0
	print("PLAYER PARRIED: Mana restored.")
