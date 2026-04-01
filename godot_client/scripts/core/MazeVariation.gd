# MazeVariation — Bible: Maze layout varies on re-entry
# Generates deterministic-but-different room layouts based on a seed
# that changes each time Kael enters the maze. The seed is derived from
# run count + behavioral integrity + act progress, ensuring the maze
# responds to the player's psychological state.
class_name MazeVariation
extends Node

## Grid dimensions for the maze
@export var grid_cols: int = 5
@export var grid_rows: int = 4

## Cell size in pixels
@export var cell_size: Vector2 = Vector2(256, 180)

## Minimum/maximum rooms per layout
@export var min_rooms: int = 8
@export var max_rooms: int = 15

## Current layout seed
var current_seed: int = 0

## Generated layout data
var layout: Array[Dictionary] = []

## Entry count (persists through save)
var entry_count: int = 0

signal layout_generated(rooms: Array[Dictionary])

## Generate a new maze layout. Call this when entering the maze.
func generate_layout() -> Array[Dictionary]:
	entry_count += 1

	# Seed from player state — maze responds to who you are
	current_seed = _compute_seed()
	seed(current_seed)

	layout.clear()

	# Start with entry room at bottom-center
	var start_col: int = grid_cols / 2
	var start_row: int = grid_rows - 1
	var visited: Dictionary = {}

	# Generate rooms via random walk from start
	var room_count: int = min_rooms + randi() % (max_rooms - min_rooms + 1)
	var frontier: Array[Vector2i] = [Vector2i(start_col, start_row)]
	visited[Vector2i(start_col, start_row)] = true

	while layout.size() < room_count and frontier.size() > 0:
		# Pick a random frontier cell
		var idx: int = randi() % frontier.size()
		var cell: Vector2i = frontier[idx]

		# Create room data
		var room: Dictionary = {
			"grid_pos": cell,
			"world_pos": Vector2(cell.x * cell_size.x, cell.y * cell_size.y),
			"type": _pick_room_type(cell, start_col, start_row),
			"connections": [],
			"enemies": _pick_enemy_count(cell),
			"has_memory_fragment": randf() < 0.2,
			"static_intensity": _compute_static_intensity(cell, start_col, start_row),
			"seed": current_seed + layout.size()
		}

		layout.append(room)

		# Add unvisited neighbors to frontier
		var neighbors = _get_neighbors(cell)
		for n in neighbors:
			if not visited.has(n) and _in_bounds(n):
				frontier.append(n)
				visited[n] = true

		# Connect to adjacent rooms already in layout
		for existing_room in layout:
			if existing_room == room:
				continue
			var diff: Vector2i = existing_room["grid_pos"] - cell
			if abs(diff.x) + abs(diff.y) == 1:  # Manhattan distance 1
				room["connections"].append(existing_room["grid_pos"])
				existing_room["connections"].append(cell)

		frontier.erase(cell)

	# Ensure boss room exists at top
	var boss_cell = Vector2i(grid_cols / 2, 0)
	if not visited.has(boss_cell):
		var boss_room: Dictionary = {
			"grid_pos": boss_cell,
			"world_pos": Vector2(boss_cell.x * cell_size.x, boss_cell.y * cell_size.y),
			"type": "boss",
			"connections": [],
			"enemies": 0,
			"has_memory_fragment": false,
			"static_intensity": 1.0,
			"seed": current_seed + 999
		}
		# Connect to nearest existing room
		var nearest = _find_nearest_room(boss_cell)
		if nearest:
			boss_room["connections"].append(nearest["grid_pos"])
			nearest["connections"].append(boss_cell)
		layout.append(boss_room)

	layout_generated.emit(layout)
	return layout

func _compute_seed() -> int:
	# Deterministic but changes each entry — also influenced by player state
	var base: int = entry_count * 7919  # Prime multiplier
	base += GameState.behavioral_integrity * 1301
	base += GameState.current_act * 10007
	base += int(GameState.emotional_resonance * 997.0)
	return base

func _pick_room_type(cell: Vector2i, start_col: int, start_row: int) -> String:
	if cell.x == start_col and cell.y == start_row:
		return "entrance"
	if cell.y == 0:
		return "boss" if cell.x == grid_cols / 2 else "challenge"

	var roll: float = randf()
	if roll < 0.1:
		return "sanctum"  # Rest room — restore mana
	elif roll < 0.3:
		return "puzzle"
	elif roll < 0.5:
		return "ambush"  # Higher enemy count
	else:
		return "corridor"

func _pick_enemy_count(cell: Vector2i) -> int:
	# Fewer near entrance, more near boss
	var depth: float = 1.0 - (float(cell.y) / float(grid_rows))
	var base: int = 1 + int(depth * 3)
	return base + randi() % 2

func _compute_static_intensity(cell: Vector2i, start_col: int, start_row: int) -> float:
	# Static intensity increases with distance from entrance
	var dist: float = Vector2(cell.x - start_col, cell.y - start_row).length()
	var max_dist: float = Vector2(grid_cols, grid_rows).length()
	return clamp(dist / max_dist, 0.1, 1.0)

func _get_neighbors(cell: Vector2i) -> Array[Vector2i]:
	return [
		Vector2i(cell.x - 1, cell.y),
		Vector2i(cell.x + 1, cell.y),
		Vector2i(cell.x, cell.y - 1),
		Vector2i(cell.x, cell.y + 1)
	]

func _in_bounds(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.x < grid_cols and cell.y >= 0 and cell.y < grid_rows

func _find_nearest_room(target: Vector2i) -> Dictionary:
	var nearest: Dictionary = {}
	var nearest_dist: float = 9999.0
	for room in layout:
		var dist: float = Vector2(room["grid_pos"] - target).length()
		if dist < nearest_dist:
			nearest = room
			nearest_dist = dist
	return nearest

## Serialize for save system
func serialize() -> Dictionary:
	return {
		"entry_count": entry_count,
		"current_seed": current_seed,
		"layout": layout
	}

## Deserialize from save
func deserialize(data: Dictionary) -> void:
	if data.has("entry_count"): entry_count = data["entry_count"]
	if data.has("current_seed"): current_seed = data["current_seed"]
	if data.has("layout"): layout.assign(data["layout"])
