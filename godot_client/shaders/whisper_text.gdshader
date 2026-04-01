shader_type canvas_item;

// Whisper text shader — psychological glitch effect on Label
// Driven by intensity uniform (0.0 = calm, 1.0 = max agitation)

uniform float intensity : hint_range(0.0, 1.0) = 0.5;
uniform float chromatic_split : hint_range(0.0, 8.0) = 3.0;
uniform float glitch_speed : hint_range(0.0, 20.0) = 8.0;
uniform float glow_strength : hint_range(0.0, 2.0) = 0.6;
uniform vec4 glow_color : source_color = vec4(0.0, 1.0, 1.0, 0.4);
uniform float scanline_density : hint_range(0.0, 200.0) = 80.0;
uniform float jitter_amount : hint_range(0.0, 0.02) = 0.005;

float rand(vec2 co) {
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void fragment() {
	vec2 uv = UV;
	float t = TIME;
	float i = intensity;

	// Horizontal jitter — increases with intensity
	float jitter_seed = floor(t * glitch_speed);
	float jitter = (rand(vec2(jitter_seed, uv.y * 20.0)) - 0.5) * jitter_amount * i;
	uv.x += jitter;

	// Chromatic aberration — RGB split on X axis
	float ca = chromatic_split * i / 512.0; // pixel-relative split
	float r = texture(TEXTURE, uv + vec2(ca, 0.0)).r;
	float g = texture(TEXTURE, uv).g;
	float b = texture(TEXTURE, uv - vec2(ca, 0.0)).b;
	float a = texture(TEXTURE, uv).a;

	// Also sample alpha from offset positions to extend the glow
	float a_r = texture(TEXTURE, uv + vec2(ca, 0.0)).a;
	float a_b = texture(TEXTURE, uv - vec2(ca, 0.0)).a;
	float a_max = max(a, max(a_r, a_b));

	vec4 base = vec4(r, g, b, a_max);

	// Scanlines — subtle horizontal lines
	float scan = sin(uv.y * scanline_density + t * 4.0) * 0.5 + 0.5;
	base.rgb *= 1.0 - (scan * 0.15 * i);

	// Glow pulse — breathes with time, stronger at high intensity
	float pulse = sin(t * 3.0) * 0.5 + 0.5;
	float glow = glow_strength * i * (0.6 + 0.4 * pulse);
	vec3 glow_add = glow_color.rgb * glow * a_max;
	base.rgb += glow_add;

	// Occasional glitch band — full line displacement
	float band = step(0.97 - i * 0.05, rand(vec2(jitter_seed * 0.1, floor(uv.y * 8.0))));
	base.rgb = mix(base.rgb, glow_color.rgb, band * 0.4 * i);

	COLOR = base;
}
