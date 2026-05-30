import { initGPU } from './engine/gpu.js'
import { configureCanvas, resizeCanvas } from './engine/device.js'
import { SimulationEngine } from './engine/simulation.js'
import { ScrollController } from './ui/scroll.js'
import { SystemPanel } from './ui/systemPanel.js'
import { ShaderView } from './ui/shaderView.js'
import { Navigation } from './ui/navigation.js'
import { StateOverlay } from './ui/stateOverlay.js'

export class App {
  private sim!: SimulationEngine
  private scroll!: ScrollController
  private panel!: SystemPanel
  private nav!: Navigation
  private overlay!: StateOverlay
  private running = false
  private rafId   = 0

  async init(): Promise<void> {
    const { device } = await initGPU()

    // ShaderView must come first — it sets canvas dimensions
    this.scroll  = new ScrollController()
    this.panel   = new SystemPanel()
    this.nav     = new Navigation()
    this.overlay = new StateOverlay()

    // ShaderView wires canvas sizing and notifies us on resize
    const view = new ShaderView((w, h) => {
      // Canvas context reconfiguration on resize (simulation stays 1024×1024)
      if (this.sim) {
        resizeCanvas(ctx, view.canvas, w, h)
      }
    })

    const ctx = configureCanvas(device, view.canvas)

    this.sim = await SimulationEngine.create(ctx)
  }

  start(): void {
    if (this.running) return
    this.running = true
    const loop = (): void => {
      const params = this.scroll.getParams()
      this.sim.tick(params)
      const state = this.sim.getFrameState()
      // Update UI every frame (DOM writes are cheap — only text content)
      this.panel.update(state, this.scroll.getScrollFraction())
      this.nav.updateFrame(state.frame)
      this.overlay.update(state)
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  stop(): void {
    this.running = false
    cancelAnimationFrame(this.rafId)
  }
}
