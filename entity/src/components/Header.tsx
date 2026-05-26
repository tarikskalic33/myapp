import { useState, useEffect } from 'react'
import { readTokenLedger, readSnapshot, truncHash } from '../lib/ledger.js'

const PHI = (Math.sqrt(5) - 1) / 2  // ≈ 0.618

export function Header() {
  const [tip, setTip] = useState('')
  const [total, setTotal] = useState(0)
  const [ratio, setRatio] = useState(0)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const refresh = () => {
      const tokens = readTokenLedger()
      const snap = readSnapshot()
      if (tokens.length > 0) {
        setTip(tokens[tokens.length - 1].token_id)
      } else if (snap?.chain_hash) {
        setTip(snap.chain_hash)
      }
      if (snap) {
        setTotal(snap.total_calls)
        setRatio(snap.total_calls > 0 ? snap.approved_calls / snap.total_calls : 0)
      }
      setTick(t => t + 1)
    }
    refresh()
    const id = setInterval(refresh, 2000)
    return () => clearInterval(id)
  }, [])

  const anchored = ratio <= PHI || total === 0
  const _ = tick  // suppress unused warning

  return (
    <header className="flex items-center gap-6 px-5 py-3 border-b border-e-border bg-e-surface shrink-0 select-none">
      {/* Identity */}
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-e-amber opacity-50" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-e-amber" />
        </span>
        <span className="text-e-amber font-mono font-bold text-base tracking-[0.2em] animate-glow">
          AEGIS-Ω
        </span>
        <span className="text-e-muted font-mono text-[10px] tracking-widest">
          SOVEREIGN INTELLIGENCE
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Chain tip */}
      {tip && (
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-e-muted">TIP</span>
          <span className="text-e-amber tracking-wider">{truncHash(tip, 10)}</span>
        </div>
      )}

      {/* Call counter */}
      <div className="flex items-center gap-2 text-[10px] font-mono">
        <span className="text-e-muted">CALLS</span>
        <span className="text-e-text tabular-nums">{total}</span>
      </div>

      {/* Martingale */}
      <div className="flex items-center gap-2 text-[10px] font-mono">
        <span className="text-e-muted">φ-BOUND</span>
        <span className={anchored ? 'text-e-green' : 'text-e-red'}>
          {total > 0 ? ratio.toFixed(3) : '—'}
          {' '}/{' '}
          {PHI.toFixed(3)}
        </span>
        <span className={`w-1.5 h-1.5 rounded-full ${anchored ? 'bg-e-green' : 'bg-e-red animate-pulse'}`} />
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-e-green">
        <span className="w-1.5 h-1.5 rounded-full bg-e-green animate-pulse-slow" />
        ACTIVE
      </div>
    </header>
  )
}
