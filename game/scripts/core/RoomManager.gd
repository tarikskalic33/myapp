# RoomManager — Loads and manages rooms within the maze
# Works with MazeVariation to populate the current room with enemies, doors, and pickups.
# Rooms are swapped in-place within MazeRoot — no full scene changes for room transitions.
class_name RoomManager
extends Node

## Packed scenes for enemies
var _enemy_1d: PackedScene = preload("res://scenes/enemies/Static_Shadow_Basic.tscn")
var _enemy_2d: PackedScene = preload("res://scenes/enemies/Static_Shadow_2D.tscn")

## Current room data from MazeVariation
var current_room: Dictionary = {}
var current_room_index: int = 0

## Node references (set in _ready via owner/parent)
var _enemy_container: Node2D
var _geometry_container: Node2D
var _player: CharacterBody2D

## The maze variation generator
var maze: MazeVariation

signal room_entered(room_data: Dictionary)
signal room_cleared(room_data: Dictionary)

var _enemies_alive: int = 0

func _ready() -> void:
	maze = MazeVariation.new()
	maze.name = "MazeVariation"
	add_child(maze)

	# Defer setup to ensure scene tree is ready
	await get_tree().process_frame
	_find_containers()

func _find_containers() -> void:
	_enemy_container = get_tree().get_first_node_in_group("EnemyContainer")
	if not _enemy_container:
		# Fallback: find by name in parent
		var root = get_parent()
		if root:
			_enemy_container = root.get_node_or_null("Enemies")

	_geometry_container = get_tree().get_first_node_in_group("GeometryContainer")
	if not _geometry_container:
		var root = get_parent()
		if root:
			_geometry_container = root.get_node_or_null("LevelGeometry")

	_player = get_tree().get_first_node_in_group("Player") as CharacterBody2D

## Generate and enter a fresh maze
func enter_maze() -> void:
	var layout = maze.generate_layout()
	if layout.size() > 0:
		# Start in the entrance room
		for i in layout.size():
			if layout[i]["type"] == "entrance":
				load_room(i)
				return
		# Fallback to first room
		load_room(0)

## Load a specific room by index
func load_room(index: int) -> void:
	if index < 0 or index >= maze.layout.size():
		push_error("RoomManager: Invalid room index %d" % index)
		return

	current_room_index = index
	current_room = maze.layout[index]

	# Clear existing room content
	_clear_room()

	# Spawn enemies based on room data
	_spawn_enemies(current_room)

	# Create doors to connected rooms
	_create_doors(current_room)

	# Set static intensity for this room
	if current_room.has("static_intensity"):
		var intensity: float = current_room["static_intensity"]
		if intensity > 0.5:
			StaticMeter.begin_tension()
		else:
			StaticMeter.end_tension()

	# Position player at room entrance
	if _player:
		_player.global_position = Vector2(300, 600)

	# Sanctum rooms transition to the Inner Sanctum scene
	if current_room["type"] == "sanctum":
		print("RoomManager: Sanctum room — transitioning to Inner Sanctum")
		GameManager.load_scene("res://scenes/levels/InnerSanctum.tscn")
		return

	room_entered.emit(current_room)
	print("RoomManager: Entered room [%s] at grid %s" % [current_room["type"], current_room["grid_pos"]])

func _clear_room() -> void:
	_enemies_alive = 0

	if _enemy_container:
		for child in _enemy_container.get_children():
			child.queue_free()

	# Clear doors
	var existing_doors = get_tree().get_nodes_in_group("Doors")
	for door in existing_doors:
		door.queue_free()

	# Clear Warden if present
	var root = get_parent()
	if root:
		var warden = root.get_node_or_null("Warden")
		if warden:
			warden.queue_free()

func _spawn_enemies(room_data: Dictionary) -> void:
	if not _enemy_container:
		return

	var count: int = room_data.get("enemies", 0)
	var room_type: String = room_data.get("type", "corridor")

	# Boss room — spawn the Warden instead of regular enemies
	if room_type == "boss":
		_spawn_warden()
		return

	# Sanctum rooms have no enemies (safe zone)
	if room_type == "sanctum":
		count = 0

	# Ambush rooms get extra enemies
	if room_type == "ambush":
		count = int(count * 1.5)

	# Use room seed for deterministic placement
	var room_seed: int = room_data.get("seed", 0)
	seed(room_seed)

	for i in count:
		var enemy: CharacterBody2D

		# Mix enemy types based on depth
		var use_2d: bool = randf() < room_data.get("static_intensity", 0.3)
		if use_2d:
			enemy = _enemy_2d.instantiate()
		else:
			enemy = _enemy_1d.instantiate()

		# Position enemies spread across the room
		var x_pos: float = 400.0 + randf() * 600.0
		var y_pos: float = 400.0 + randf() * 200.0
		enemy.position = Vector2(x_pos, y_pos)

		# Connect death signal
		if enemy.has_signal("died"):
			enemy.died.connect(_on_enemy_died)

		_enemy_container.add_child(enemy)
		_enemies_alive += 1

func _create_doors(room_data: Dictionary) -> void:
	var connections: Array = room_data.get("connections", [])
	if connections.is_empty():
		return

	var door_positions: Array[Vector2] = [
		Vector2(50, 500),     # Left door
		Vector2(1230, 500),   # Right door
		Vector2(640, 50),     # Top door
		Vector2(640, 650),    # Bottom door
	]

	var current_grid: Vector2i = room_data["grid_pos"]
	var door_idx: int = 0

	for conn in connections:
		if door_idx >= door_positions.size():
			break

		var conn_grid: Vector2i
		if conn is Vector2i:
			conn_grid = conn
		else:
			conn_grid = Vector2i(conn.x, conn.y)

		var diff: Vector2i = conn_grid - current_grid
		var pos: Vector2

		# Position door based on direction
		if diff.x < 0:
			pos = Vector2(30, 500)     # Left
		elif diff.x > 0:
			pos = Vector2(1250, 500)   # Right
		elif diff.y < 0:
			pos = Vector2(640, 30)     # Up
		else:
			pos = Vector2(640, 660)    # Down

		_create_door_node(pos, conn_grid, diff)
		door_idx += 1

func _create_door_node(pos: Vector2, target_grid: Vector2i, direction: Vector2i) -> void:
	var door = Area2D.new()
	door.name = "Door_%s" % str(target_grid)
	door.position = pos
	door.add_to_group("Doors")

	# Collision shape
	var shape = CollisionShape2D.new()
	var rect = RectangleShape2D.new()
	rect.size = Vector2(40, 60)
	shape.shape = rect
	door.add_child(shape)

	# Visual indicator
	var visual = ColorRect.new()
	visual.size = Vector2(40, 60)
	visual.position = Vector2(-20, -30)

	# Color based on room type of target
	var target_room = _find_room_at(target_grid)
	if target_room:
		match target_room.get("type", "corridor"):
			"boss":
				visual.color = Color(1.0, 0.2, 0.2, 0.7)  # Red
			"sanctum":
				visual.color = Color(0.2, 1.0, 0.5, 0.7)  # Green
			"ambush":
				visual.color = Color(1.0, 0.5, 0.0, 0.7)  # Orange
			"puzzle":
				visual.color = Color(0.5, 0.3, 1.0, 0.7)  # Purple
			_:
				visual.color = Color(0.0, 0.8, 1.0, 0.5)  # Cyan
	else:
		visual.color = Color(0.0, 0.8, 1.0, 0.5)

	door.add_child(visual)

	# Direction arrow label
	var label = Label.new()
	label.position = Vector2(-15, -45)
	var arrow: String = "→"
	if direction.x < 0: arrow = "←"
	elif direction.y < 0: arrow = "↑"
	elif direction.y > 0: arrow = "↓"
	label.text = arrow
	label.add_theme_font_size_override("font_size", 24)
	label.add_theme_color_override("font_color", Color.WHITE)
	door.add_child(label)

	# Set collision layers — use layer 32 for doors, mask player layer
	door.collision_layer = 32
	door.collision_mask = 1  # Player body

	# Store target data
	door.set_meta("target_grid", target_grid)

	# Connect body entered
	door.body_entered.connect(func(body):
		if body is Player:
			_on_door_entered(target_grid)
	)

	# Add to the scene root (not enemy container)
	var root = get_parent()
	if root:
		root.add_child(door)

func _on_door_entered(target_grid: Vector2i) -> void:
	# Find the target room index
	for i in maze.layout.size():
		var room = maze.layout[i]
		if room["grid_pos"] == target_grid:
			load_room(i)
			return
	push_warning("RoomManager: No room found at grid %s" % str(target_grid))

func _on_enemy_died() -> void:
	_enemies_alive -= 1
	if _enemies_alive <= 0:
		room_cleared.emit(current_room)
		print("RoomManager: Room cleared!")

## Spawn the Warden boss in the boss room
func _spawn_warden() -> void:
	var warden_script = load("res://scripts/bosses/warden/Warden.gd")
	if not warden_script:
		push_error("RoomManager: Warden script not found")
		return

	var warden = Node2D.new()
	warden.name = "Warden"
	warden.set_script(warden_script)

	# Warden observes from the center-right of the room
	warden.position = Vector2(800, 400)

	# Set player_path — player is a sibling in MazeRoot
	warden.player_path = NodePath("../../Player")

	var root = get_parent()
	if root:
		root.add_child(warden)

	print("RoomManager: Warden spawned in boss room!")

func _find_room_at(grid: Vector2i) -> Dictionary:
	for room in maze.layout:
		if room["grid_pos"] == grid:
			return room
	return {}
