# EmotionalScan — Hold 'E' to reveal NPC/boss dimensional tier, motivation, and weakness
# Bible: "Hold on any NPC/boss — costs Mental Mana, reveals dimensional tier, hidden motivation, Structural Weakness."
# Drains Mental Mana while held. Shows scan UI overlay on the nearest scannable target.
class_name EmotionalScan
extends Node

## Mana cost per second while scanning
@export var mana_drain_per_sec: float = 15.0

## Maximum scan range in pixels
@export var scan_range: float = 250.0

## Time to complete a full scan (reveals tiers of info)
@export var full_scan_time: float = 1.5

var _is_scanning: bool = false
var _scan_progress: float = 0.0
var _current_target: Node2D = null
var _scan_ui: Control = null
var _player: CharacterBody2D

signal scan_started(target: Node2D)
signal scan_completed(target: Node2D, data: Dictionary)
signal scan_cancelled

func _ready() -> void:
	# Find player
	await get_tree().process_frame
	_player = get_tree().get_first_node_in_group("Player") as CharacterBody2D
	_create_scan_ui()

func _process(delta: float) -> void:
	if not _player:
		return

	if Input.is_action_pressed("emotional_scan"):
		if not _is_scanning:
			_start_scan()
		elif _is_scanning:
			_update_scan(delta)
	elif _is_scanning:
		_cancel_scan()

func _start_scan() -> void:
	# Check mana
	if GameState.mental_mana < mana_drain_per_sec * 0.1:
		return  # Not enough mana to even start

	# Find nearest scannable target
	_current_target = _find_nearest_target()
	if not _current_target:
		return

	_is_scanning = true
	_scan_progress = 0.0
	scan_started.emit(_current_target)

	if _scan_ui:
		_scan_ui.visible = true

func _update_scan(delta: float) -> void:
	if not _current_target or not is_instance_valid(_current_target):
		_cancel_scan()
		return

	# Check range
	var dist = _player.global_position.distance_to(_current_target.global_position)
	if dist > scan_range:
		_cancel_scan()
		return

	# Drain mana
	var drain = mana_drain_per_sec * delta
	if GameState.mental_mana < drain:
		_cancel_scan()
		return
	GameState.mental_mana -= drain

	# Advance scan
	_scan_progress += delta / full_scan_time
	_scan_progress = clamp(_scan_progress, 0.0, 1.0)

	# Update UI
	_update_scan_ui()

	# Complete scan at 100%
	if _scan_progress >= 1.0:
		_complete_scan()

func _complete_scan() -> void:
	if _current_target:
		var data = _extract_target_data(_current_target)
		scan_completed.emit(_current_target, data)
		_show_scan_results(data)

	# Keep showing results for a moment, then fade
	var tween = create_tween()
	tween.tween_interval(2.0)
	tween.tween_callback(_cancel_scan)

func _cancel_scan() -> void:
	_is_scanning = false
	_scan_progress = 0.0
	_current_target = null
	if _scan_ui:
		_scan_ui.visible = false
	scan_cancelled.emit()

func _find_nearest_target() -> Node2D:
	var enemies = get_tree().get_nodes_in_group("Enemies")
	var nearest: Node2D = null
	var nearest_dist: float = scan_range

	for enemy in enemies:
		if enemy is Node2D:
			var dist = _player.global_position.distance_to(enemy.global_position)
			if dist < nearest_dist:
				nearest = enemy as Node2D
				nearest_dist = dist

	return nearest

func _extract_target_data(target: Node2D) -> Dictionary:
	# Build scan data based on what the target exposes
	var data: Dictionary = {
		"name": target.name,
		"dimensional_tier": "2D",  # Default — enemies think in 2D patterns
		"motivation": "TERRITORIAL DEFENSE",
		"weakness": "NONE DETECTED",
		"health_pct": 100.0,
		"threat_level": "LOW"
	}

	# Read actual data from the target if available
	if target is StaticShadowBasic:
		var enemy = target as StaticShadowBasic
		data["health_pct"] = (enemy.current_health / enemy.max_health) * 100.0
		data["dimensional_tier"] = "1D"  # Bible: Static Shadows are 1D thinkers
		data["motivation"] = "PROXIMITY PURSUIT — STATIC FEEDBACK LOOP"
		data["weakness"] = "LOW STATIC = INTANGIBLE"

		if enemy.damage_active:
			data["threat_level"] = "HIGH"
		elif enemy.modulate.a > 0.1:
			data["threat_level"] = "MEDIUM"
		else:
			data["threat_level"] = "DORMANT"

	# Check for custom scan data on the target
	if target.has_method("get_scan_data"):
		var custom = target.get_scan_data()
		data.merge(custom, true)

	return data

## --- UI ---

func _create_scan_ui() -> void:
	# Build the scan overlay UI programmatically
	_scan_ui = Control.new()
	_scan_ui.name = "ScanOverlay"
	_scan_ui.visible = false
	_scan_ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_scan_ui.set_anchors_preset(Control.PRESET_FULL_RECT)

	# Scan ring / progress indicator (centered on target)
	var ring = TextureProgressBar.new()
	ring.name = "ScanRing"
	ring.custom_minimum_size = Vector2(80, 80)
	ring.fill_mode = TextureProgressBar.FILL_CLOCKWISE
	ring.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_scan_ui.add_child(ring)

	# Scan text panel
	var panel = PanelContainer.new()
	panel.name = "ScanPanel"
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE

	var vbox = VBoxContainer.new()
	vbox.mouse_filter = Control.MOUSE_FILTER_IGNORE

	var label_name = Label.new()
	label_name.name = "TargetName"
	label_name.add_theme_color_override("font_color", Color(0.0, 1.0, 1.0))
	label_name.add_theme_font_size_override("font_size", 16)
	vbox.add_child(label_name)

	var label_tier = Label.new()
	label_tier.name = "DimTier"
	label_tier.add_theme_color_override("font_color", Color(0.7, 0.9, 1.0))
	label_tier.add_theme_font_size_override("font_size", 12)
	vbox.add_child(label_tier)

	var label_motivation = Label.new()
	label_motivation.name = "Motivation"
	label_motivation.add_theme_color_override("font_color", Color(1.0, 0.85, 0.3))
	label_motivation.add_theme_font_size_override("font_size", 12)
	vbox.add_child(label_motivation)

	var label_weakness = Label.new()
	label_weakness.name = "Weakness"
	label_weakness.add_theme_color_override("font_color", Color(1.0, 0.4, 0.4))
	label_weakness.add_theme_font_size_override("font_size", 12)
	vbox.add_child(label_weakness)

	var label_threat = Label.new()
	label_threat.name = "ThreatLevel"
	label_threat.add_theme_font_size_override("font_size", 11)
	vbox.add_child(label_threat)

	panel.add_child(vbox)
	_scan_ui.add_child(panel)

	# Add to a CanvasLayer so it renders above gameplay
	var canvas = CanvasLayer.new()
	canvas.name = "ScanLayer"
	canvas.layer = 12
	canvas.add_child(_scan_ui)
	add_child(canvas)

func _update_scan_ui() -> void:
	if not _scan_ui or not _current_target:
		return

	# Position panel near the target (offset to the right)
	var camera = get_viewport().get_camera_2d()
	if camera:
		var screen_pos = _current_target.get_global_transform_with_canvas().origin
		var panel = _scan_ui.get_node_or_null("ScanPanel")
		if panel:
			panel.position = screen_pos + Vector2(50, -40)

	# Progress bar text (show percentage while scanning)
	var name_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/TargetName")
	if name_label:
		name_label.text = "SCANNING... %d%%" % int(_scan_progress * 100)

	# Reveal tiers of info as scan progresses
	var tier_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/DimTier")
	var motiv_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/Motivation")
	var weak_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/Weakness")
	var threat_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/ThreatLevel")

	# Progressive reveal: tier at 30%, motivation at 60%, weakness at 100%
	if tier_label:
		tier_label.visible = _scan_progress >= 0.3
		if tier_label.visible and _current_target is StaticShadowBasic:
			tier_label.text = "◆ DIMENSIONAL TIER: 1D"
	if motiv_label:
		motiv_label.visible = _scan_progress >= 0.6
	if weak_label:
		weak_label.visible = _scan_progress >= 1.0
	if threat_label:
		threat_label.visible = _scan_progress >= 0.3

func _show_scan_results(data: Dictionary) -> void:
	if not _scan_ui:
		return

	var name_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/TargetName")
	var tier_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/DimTier")
	var motiv_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/Motivation")
	var weak_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/Weakness")
	var threat_label = _scan_ui.get_node_or_null("ScanPanel/VBoxContainer/ThreatLevel")

	if name_label:
		name_label.text = "⟐ %s" % data.get("name", "UNKNOWN")
	if tier_label:
		tier_label.text = "◆ DIMENSIONAL TIER: %s" % data.get("dimensional_tier", "?")
		tier_label.visible = true
	if motiv_label:
		motiv_label.text = "◈ MOTIVATION: %s" % data.get("motivation", "UNKNOWN")
		motiv_label.visible = true
	if weak_label:
		weak_label.text = "◇ WEAKNESS: %s" % data.get("weakness", "NONE")
		weak_label.visible = true
	if threat_label:
		var threat = data.get("threat_level", "UNKNOWN")
		var threat_color = Color.WHITE
		match threat:
			"HIGH": threat_color = Color(1.0, 0.3, 0.3)
			"MEDIUM": threat_color = Color(1.0, 0.85, 0.3)
			"LOW": threat_color = Color(0.3, 1.0, 0.3)
			"DORMANT": threat_color = Color(0.5, 0.5, 0.5)
		threat_label.text = "▲ THREAT: %s | HP: %d%%" % [threat, data.get("health_pct", 100)]
		threat_label.add_theme_color_override("font_color", threat_color)
		threat_label.visible = true
