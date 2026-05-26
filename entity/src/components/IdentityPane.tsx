import { useState, useEffect } from 'react'
import { readTokenLedger, truncHash, formatTs, genesisId } from '../lib/ledger.js'
import type { ProofToken } from '../lib/ledger.js'
import { ShieldCheck, Link2, Clock, Cpu } from 'lucide-react'

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1 border-b border-e-border/50 last:border-0">
      <span className="text-e-muted text-[10px] font-mono uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-[10px] font-mono text-right break-all leading-relaxed ${accent ? 'text-e-amber' : 'text-e-text'}`}>
        {value}
      </span>
    </div>
  )
}

function TokenNode({ token, index, isLast }: { token: ProofToken; index: number; isLast: boolean }) {
  return (
    <div className="relative pl-5">
      {/* chain line */}
      {!isLast && (
        <div className="absolute left-[7px] top-5 bottom-0 w-px bg-e-border" />
      )}
      {/* node dot */}
      <div className={`absolute left-0 top-2 w-3.5 h-3.5 rounded-full border flex items-center justify-center
        ${token.ccil_valid
          ? 'border-e-green bg-e-green/10'
          : 'border-e-red bg-e-red/10'}`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${token.ccil_valid ? 'bg-e-green' : 'bg-e-red'}`} />
      </div>

      <div className="pb-3">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[9px] font-mono text-e-muted uppercase">{token.product}</span>
          <span className="text-[9px] font-mono text-e-muted">{formatTs(token.timestamp_ms)}</span>
        </div>
        <div className="text-[10px] font-mono text-e-amber tracking-wider">
          {truncHash(token.token_id, 6)}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] font-mono ${token.ccil_valid ? 'text-e-green' : 'text-e-red'}`}>
            {token.ccil_valid ? 'CCIL ✓' : 'CCIL ✗'}
          </span>
          <span className="text-[9px] font-mono text-e-muted">{token.record.backend}</span>
          <span className="text-[9px] font-mono text-e-muted">{token.record.latency_ms}ms</span>
        </div>
        {index === 0 && (
          <div className="text-[9px] font-mono text-e-amber/50 mt-0.5">← genesis</div>
        )}
      </div>
    </div>
  )
}

export function IdentityPane() {
  const [tokens, setTokens] = useState<ProofToken[]>([])
  const [genesis, setGenesis] = useState('')

  useEffect(() => {
    void genesisId().then(setGenesis)
  }, [])

  useEffect(() => {
    const refresh = () => setTokens(readTokenLedger())
    refresh()
    const id = setInterval(refresh, 2000)
    return () => clearInterval(id)
  }, [])

  const recent = tokens.slice(-8).reverse()

  return (
    <div className="flex flex-col h-full bg-e-surface overflow-hidden">
      {/* Pane header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-e-border shrink-0">
        <ShieldCheck size={12} className="text-e-amber" />
        <span className="text-[10px] font-mono text-e-muted uppercase tracking-widest">Identity</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
        {/* Entity card */}
        <div className="rounded border border-e-border bg-e-raised p-3 space-y-1">
          <div className="text-e-amber text-xs font-mono font-semibold tracking-widest mb-2">AEGIS-Ω</div>
          <Row label="Schema" value="CCIL-Ψ v1.0.0" />
          <Row label="Bound" value="φ⁻¹ = 0.6180" accent />
          <Row label="Tokens" value={String(tokens.length)} />
          {genesis && <Row label="Genesis" value={truncHash(genesis, 10)} accent />}
          {tokens.length > 0 && (
            <Row label="Chain tip" value={truncHash(tokens[tokens.length - 1].token_id, 10)} accent />
          )}
        </div>

        {/* Proof chain */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Link2 size={10} className="text-e-muted" />
            <span className="text-[10px] font-mono text-e-muted uppercase tracking-widest">Proof chain</span>
            <span className="ml-auto text-[9px] font-mono text-e-dim">{tokens.length} tokens</span>
          </div>

          {tokens.length === 0 ? (
            <div className="text-[10px] font-mono text-e-muted italic">
              No tokens yet. Constitutional calls will mint here.
            </div>
          ) : (
            <div>
              {recent.map((t, i) => (
                <TokenNode key={t.token_id} token={t} index={tokens.length - 1 - i} isLast={i === recent.length - 1} />
              ))}
              {tokens.length > 8 && (
                <div className="text-[9px] font-mono text-e-dim pl-5">
                  + {tokens.length - 8} earlier tokens
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product distribution */}
        {tokens.length > 0 && (() => {
          const counts: Record<string, number> = {}
          for (const t of tokens) counts[t.product] = (counts[t.product] ?? 0) + 1
          return (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Cpu size={10} className="text-e-muted" />
                <span className="text-[10px] font-mono text-e-muted uppercase tracking-widest">Products</span>
              </div>
              {Object.entries(counts).map(([p, n]) => (
                <div key={p} className="flex items-center gap-2 py-0.5">
                  <span className="text-[9px] font-mono text-e-muted w-28 truncate">{p}</span>
                  <div className="flex-1 h-1 bg-e-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-e-amber rounded-full"
                      style={{ width: `${(n / tokens.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-e-text w-4 text-right">{n}</span>
                </div>
              ))}
            </div>
          )
        })()}

        {/* History note */}
        <div className="flex items-start gap-2 text-[9px] font-mono text-e-dim border-t border-e-border pt-3">
          <Clock size={10} className="shrink-0 mt-px" />
          <span>Chain persists across sessions. Every constitutional inference call extends this ledger.</span>
        </div>
      </div>
    </div>
  )
}
