import { useState, useEffect } from 'react'
import { subscribeTelemetry } from '../lib/telemetry.js'
import type { TelemetryState } from '../lib/telemetry.js'
import { Activity, WifiOff, Gauge } from 'lucide-react'

function Indicator({ ok, label, value }: { ok: boolean; label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-e-border/40 last:border-0">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ok ? 'bg-e-green' : 'bg-e-red animate-pulse'}`} />
        <span className="text-[10px] font-mono text-e-muted">{label}</span>
      </div>
      {value !== undefined && (
        <span className={`text-[10px] font-mono ${ok ? 'text-e-text' : 'text-e-red'}`}>{value}</span>
      )}
      {value === undefined && (
        <span className={`text-[10px] font-mono ${ok ? 'text-e-green' : 'text-e-red'}`}>
          {ok ? 'PASS' : 'FAIL'}
        </span>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-e-border/40 last:border-0">
      <span className="text-[10px] font-mono text-e-muted">{label}</span>
      <span className="text-[10px] font-mono text-e-text tabular-nums">{value}</span>
    </div>
  )
}

function VcgGauge({ error }: { error: number }) {
  const pct = Math.min(error * 1000, 100)
  const good = error < 0.01
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-e-muted uppercase tracking-wider">VCG error</span>
        <span className={`text-[10px] font-mono tabular-nums ${good ? 'text-e-green' : 'text-e-amber'}`}>
          {error.toFixed(4)}
        </span>
      </div>
      <div className="h-1 bg-e-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${good ? 'bg-e-green' : 'bg-e-amber'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function DriftGauge({ drift }: { drift: number }) {
  const pct = Math.min(drift * 500, 100)
  const good = drift < 0.05
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-e-muted uppercase tracking-wider">Drift index</span>
        <span className={`text-[10px] font-mono tabular-nums ${good ? 'text-e-green' : 'text-e-amber'}`}>
          {drift.toFixed(4)}
        </span>
      </div>
      <div className="h-1 bg-e-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${good ? 'bg-e-green' : 'bg-e-amber'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function TelemetryPane() {
  const [state, setState] = useState<TelemetryState>({ status: 'offline' })
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)

  useEffect(() => {
    return subscribeTelemetry(s => {
      setState(s)
      if (s.status === 'online') setLastUpdate(Date.now())
    })
  }, [])

  return (
    <div className="flex flex-col h-full bg-e-surface overflow-hidden">
      {/* Pane header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-e-border shrink-0">
        <Activity size={12} className="text-e-amber" />
        <span className="text-[10px] font-mono text-e-muted uppercase tracking-widest">Runtime</span>
        <span className="ml-auto">
          {state.status === 'online'
            ? <span className="w-1.5 h-1.5 rounded-full bg-e-green inline-block animate-pulse-slow" />
            : <span className="w-1.5 h-1.5 rounded-full bg-e-muted inline-block" />
          }
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Bridge status */}
        <div className={`rounded border px-3 py-2 flex items-center gap-2
          ${state.status === 'online'
            ? 'border-e-green/30 bg-e-green/5'
            : 'border-e-border bg-e-raised'}`}
        >
          {state.status === 'online'
            ? <span className="w-2 h-2 rounded-full bg-e-green animate-pulse-slow" />
            : <WifiOff size={12} className="text-e-muted" />
          }
          <span className={`text-[10px] font-mono ${state.status === 'online' ? 'text-e-green' : 'text-e-muted'}`}>
            {state.status === 'online' ? 'Bridge online' : 'Bridge offline'}
          </span>
          {lastUpdate && (
            <span className="ml-auto text-[9px] font-mono text-e-dim">
              {Math.round((Date.now() - lastUpdate) / 1000)}s ago
            </span>
          )}
        </div>

        {state.status === 'online' ? (
          <>
            {/* Gate indicators */}
            <div className="rounded border border-e-border bg-e-raised p-3 space-y-0">
              <div className="text-[9px] font-mono text-e-muted uppercase tracking-widest mb-2">Gates</div>
              <Indicator ok={state.data.pgcs_passes} label="PGCS" />
              <Indicator
                ok={state.data.failsafe_state === 'nominal'}
                label="Failsafe"
                value={state.data.failsafe_state}
              />
              <Indicator
                ok={state.data.corruption_count === 0}
                label="Corruption"
                value={String(state.data.corruption_count)}
              />
              <Indicator ok={state.data.calibrator_passes_100k} label="Calibrator 100k" />
            </div>

            {/* Metrics */}
            <div className="rounded border border-e-border bg-e-raised p-3 space-y-0">
              <div className="text-[9px] font-mono text-e-muted uppercase tracking-widest mb-2">Metrics</div>
              <Metric label="Epoch" value={String(state.data.epoch)} />
            </div>

            {/* Gauges */}
            <div className="rounded border border-e-border bg-e-raised p-3 space-y-3">
              <div className="text-[9px] font-mono text-e-muted uppercase tracking-widest">Gauges</div>
              <VcgGauge error={state.data.avg_vcg_error} />
              <DriftGauge drift={state.data.drift_index} />
            </div>

            {/* Overall health */}
            {(() => {
              const healthy =
                state.data.pgcs_passes &&
                state.data.failsafe_state === 'nominal' &&
                state.data.corruption_count === 0 &&
                state.data.calibrator_passes_100k
              return (
                <div className={`rounded border px-3 py-2.5 text-center
                  ${healthy ? 'border-e-green/40 bg-e-green/5' : 'border-e-red/40 bg-e-red/5'}`}
                >
                  <div className={`text-sm font-mono font-bold tracking-widest ${healthy ? 'text-e-green' : 'text-e-red'}`}>
                    {healthy ? '✓ NOMINAL' : '⚠ DEGRADED'}
                  </div>
                  <div className="text-[9px] font-mono text-e-muted mt-0.5">
                    sovereign-omega-v2
                  </div>
                </div>
              )
            })()}
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-3 py-6 text-e-muted">
              <Gauge size={28} className="text-e-dim" />
              <div className="text-center">
                <div className="text-xs font-mono mb-1">Runtime offline</div>
                <div className="text-[10px] font-mono text-e-dim leading-relaxed">
                  Start bridge.py on the governance server.<br />
                  <span className="text-e-amber">POST localhost:7890/telemetry</span>
                </div>
              </div>
            </div>

            {/* Setup hint */}
            <div className="rounded border border-e-border bg-e-raised p-3 text-[9px] font-mono text-e-dim space-y-1">
              <div className="text-e-muted mb-1">Connect runtime:</div>
              <div>cd sovereign-omega-v2</div>
              <div>python python/bridge.py</div>
              <div className="text-e-amber mt-2">VITE_BRIDGE_URL=http://your-server:7890</div>
            </div>
          </div>
        )}
      </div>

      {/* Poll interval note */}
      <div className="px-4 py-2 border-t border-e-border shrink-0 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-e-dim" />
        <span className="text-[9px] font-mono text-e-muted">Polls every 5s</span>
      </div>
    </div>
  )
}
