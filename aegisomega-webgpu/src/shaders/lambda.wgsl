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

@group(0) @binding(0) var lambda_in : texture_2d<f32>;
@group(0) @binding(1) var lambda_out: texture_storage_2d<rgba32float, write>;
@group(0) @binding(2) var sigma_in  : texture_2d<f32>;
@group(0) @binding(3) var<uniform> u: Uniforms;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= u.width || gid.y >= u.height) { return; }
  let coord  = vec2<i32>(gid.xy);
  let lambda = textureLoad(lambda_in, coord, 0).r;
  let sigma  = textureLoad(sigma_in,  coord, 0).r;
  // λ' = λ * 0.995 + σ * 0.01 * scroll_lambda_influence
  let next = lambda * 0.995 + sigma * 0.01 * u.lambda_influence;
  textureStore(lambda_out, coord, vec4<f32>(next, 0.0, 0.0, 1.0));
}
