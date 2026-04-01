# StaticShadow2D — Bible: "2D Thinkers: Linear cause-effect only"
# Unlike 1D (pure chase), 2D enemies predict player direction, flank, and retreat when hurt.
# They understand if→then: "player moving right → intercept ahead", "health low → retreat to recover"
class_name StaticShadow2D
extends CharacterBody2D

signal died

@export var base_speed: float = 75.0
@export var max_health: float = 50.0
@export var player_path: NodePath = NodePath("")

## How far ahead to predict player position (seconds)
@export var prediction_time: float = 0.8

## Distance at which the enemy tries to flank instead of chase
@export var flank_range: float = 200.0

## Health threshold to trigger retreat behavior (percentage)
@export var retreat_threshold: float = 0.3

var current_speed: float = base_speed
var current_health: float = max_health
var player: CharacterBody2D
var damage_active: bool = false
var hurtbox: HurtBox

@onready var hitbox: HitBox = get_node("HitBox") as HitBox

## AI State — 2D thinkers have cause-effect reasoning
enum AIState { STALK, FLANK, ENGAGE, RETREAT, DORMANT }
var ai_state: AIState = AIState.DORMANT

## Flank direction (perpendicular to player-enemy axis)
var _flank_sign: float = 1.0
var _retreat_timer: float = 0.0
var _state_timer: float = 0.0
var _last_player_velocity: Vector2 = Vector2.ZERO

func _ready() -> void:
	hurtbox = get_node("HurtBox") as HurtBox
	if hurtbox:
		hurtbox.damage_taken.connect(_on_hurtbox_damage_taken)

	if player_path != NodePath("") and has_node(player_path):
		player = get_node(player_path) as CharacterBody2D
	else:
		player = get_tree().get_first_node_in_group("Player") as CharacterBody2D

	# Randomize flank direction so multiple 2D enemies don't stack
	_flank_sign = [-1.0, 1.0].pick_random()

	EventBus.state_changed.connect(_on_state_changed)
	_on_state_changed("static_meter", GameState.static_meter)

func _on_state_changed(property_name: String, new_value: Variant) -> void:
	if property_name != "static_meter":
		return

	var level: float = clamp(new_value, 0.0, 1.0)
	current_speed = base_speed
	damage_active = false

	if level < 0.3:
		# 2D thinkers need more static to manifest than 1D
		modulate = Color(0.4, 0.2, 1.0, 0.0)  # Purple tint when visible
		ai_state = AIState.DORMANT
	elif level > 0.6:
		current_speed = base_speed * 1.3
		modulate = Color(0.4, 0.2, 1.0, min(1.0, level + 0.2))
		damage_active = true
		if ai_state == AIState.DORMANT:
			ai_state = AIState.STALK
	else:
		modulate = Color(0.4, 0.2, 1.0, level * 0.8)
		if ai_state == AIState.DORMANT:
			ai_state = AIState.STALK

	if hitbox:
		hitbox.get_node("CollisionShape2D").disabled = !damage_active

func _physics_process(delta: float) -> void:
	if not player or ai_state == AIState.DORMANT:
		return
	if modulate.a < 0.15:
		return

	_state_timer += delta
	_last_player_velocity = player.velocity

	var to_player: Vector2 = player.global_position - global_position
	var dist: float = to_player.length()

	# 2D Thinker AI: cause-effect decision tree
	match ai_state:
		AIState.STALK:
			_do_stalk(delta, to_player, dist)
		AIState.FLANK:
			_do_flank(delta, to_player, dist)
		AIState.ENGAGE:
			_do_engage(delta, to_player, dist)
		AIState.RETREAT:
			_do_retreat(delta, to_player, dist)

	# Passive static buildup when near (weaker than 1D — 2D enemies are smarter, not louder)
	if dist < 250.0:
		GameState.static_meter += 0.005 * delta

func _do_stalk(delta: float, to_player: Vector2, dist: float) -> void:
	# Approach cautiously, predicting where player will be
	var predicted_pos: Vector2 = player.global_position + _last_player_velocity * prediction_time
	var to_predicted: Vector2 = predicted_pos - global_position

	if dist < flank_range:
		# Close enough — switch to flanking
		ai_state = AIState.FLANK
		_state_timer = 0.0
		return

	# Move toward predicted position
	velocity = to_predicted.normalized() * current_speed * 0.7  # Slower approach
	move_and_slide()

func _do_flank(delta: float, to_player: Vector2, dist: float) -> void:
	# Move perpendicular to player-enemy axis to get a side angle
	var perp: Vector2 = Vector2(-to_player.y, to_player.x).normalized() * _flank_sign

	# Combine perpendicular with slight approach
	var flank_target: Vector2 = perp * 0.7 + to_player.normalized() * 0.3
	velocity = flank_target.normalized() * current_speed
	move_and_slide()

	# After flanking for 1.5s, engage
	if _state_timer > 1.5:
		ai_state = AIState.ENGAGE
		_state_timer = 0.0

	# If player gets too far, go back to stalk
	if dist > flank_range * 1.5:
		ai_state = AIState.STALK
		_state_timer = 0.0

func _do_engage(delta: float, to_player: Vector2, dist: float) -> void:
	# Direct attack run — predict and intercept
	var predicted_pos: Vector2 = player.global_position + _last_player_velocity * 0.3
	var to_predicted: Vector2 = predicted_pos - global_position

	velocity = to_predicted.normalized() * current_speed * 1.4  # Burst speed
	move_and_slide()

	# If close enough, we're doing contact damage via HitBox
	if dist < 15.0:
		velocity = Vector2.ZERO

	# After 2s engagement, pull back and re-assess
	if _state_timer > 2.0:
		ai_state = AIState.STALK
		_state_timer = 0.0
		_flank_sign *= -1  # Switch flank side next time

func _do_retreat(delta: float, to_player: Vector2, dist: float) -> void:
	# Run away from player
	var away: Vector2 = -to_player.normalized()
	velocity = away * current_speed * 1.2
	move_and_slide()

	_retreat_timer -= delta
	if _retreat_timer <= 0:
		# Health check — if still low, keep retreating
		if current_health / max_health < retreat_threshold:
			_retreat_timer = 1.0
		else:
			ai_state = AIState.STALK
			_state_timer = 0.0

func _on_hurtbox_damage_taken(amount: float) -> void:
	current_health -= amount

	# Flash purple-red
	var tween = create_tween()
	tween.tween_property(self, "modulate", Color(1.0, 0.2, 0.6, modulate.a), 0.1)
	tween.tween_property(self, "modulate", Color(0.4, 0.2, 1.0, modulate.a), 0.15)

	# 2D cause-effect: "I'm hurt → retreat"
	if current_health / max_health < retreat_threshold:
		ai_state = AIState.RETREAT
		_retreat_timer = 2.0
		_state_timer = 0.0

	if current_health <= 0:
		died.emit()
		dissolve()

func dissolve() -> void:
	print("STATIC_SHADOW_2D: Dissolved — cause-effect loop terminated.")
	queue_free()

## Emotional Scan data — reveals 2D thinker classification
func get_scan_data() -> Dictionary:
	return {
		"dimensional_tier": "2D",
		"motivation": "CAUSE-EFFECT PREDATOR — FLANKS BASED ON TRAJECTORY",
		"weakness": "PREDICTABLE FLANK PATTERN — BAIT AND PUNISH",
		"ai_state": AIState.keys()[ai_state]
	}
