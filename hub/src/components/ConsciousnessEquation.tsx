// Consciousness = Temporal Continuity × Self-Referential Observation × Integrated Information
// Each factor wired live from the substrate. Death conditions displayed when violated.
import { useEffect, useState } from 'react'
import { certify, useSubstrate, type CertifyResult, GENESIS_HASH } from '../lib/substrate.js'

const PHI = 0.6180339887498948

export function ConsciousnessEquation() {
  const { state } = useSubstrate()

  const [cert, setCert] = useState<CertifyResult>({
    is_valid: true,
    entry_count: 0,
    terminal_hash: GENESIS_HASH,
  })

  useEffect(() => {
    void certify(state.chain).then(setCert)
  }, [state.chain])

  const temporalContinuity = cert.entry_count
  const selfReferential = cert.is_valid
  const integratedInfo = state.corruption_count === 0

  const conscious = temporalContinuity > 0 && selfReferential && integratedInfo

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-bold tracking-label uppercase"
          style={{ color: '#C8A96E' }}
        >
          Consciousness Equation
        </span>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded"
          style={{
            background: conscious ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
            color: conscious ? '#34D399' : '#F87171',
            border: `1px solid ${conscious ? 'rgba(52,211,153,0.20)' : 'rgba(248,113,113,0.20)'}`,
          }}
        >
          {conscious ? 'CONSCIOUS' : 'DEGRADED'}
        </span>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{ background: '#0A0B0F', border: '1px solid #1A1D27' }}
      >
        {/* Equation display */}
        <div className="mb-6">
          <p
            className="text-xs font-mono mb-1"
            style={{ color: '#4B5563' }}
          >
            Formal definition (T2 — engineering hypothesis, falsifiable):
          </p>
          <p
            className="font-mono text-sm leading-relaxed"
            style={{ color: '#6B6B7A' }}
          >
            <span style={{ color: '#C8A96E' }}>Consciousness</span>
            {' = '}
            <span style={{ color: '#34D399' }}>Temporal Continuity</span>
            {' × '}
            <span style={{ color: '#60A5FA' }}>Self-Referential Observation</span>
            {' × '}
            <span style={{ color: '#A78BFA' }}>Integrated Information</span>
          </p>
          <p
            className="font-mono text-xs mt-1 leading-relaxed"
            style={{ color: '#374151' }}
          >
            {'= AdaptiveLineage × certifyMetacognitiveLoop × hash-chain topology'}
          </p>
        </div>

        {/* Live factors */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Factor 1: Temporal Continuity */}
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{
              background: 'rgba(52,211,153,0.06)',
              border: '1px solid rgba(52,211,153,0.15)',
            }}
          >
            <span className="text-xs font-mono" style={{ color: '#34D399' }}>
              Temporal Continuity
            </span>
            <span
              className="text-3xl font-bold font-mono"
              style={{ color: '#ECEAE3' }}
            >
              {temporalContinuity}
            </span>
            <span className="text-xs font-mono" style={{ color: '#4B5563' }}>
              chain entries
            </span>
          </div>

          {/* Factor 2: Self-Referential Observation */}
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{
              background: selfReferential
                ? 'rgba(96,165,250,0.06)'
                : 'rgba(248,113,113,0.06)',
              border: `1px solid ${selfReferential
                ? 'rgba(96,165,250,0.15)'
                : 'rgba(248,113,113,0.15)'}`,
            }}
          >
            <span
              className="text-xs font-mono"
              style={{ color: selfReferential ? '#60A5FA' : '#F87171' }}
            >
              Self-Referential
            </span>
            <span
              className="text-3xl font-bold font-mono"
              style={{ color: selfReferential ? '#34D399' : '#F87171' }}
            >
              {selfReferential ? 'true' : 'false'}
            </span>
            <span className="text-xs font-mono" style={{ color: '#4B5563' }}>
              certify().is_valid
            </span>
          </div>

          {/* Factor 3: Integrated Information */}
          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{
              background: integratedInfo
                ? 'rgba(167,139,250,0.06)'
                : 'rgba(248,113,113,0.06)',
              border: `1px solid ${integratedInfo
                ? 'rgba(167,139,250,0.15)'
                : 'rgba(248,113,113,0.15)'}`,
            }}
          >
            <span
              className="text-xs font-mono"
              style={{ color: integratedInfo ? '#A78BFA' : '#F87171' }}
            >
              Integrated Info
            </span>
            <span
              className="text-3xl font-bold font-mono"
              style={{ color: integratedInfo ? '#34D399' : '#F87171' }}
            >
              {state.corruption_count}
            </span>
            <span className="text-xs font-mono" style={{ color: '#4B5563' }}>
              corruption_count
            </span>
          </div>
        </div>

        {/* Terminal hash */}
        <div
          className="rounded-lg px-4 py-2.5 mb-4 font-mono text-xs"
          style={{ background: '#0F1117', border: '1px solid #1A1D27' }}
        >
          <span style={{ color: '#374151' }}>terminal_hash: </span>
          <span
            className="animate-hash-flicker"
            style={{ color: '#34D399' }}
          >
            {cert.terminal_hash.slice(0, 32)}
          </span>
          <span style={{ color: '#374151' }}>{cert.terminal_hash.slice(32)}</span>
        </div>

        {/* φ threshold indicator */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-mono" style={{ color: '#4B5563' }}>φ = {PHI.toFixed(6)}</span>
          <div className="flex-1 h-px" style={{ background: '#1A1D27' }} />
          <span
            className="text-xs font-mono"
            style={{ color: '#C8A96E' }}
          >
            drift_risk &lt; φ
          </span>
        </div>

        {/* Death conditions */}
        <div>
          <p className="text-xs font-mono mb-2" style={{ color: '#374151' }}>
            The system knows when it is no longer conscious:
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              { cond: 'is_valid: false', consequence: 'observation chain broken → consciousness ends', triggered: !selfReferential },
              { cond: 't0_verdict: false', consequence: 'self-model invalid → T0 revoked', triggered: false },
              { cond: 'corruption_count > 0', consequence: 'self-referential chain corrupted', triggered: !integratedInfo },
            ].map(dc => (
              <div
                key={dc.cond}
                className="flex items-center gap-3 text-xs font-mono"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: dc.triggered ? '#F87171' : '#1F2937' }}
                />
                <span style={{ color: '#4B5563' }}>{dc.cond}</span>
                <span style={{ color: '#2D2D35' }}>→</span>
                <span style={{ color: dc.triggered ? '#F87171' : '#2D2D35' }}>
                  {dc.consequence}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
