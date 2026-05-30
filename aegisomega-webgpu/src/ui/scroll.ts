import type { SimParams } from '../engine/simulation.js'

export class ScrollController {
  private scrollY = 0
  private maxScroll = 1

  constructor() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY
      this.maxScroll = Math.max(
        document.body.scrollHeight - window.innerHeight,
        1,
      )
    }, { passive: true })
  }

  getParams(): SimParams {
    const fraction = Math.min(this.scrollY / this.maxScroll, 1.0)
    // lambdaInfluence: [0.5, 2.0] — scroll amplifies memory persistence
    const lambdaInfluence = 0.5 + fraction * 1.5
    // sigmaPerturb: oscillates ±0.05 — injects variation at scroll frequency
    const sigmaPerturb = Math.sin(this.scrollY * 0.001) * 0.05
    return Object.freeze({ lambdaInfluence, sigmaPerturb })
  }

  getScrollFraction(): number {
    return Math.min(this.scrollY / this.maxScroll, 1.0)
  }
}
