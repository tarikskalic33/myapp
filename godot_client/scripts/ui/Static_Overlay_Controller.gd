class_name Static_Overlay_Controller
extends ColorRect

@onready var shader_material: ShaderMaterial = material as ShaderMaterial

func _ready() -> void:
    if shader_material == null:
        push_warning("Static_Overlay_Controller: ShaderMaterial missing from ColorRect.")
    
    EventBus.state_changed.connect(_on_state_changed)
    _update_shader(GameState.static_meter)

func _on_state_changed(property_name: String, new_value: Variant) -> void:
    if property_name == "static_meter":
        _update_shader(new_value)

func _update_shader(level: float) -> void:
    if shader_material != null:
        var clamped_level: float = clamp(level, 0.0, 1.0)
        # Tone down the multipliers — setting distortion_strength to 0.2 shifts the screen by 20%
        shader_material.set_shader_parameter("distortion_strength", clamped_level * 0.03)
        shader_material.set_shader_parameter("glitch_amount", clamped_level * 0.6)
        shader_material.set_shader_parameter("chromatic_aberration", clamped_level * 0.01)
        shader_material.set_shader_parameter("scanline_strength", clamped_level * 0.15)
