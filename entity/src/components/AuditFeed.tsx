import { useState, useEffect, useRef } from 'react'
import { readTokenLedger, readSnapshot, truncHash, formatTs } from '../lib/ledger.js'
import type { ProofToken, LedgerSnapshot } from '../lib/ledger.js'
import { ScrollText, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

const PHI = (Math.sqrt(5) - 1) / 2

function AuditRow({ token, prev }: { token: ProofToken; prev: ProofToken | undefined }) {
  return (
    <div className={`border-b border-e-border/40 px-4 py-2.5 hover:bg-e-raised/50 transition-colors
      ${!token.ccil_valid ? 'border-l-2 border-l-e-red' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {token.ccil_valid
          ? <CheckCircle2 size={11} className="text-e-green shrink-0" />
          : <XCircle size={11} className="text-e-red shrink-0" />
        }
        <span className="text-[10px] font-mono text-e-muted">{formatTs(token.timestamp_ms)}</span>
        <span className="text-[9px] font-mono text-e-dim uppercase">{token.product}</span>
        <span className="ml-auto text-[9px] font-mono text-e-dim">{token.record.backend}</span>
        <span className="text-[9px] font-mono text-e-dim">{token.record.latency_ms}ms</span>
      </div>

      {/* Hash chain */}
      <div className="flex items-center gap-1 text-[9px] font-mono overflow-hidden">
        <span className="text-e-muted shrink-0">prev</span>
        <span className="text-e-dim">{truncHash(token.prev_token_id, 5)}</span>
        <ArrowRight size={8} className="text-e-dim shrink-0" />
        <span className="text-e-amber">{truncHash(token.token_id, 5)}</span>
        {prev && prev.token_id !== token.prev_token_id && (
          <span className="text-e-red ml-1">CHAIN BREAK</span>
        )}
      </div>

      {/* Hashes row */}
      <div className="flex items-center gap-3 mt-0.5 text-[9px] font-mono text-e-dim">
        <span>p:{truncHash(token.record.prompt_hash, 4)}</span>
        <span>r:{truncHash(token.record.response_hash, 4)}</span>
        <span>c:{truncHash(token.chain_hash, 4)}</span>
        <span className="ml-auto">{token.record.model.split('/').pop()}</span>
      </div>
    </div>
  )
}

function SessionStats({ snap, tokens }: { snap: LedgerSnapshot | null; tokens: ProofToken[] }) {
  if (!snap && tokens.length === 0) return null
  const total = snap?.total_calls ?? tokens.length
  const approved = snap?.approved_calls ?? tokens.filter(t => t.ccil_valid).length
  const ratio = total > 0 ? approved / total : 0
  const anchored = ratio <= PHI || total === 0
  const pct = Math.round(ratio * 100)
  const fill = Math.round((ratio / PHI) * 100)

  return (
    <div className="px-4 py-2.5 border-b border-e-border bg-e-raised/30 flex items-center gap-4">
      <div className="flex items-center gap-2 text-[10px] font-mono">
        <span className="text-e-muted">CCIL</span>
        <span className={anchored ? 'text-e-green' : 'text-e-red'}>{approved}/{total}</span>
        <span className="text-e-muted">({pct}%)</span>
      </div>

      {/* φ gauge */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-[9px] font-mono text-e-muted shrink-0">φ-meter</span>
        <div className="flex-1 h-1.5 bg-e-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${anchored ? 'bg-e-green' : 'bg-e-red'}`}
            style={{ width: `${Math.min(fill, 100)}%` }}
          />
        </div>
        <span className={`text-[9px] font-mono shrink-0 ${anchored ? 'text-e-green' : 'text-e-red'}`}>
          {ratio.toFixed(3)} / {PHI.toFixed(3)}
        </span>
      </div>

      <div className={`text-[9px] font-mono ${anchored ? 'text-e-green' : 'text-e-red'}`}>
        {anchored ? '✓ ANCHORED' : '⚠ EXCEEDED'}
      </div>
    </div>
  )
}

export function AuditFeed() {
  const [tokens, setTokens] = useState<ProofToken[]>([])
  const [snap, setSnap] = useState<LedgerSnapshot | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    const refresh = () => {
      setTokens(readTokenLedger())
      setSnap(readSnapshot())
    }
    refresh()
    const id = setInterval(refresh, 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tokens, autoScroll])

  const reversed = [...tokens].reverse()

  return (
    <div className="flex flex-col h-full bg-e-bg overflow-hidden">
      {/* Pane header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-e-border shrink-0 bg-e-surface">
        <ScrollText size={12} className="text-e-amber" />
        <span className="text-[10px] font-mono text-e-muted uppercase tracking-widest">Constitutional Audit</span>
        <span className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setAutoScroll(v => !v)}
            className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors
              ${autoScroll
                ? 'border-e-amber text-e-amber'
                : 'border-e-border text-e-muted hover:border-e-text hover:text-e-text'}`}
          >
            {autoScroll ? 'AUTO ↓' : 'MANUAL'}
          </button>
        </span>
      </div>

      {/* Stats bar */}
      <SessionStats snap={snap} tokens={tokens} />

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-e-muted">
            <div className="w-12 h-12 rounded-full border border-e-border flex items-center justify-center">
              <ScrollText size={20} className="text-e-dim" />
            </div>
            <div className="text-center">
              <div className="text-xs font-mono text-e-muted mb-1">Audit chain empty</div>
              <div className="text-[10px] font-mono text-e-dim">
                Use a commercial tool to generate the first constitutional call
              </div>
            </div>
          </div>
        ) : (
          <>
            {reversed.map((t, i) => (
              <AuditRow
                key={t.token_id}
                token={t}
                prev={reversed[i + 1]}
              />
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Bottom status */}
      <div className="px-4 py-2 border-t border-e-border bg-e-surface shrink-0 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-e-amber animate-pulse" />
        <span className="text-[9px] font-mono text-e-muted">
          Live · refreshes every 2s · {tokens.length} records in chain
        </span>
      </div>
    </div>
  )
}
