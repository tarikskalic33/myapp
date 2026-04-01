class_name IntegrityHUD
extends Control

@onready var bg_bar: TextureProgressBar = $BackgroundBar
@onready var fg_bar: TextureProgressBar = $ForegroundBar

var _initial_max: float = 100.0

func _ready() -> void:
    _initial_max = GameState.max_health
    EventBus.state_changed.connect(_on_state_changed)
    _on_max_updated(GameState.max_health)
    _on_health_updated(GameState.current_health)

func _on_state_changed(property_name: String, new_value: Variant) -> void:
    if property_name == "current_health":
        _on_health_updated(new_value)
    elif property_name == "max_health":
        _on_max_updated(new_value)

func _on_health_updated(val: float) -> void:
    var tween: Tween = create_tween()
    tween.tween_property(fg_bar, "value", val, 0.3).set_trans(Tween.TRANS_SINE)

func _on_max_updated(new_max: float) -> void:
    var ratio: float = float(new_max) / _initial_max if _initial_max != 0.0 else 1.0
    var tween: Tween = create_tween()
    tween.parallel().tween_property(self, "scale:x", ratio, 0.6).set_trans(Tween.TRANS_ELASTIC)
    tween.parallel().tween_property(bg_bar, "modulate", Color(4, 4, 4), 0.1)
    tween.chain().tween_property(bg_bar, "modulate", Color(1, 1, 1), 0.2)
    bg_bar.max_value = new_max
    fg_bar.max_value = new_max
