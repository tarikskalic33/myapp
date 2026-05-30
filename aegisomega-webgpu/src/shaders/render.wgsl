struct VertexOut {
  @builtin(position) pos: vec4<f32>,
  @location(0)       uv : vec2<f32>,
}

struct Uniforms {
  dt              : f32,
  frame           : u32,
  lambda_influence: f32,
  sigma_perturb   : f32,
  width           : u32,
  height          : u32,
  _pad0           : u32,
  _pad1           : u32,
}

@vertex
fn vs_main(@builtin(vertex_index) vi: u32) -> VertexOut {
  var positions = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0),
  );
  var uvs = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(2.0, 1.0),
    vec2<f32>(0.0, -1.0),
  );
  var out: VertexOut;
  out.pos = vec4<f32>(positions[vi], 0.0, 1.0);
  out.uv  = uvs[vi];
  return out;
}

@group(0) @binding(0) var sigma_tex : texture_2d<f32>;
@group(0) @binding(1) var rho_tex   : texture_2d<f32>;
@group(0) @binding(2) var lambda_tex: texture_2d<f32>;
@group(0) @binding(3) var<uniform> u: Uniforms;

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
  let coord = clamp(
    vec2<i32>(in.uv * vec2<f32>(f32(u.width), f32(u.height))),
    vec2<i32>(0, 0),
    vec2<i32>(i32(u.width) - 1, i32(u.height) - 1),
  );
  let sigma  = textureLoad(sigma_tex,  coord, 0).r;
  let rho    = textureLoad(rho_tex,    coord, 0).r;
  let lambda = textureLoad(lambda_tex, coord, 0).r;

  // Deep space background — navy/black like the reference
  let bg = vec3<f32>(0.008, 0.012, 0.042);

  // Teal/cyan arch glow from positive σ field (the portal structure)
  let sigma_pos  = max(sigma, 0.0);
  let teal_arch  = vec3<f32>(0.08, 0.82, 0.88) * pow(sigma_pos * 0.5 + 0.0, 1.4) * 1.1;

  // Purple/violet nebula from λ memory field (lingering plasma clouds)
  let lambda_pos = max(lambda, 0.0);
  let violet_neb = vec3<f32>(0.52, 0.12, 0.92) * pow(lambda_pos * 0.8, 1.2) * 0.9;

  // Gold/amber particle streams from ρ gradient edges (foreground wave streams)
  let gold_stream = vec3<f32>(1.00, 0.70, 0.08) * pow(rho, 1.8) * 2.2;

  // Iridescent rim where σ transitions through zero (arch edge glow)
  let sigma_abs  = abs(sigma);
  let rim_mask   = exp(-sigma_abs * sigma_abs * 4.0);
  let iridescent = vec3<f32>(0.55, 0.90, 0.95) * rim_mask * 0.6;

  // Combine additively — cosmic bloom
  let hdr = bg + teal_arch + violet_neb + gold_stream + iridescent;

  // Reinhard tonemapping
  let mapped = hdr / (hdr + vec3<f32>(1.0));

  // Gamma correction (2.2)
  let gamma = pow(clamp(mapped, vec3<f32>(0.0), vec3<f32>(1.0)), vec3<f32>(1.0 / 2.2));

  return vec4<f32>(gamma, 1.0);
}
