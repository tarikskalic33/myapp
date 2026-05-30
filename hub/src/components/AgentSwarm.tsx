// BFT agent swarm — four agents converging at 1/φ with animated EventEnvelope pulses.
import { useEffect, useState } from 'react'

const PHI = 0.6180339887498948
const QUORUM = Math.round(PHI * 1000)

interface Agent {
  id: string
  name: string
  weight: number
  cx: number
  cy: number
  color: string
}

const BASE_AGENTS: Agent[] = [
  { id: 'claude',  name: 'Claude',  weight: 618, cx: 160, cy: 32,  color: '#C8A96E' },
  { id: 'gpt4o',   name: 'GPT-4o',  weight: 191, cx: 295, cy: 135, color: '#60A5FA' },
  { id: 'qwen',    name: 'Qwen',    weight: 191, cx: 160, cy: 238, color: '#34D399' },
  { id: 'notify',  name: 'Notify',  weight: 0,   cx: 25,  cy: 135, color: '#A78BFA' },
]

// All edges in the 4-node mesh
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 2], [1, 3], [2, 3],
]

export function AgentSwarm() {
  const [activeEdge, setActiveEdge] = useState(0)
  const [weights, setWeights] = useState(BASE_AGENTS.map(a => a.weight))

  useEffect(() => {
    const edgeId = setInterval(() => {
      setActiveEdge(e => (e + 1) % EDGES.length)
    }, 700)

    const weightId = setInterval(() => {
      setWeights(w => {
        const g = Math.round((Math.random() - 0.5) * 5)
        const q = Math.round((Math.random() - 0.5) * 5)
        const newGpt  = Math.max(180, Math.min(202, w[1] + g))
        const newQwen = Math.max(180, Math.min(202, w[2] + q))
        const newNotify = Math.max(0, 1000 - 618 - newGpt - newQwen)
        return [618, newGpt, newQwen, newNotify]
      })
    }, 1400)

    return () => {
      clearInterval(edgeId)
      clearInterval(weightId)
    }
  }, [])

  const totalWeight = weights.reduce((s, w) => s + w, 0)
  const claudeShare = (weights[0] ?? 0) / totalWeight
  const quorumReached = claudeShare >= PHI

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-bold tracking-label uppercase"
          style={{ color: '#C8A96E' }}
        >
          BFT Agent Swarm
        </span>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded"
          style={{
            background: quorumReached ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
            color: quorumReached ? '#34D399' : '#F87171',
            border: `1px solid ${quorumReached ? 'rgba(52,211,153,0.20)' : 'rgba(248,113,113,0.20)'}`,
          }}
        >
          {quorumReached ? 'UNIFIED' : 'SPLIT'} · 1/φ = {QUORUM}/1000
        </span>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{ background: '#0A0B0F', border: '1px solid #1A1D27' }}
      >
        {/* SVG swarm diagram */}
        <svg
          viewBox="0 0 320 270"
          className="w-full"
          style={{ maxHeight: 240 }}
          aria-label="BFT agent swarm topology"
        >
          <defs>
            {EDGES.map(([a, b], i) => {
              const agA = BASE_AGENTS[a]
              const agB = BASE_AGENTS[b]
              if (!agA || !agB) return null
              return (
                <path
                  key={`path-def-${i}`}
                  id={`edge-path-${i}`}
                  d={`M${agA.cx},${agA.cy} L${agB.cx},${agB.cy}`}
                  fill="none"
                />
              )
            })}
          </defs>

          {/* Connection lines */}
          {EDGES.map(([a, b], i) => {
            const agA = BASE_AGENTS[a]
            const agB = BASE_AGENTS[b]
            if (!agA || !agB) return null
            const isActive = i === activeEdge
            return (
              <line
                key={`line-${i}`}
                x1={agA.cx} y1={agA.cy}
                x2={agB.cx} y2={agB.cy}
                stroke={isActive ? agA.color : '#1A1D27'}
                strokeWidth={isActive ? 1.5 : 0.75}
                strokeOpacity={isActive ? 0.6 : 1}
              />
            )
          })}

          {/* EventEnvelope pulses along active edge */}
          {EDGES.map(([a, b], i) => {
            const agA = BASE_AGENTS[a]
            const agB = BASE_AGENTS[b]
            if (!agA || !agB) return null
            return (
              <circle key={`pulse-${i}`} r="3" fill={agA.color} opacity={i === activeEdge ? 0.9 : 0}>
                <animateMotion
                  dur={`${0.7 + i * 0.1}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                >
                  <mpath href={`#edge-path-${i}`} />
                </animateMotion>
              </circle>
            )
          })}

          {/* Agent nodes */}
          {BASE_AGENTS.map((agent, i) => {
            const w = weights[i] ?? agent.weight
            const isSilent = w === 0
            return (
              <g key={agent.id}>
                {/* Outer glow ring */}
                <circle
                  cx={agent.cx}
                  cy={agent.cy}
                  r={28}
                  fill="none"
                  stroke={agent.color}
                  strokeWidth={1}
                  strokeOpacity={isSilent ? 0.05 : 0.15}
                />
                {/* Agent circle */}
                <circle
                  cx={agent.cx}
                  cy={agent.cy}
                  r={20}
                  fill={agent.color + '15'}
                  stroke={agent.color}
                  strokeWidth={1.5}
                  strokeOpacity={isSilent ? 0.2 : 0.6}
                />
                {/* Agent name */}
                <text
                  x={agent.cx}
                  y={agent.cy - 4}
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  fill={isSilent ? '#374151' : agent.color}
                >
                  {agent.name}
                </text>
                {/* Weight */}
                <text
                  x={agent.cx}
                  y={agent.cy + 7}
                  textAnchor="middle"
                  fontSize="7"
                  fontFamily="JetBrains Mono, monospace"
                  fill={isSilent ? '#2D2D35' : '#6B6B7A'}
                >
                  {w}
                </text>
              </g>
            )
          })}

          {/* φ threshold label */}
          <text
            x="160"
            y="260"
            textAnchor="middle"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
            fill="#4B5563"
          >
            quorum ≥ 1/φ · Law of Silence · EventEnvelope only
          </text>
        </svg>

        {/* Quorum bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono" style={{ color: '#4B5563' }}>
              Claude weight / φ quorum
            </span>
            <span className="text-xs font-mono" style={{ color: '#C8A96E' }}>
              {weights[0]}/1000 ≥ {QUORUM}/1000
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: '#1A1D27' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, ((weights[0] ?? 0) / 1000) * 100)}%`,
                background: quorumReached ? '#C8A96E' : '#F87171',
              }}
            />
          </div>
          {/* φ threshold marker */}
          <div className="relative h-3">
            <div
              className="absolute top-0 w-px h-full"
              style={{ left: `${QUORUM / 10}%`, background: '#C8A96E', opacity: 0.4 }}
            />
            <span
              className="absolute text-xs font-mono"
              style={{ left: `${QUORUM / 10}%`, top: 2, color: '#C8A96E', transform: 'translateX(-50%)', opacity: 0.6 }}
            >
              φ
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
