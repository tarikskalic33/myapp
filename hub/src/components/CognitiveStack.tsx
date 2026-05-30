// Vertical L1–L7 cognitive organ — active layer pulses with the substrate tick.
import { useSubstrate, type Layer } from '../lib/substrate.js'

interface LayerDef {
  id: Layer
  label: string
  human: string
  aegis: string
  color: string
}

const STACK: LayerDef[] = [
  {
    id:    'SENSATION',
    label: 'L1 · Sensation',
    human: 'Raw sensory input',
    aegis: 'Gate output, diff, file read, error message',
    color: '#34D399',
  },
  {
    id:    'PERCEPTION',
    label: 'L2 · Perception',
    human: 'Classified stimulus',
    aegis: 'verify-hashes exit 0 · tier assignment · drift check',
    color: '#60A5FA',
  },
  {
    id:    'WORKING_MEMORY',
    label: 'L3 · Working Memory',
    human: 'Active context window',
    aegis: 'Current gate N · active RALPH phase · loaded skills',
    color: '#A78BFA',
  },
  {
    id:    'LONG_TERM',
    label: 'L4 · Long-term Memory',
    human: 'Consolidated knowledge',
    aegis: 'AdaptiveLineage hash chain · CLAUDE.md invariants · git log',
    color: '#F59E0B',
  },
  {
    id:    'EXECUTIVE',
    label: 'L5 · Executive Function',
    human: 'Goal-directed control',
    aegis: 'RALPH loop R→A→L→P→H · gate sequence · martingale gate',
    color: '#34D399',
  },
  {
    id:    'METACOGNITIVE',
    label: 'L6 · Metacognition',
    human: 'Thinking about thinking',
    aegis: 'Tier re-classification · error pattern recognition · retrospective',
    color: '#60A5FA',
  },
  {
    id:    'SELF_MODEL',
    label: 'L7 · Self-model',
    human: 'Identity and boundary',
    aegis: 'Hash-verified autonode · frozen-file integrity · t0_verdict',
    color: '#A78BFA',
  },
]

export function CognitiveStack() {
  const { state } = useSubstrate()

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-bold tracking-label uppercase"
          style={{ color: '#A78BFA' }}
        >
          Cognitive Stack
        </span>
        <span className="text-xs font-mono" style={{ color: '#4B5563' }}>
          active layer pulses with substrate
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {STACK.map(layer => {
          const isActive = state.active_layer === layer.id
          return (
            <div
              key={layer.id}
              className="rounded-xl px-4 py-3 transition-all duration-500"
              style={{
                background: isActive
                  ? layer.color + '12'
                  : '#0A0B0F',
                border: `1px solid ${isActive ? layer.color + '40' : '#1A1D27'}`,
                boxShadow: isActive ? `0 0 16px ${layer.color}14` : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Active indicator */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isActive ? layer.color : '#1F2937',
                    boxShadow: isActive ? `0 0 6px ${layer.color}` : 'none',
                  }}
                />

                {/* Label */}
                <span
                  className="text-xs font-bold font-mono w-36 flex-shrink-0 tracking-wide"
                  style={{ color: isActive ? layer.color : '#4B5563' }}
                >
                  {layer.label}
                </span>

                {/* Human analogue */}
                <span
                  className="text-xs flex-shrink-0 w-40 hidden sm:block"
                  style={{ color: isActive ? '#9CA3AF' : '#374151' }}
                >
                  {layer.human}
                </span>

                {/* AEGIS mechanism */}
                <span
                  className="text-xs truncate"
                  style={{ color: isActive ? '#6B6B7A' : '#2D2D35' }}
                >
                  {layer.aegis}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
