# SanctumExit — Door to return from Inner Sanctum to the Maze
extends Area2D

var _label: Label

func _ready() -> void:
	# Visual
	var rect = ColorRect.new()
	rect.size = Vector2(50, 70)
	rect.position = Vector2(-25, -70)
	rect.color = Color(0.0, 0.8, 1.0, 0.4)
	add_child(rect)

	_label = Label.new()
	_label.text = "← RETURN TO MAZE"
	_label.position = Vector2(-60, 10)
	_label.add_theme_color_override("font_color", Color(0.0, 0.8, 1.0, 0.6))
	_label.add_theme_font_size_override("font_size", 11)
	add_child(_label)

	# Collision
	var shape = CollisionShape2D.new()
	var r = RectangleShape2D.new()
	r.size = Vector2(50, 70)
	shape.shape = r
	add_child(shape)

	collision_layer = 0
	collision_mask = 1
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		GameState.current_stage = "maze_of_thorns"
		GameManager.load_scene("res://scenes/test/MazeRoot.tscn")
