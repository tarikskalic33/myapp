// Navigation bar is static HTML; this module adds dynamic frame counter to nav sub-text.
export class Navigation {
  private readonly subEl: HTMLElement | null

  constructor() {
    this.subEl = document.querySelector('.nav-sub')
  }

  updateFrame(frame: number): void {
    if (this.subEl) {
      this.subEl.textContent = `σ/ρ/λ Field Engine · frame ${frame}`
    }
  }
}
