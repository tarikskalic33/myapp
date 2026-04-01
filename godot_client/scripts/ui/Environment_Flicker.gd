class_name Environment_Flicker
extends Node2D

@export var base_interval: float = 1.0
@export var min_interval: float = 0.05

var current_interval: float = base_interval
var _timer: float = 0.0

func _ready() -> void:
    EventBus.state_changed.connect(_on_state_changed)
    _on_static_level_changed(GameState.static_meter)
    _timer = current_interval * randf()

func _on_state_changed(property_name: String, new_value: Variant) -> void:
    if property_name == "static_meter":
        _on_static_level_changed(new_value)

func _on_static_level_changed(level: float) -> void:
    var clamped: float = clamp(level, 0.0, 1.0)
    current_interval = lerp(base_interval, min_interval, clamped)

func _process(delta: float) -> void:
    # Only flicker when static is meaningfully elevated
    if current_interval >= base_interval * 0.9:
        visible = true
        return
    _timer -= delta
    if _timer <= 0.0:
        _timer = current_interval * randf_range(0.8, 1.5)
        visible = not visible
