shader_type canvas_item;

// Intent Trail — shows projected enemy movement path
// Dashed ghostly line with pulsing leading indicator

uniform vec4 trail_color : source_color = vec4(0.6, 0.9, 1.0, 0.4);
uniform vec4 tip_color : source_color = vec4(1.0, 1.0, 1.0, 0.8);
uniform float pulse_speed : hint_range(0.5, 8.0) = 4.0;
uniform float dash_frequency : hint_range(2.0, 30.0) = 12.0;

void fragment() {
	vec2 uv = UV;

	// Dashed line pattern along X axis
	float dash = step(0.5, fract(uv.x * dash_frequency + TIME * 2.0));

	// Fade along the trail (start = bright, end = dim)
	float fade = 1.0 - uv.x;
	fade = pow(fade, 0.7);

	// Pulse at the leading tip
	float pulse = 0.7 + 0.3 * sin(TIME * pulse_speed);
	float tip_glow = smoothstep(0.8, 1.0, 1.0 - uv.x) * pulse;

	// Vertical falloff — thin line in center
	float center_dist = abs(uv.y - 0.5) * 2.0;
	float line_mask = 1.0 - smoothstep(0.0, 0.8, center_dist);

	// Mix colors
	vec3 col = mix(trail_color.rgb, tip_color.rgb, tip_glow);
	float alpha = line_mask * fade * dash * trail_color.a;
	alpha += tip_glow * line_mask * 0.5; // Additive tip glow

	COLOR = vec4(col, alpha);
}
