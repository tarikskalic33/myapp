# GambleUI — Bible: "Inner Sanctum only. No judgment. No warning popup."
# Small (10pts, 25% double) / Medium (25pts, 40% triple) / All-In (50/50 or zero)
# After 3 All-In losses: Data Log unlocks "CORRUPTION DATA — GAMBLING SUBROUTINE — STATUS: FAMILIAR."
class_name GambleUI
extends CanvasLayer

var _panel: PanelContainer
var _title_label: Label
var _balance_label: Label
var _result_label: Label
var _btn_small: Button
var _btn_medium: Button
var _btn_allin: Button
var _btn_close: Button
var _corruption_label: Label

## Track All-In losses for corruption unlock
var all_in_losses: int = 0
var corruption_unlocked: bool = false

## Resource being gambled — uses Mental Mana per Bible (cognitive resource)
var _is_open: bool = false

signal gamble_completed(wager_type: String, won: bool, amount: float)
signal corruption_data_unlocked

func _ready() -> void:
	layer = 15  # Above most UI
	_build_ui()
	_panel.visible = false

func open() -> void:
	if _is_open:
		return
	_is_open = true
	_panel.visible = true
	_update_balance()
	_result_label.text = ""
	get_tree().paused = true  # Pause game while gambling

func close() -> void:
	_is_open = false
	_panel.visible = false
	get_tree().paused = false

func _update_balance() -> void:
	_balance_label.text = "MENTAL MANA: %.0f / %.0f" % [GameState.mental_mana, GameState.max_mental_mana]

	# Enable/disable buttons based on available mana
	_btn_small.disabled = GameState.mental_mana < 10
	_btn_medium.disabled = GameState.mental_mana < 25
	_btn_allin.disabled = GameState.mental_mana < 1

	# Show corruption status
	if corruption_unlocked:
		_corruption_label.text = "CORRUPTION DATA — GAMBLING SUBROUTINE — STATUS: FAMILIAR"
		_corruption_label.visible = true

func _on_small_pressed() -> void:
	_execute_gamble("SMALL", 10.0, 0.25, 2.0)

func _on_medium_pressed() -> void:
	_execute_gamble("MEDIUM", 25.0, 0.40, 3.0)

func _on_allin_pressed() -> void:
	var stake: float = GameState.mental_mana
	_execute_gamble("ALL-IN", stake, 0.50, 2.0)

func _execute_gamble(type: String, stake: float, win_chance: float, multiplier: float) -> void:
	# Deduct stake
	GameState.mental_mana -= stake

	# Bible: GAMBLE sets static to max
	StaticMeter.register_action(StaticMeter.ActionType.GAMBLE)

	# Roll
	var roll: float = randf()
	var won: bool = roll < win_chance

	if won:
		var winnings: float = stake * multiplier
		GameState.mental_mana += winnings
		_result_label.add_theme_color_override("font_color", Color(0.0, 1.0, 1.0))
		_result_label.text = "WIN — +%.0f MANA" % winnings
	else:
		_result_label.add_theme_color_override("font_color", Color(1.0, 0.3, 0.3))
		_result_label.text = "LOSS — -%.0f MANA" % stake

		# Track All-In losses
		if type == "ALL-IN":
			all_in_losses += 1
			if all_in_losses >= 3 and not corruption_unlocked:
				corruption_unlocked = true
				corruption_data_unlocked.emit()
				_result_label.text = "CORRUPTION DATA UNLOCKED"
				_result_label.add_theme_color_override("font_color", Color(1.0, 0.0, 0.5))

	# Flash the result
	var tween = create_tween()
	tween.tween_property(_result_label, "modulate:a", 1.0, 0.05)
	tween.tween_interval(1.5)
	tween.tween_property(_result_label, "modulate:a", 0.3, 0.5)

	_update_balance()
	gamble_completed.emit(type, won, stake)

func _build_ui() -> void:
	# Dark panel container
	_panel = PanelContainer.new()
	_panel.name = "GamblePanel"

	# Style — dark translucent background
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.05, 0.05, 0.12, 0.95)
	style.border_color = Color(0.0, 1.0, 1.0, 0.4)
	style.set_border_width_all(2)
	style.set_corner_radius_all(8)
	style.set_content_margin_all(20)
	_panel.add_theme_stylebox_override("panel", style)

	# Center the panel
	_panel.set_anchors_preset(Control.PRESET_CENTER)
	_panel.custom_minimum_size = Vector2(400, 300)
	_panel.position = Vector2(-200, -150)

	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 12)

	# Title
	_title_label = Label.new()
	_title_label.text = "◈ THE GAMBLE ◈"
	_title_label.add_theme_color_override("font_color", Color(1.0, 0.85, 0.3))
	_title_label.add_theme_font_size_override("font_size", 22)
	_title_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(_title_label)

	# Balance
	_balance_label = Label.new()
	_balance_label.add_theme_color_override("font_color", Color(0.7, 0.9, 1.0))
	_balance_label.add_theme_font_size_override("font_size", 14)
	_balance_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	vbox.add_child(_balance_label)

	# Separator
	var sep = HSeparator.new()
	vbox.add_child(sep)

	# Buttons
	var btn_container = HBoxContainer.new()
	btn_container.add_theme_constant_override("separation", 10)
	btn_container.alignment = BoxContainer.ALIGNMENT_CENTER

	_btn_small = _make_button("SMALL\n10 pts | 25%\n×2", Color(0.3, 0.8, 0.3))
	_btn_small.pressed.connect(_on_small_pressed)
	btn_container.add_child(_btn_small)

	_btn_medium = _make_button("MEDIUM\n25 pts | 40%\n×3", Color(1.0, 0.85, 0.3))
	_btn_medium.pressed.connect(_on_medium_pressed)
	btn_container.add_child(_btn_medium)

	_btn_allin = _make_button("ALL-IN\nAll mana | 50%\n×2 or 0", Color(1.0, 0.3, 0.3))
	_btn_allin.pressed.connect(_on_allin_pressed)
	btn_container.add_child(_btn_allin)

	vbox.add_child(btn_container)

	# Result label
	_result_label = Label.new()
	_result_label.add_theme_font_size_override("font_size", 18)
	_result_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_result_label.text = ""
	vbox.add_child(_result_label)

	# Corruption label (hidden until unlocked)
	_corruption_label = Label.new()
	_corruption_label.add_theme_color_override("font_color", Color(1.0, 0.0, 0.5))
	_corruption_label.add_theme_font_size_override("font_size", 11)
	_corruption_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_corruption_label.visible = false
	vbox.add_child(_corruption_label)

	# Close button
	_btn_close = Button.new()
	_btn_close.text = "WALK AWAY"
	_btn_close.pressed.connect(close)
	var close_style = StyleBoxFlat.new()
	close_style.bg_color = Color(0.15, 0.15, 0.2)
	close_style.set_corner_radius_all(4)
	_btn_close.add_theme_stylebox_override("normal", close_style)
	_btn_close.add_theme_color_override("font_color", Color(0.6, 0.6, 0.7))
	vbox.add_child(_btn_close)

	_panel.add_child(vbox)
	add_child(_panel)

func _make_button(text: String, color: Color) -> Button:
	var btn = Button.new()
	btn.text = text
	btn.custom_minimum_size = Vector2(110, 80)

	var style_normal = StyleBoxFlat.new()
	style_normal.bg_color = Color(color.r * 0.2, color.g * 0.2, color.b * 0.2, 0.9)
	style_normal.border_color = color * 0.6
	style_normal.set_border_width_all(1)
	style_normal.set_corner_radius_all(6)
	style_normal.set_content_margin_all(8)
	btn.add_theme_stylebox_override("normal", style_normal)

	var style_hover = StyleBoxFlat.new()
	style_hover.bg_color = Color(color.r * 0.3, color.g * 0.3, color.b * 0.3, 0.95)
	style_hover.border_color = color
	style_hover.set_border_width_all(2)
	style_hover.set_corner_radius_all(6)
	style_hover.set_content_margin_all(8)
	btn.add_theme_stylebox_override("hover", style_hover)

	btn.add_theme_color_override("font_color", color)
	btn.add_theme_font_size_override("font_size", 12)

	return btn
