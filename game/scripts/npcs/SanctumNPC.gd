# SanctumNPC — Base class for Inner Sanctum hub NPCs
# Bible NPCs: DISCIPLINE, MEANING, and The Gambler
class_name SanctumNPC
extends Area2D

@export var npc_name: String = "NPC"
@export var npc_color: Color = Color.WHITE
@export var interaction_prompt: String = "Press E to interact"

## Dialogue lines (simple array for now)
@export var dialogue: Array[String] = []

var _is_player_near: bool = false
var _label: Label
var _prompt_label: Label
var _sprite: ColorRect  # Placeholder until proper art

signal interacted(npc: SanctumNPC)

func _ready() -> void:
	# Visual placeholder
	_sprite = ColorRect.new()
	_sprite.size = Vector2(32, 48)
	_sprite.position = Vector2(-16, -48)
	_sprite.color = npc_color
	add_child(_sprite)

	# Name label
	_label = Label.new()
	_label.text = npc_name
	_label.position = Vector2(-30, -65)
	_label.add_theme_color_override("font_color", npc_color)
	_label.add_theme_font_size_override("font_size", 11)
	add_child(_label)

	# Interaction prompt (hidden until player is near)
	_prompt_label = Label.new()
	_prompt_label.text = interaction_prompt
	_prompt_label.position = Vector2(-40, 10)
	_prompt_label.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 0.6))
	_prompt_label.add_theme_font_size_override("font_size", 10)
	_prompt_label.visible = false
	add_child(_prompt_label)

	# Collision for player detection
	var shape = CollisionShape2D.new()
	var circle = CircleShape2D.new()
	circle.radius = 60.0
	shape.shape = circle
	add_child(shape)

	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)

func _process(_delta: float) -> void:
	if _is_player_near and Input.is_action_just_pressed("emotional_scan"):
		_on_interact()

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		_is_player_near = true
		_prompt_label.visible = true

func _on_body_exited(body: Node2D) -> void:
	if body is Player:
		_is_player_near = false
		_prompt_label.visible = false

func _on_interact() -> void:
	interacted.emit(self)
	EventBus.npc_interacted.emit(npc_name)
