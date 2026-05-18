import { useState, useEffect } from 'react'
import { Activity, ChevronDown, ChevronUp, WifiOff } from 'lucide-react'
import { subscribeTelemetry, type TelemetryState } from '../lib/telemetry.js'

function Indicator({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between text-xs py-0.5">
      <span className="text-aegis-muted">{label}</span>
      <span className={ok ? 'text-green-400' : 'text-red-400'}>
        {ok ? '●' : '●'}
      </span>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs py-0.5">
      <span className="text-aegis-muted">{label}</span>
      <span className="text-aegis-text font-mono">{value}</span>
    </div>
  )
}

export function TelemetryPanel() {
  const [state, setState] = useState<TelemetryState>({ status: 'offline' })
  const [open, setOpen] = useState(true)

  useEffect(() => subscribeTelemetry(setState), [])

  return (
    <div className="border-t border-aegis-border">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-aegis-muted hover:text-aegis-text transition-colors"
        aria-label="Toggle runtime telemetry panel"
      >
        <div className="flex items-center gap-1.5">
          <Activity size={12} />
          <span className="font-medium">Runtime</span>
          {state.status === 'online' && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          )}
          {state.status === 'offline' && (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          )}
        </div>
        {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
      </button>

      {open && (
        <div className="px-3 pb-3">
          {state.status === 'offline' && (
            <div className="flex items-center gap-1.5 text-xs text-aegis-muted py-1">
              <WifiOff size={12} />
              <span>Runtime offline</span>
            </div>
          )}

          {state.status === 'error' && (
            <div className="text-xs text-red-400 py-1">{state.message}</div>
          )}

          {state.status === 'online' && (
            <div className="space-y-0.5">
              <Indicator ok={state.data.pgcs_passes} label="PGCS" />
              <Indicator
                ok={state.data.failsafe_state === 'nominal'}
                label={`Failsafe (${state.data.failsafe_state})`}
              />
              <Indicator ok={state.data.corruption_count === 0} label="Epoch integrity" />
              <Indicator ok={state.data.calibrator_passes_100k} label="Calibrator 100k" />
              <div className="border-t border-aegis-border mt-1 pt-1">
                <Metric label="VCG error" value={state.data.avg_vcg_error.toFixed(4)} />
                <Metric label="Drift index" value={state.data.drift_index.toFixed(4)} />
                <Metric label="Epoch" value={String(state.data.epoch)} />
                <Metric label="Corruptions" value={String(state.data.corruption_count)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
