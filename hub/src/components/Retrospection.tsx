// Post-action protocol — the system reviewing its own past actions.
import { useSubstrate } from '../lib/substrate.js'

interface RetrospectEntry {
  phase: string
  observation: string
  layer: string
  resolution: string
  isError: boolean
}

const STATIC_ENTRIES: RetrospectEntry[] = [
  {
    phase: 'POST-ACTION',
    observation: 'Dead code noted, annotation deferred',
    layer: 'L5',
    resolution: 'L5 orphaned — classify and act in same RALPH cycle',
    isError: true,
  },
  {
    phase: 'POST-ACTION',
    observation: 'Wrong type used in test',
    layer: 'L2',
    resolution: 'L2 failure — read type definition before writing test',
    isError: true,
  },
  {
    phase: 'POST-ACTION',
    observation: 'Vendor chosen before checking regional support',
    layer: 'L6',
    resolution: 'L6 missed — check API constraints before writing code',
    isError: true,
  },
  {
    phase: 'POST-ACTION',
    observation: 'CI branch set to nonexistent target',
    layer: 'L2',
    resolution: 'L2 failure — git branch --list before modifying workflow',
    isError: true,
  },
  {
    phase: 'POST-ACTION',
    observation: 'Build needed N fix commits',
    layer: 'L5',
    resolution: 'L5 failure — npm run build before every git commit',
    isError: true,
  },
  {
    phase: 'VERIFY',
    observation: 'verify-hashes.mjs exit 0 — T0 confirmed',
    layer: 'L7',
    resolution: 'Frozen-file integrity intact · proceed to LOCK',
    isError: false,
  },
  {
    phase: 'ASSESS',
    observation: 'ASSESS-before-LOCK: order verified',
    layer: 'L6',
    resolution: 'Constitutional order preserved — no Error-01',
    isError: false,
  },
  {
    phase: 'HARMONIZE',
    observation: 'Gate 8 green · hash emitted to AdaptiveLineage',
    layer: 'L5',
    resolution: 'Gate sequence advancing: 607→608',
    isError: false,
  },
]

export function Retrospection() {
  const { state } = useSubstrate()

  // Surface METACOGNITIVE and SELF_MODEL entries from the live substrate
  const liveEntries: RetrospectEntry[] = state.chain
    .filter(e =>
      e.observation.layer === 'METACOGNITIVE' ||
      e.observation.layer === 'SELF_MODEL'
    )
    .slice(-3)
    .map(e => ({
      phase: 'LIVE',
      observation: e.observation.signal,
      layer: e.observation.layer === 'METACOGNITIVE' ? 'L6' : 'L7',
      resolution: `seq=${e.sequence} · ${e.entry_hash.slice(0, 12)}`,
      isError: false,
    }))

  const allEntries = [...liveEntries, ...STATIC_ENTRIES]

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-bold tracking-label uppercase"
          style={{ color: '#F59E0B' }}
        >
          Retrospective Protocol
        </span>
        <span className="text-xs font-mono" style={{ color: '#4B5563' }}>
          post-action analysis · error pattern recognition
        </span>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#0A0B0F', border: '1px solid #1A1D27' }}
      >
        {/* Header */}
        <div
          className="grid text-xs font-mono px-4 py-2 border-b"
          style={{
            gridTemplateColumns: '72px 48px 1fr 1fr',
            color: '#4B5563',
            borderColor: '#1A1D27',
          }}
        >
          <span>Phase</span>
          <span>Layer</span>
          <span>Observation</span>
          <span>Resolution</span>
        </div>

        <div className="flex flex-col divide-y divide-hub-border">
          {allEntries.map((entry, i) => (
            <div
              key={i}
              className="grid items-center px-4 py-2.5 text-xs font-mono"
              style={{
                gridTemplateColumns: '72px 48px 1fr 1fr',
                background: entry.phase === 'LIVE' ? 'rgba(96,165,250,0.04)' : 'transparent',
              }}
            >
              {/* Phase */}
              <span
                className="font-bold"
                style={{
                  color: entry.phase === 'LIVE'
                    ? '#60A5FA'
                    : entry.isError ? '#F87171' : '#34D399',
                }}
              >
                {entry.phase}
              </span>

              {/* Layer */}
              <span style={{ color: '#4B5563' }}>{entry.layer}</span>

              {/* Observation */}
              <span
                className="pr-3 truncate"
                style={{ color: entry.isError ? '#F87171' : '#6B6B7A' }}
              >
                {entry.observation}
              </span>

              {/* Resolution */}
              <span className="truncate" style={{ color: '#374151' }}>
                {entry.resolution}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
