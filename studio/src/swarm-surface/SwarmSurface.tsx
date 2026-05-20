import type { TelemetrySnapshot } from '../types.js'

// Fibonacci sequence for display — F_1..F_11 then capped at 89
const FIB_SEQUENCE: readonly number[] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 89, 89]
const PHI_THRESHOLD = (Math.sqrt(5) - 1) / 2  // 1/φ ≈ 0.6180

interface SwarmAgentRow {
  agent_id: string
  agent_type: string
  epistemic_tier: string
  loop_count: number
  last_fib_interval: number
}

// Static agent projection — reflects the 8 core + 7 CRGM agent types (read-only display)
const AGENT_MANIFEST: readonly SwarmAgentRow[] = [
  { agent_id: 'workspace-1', agent_type: 'WorkspaceMappingAgent', epistemic_tier: 'T1', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'research-1', agent_type: 'ResearchAgent', epistemic_tier: 'T1', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'replay-audit-1', agent_type: 'ReplayAuditAgent', epistemic_tier: 'T0', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'telemetry-1', agent_type: 'TelemetryAnalysisAgent', epistemic_tier: 'T1', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'ext-gov-1', agent_type: 'ExtensionGovernanceAgent', epistemic_tier: 'T1', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'invariant-1', agent_type: 'InvariantEnforcementAgent', epistemic_tier: 'T0', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'docs-1', agent_type: 'DocumentationAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'env-1', agent_type: 'EnvironmentAdaptationAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'sentinel-1', agent_type: 'SentinelAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'arbitration-1', agent_type: 'ArbitrationAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'memory-1', agent_type: 'MemoryAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'entropy-1', agent_type: 'EntropySuppressionAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'guardian-1', agent_type: 'ConstitutionalGuardianAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'federation-1', agent_type: 'FederationRelayAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
  { agent_id: 'simulation-1', agent_type: 'SimulationAgent', epistemic_tier: 'T2', loop_count: 0, last_fib_interval: 1 },
]

const TIER_COLOR: Record<string, string> = {
  T0: 'text-blue-400',
  T1: 'text-green-400',
  T2: 'text-yellow-400',
}

interface Props { snapshot: TelemetrySnapshot | null }

export function SwarmSurface({ snapshot }: Props) {
  const online = snapshot !== null

  // Derive a synthetic loop index from epoch_sequence for display
  const loopIndex = snapshot ? (snapshot.epoch_sequence % FIB_SEQUENCE.length) + 1 : 0
  const fibInterval = loopIndex > 0 ? (FIB_SEQUENCE[loopIndex - 1] ?? 89) : 0

  // Martingale: use gate_acceptance_rate as adaptive_ratio proxy
  const adaptiveRatio = snapshot ? (1 - snapshot.gate_acceptance_rate) : 0
  const entropyBounded = adaptiveRatio <= PHI_THRESHOLD
  const isAnchored = snapshot ? snapshot.pgcs_passes && snapshot.corruption_count === 0 : false

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold text-white">Swarm Surface</span>
        <span className="text-xs text-gray-500">read-only projection · no constitutional authority</span>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-3 gap-3">
        <StatusCard label="Fibonacci Loop" value={online ? `F${loopIndex} = ${fibInterval}` : '—'} sub={online ? `loop index ${loopIndex}` : 'bridge offline'} ok={online} />
        <StatusCard label="Martingale" value={online ? (isAnchored ? 'ANCHORED' : 'DRIFTING') : '—'} sub={online ? `entropy_bounded=${String(entropyBounded)}` : 'bridge offline'} ok={isAnchored} />
        <StatusCard label="Swarm Agents" value={String(AGENT_MANIFEST.length)} sub="agents in manifest" ok={true} />
      </div>

      {/* Fibonacci timeline */}
      <div className="bg-gray-900 rounded border border-gray-800 p-3">
        <p className="text-xs text-gray-400 mb-2 font-mono">fibonacci pacing — F₁..F₁₁ (cap=89)</p>
        <div className="flex items-end gap-1 h-16">
          {FIB_SEQUENCE.slice(0, 11).map((f, i) => {
            const active = online && i === loopIndex - 1
            const h = Math.round((f / 89) * 56)
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                <div
                  className={`rounded-sm w-full transition-all ${active ? 'bg-blue-500' : 'bg-gray-700'}`}
                  style={{ height: `${h}px` }}
                />
                <span className="text-[8px] text-gray-600">{f}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Martingale bar */}
      <div className="bg-gray-900 rounded border border-gray-800 p-3">
        <p className="text-xs text-gray-400 mb-2 font-mono">adaptive ratio vs 1/φ threshold</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${adaptiveRatio > PHI_THRESHOLD ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(adaptiveRatio * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-400 w-20 text-right">
            {(adaptiveRatio * 100).toFixed(1)}% / {(PHI_THRESHOLD * 100).toFixed(1)}%
          </span>
        </div>
        <p className={`text-[10px] mt-1 font-mono ${entropyBounded ? 'text-green-400' : 'text-red-400'}`}>
          {entropyBounded ? 'entropy_bounded=true — mutation authority preserved' : 'entropy_bounded=false — mutation authority SUSPENDED'}
        </p>
      </div>

      {/* Agent grid */}
      <div className="bg-gray-900 rounded border border-gray-800 p-3">
        <p className="text-xs text-gray-400 mb-2 font-mono">agent manifest — {AGENT_MANIFEST.length} agents</p>
        <div className="overflow-auto max-h-48">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left pb-1 font-mono">agent_id</th>
                <th className="text-left pb-1 font-mono">type</th>
                <th className="text-center pb-1 font-mono">tier</th>
              </tr>
            </thead>
            <tbody>
              {AGENT_MANIFEST.map(row => (
                <tr key={row.agent_id} className="border-b border-gray-800/50">
                  <td className="py-0.5 font-mono text-gray-300">{row.agent_id}</td>
                  <td className="py-0.5 text-gray-400 truncate max-w-[140px]">{row.agent_type}</td>
                  <td className={`py-0.5 text-center font-mono ${TIER_COLOR[row.epistemic_tier] ?? 'text-gray-400'}`}>{row.epistemic_tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusCard({ label, value, sub, ok }: { label: string; value: string; sub: string; ok: boolean }) {
  return (
    <div className="bg-gray-900 rounded border border-gray-800 p-3">
      <p className="text-[10px] text-gray-500 font-mono mb-1">{label}</p>
      <p className={`text-sm font-mono ${ok ? 'text-white' : 'text-gray-500'}`}>{value}</p>
      <p className="text-[9px] text-gray-600 mt-0.5">{sub}</p>
    </div>
  )
}
