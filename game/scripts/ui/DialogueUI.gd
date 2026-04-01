# DialogueUI — Minimal dialogue box for NPC conversations
# Bible: DISCIPLINE teaches structure, MEANING teaches purpose.
# No branching trees — linear wisdom delivery with mechanical rewards.
class_name DialogueUI
extends CanvasLayer

var _panel: PanelContainer
var _name_label: Label
var _text_label: RichTextLabel
var _advance_label: Label
var _is_open: bool = false
var _lines: Array[String] = []
var _current_line: int = 0
var _npc_name: String = ""
var _npc_color: Color = Color.WHITE
var _char_index: int = 0
var _typewriter_speed: float = 0.03
var _typewriter_timer: float = 0.0
var _line_complete: bool = false

## Callback when dialogue ends
var _on_complete: Callable

signal dialogue_finished(npc_name: String)

static var _instance: DialogueUI

func _ready() -> void:
	layer = 20
	_instance = self
	_build_ui()
	visible = false

static func get_instance() -> DialogueUI:
	return _instance

func _build_ui() -> void:
	# Dark semi-transparent panel at bottom of screen
	_panel = PanelContainer.new()
	_panel.anchor_left = 0.05
	_panel.anchor_right = 0.95
	_panel.anchor_top = 0.7
	_panel.anchor_bottom = 0.95
	_panel.set("theme_override_styles/panel", _create_panel_style())
	add_child(_panel)

	var vbox = VBoxContainer.new()
	vbox.set("theme_override_constants/separation", 8)
	_panel.add_child(vbox)

	# NPC name
	_name_label = Label.new()
	_name_label.add_theme_font_size_override("font_size", 16)
	_name_label.add_theme_color_override("font_color", Color.CYAN)
	vbox.add_child(_name_label)

	# Dialogue text (RichTextLabel for typewriter effect)
	_text_label = RichTextLabel.new()
	_text_label.bbcode_enabled = true
	_text_label.custom_minimum_size = Vector2(0, 100)
	_text_label.add_theme_font_size_override("normal_font_size", 14)
	_text_label.add_theme_color_override("default_color", Color(0.9, 0.9, 0.9, 1.0))
	_text_label.scroll_active = false
	vbox.add_child(_text_label)

	# Advance prompt
	_advance_label = Label.new()
	_advance_label.text = "[E] Continue"
	_advance_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_advance_label.add_theme_font_size_override("font_size", 11)
	_advance_label.add_theme_color_override("font_color", Color(0.5, 0.5, 0.5, 0.6))
	vbox.add_child(_advance_label)

func _create_panel_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.02, 0.02, 0.06, 0.92)
	style.border_color = Color(0.0, 0.6, 0.8, 0.4)
	style.set_border_width_all(1)
	style.set_corner_radius_all(4)
	style.set_content_margin_all(16)
	return style

## Open dialogue with a set of lines
func open(npc_name: String, color: Color, lines: Array[String], on_complete: Callable = Callable()) -> void:
	if _is_open:
		return

	_npc_name = npc_name
	_npc_color = color
	_lines = lines
	_current_line = 0
	_on_complete = on_complete
	_is_open = true
	visible = true

	_name_label.text = "◈ " + npc_name
	_name_label.add_theme_color_override("font_color", color)

	_show_line(0)

	# Pause player input during dialogue
	get_tree().paused = false  # Don't fully pause — just block player movement via flag
	GameState.in_dialogue = true

func _show_line(index: int) -> void:
	if index >= _lines.size():
		_close()
		return

	_current_line = index
	_text_label.text = ""
	_char_index = 0
	_typewriter_timer = 0.0
	_line_complete = false
	_advance_label.text = ""

func _process(delta: float) -> void:
	if not _is_open:
		return

	# Typewriter effect
	if not _line_complete and _current_line < _lines.size():
		_typewriter_timer += delta
		var full_text: String = _lines[_current_line]

		while _typewriter_timer >= _typewriter_speed and _char_index < full_text.length():
			_char_index += 1
			_typewriter_timer -= _typewriter_speed

		_text_label.text = full_text.substr(0, _char_index)

		if _char_index >= full_text.length():
			_line_complete = true
			if _current_line < _lines.size() - 1:
				_advance_label.text = "[E] Continue"
			else:
				_advance_label.text = "[E] Close"

	# Input handling
	if Input.is_action_just_pressed("emotional_scan"):
		if _line_complete:
			_show_line(_current_line + 1)
		else:
			# Skip typewriter — show full line instantly
			_char_index = _lines[_current_line].length()
			_text_label.text = _lines[_current_line]
			_line_complete = true
			if _current_line < _lines.size() - 1:
				_advance_label.text = "[E] Continue"
			else:
				_advance_label.text = "[E] Close"

func _close() -> void:
	_is_open = false
	visible = false
	GameState.in_dialogue = false
	dialogue_finished.emit(_npc_name)
	if _on_complete.is_valid():
		_on_complete.call()
