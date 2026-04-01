shader_type canvas_item;

uniform vec4 color_left : source_color = vec4(0.05, 0.08, 0.16, 1.0); // Deep Midnight Blue
uniform vec4 color_left_highlight : source_color = vec4(0.72, 0.53, 0.04, 1.0); // Dying Amber
uniform vec4 color_right : source_color = vec4(0.94, 0.94, 0.94, 1.0); // Alabaster White
uniform vec4 color_right_accent : source_color = vec4(0.0, 1.0, 1.0, 1.0); // Cyan

uniform float gradient_softness : hint_range(0.0, 1.0) = 0.5;
uniform sampler2D grit_texture : hint_default_white, repeat_enable;
uniform sampler2D thorn_mask : hint_default_black, repeat_enable;
uniform float grit_strength : hint_range(0.0, 1.0) = 0.2;
uniform float thorn_density : hint_range(0.0, 1.0) = 0.5;

void fragment() {
    float x_ratio = SCREEN_UV.x;
    
    // LAW 03: Left = Shadow/Amber, Right = Light/White
    vec4 left_side = mix(color_left, color_left_highlight, 0.1);
    vec4 right_side = mix(color_right, color_right_accent, 0.05);
    
    // Create the Chiaroscuro transition
    float mask = smoothstep(0.5 - gradient_softness * 0.5, 0.5 + gradient_softness * 0.5, x_ratio);
    vec4 final_color = mix(left_side, right_side, mask);
    
    // Apply Industrial Grit (Law 03: Heavier in shadows)
    vec2 grit_uv = SCREEN_UV * 4.0; // Tile the grit
    float grit = texture(grit_texture, grit_uv).r;
    float grit_factor = mix(grit_strength, grit_strength * 0.2, mask);
    final_color.rgb *= mix(1.0, 1.0 - (1.0 - grit) * 0.5, grit_factor);
    
    // Apply Thorn Patterns (Law 03: Only in the dark past/left)
    float thorn = texture(thorn_mask, UV * 2.0).r;
    float thorn_factor = smoothstep(0.6, 0.0, x_ratio) * thorn_density;
    final_color.rgb = mix(final_color.rgb, final_color.rgb * 0.3, thorn * thorn_factor);
    
    COLOR = final_color;
}
