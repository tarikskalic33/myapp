import type { FrameState } from '../engine/simulation.js'

export class SystemPanel {
  private readonly elFrame:  HTMLElement
  private readonly elDt:     HTMLElement
  private readonly elLambda: HTMLElement
  private readonly elSigma:  HTMLElement
  private readonly elScroll: HTMLElement
  private readonly elRho:    HTMLElement

  constructor() {
    this.elFrame  = this.el('val-frame')
    this.elDt     = this.el('val-dt')
    this.elLambda = this.el('val-lambda')
    this.elSigma  = this.el('val-sigma')
    this.elScroll = this.el('val-scroll')
    this.elRho    = this.el('val-rho')
  }

  private el(id: string): HTMLElement {
    const el = document.getElementById(id)
    if (!el) throw new Error(`SystemPanel: element #${id} not found`)
    return el
  }

  update(state: FrameState, scrollFraction: number): void {
    this.elFrame.textContent  = String(state.frame)
    this.elDt.textContent     = state.dt.toFixed(4)
    this.elLambda.textContent = state.lambdaInfluence.toFixed(3)
    this.elSigma.textContent  = state.sigmaPerturb.toFixed(4)
    this.elScroll.textContent = scrollFraction.toFixed(3)
    // ρ is derived: gradient magnitude ~ |sigmaPerturb| smoothstepped
    const rhoEst = Math.min(Math.abs(state.sigmaPerturb) / 0.05, 1.0) * 0.25
    this.elRho.textContent = rhoEst.toFixed(4)
  }
}
