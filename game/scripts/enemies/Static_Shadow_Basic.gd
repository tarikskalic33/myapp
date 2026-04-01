class_name StaticShadowBasic
extends CharacterBody2D

signal died

@export var base_speed: float = 60.0
@export var player_path: NodePath = NodePath("")

var current_speed: float = base_speed
var player: CharacterBody2D
var damage_active: bool = false

@export var max_health: float = 30.0
var current_health: float = max_health
var hurtbox: HurtBox

@onready var hitbox: HitBox = get_node("HitBox") as HitBox

func _ready() -> void:
	hurtbox = get_node("HurtBox") as HurtBox
	if hurtbox:
		hurtbox.damage_taken.connect(_on_hurtbox_damage_taken)
		
	if player_path != NodePath("") and has_node(player_path):
		player = get_node(player_path) as CharacterBody2D
	else:
		player = get_tree().get_first_node_in_group("Player") as CharacterBody2D
	
	EventBus.state_changed.connect(_on_state_changed)
	_on_state_changed("static_meter", GameState.static_meter)

func _on_state_changed(property_name: String, new_value: Variant) -> void:
	if property_name == "static_meter":
		var clamped_level: float = clamp(new_value, 0.0, 1.0)
		current_speed = base_speed
		damage_active = false
		
		if clamped_level < 0.2:
			modulate = Color(0.0, 1.0, 1.0, 0.0)
		elif clamped_level > 0.8:
			current_speed = base_speed * 1.5
			modulate = Color(0.0, 1.0, 1.0, 1.0)
			damage_active = true
		else:
			modulate = Color(0.0, 1.0, 1.0, clamped_level)
		
		# Toggle hitbox based on visibility/damage state
		if hitbox:
			hitbox.get_node("CollisionShape2D").disabled = !damage_active

func _on_hurtbox_damage_taken(amount: float) -> void:
	current_health -= amount
	# Visual feedback: Flash red or cyan per static
	var tween = create_tween()
	tween.tween_property(self, "modulate", Color.RED, 0.1)
	tween.tween_property(self, "modulate", modulate, 0.1)
	
	if current_health <= 0:
		died.emit()
		dissolve()

func dissolve() -> void:
	# Logic for death/feedback per Bible: Eco-system overdrive or routine break
	# Visual: Dissolve shader would be better, but for now queue_free
	print("STATIC_SHADOW: Dissolved.")
	queue_free()

func _physics_process(delta: float) -> void:
	if player != null:
		var dist_sq: float = global_position.distance_squared_to(player.global_position)
		
		# Only move and buildup static if somewhat visible
		if modulate.a > 0.1:
			var dir: Vector2 = player.global_position - global_position
			if dir.length_squared() > 100.0: # Stop if very close
				dir = dir.normalized()
				velocity = dir * current_speed
				move_and_slide()
			
			# Passive static buildup when near player (within ~200px)
			if dist_sq < 40000.0:
				GameState.static_meter += 0.01 * delta
