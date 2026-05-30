export async function initGPU(): Promise<{ adapter: GPUAdapter; device: GPUDevice }> {
  if (!navigator.gpu) {
    throw new Error('WebGPU not available — navigator.gpu is undefined')
  }
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' })
  if (!adapter) {
    throw new Error('WebGPU adapter not found — hardware may not support WebGPU')
  }
  const device = await adapter.requestDevice({
    label: 'aegis-simulation-device',
  })
  device.lost.then(info => {
    console.error('WebGPU device lost:', info.message, info.reason)
  })
  return { adapter, device }
}
