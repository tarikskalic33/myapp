export interface TelemetryData {
  pgcs_passes: boolean
  failsafe_state: string
  corruption_count: number
  calibrator_passes_100k: boolean
  avg_vcg_error: number
  drift_index: number
  epoch: number
}

export type TelemetryState =
  | { status: 'offline' }
  | { status: 'error'; message: string }
  | { status: 'online'; data: TelemetryData }

const BRIDGE_URL = (import.meta.env.VITE_BRIDGE_URL as string | undefined) ?? 'http://localhost:7890'

export function subscribeTelemetry(cb: (s: TelemetryState) => void): () => void {
  let active = true
  async function poll() {
    if (!active) return
    try {
      const res = await fetch(`${BRIDGE_URL}/telemetry`, { signal: AbortSignal.timeout(3000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as TelemetryData
      if (active) cb({ status: 'online', data })
    } catch {
      if (active) cb({ status: 'offline' })
    }
  }
  void poll()
  const id = setInterval(() => void poll(), 5000)
  return () => { active = false; clearInterval(id) }
}
