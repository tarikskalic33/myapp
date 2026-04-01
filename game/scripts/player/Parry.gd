extends State
class_name Parry

var player: Player
var _timer: float = 0.0
@export var parry_duration: float = 0.2

func _ready() -> void:
	player = owner as Player
	assert(player != null, "Parry state must be attached to a Player.")

func enter(_previous_state: String, _msg: Dictionary) -> void:
	_timer = parry_duration
	player.velocity = Vector2.ZERO
	
	if player.has_node("HurtBox"):
		var hurtbox: HurtBox = player.get_node("HurtBox") as HurtBox
		hurtbox.is_parrying = true
		if not hurtbox.parried.is_connected(_on_parry_success):
			hurtbox.parried.connect(_on_parry_success)
			
	# Visual feedback
	player.sprite.modulate = Color(1.0, 1.0, 0.0, 1.0) # Flash yellow
	StaticMeter.register_action(StaticMeter.ActionType.PARRY)

func exit() -> void:
	if player.has_node("HurtBox"):
		var hurtbox: HurtBox = player.get_node("HurtBox") as HurtBox
		hurtbox.is_parrying = false
		if hurtbox.parried.is_connected(_on_parry_success):
			hurtbox.parried.disconnect(_on_parry_success)
			
	player.sprite.modulate = Color(1.0, 1.0, 1.0, 1.0) # Reset to white/normal

func physics_update(delta: float) -> void:
	_timer -= delta
	if _timer <= 0:
		var input_dir: Vector2 = player.get_input_direction()
		if input_dir == Vector2.ZERO:
			player.state_machine.transition_to("Idle", {})
		else:
			player.state_machine.transition_to("Move", {})

func _on_parry_success(_attacker: Node) -> void:
	print("MICRO-EXPRESSION READ: Parried!")
	GameState.mental_mana += 15.0
	EventBus.player_parried.emit()

	# Screen shake on successful parry
	var camera = player.get_node_or_null("Camera2D")
	if camera:
		var shake = camera.get_node_or_null("CameraShake")
		if shake and shake.has_method("apply_shake"):
			shake.apply_shake(5.0)

	# Brief flash to cyan (the game's accent color) then back to yellow
	player.sprite.modulate = Color(0.0, 1.0, 1.0, 1.0)
	var tween = player.create_tween()
	tween.tween_property(player.sprite, "modulate", Color(1.0, 1.0, 0.0, 1.0), 0.1)
