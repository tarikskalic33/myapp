shader_type canvas_item;

// Procedural slash arc — directional attack VFX
// Draws a crescent/arc shape with bright leading edge and fading trail

uniform float progress : hint_range(0.0, 1.0) = 0.0;
uniform vec4 edge_color : source_color = vec4(1.0, 0.95, 0.7, 1.0);
uniform vec4 trail_color : source_color = vec4(0.0, 1.0, 1.0, 0.6);
uniform float arc_thickness : hint_range(0.02, 0.3) = 0.12;
uniform float arc_angle : hint_range(0.5, 3.14) = 2.0;
uniform float sharpness : hint_range(1.0, 20.0) = 8.0;

void fragment() {
	vec2 uv = UV * 2.0 - 1.0; // Center UV to -1..1

	// Polar coordinates
	float dist = length(uv);
	float angle = atan(uv.y, uv.x); // -PI to PI

	// Arc mask — only render within arc_angle sweep
	// Progress sweeps the arc from start to full
	float sweep = arc_angle * progress;
	float half_arc = arc_angle * 0.5;
	float angle_offset = angle + half_arc; // Shift so arc is centered

	// Normalize angle to 0..arc_angle range
	float in_arc = step(0.0, angle_offset) * step(angle_offset, sweep);

	// Ring shape — distance from unit circle edge
	float ring = 1.0 - abs(dist - 0.7) / arc_thickness;
	ring = clamp(ring, 0.0, 1.0);
	ring = pow(ring, 1.5); // Sharpen edges

	// Leading edge glow — brighter near the sweep front
	float edge_proximity = 1.0 - clamp(abs(angle_offset - sweep) / 0.3, 0.0, 1.0);
	edge_proximity = pow(edge_proximity, 2.0);

	// Trail fade — older parts of the arc fade out
	float trail_fade = clamp(angle_offset / max(sweep, 0.01), 0.0, 1.0);
	trail_fade = pow(trail_fade, 0.5);

	// Combine
	float alpha_mask = ring * in_arc;

	// Color blend — leading edge is bright, trail is colored
	vec3 col = mix(trail_color.rgb, edge_color.rgb, edge_proximity);

	// Overall fade with progress (peak at 0.5, fade at end)
	float life_fade = 1.0 - pow(progress, 3.0);

	// Intensity boost at leading edge
	float intensity = 1.0 + edge_proximity * 2.0;

	COLOR = vec4(col * intensity, alpha_mask * life_fade * (0.4 + trail_fade * 0.6));
}
