shader_type canvas_item;

uniform sampler2D screen_texture : hint_screen_texture, repeat_disable, filter_linear;
uniform float distortion_strength : hint_range(0.0, 0.2) = 0.02;
uniform float glitch_amount : hint_range(0.0, 1.0) = 0.0;
uniform float chromatic_aberration : hint_range(0.0, 0.02) = 0.003;
uniform float scanline_strength : hint_range(0.0, 0.25) = 0.05;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void fragment() {
    vec2 uv = SCREEN_UV;
    float t = TIME;
    float wave = sin(uv.y * 35.0 + t * 2.4) * 0.5 + 0.5;
    float wave_2 = sin(uv.y * 80.0 - t * 4.1) * 0.5 + 0.5;
    float distortion = (wave * 0.65 + wave_2 * 0.35) * distortion_strength;
    float tear_band = step(0.92, sin(uv.y * 18.0 - t * 7.0));
    float tear_offset = (hash(vec2(floor(t * 12.0), floor(uv.y * 40.0))) - 0.5) * glitch_amount * 0.08 * tear_band;
    vec2 dist_uv = uv + vec2(distortion + tear_offset, 0.0);
    float ca = chromatic_aberration + glitch_amount * 0.008;
    float r = texture(screen_texture, clamp(dist_uv + vec2(ca, 0.0), vec2(0.0), vec2(1.0))).r;
    float g = texture(screen_texture, clamp(dist_uv, vec2(0.0), vec2(1.0))).g;
    float b = texture(screen_texture, clamp(dist_uv - vec2(ca, 0.0), vec2(0.0), vec2(1.0))).b;
    vec4 color = vec4(r, g, b, 1.0);
    float scan = sin(uv.y * 900.0) * 0.5 + 0.5;
    color.rgb *= 1.0 - (scanline_strength * scan * (0.25 + glitch_amount));
    COLOR = color;
}
