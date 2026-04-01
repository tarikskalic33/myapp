class_name EnvironmentalDistortion
extends ColorRect

@export var max_distortion_strength: float = 0.05
@export var glitch_threshold: float = 0.7
@export var max_chroma_offset: float = 2.0

func _ready() -> void:
    EventBus.state_changed.connect(_on_state_changed)
    _on_static_changed(GameState.static_meter)

func _on_state_changed(property_name: String, new_value: Variant) -> void:
    if property_name == "static_meter":
        _on_static_changed(new_value)
    elif property_name == "agitation_spike":
        _on_agitation_spike(new_value)

func _on_agitation_spike(agitation: float) -> void:
    if material is ShaderMaterial:
        var shader: ShaderMaterial = material as ShaderMaterial
        var tween = create_tween()
        var peak = agitation * 0.2
        tween.tween_method(func(v): shader.set_shader_parameter("distortion_strength", v), 0.0, peak, 0.1)
        tween.tween_method(func(v): shader.set_shader_parameter("distortion_strength", v), peak, 0.0, 0.5)

func _on_static_changed(level: float) -> void:
    if material is ShaderMaterial:
        var shader: ShaderMaterial = material as ShaderMaterial
        shader.set_shader_parameter("distortion_strength", level * max_distortion_strength)
        var glitch_amount: float = 0.0
        if level > glitch_threshold:
            glitch_amount = (level - glitch_threshold) / max(0.0001, 1.0 - glitch_threshold)
        shader.set_shader_parameter("glitch_amount", clamp(glitch_amount, 0.0, 1.0))
        shader.set_shader_parameter("chroma_offset", level * max_chroma_offset)
    var tint_r: float = clamp(1.0 - (level * 0.2), 0.0, 1.0)
    modulate = Color(tint_r, 1.0, 1.0, 1.0)
