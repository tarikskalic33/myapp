extends Node2D
class_name CameraShake

@export var shake_intensity: float = 0.0
@export var shake_decay: float = 5.0

var _camera: Camera2D
var _original_offset: Vector2

func _ready() -> void:
    _camera = get_parent() as Camera2D
    if _camera:
        _original_offset = _camera.offset

func _process(delta: float) -> void:
    if shake_intensity > 0:
        shake_intensity = lerp(shake_intensity, 0.0, shake_decay * delta)
        if shake_intensity < 0.1:
            shake_intensity = 0
            _camera.offset = _original_offset
        else:
            _camera.offset = _original_offset + Vector2(
                randf_range(-shake_intensity, shake_intensity),
                randf_range(-shake_intensity, shake_intensity)
            )

func apply_shake(intensity: float) -> void:
    shake_intensity = max(shake_intensity, intensity)
