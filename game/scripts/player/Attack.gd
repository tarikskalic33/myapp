extends State
class_name Attack

var player: Player

func _ready() -> void:
	player = owner as Player
	assert(player != null, "Attack state must be attached to a Player.")

func enter(_previous_state: String, _msg: Dictionary) -> void:
	player.velocity = Vector2.ZERO
	player.start_attack_sequence()

	# Bible: Combat increases static intensity (was unreachable before — fixed)
	StaticMeter.register_action(StaticMeter.ActionType.ATTACK)

	# Orient the hitbox based on last direction
	if player.has_node("HitBox"):
		var hitbox: Area2D = player.get_node("HitBox")
		hitbox.position = player.last_direction * 20.0
		var shape: CollisionShape2D = hitbox.get_node("CollisionShape2D")
		if shape:
			shape.disabled = false

	# Trigger slash VFX
	_play_slash_vfx()

	# Trigger screen shake on attack start (light shake)
	_apply_camera_shake(3.0)

	if player.has_node("AnimationPlayer"):
		var anim: AnimationPlayer = player.get_node("AnimationPlayer")
		if anim.has_animation("attack"):
			if not anim.animation_finished.is_connected(_on_animation_finished):
				anim.animation_finished.connect(_on_animation_finished)
			anim.play("attack")
			return

	# Fallback timer only if no AnimationPlayer or no attack animation
	var t = get_tree().create_timer(0.35)
	t.timeout.connect(_on_attack_finished)

func exit() -> void:
	# Disable hitbox when leaving state
	if player.has_node("HitBox"):
		var hitbox: Area2D = player.get_node("HitBox")
		var shape: CollisionShape2D = hitbox.get_node("CollisionShape2D")
		if shape:
			shape.disabled = true

func _on_animation_finished(anim_name: StringName) -> void:
	if anim_name == "attack":
		_on_attack_finished()

func _on_attack_finished() -> void:
	# Only transition if we are still attacking
	if player.state_machine.current_state == self:
		player.notify_miss()
		var input_dir: Vector2 = player.get_input_direction()
		if input_dir == Vector2.ZERO:
			player.state_machine.transition_to("Idle", {})
		else:
			player.state_machine.transition_to("Move", {})

func physics_update(_delta: float) -> void:
	player.move_and_slide()

## --- VFX Helpers ---

func _play_slash_vfx() -> void:
	if player.has_node("SlashEffect"):
		var slash = player.get_node("SlashEffect")
		if slash.has_method("play_slash"):
			slash.play_slash(player.last_direction)

func _apply_camera_shake(intensity: float) -> void:
	var camera = player.get_node_or_null("Camera2D")
	if camera:
		var shake = camera.get_node_or_null("CameraShake")
		if shake and shake.has_method("apply_shake"):
			shake.apply_shake(intensity)
