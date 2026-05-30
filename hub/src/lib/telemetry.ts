// Optional live bridge overlay. Polls VITE_BRIDGE_URL every 5s; silent fallback when absent.
import { useEffect, useRef, useState } from 'react'
import type { AutonodeDescriptor } from '@shared/lib/autonode.js'

export type { AutonodeDescriptor }

export interface TelemetrySnapshot {
  readonly sequence: number
  readonly epoch: number
  readonly pgcs_passes: boolean
  readonly vcg_error: number
  readonly drift_index: number
  readonly corruption_count: number
  readonly gate_acceptance_rate: number
  readonly failsafe_state: string
  readonly timestamp_ms: number
}

export interface ResonanceSnapshot {
  readonly is_resonant: boolean
  readonly is_certified: boolean
  readonly phi_convergent: boolean
  readonly resonance_coefficient: number
  readonly ring_valid: boolean
  readonly sequence: number
  readonly epoch: number
}

export interface BridgeState {
  readonly node: AutonodeDescriptor | null
  readonly telemetry: TelemetrySnapshot | null
  readonly resonance: ResonanceSnapshot | null
}

const POLL_MS = 5000

const rawBridgeUrl: unknown = import.meta.env['VITE_BRIDGE_URL']
const BRIDGE_URL: string | undefined =
  typeof rawBridgeUrl === 'string' && rawBridgeUrl.length > 0 ? rawBridgeUrl : undefined

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4_000) })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function useBridgeTelemetry(): BridgeState {
  const [bridgeState, setBridgeState] = useState<BridgeState>({
    node: null,
    telemetry: null,
    resonance: null,
  })
  const mountedRef = useRef(true)

  useEffect(() => {
    if (!BRIDGE_URL) return

    const base = BRIDGE_URL.replace(/\/$/, '')
    const poll = async () => {
      const [node, telemetry, resonance] = await Promise.all([
        safeFetch<AutonodeDescriptor>(`${base}/node`),
        safeFetch<TelemetrySnapshot>(`${base}/telemetry`),
        safeFetch<ResonanceSnapshot>(`${base}/resonance`),
      ])
      if (mountedRef.current) {
        setBridgeState({ node, telemetry, resonance })
      }
    }

    void poll()
    const id = setInterval(() => { void poll() }, POLL_MS)
    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [])

  return bridgeState
}
