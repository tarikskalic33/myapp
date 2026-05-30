// layout.ts — handles "no WebGPU" fallback visibility
export function showNoWebGPU(): void {
  const el = document.getElementById('no-webgpu')
  if (el) {
    el.removeAttribute('hidden')
    const canvas = document.getElementById('gpu-canvas')
    if (canvas) canvas.setAttribute('hidden', '')
  }
}
