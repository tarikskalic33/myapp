shader_type canvas_item;

uniform sampler2D noise_tex : repeat_enable;
uniform vec4 cloak_color : source_color = vec4(0.05, 0.05, 0.1, 1.0);
uniform vec4 outline_color : source_color = vec4(0.0, 1.0, 1.0, 1.0); // Cyan outline
uniform float outline_width : hint_range(0.0, 10.0) = 2.0;
uniform float turbulence_speed : hint_range(0.0, 2.0) = 0.5;
uniform float stars_intensity : hint_range(0.0, 1.0) = 0.8;

void fragment() {
    vec2 uv = UV;
    float t = TIME * turbulence_speed;
    vec2 pixel_size = TEXTURE_PIXEL_SIZE;

    // === OUTLINE DETECTION ===
    // Sample neighboring pixels to detect edge
    vec4 texture_color = texture(TEXTURE, uv);
    float alpha = texture_color.a;

    float outline = 0.0;
    if (alpha < 0.5) {
        // Check neighbors — if any neighbor has alpha, we're on the outline
        for (float x = -outline_width; x <= outline_width; x += 1.0) {
            for (float y = -outline_width; y <= outline_width; y += 1.0) {
                float neighbor_alpha = texture(TEXTURE, uv + vec2(x, y) * pixel_size).a;
                if (neighbor_alpha > 0.5) {
                    outline = 1.0;
                    break;
                }
            }
            if (outline > 0.5) break;
        }
    }

    // If this pixel is part of the outline, render outline color with pulse
    if (outline > 0.5 && alpha < 0.5) {
        float pulse = 0.7 + 0.3 * sin(t * 3.0);
        COLOR = vec4(outline_color.rgb * pulse, outline_color.a * 0.9);
        return;
    }

    // === CLOAK BODY ===
    // Dual scrolling noise for interference (Law 05)
    float noise1 = texture(noise_tex, uv + vec2(t * 0.2, t * 0.1)).r;
    float noise2 = texture(noise_tex, uv - vec2(t * 0.15, t * 0.25)).g;
    float combined_noise = (noise1 + noise2) * 0.5;

    // Base color with internal fluid movement
    vec4 final_color = cloak_color;
    final_color.rgb *= 0.8 + 0.4 * combined_noise;

    // Distorted Star Reflections
    float stars = pow(combined_noise, 10.0) * stars_intensity;
    final_color.rgb += vec3(stars);

    // Inner edge glow — brighter near the silhouette border
    float edge_detect = 1.0 - smoothstep(0.0, 0.15, alpha - 0.5);
    final_color.rgb = mix(final_color.rgb, outline_color.rgb * 0.5, edge_detect * 0.3);

    // Alpha handling (Law 01 silhouette)
    final_color.a = alpha;

    // Subtle edge ripple
    if (final_color.a > 0.0) {
        float ripple = sin(uv.y * 20.0 + t * 5.0) * 0.005;
        final_color.a *= smoothstep(0.0, 0.01, alpha - ripple);
    }

    COLOR = final_color;
}
