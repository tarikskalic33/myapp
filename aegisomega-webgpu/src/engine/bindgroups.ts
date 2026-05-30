import { GPU_BUFFER_USAGE } from './constants.js'
import type { ComputePipelines, RenderPipelineSet } from './pipelines.js'
import type { PingPongField } from './textures.js'

// Uniforms layout: 32 bytes
// offset 0 : dt               (f32)
// offset 4 : frame            (u32)
// offset 8 : lambda_influence (f32)
// offset 12: sigma_perturb    (f32)
// offset 16: width            (u32)
// offset 20: height           (u32)
// offset 24: _pad0            (u32)
// offset 28: _pad1            (u32)
export const UNIFORMS_SIZE = 32

export function createUniformBuffer(device: GPUDevice): GPUBuffer {
  return device.createBuffer({
    label: 'uniforms',
    size: UNIFORMS_SIZE,
    usage: GPU_BUFFER_USAGE.UNIFORM | GPU_BUFFER_USAGE.COPY_DST,
  })
}

export function writeUniforms(
  device: GPUDevice,
  buffer: GPUBuffer,
  dt: number,
  frame: number,
  lambdaInfluence: number,
  sigmaPerturb: number,
  width: number,
  height: number,
): void {
  const ab  = new ArrayBuffer(UNIFORMS_SIZE)
  const f32 = new Float32Array(ab)
  const u32 = new Uint32Array(ab)
  f32[0] = dt
  u32[1] = frame >>> 0
  f32[2] = lambdaInfluence
  f32[3] = sigmaPerturb
  u32[4] = width >>> 0
  u32[5] = height >>> 0
  device.queue.writeBuffer(buffer, 0, ab)
}

// ---------------------------------------------------------------------------
// Sigma bind groups — 4 bindings: @0 sigma_in, @1 sigma_out, @2 lambda_in, @3 uniforms
// ---------------------------------------------------------------------------
export interface SigmaBindGroups {
  readonly atob: GPUBindGroup
  readonly btoa: GPUBindGroup
}

export function createSigmaBindGroups(
  device: GPUDevice,
  pipelines: ComputePipelines,
  sigma: PingPongField,
  lambda: PingPongField,
  uniforms: GPUBuffer,
): SigmaBindGroups {
  const layout = pipelines.sigma.getBindGroupLayout(0)
  const make = (sigIn: GPUTexture, sigOut: GPUTexture, lamIn: GPUTexture): GPUBindGroup =>
    device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: sigIn.createView() },
        { binding: 1, resource: sigOut.createView() },
        { binding: 2, resource: lamIn.createView() },
        { binding: 3, resource: { buffer: uniforms } },
      ],
    })
  return Object.freeze({
    atob: make(sigma.a, sigma.b, lambda.a),
    btoa: make(sigma.b, sigma.a, lambda.b),
  })
}

// ---------------------------------------------------------------------------
// Rho bind groups — 3 bindings: @0 sigma_in, @1 rho_out, @2 uniforms
// ---------------------------------------------------------------------------
export interface RhoBindGroups {
  readonly atob: GPUBindGroup
  readonly btoa: GPUBindGroup
}

export function createRhoBindGroups(
  device: GPUDevice,
  pipelines: ComputePipelines,
  sigma: PingPongField,
  rho: PingPongField,
  uniforms: GPUBuffer,
): RhoBindGroups {
  const layout = pipelines.rho.getBindGroupLayout(0)
  const make = (sigIn: GPUTexture, rhoOut: GPUTexture): GPUBindGroup =>
    device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: sigIn.createView() },
        { binding: 1, resource: rhoOut.createView() },
        { binding: 2, resource: { buffer: uniforms } },
      ],
    })
  return Object.freeze({
    atob: make(sigma.b, rho.b),
    btoa: make(sigma.a, rho.a),
  })
}

// ---------------------------------------------------------------------------
// Lambda bind groups — 4 bindings: @0 lambda_in, @1 lambda_out, @2 sigma_in, @3 uniforms
// ---------------------------------------------------------------------------
export interface LambdaBindGroups {
  readonly atob: GPUBindGroup
  readonly btoa: GPUBindGroup
}

export function createLambdaBindGroups(
  device: GPUDevice,
  pipelines: ComputePipelines,
  lambda: PingPongField,
  sigma: PingPongField,
  uniforms: GPUBuffer,
): LambdaBindGroups {
  const layout = pipelines.lambda.getBindGroupLayout(0)
  const make = (lamIn: GPUTexture, lamOut: GPUTexture, sigIn: GPUTexture): GPUBindGroup =>
    device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: lamIn.createView() },
        { binding: 1, resource: lamOut.createView() },
        { binding: 2, resource: sigIn.createView() },
        { binding: 3, resource: { buffer: uniforms } },
      ],
    })
  return Object.freeze({
    atob: make(lambda.a, lambda.b, sigma.b),
    btoa: make(lambda.b, lambda.a, sigma.a),
  })
}

// ---------------------------------------------------------------------------
// Render bind groups — 4 bindings: @0 sigma, @1 rho, @2 lambda, @3 uniforms
// ---------------------------------------------------------------------------
export interface RenderBindGroups {
  readonly readB: GPUBindGroup
  readonly readA: GPUBindGroup
}

export function createRenderBindGroups(
  device: GPUDevice,
  pipelines: RenderPipelineSet,
  sigma: PingPongField,
  rho: PingPongField,
  lambda: PingPongField,
  uniforms: GPUBuffer,
): RenderBindGroups {
  const layout = pipelines.render.getBindGroupLayout(0)
  const make = (sig: GPUTexture, r: GPUTexture, lam: GPUTexture): GPUBindGroup =>
    device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: sig.createView() },
        { binding: 1, resource: r.createView() },
        { binding: 2, resource: lam.createView() },
        { binding: 3, resource: { buffer: uniforms } },
      ],
    })
  return Object.freeze({
    readB: make(sigma.b, rho.b, lambda.b),
    readA: make(sigma.a, rho.a, lambda.a),
  })
}
