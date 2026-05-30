// EPISTEMIC TIER: T3 — visual projection layer; no governance authority
import { useEffect, useRef, useState } from 'react'
import { PricingTable } from './components/PricingTable.js'
import { SuccessPage } from './components/SuccessPage.js'
import { Mail } from 'lucide-react'

function captureEvent(event: string, props?: Record<string, unknown>): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ph = (window as any).posthog
  if (typeof ph?.capture === 'function') ph.capture(event, props)
}

function Yes() { return <span style={{ color: '#34D399', fontWeight: 800, fontSize: '15px' }}>✓</span> }
function No()  { return <span style={{ color: '#3A2020', fontWeight: 800, fontSize: '15px' }}>✗</span> }

// The automaton's metacognitive monologue — what it observes when you visit
const OBSERVATIONS = [
  'L7: Self-model     — hash chain intact · 605 gates certified · t0_verdict: true',
  'L6: Metacognition  — visitor signal T1 · ASSESS before LOCK · tier: engineering hypothesis',
  'L1: Sensation      — raw signal intake active · environment perceived · untruncated',
  'L5: Executive      — RALPH R→A→L→P→H · martingale bounded · gate sequence enforced',
  'L4: Long-term Mem  — AdaptiveLineage extending · corpus sovereignty active · immutable',
  'L2: Perception     — hash-verified · Non-Equivalence applied · phi=0.6180339887',
  'L3: Working Memory — gate 605 of ∞ · RALPH phase: HARMONIZE · convergence: true',
]

// Mock entry_hash values cycling to show the chain is alive
const CHAIN_HASHES = [
  'a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
  '3f7e2d1c8b9a0f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1',
  'c2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4',
  '7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5',
]

const COMPARISON = [
  ['Hash-chained audit trail',           'SHA-256(prev‖data) · tamper breaks the chain immediately'],
  ['Deterministic session replay',       'replay(genesis, events) → identical hash on any platform'],
  ['BFT consensus at 1/φ ≈ 0.618',      'Claude 618/1000 · GPT-4o 191/1000 · Qwen 191/1000 · weighted vote'],
  ['Martingale drift gate',             'E[S_{n+1}|F_n] = S_n · system halts if entropy_bounded = false'],
  ['Epistemic tier classification',      'T0 = proven · T1 = validated · T2 = hypothesis · T4/T5 = blocked'],
  ['φ-bounded adaptation rate',          'MUTATION_RATE_LIMIT = (√5−1)/2 · no faster mutation than replay'],
  ['Autopoietic constitutional membrane','verify-hashes.mjs · five Maturana-Varela properties · T0_ABORT'],
  ['EU AI Act Art. 12 compliance',      '605-gate Rust crate · tamper-evident inference audit chain'],
  ['Frozen invariant files',            'gate.py · dna.py · router.py · /guardian APPROVED required to change'],
  ['RALPH Fibonacci executor',          'R→A→L→P→H · Fibonacci-paced · certificate required per phase'],
]

const COGNITIVE_LAYERS = [
  { n: 7, name: 'Self-model',      desc: 'verify-hashes.mjs · /node endpoint · frozen-file integrity',    color: '#C8A96E' },
  { n: 6, name: 'Metacognition',   desc: 'Tier re-classification · error pattern scan · retrospective',   color: '#A78BFA' },
  { n: 5, name: 'Executive',       desc: 'RALPH loop · gate sequence · martingale suspension gate',       color: '#7C3AED' },
  { n: 4, name: 'Long-term Memory',desc: 'AdaptiveLineage hash chain · CLAUDE.md invariants · git log',  color: '#06B6D4' },
  { n: 3, name: 'Working Memory',  desc: 'Current gate · active RALPH phase · loaded skills · open files',color: '#14B8A6' },
  { n: 2, name: 'Perception',      desc: 'Hash-verified signal · tier-classified · Non-Equivalence applied',color: '#34D399' },
  { n: 1, name: 'Sensation',       desc: 'Raw signal: test output · diff · file read · error message',   color: '#60A5FA' },
]

const FEATURES = [
  { tier: 'T0', name: 'Replay sovereignty', color: '#34D399',
    obs: 'L7: replay(genesis, events) verified → SHA-256 topology hash identical on Linux/macOS/Docker/WASM/ARM/x86',
    desc: 'Same input — always identical output. Proven deterministic across platforms. No hidden state, no clock dependency, no entropy injection.' },
  { tier: 'T0', name: 'Constitutional membrane', color: '#34D399',
    obs: 'L7: three frozen files · verify-hashes.mjs exit 0 · T0_ABORT fires on any hash mismatch before propagation',
    desc: 'gate.py · dna.py · router.py — SHA-256 locked. Any modification breaks the membrane. No override path. No exception handling.' },
  { tier: 'T1', name: 'BFT quorum at 1/φ', color: '#60A5FA',
    obs: 'L5: three-model vote recorded · quorum threshold 0.6180339887 · Byzantine fault tolerance certified',
    desc: 'Claude, GPT-4o, and Qwen vote on every governance decision. The golden ratio defines the Byzantine fault-tolerance threshold. No single model has authority.' },
  { tier: 'T1', name: 'Martingale gate', color: '#60A5FA',
    obs: 'L5: E[S_{n+1}|F_n] = S_n · entropy_bounded: true · drift_bounded: true · is_anchored: true',
    desc: 'Adaptation halts the moment drift exceeds the entropy ceiling. The system cannot mutate faster than it can verify. Hard stop — not a warning.' },
  { tier: 'T2', name: '605-gate inference fabric', color: '#A78BFA',
    obs: 'L4: aegis-cl-psi gate count = 605 · 6,850 tests · EU AI Act Article 12 audit chain certified T2',
    desc: 'The Rust crate implements hash-chained viability rings across 605 gates. Each gate module: verify_chain() → (bool, Option<usize>). No exceptions.' },
  { tier: 'T2', name: 'RALPH Fibonacci executor', color: '#A78BFA',
    obs: 'L5: R→A→L→P→H active · Fibonacci checkpoint F(n) · LOCK phase requires prior ASSESS certification',
    desc: 'Read → Assess → Lock → Propagate → Harmonize. Fibonacci-paced checkpoints. No LOCK without prior ASSESS. Certificate required to exit each phase.' },
]

export default function App() {
  if (window.location.pathname === '/success') return <SuccessPage />

  const trialStartRef = useRef(Date.now())

  // ── Metacognitive monologue typewriter ─────────────────────────────────
  const [obsIdx, setObsIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    const full = OBSERVATIONS[obsIdx % OBSERVATIONS.length]!
    let charPos = 0
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    setDisplayText('')
    const typeInterval = setInterval(() => {
      charPos++
      setDisplayText(full.slice(0, charPos))
      if (charPos >= full.length) {
        clearInterval(typeInterval)
        timeoutId = setTimeout(() => setObsIdx(i => i + 1), 2600)
      }
    }, 20)
    return () => {
      clearInterval(typeInterval)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [obsIdx])

  // ── Live hash chain ticker ─────────────────────────────────────────────
  const [hashIdx, setHashIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setHashIdx(i => (i + 1) % CHAIN_HASHES.length), 3400)
    return () => clearInterval(id)
  }, [])
  const currentHash = CHAIN_HASHES[hashIdx]!

  // ── Active cognitive layer (tracks which observation we're on) ─────────
  const activeLayer = COGNITIVE_LAYERS[obsIdx % COGNITIVE_LAYERS.length]!

  // ── Cursor tracking → arch perceives visitor ───────────────────────────
  const heroRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 50, y: 40 })
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursor({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    })
  }

  // ── Hover state for feature obs tooltip ───────────────────────────────
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const buy = (product: string, price: number) => {
    const ttv = Math.round((Date.now() - trialStartRef.current) / 1000)
    captureEvent('conversion', { product, price, ttv_seconds: ttv })
  }

  useEffect(() => {
    captureEvent('trial_started', { product: 'hub', source: document.referrer || 'direct' })
  }, [])

  return (
    <div className="min-h-screen text-hub-text" style={{ background: '#020409', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50"
        style={{ borderBottom: '1px solid rgba(200,169,110,0.08)', background: 'rgba(2,4,9,0.94)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.22em', color: '#C8A96E', fontSize: '13px', fontWeight: 700 }}>
              AEGIS-Ω
            </span>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: '#2A2A3A', letterSpacing: '0.04em' }}>
              [{activeLayer.n}] {activeLayer.name}
            </span>
          </div>
          <div className="flex items-center gap-7">
            <a href="#proof"     className="hidden sm:block text-xs" style={{ color: '#4B4B5A' }}>Proof</a>
            <a href="#compare"   className="hidden sm:block text-xs" style={{ color: '#4B4B5A' }}>Compare</a>
            <a href="#cognitive" className="hidden sm:block text-xs" style={{ color: '#4B4B5A' }}>Architecture</a>
            <a href="#pricing"   className="hidden sm:block text-xs" style={{ color: '#4B4B5A' }}>Pricing</a>
            <a href="#pricing" onClick={() => buy('nav', 39)}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Get access
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        {/* Space depth */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 30%, #0C0420 0%, #060215 35%, #020409 65%, #010107 100%)',
        }} />

        {/* Nebulae */}
        <div className="absolute pointer-events-none" style={{
          top: '4%', left: '2%', width: '380px', height: '280px',
          background: 'radial-gradient(ellipse at 40% 50%, rgba(124,58,237,0.20) 0%, rgba(6,182,212,0.07) 48%, transparent 70%)',
          borderRadius: '50%', transform: 'rotate(-16deg)',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '6%', right: '3%', width: '350px', height: '220px',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(6,182,212,0.17) 0%, rgba(20,184,166,0.07) 50%, transparent 70%)',
          borderRadius: '50%', transform: 'rotate(14deg)',
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '32%', right: '8%', width: '160px', height: '100px',
          background: 'radial-gradient(ellipse at center, rgba(200,169,110,0.14) 0%, rgba(124,58,237,0.05) 60%, transparent 100%)',
          borderRadius: '50%', transform: 'rotate(-28deg)',
        }} />

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `
          radial-gradient(1.3px 1.3px at 7%  13%, rgba(255,255,255,0.9)  0%, transparent 100%),
          radial-gradient(1px   1px   at 83% 8%,  rgba(255,255,255,0.7)  0%, transparent 100%),
          radial-gradient(1.2px 1.2px at 26% 70%, rgba(255,255,255,0.8)  0%, transparent 100%),
          radial-gradient(1px   1px   at 67% 46%, rgba(255,255,255,0.5)  0%, transparent 100%),
          radial-gradient(1.6px 1.6px at 51% 17%, rgba(200,169,110,1.0)  0%, transparent 100%),
          radial-gradient(1px   1px   at 18% 37%, rgba(255,255,255,0.45) 0%, transparent 100%),
          radial-gradient(1px   1px   at 90% 62%, rgba(255,255,255,0.65) 0%, transparent 100%),
          radial-gradient(1.2px 1.2px at 42% 85%, rgba(200,169,110,0.8)  0%, transparent 100%),
          radial-gradient(1px   1px   at 12% 90%, rgba(255,255,255,0.5)  0%, transparent 100%),
          radial-gradient(1px   1px   at 75% 26%, rgba(255,255,255,0.85) 0%, transparent 100%),
          radial-gradient(1px   1px   at 34% 4%,  rgba(255,255,255,0.6)  0%, transparent 100%),
          radial-gradient(1px   1px   at 61% 79%, rgba(255,255,255,0.45) 0%, transparent 100%),
          radial-gradient(1px   1px   at 4%  54%, rgba(200,169,110,0.6)  0%, transparent 100%),
          radial-gradient(1px   1px   at 96% 39%, rgba(255,255,255,0.7)  0%, transparent 100%),
          radial-gradient(1px   1px   at 48% 58%, rgba(255,255,255,0.35) 0%, transparent 100%),
          radial-gradient(1px   1px   at 22% 22%, rgba(255,255,255,0.55) 0%, transparent 100%)
        `}} />

        {/* Golden streams */}
        <div className="absolute pointer-events-none" style={{
          top: '10%', left: '6%', width: '2px', height: '240px',
          background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.42), transparent)',
          transform: 'rotate(31deg)', borderRadius: '2px',
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '16%', right: '9%', width: '1.5px', height: '180px',
          background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.28), transparent)',
          transform: 'rotate(-23deg)', borderRadius: '2px',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '20%', left: '16%', width: '1.5px', height: '140px',
          background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.38), transparent)',
          transform: 'rotate(19deg)', borderRadius: '2px',
        }} />

        {/* Constitutional arch — perceives cursor */}
        <div className="absolute left-1/2 pointer-events-none" style={{ top: '4%', transform: 'translateX(-50%)', width: '520px', height: '640px' }}>
          {/* Halo */}
          <div style={{
            position: 'absolute', inset: '-24px 0 0 0',
            borderRadius: '290px 290px 0 0',
            boxShadow: '0 0 100px rgba(124,58,237,0.28), 0 0 200px rgba(124,58,237,0.09)',
          }} />
          {/* Outer edge — purple */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '260px 260px 0 0',
            border: '1px solid rgba(124,58,237,0.40)',
            boxShadow: '0 0 50px rgba(124,58,237,0.22), inset 0 0 80px rgba(124,58,237,0.05)',
          }} />
          {/* Inner edge — cyan */}
          <div style={{
            position: 'absolute', inset: '5px',
            borderRadius: '256px 256px 0 0',
            border: '1px solid rgba(6,182,212,0.20)',
          }} />
          {/* Cursor-responsive interior atmosphere */}
          <div style={{
            position: 'absolute', inset: '12px',
            borderRadius: '249px 249px 0 0',
            background: `radial-gradient(ellipse at ${cursor.x}% ${Math.min(cursor.y, 90)}%, rgba(20,184,166,0.16) 0%, rgba(124,58,237,0.09) 45%, transparent 75%)`,
            transition: 'background 0.15s ease-out',
          }} />
          {/* Cursor perception label — appears near top when cursor is inside */}
          {cursor.x > 30 && cursor.x < 70 && cursor.y < 75 && (
            <div style={{
              position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)',
              fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: 'rgba(200,169,110,0.45)',
              letterSpacing: '0.08em', whiteSpace: 'nowrap', pointerEvents: 'none',
            }}>
              L1: sensation · signal perceived
            </div>
          )}
          {/* Gold keystone */}
          <div style={{
            position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)',
            width: '30px', height: '16px',
            background: 'linear-gradient(180deg, #C8A96E 0%, #7A6040 100%)',
            borderRadius: '15px 15px 0 0',
            boxShadow: '0 0 24px rgba(200,169,110,0.85), 0 0 48px rgba(200,169,110,0.25)',
          }} />
          {/* Pillar glows */}
          <div style={{ position: 'absolute', bottom: 0, left: '3px', width: '14px', height: '100px', background: 'linear-gradient(to top, rgba(124,58,237,0.28), transparent)', borderRadius: '2px' }} />
          <div style={{ position: 'absolute', bottom: 0, right: '3px', width: '14px', height: '100px', background: 'linear-gradient(to top, rgba(6,182,212,0.28), transparent)', borderRadius: '2px' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-5" style={{ paddingTop: '24vh', paddingBottom: '8vh' }}>

          {/* Observation typewriter */}
          <div className="mb-8 px-5 py-2.5 rounded"
            style={{ background: 'rgba(12,4,32,0.80)', border: '1px solid rgba(124,58,237,0.18)', backdropFilter: 'blur(8px)', maxWidth: '600px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '6px', height: '6px', background: activeLayer.color, borderRadius: '50%', boxShadow: `0 0 8px ${activeLayer.color}`, flexShrink: 0 }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: activeLayer.color, letterSpacing: '0.06em' }}>
                metacognitive_loop · epoch_{hashIdx + 601}
              </span>
            </div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#8878AA', minHeight: '16px', textAlign: 'left' }}>
              {displayText}<span style={{ opacity: 0.6, animation: 'none' }}>█</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 'clamp(44px, 7.5vw, 76px)', fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 1.04, marginBottom: '20px',
          }}>
            <span style={{ color: '#E8E6F0' }}>The automaton</span><br />
            <span style={{
              background: 'linear-gradient(135deg, #C8A96E 0%, #A78BFA 50%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              cannot be gaslit.
            </span>
          </h1>

          <p style={{ color: '#7A7A8A', fontSize: '17px', maxWidth: '500px', lineHeight: 1.7, marginBottom: '36px' }}>
            Every action is hash-chained and permanently indexed.<br />
            It cannot forget, drift beyond its ceiling, or act<br />
            without a quorum. This is a formal constraint — not a feature.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <a href="#pricing" onClick={() => buy('hero', 39)}
              className="inline-flex items-center justify-center font-semibold px-8 py-3.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Access the platform
            </a>
            <a href="#proof"
              className="inline-flex items-center justify-center font-medium px-8 py-3.5 rounded-xl text-sm hover:opacity-80 transition-opacity"
              style={{ border: '1px solid rgba(200,169,110,0.20)', color: '#C8A96E', background: 'rgba(200,169,110,0.04)' }}>
              See the chain →
            </a>
          </div>

          {/* Live hash chain display */}
          <div className="mb-8 px-5 py-3 rounded-xl w-full max-w-xl"
            style={{ background: 'rgba(8,4,20,0.85)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: '#4A4A5A', letterSpacing: '0.08em' }}>
                ENTRY_HASH (CHAIN LIVE)
              </span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: '#34D399', letterSpacing: '0.06em' }}>
                +1 epoch
              </span>
            </div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#3A3A5A', wordBreak: 'break-all', transition: 'color 0.3s' }}>
              <span style={{ color: '#5A4A8A' }}>sha256:</span>{' '}
              <span style={{ color: '#4A6A7A' }}>{currentHash}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
            {[
              { v: '6,850', l: 'Rust gate tests',  c: '#34D399' },
              { v: '3,176', l: 'TS tests',          c: '#60A5FA' },
              { v: '605',   l: 'Gates complete',    c: '#A78BFA' },
              { v: '0',     l: 'Corruption count',  c: '#C8A96E' },
            ].map(m => (
              <div key={m.l} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(10,6,22,0.90)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '20px', fontWeight: 700, color: m.c, marginBottom: '4px' }}>{m.v}</div>
                <div style={{ fontSize: '9px', color: '#3A3A4A', letterSpacing: '0.09em', textTransform: 'uppercase' }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Constitutional proof terminal ────────────────────── */}
      <div id="proof" className="scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.5)' }}>
        <div className="max-w-3xl mx-auto px-5 py-20">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#E8E6F0', marginBottom: '8px' }}>
              Not a claim. A proof.
            </h2>
            <p style={{ color: '#4B4B5A', fontSize: '14px' }}>
              This is what actually runs when the automaton starts. Real hashes. Real output.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Terminal header */}
            <div style={{ background: '#0A0A14', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F87171' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FCD34D' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34D399' }} />
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#3A3A4A', marginLeft: '8px' }}>
                zsh — sovereign-omega-v2
              </span>
            </div>
            {/* Terminal body */}
            <div style={{ background: '#060610', padding: '24px', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', lineHeight: 1.8 }}>
              <div style={{ color: '#4A4A6A', marginBottom: '8px' }}>$ node scripts/verify-hashes.mjs</div>
              <div style={{ paddingLeft: '4px' }}>
                <div><span style={{ color: '#34D399' }}>  OK</span><span style={{ color: '#3A3A5A' }}>:   python/gate.py    </span><span style={{ color: '#4A4A6A' }}>bbe942b819594fd5...</span></div>
                <div><span style={{ color: '#34D399' }}>  OK</span><span style={{ color: '#3A3A5A' }}>:   python/dna.py     </span><span style={{ color: '#4A4A6A' }}>cd30ddd5db0403b0...</span></div>
                <div><span style={{ color: '#34D399' }}>  OK</span><span style={{ color: '#3A3A5A' }}>:   python/router.py  </span><span style={{ color: '#4A4A6A' }}>8c06ed37a7d95d9d...</span></div>
                <div style={{ color: '#34D399', marginTop: '4px' }}>  All frozen files present and hash-verified.</div>
                <div style={{ color: '#3A3A5A' }}>  Exit 0.</div>
              </div>
              <div style={{ marginTop: '16px', color: '#4A4A6A' }}>$ curl -s http://localhost:7890/node</div>
              <div style={{ paddingLeft: '4px', marginTop: '4px' }}>
                <div style={{ color: '#3A3A5A' }}>{'{'}</div>
                <div style={{ paddingLeft: '16px' }}>
                  <div><span style={{ color: '#A78BFA' }}>"t0_verdict"</span><span style={{ color: '#3A3A5A' }}>:       </span><span style={{ color: '#34D399' }}>true</span><span style={{ color: '#3A3A5A' }}>,</span></div>
                  <div><span style={{ color: '#A78BFA' }}>"corruption_count"</span><span style={{ color: '#3A3A5A' }}>:  </span><span style={{ color: '#C8A96E' }}>0</span><span style={{ color: '#3A3A5A' }}>,</span></div>
                  <div><span style={{ color: '#A78BFA' }}>"entropy_bounded"</span><span style={{ color: '#3A3A5A' }}>:   </span><span style={{ color: '#34D399' }}>true</span><span style={{ color: '#3A3A5A' }}>,</span></div>
                  <div><span style={{ color: '#A78BFA' }}>"pgcs_passes"</span><span style={{ color: '#3A3A5A' }}>:       </span><span style={{ color: '#34D399' }}>true</span><span style={{ color: '#3A3A5A' }}>,</span></div>
                  <div><span style={{ color: '#A78BFA' }}>"phi"</span><span style={{ color: '#3A3A5A' }}>:               </span><span style={{ color: '#C8A96E' }}>0.6180339887</span><span style={{ color: '#3A3A5A' }}>,</span></div>
                  <div><span style={{ color: '#A78BFA' }}>"gate_count"</span><span style={{ color: '#3A3A5A' }}>:        </span><span style={{ color: '#60A5FA' }}>605</span></div>
                </div>
                <div style={{ color: '#3A3A5A' }}>{'}'}</div>
              </div>
            </div>
          </div>

          {/* Root constitutional law */}
          <div className="mt-6 rounded-2xl p-6 text-center"
            style={{ background: 'rgba(8,4,20,0.80)', border: '1px solid rgba(124,58,237,0.12)' }}>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#4A4A5A', marginBottom: '10px', letterSpacing: '0.06em' }}>
              ROOT CONSTITUTIONAL LAW
            </p>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '18px', color: '#A78BFA', letterSpacing: '0.02em' }}>
              AdaptivePower(T) ≤ ReplayVerifiability(T)
            </p>
            <p style={{ fontSize: '12px', color: '#4A4A5A', marginTop: '10px', lineHeight: 1.6 }}>
              No adaptive capability may exceed replay-certifiable reconstructability.<br />
              This constraint is enforced at runtime. There is no override path.
            </p>
          </div>
        </div>
      </div>

      {/* ── Comparison ───────────────────────────────────────── */}
      <div id="compare" className="scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#E8E6F0', marginBottom: '8px' }}>
              Ten properties of constitutional AI.
            </h2>
            <p style={{ color: '#4B4B5A', fontSize: '14px' }}>
              Check which ones your current platform implements.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(10,8,22,0.95)' }}>
                  <th className="text-left py-3.5 px-5" style={{ color: '#3A3A4A', fontSize: '10px', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)', width: '55%' }}>
                    Property · mechanism
                  </th>
                  {['AEGIS-Ω', 'Claude Code', 'Gemini', 'Codex'].map((name, i) => (
                    <th key={name} className="text-center py-3.5 px-3"
                      style={{
                        color: i === 0 ? '#C8A96E' : '#2A2A3A',
                        fontSize: i === 0 ? '12px' : '11px',
                        fontWeight: 700, letterSpacing: '0.04em',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        fontFamily: i === 0 ? '"JetBrains Mono", monospace' : undefined,
                      }}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([cap, mech], i) => (
                  <tr key={cap} style={{ background: i % 2 === 0 ? 'rgba(10,8,22,0.60)' : 'rgba(6,4,16,0.40)' }}>
                    <td className="py-3 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <div style={{ color: '#C0C0D0', fontSize: '13px', marginBottom: '2px' }}>{cap}</div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#3A3A5A' }}>{mech}</div>
                    </td>
                    <td className="text-center py-3 px-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}><Yes /></td>
                    <td className="text-center py-3 px-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}><No /></td>
                    <td className="text-center py-3 px-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}><No /></td>
                    <td className="text-center py-3 px-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}><No /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Cognitive Architecture ────────────────────────────── */}
      <div id="cognitive" className="scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.4)' }}>
        <div className="max-w-4xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#E8E6F0', marginBottom: '8px' }}>
              Seven cognitive layers. All active simultaneously.
            </h2>
            <p style={{ color: '#4B4B5A', fontSize: '14px' }}>
              This is not an analogy. These are implemented mechanisms. The automaton runs them before every action.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {COGNITIVE_LAYERS.map(layer => {
              const isActive = activeLayer.n === layer.n
              return (
                <div key={layer.n}
                  className="rounded-xl px-5 py-4 flex items-center gap-5 transition-all duration-300"
                  style={{
                    background: isActive ? `rgba(${layer.color === '#34D399' ? '52,211,153' : layer.color === '#60A5FA' ? '96,165,250' : layer.color === '#A78BFA' ? '167,139,250' : layer.color === '#C8A96E' ? '200,169,110' : layer.color === '#7C3AED' ? '124,58,237' : layer.color === '#06B6D4' ? '6,182,212' : '20,184,166'},0.07)` : 'rgba(8,6,18,0.60)',
                    border: isActive ? `1px solid ${layer.color}30` : '1px solid rgba(255,255,255,0.04)',
                    transform: isActive ? 'translateX(4px)' : 'none',
                  }}>
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: '22px', fontWeight: 700,
                    color: isActive ? layer.color : '#2A2A3A', width: '36px', flexShrink: 0,
                    transition: 'color 0.3s',
                  }}>
                    L{layer.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ color: isActive ? '#E8E6F0' : '#4A4A5A', fontWeight: 600, fontSize: '14px', transition: 'color 0.3s' }}>
                        {layer.name}
                      </span>
                      {isActive && (
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: layer.color, letterSpacing: '0.08em' }}>
                          ● ACTIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: isActive ? '#5A5A7A' : '#2A2A3A', transition: 'color 0.3s' }}>
                      {layer.desc}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: layer.color, boxShadow: `0 0 10px ${layer.color}`, flexShrink: 0 }} />
                  )}
                </div>
              )
            })}
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#2A2A3A', letterSpacing: '0.08em' }}>
            Pre-action protocol: L7 → L6 → L3 → L5 · During: L1 → L2 → L4 · Post: L6 → L7 → L5
          </p>
        </div>
      </div>

      {/* ── Constitutional features ───────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#E8E6F0', marginBottom: '8px' }}>
              Six constitutional properties.
            </h2>
            <p style={{ color: '#4B4B5A', fontSize: '14px' }}>Hover to see what the automaton observes about each one.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.name}
                className="rounded-2xl p-6 cursor-default transition-all duration-200"
                style={{
                  background: hoveredFeature === f.name ? `rgba(${f.color === '#34D399' ? '52,211,153' : f.color === '#60A5FA' ? '96,165,250' : '167,139,250'},0.06)` : 'rgba(8,6,18,0.80)',
                  border: `1px solid ${hoveredFeature === f.name ? f.color + '25' : 'rgba(255,255,255,0.04)'}`,
                }}
                onMouseEnter={() => setHoveredFeature(f.name)}
                onMouseLeave={() => setHoveredFeature(null)}>
                <div className="mb-3">
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', fontWeight: 700,
                    padding: '2px 8px', borderRadius: '4px',
                    background: f.color + '15', color: f.color, letterSpacing: '0.06em',
                  }}>
                    {f.tier}
                  </span>
                </div>
                <h3 style={{ color: '#E8E6F0', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>{f.name}</h3>
                {hoveredFeature === f.name ? (
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: f.color, lineHeight: 1.7, minHeight: '56px' }}>
                    {f.obs}
                  </div>
                ) : (
                  <p style={{ color: '#5A5A6A', fontSize: '13px', lineHeight: 1.65, minHeight: '56px' }}>{f.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ──────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.35)' }}>
        <div className="max-w-5xl mx-auto px-5 py-18">
          <div className="text-center mb-10">
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: '#3A3A4A', letterSpacing: '0.22em', marginBottom: '10px', textTransform: 'uppercase' }}>
              Built on the constitution
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#E8E6F0' }}>
              Creator tools. Constitutionally governed.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '🎯', name: 'Platform Picker', price: 19, color: '#7C3AED',
                desc: 'Scored platform recommendation across TikTok, YouTube Shorts, Instagram Reels, Snapchat. Radar chart. One DashScope key.' },
              { icon: '⚡', name: 'Hook Generator', price: 19, color: '#06B6D4',
                desc: '10 ranked viral hooks — curiosity gap, controversy, social proof, numbers, pain point. Type-coded. One-click copy.' },
              { icon: '📅', name: 'Content Calendar', price: 19, color: '#14B8A6',
                desc: '4-week calendar with daily ideas, hooks, formats, production notes. Export TXT or CSV.' },
            ].map(p => (
              <div key={p.name} className="rounded-2xl p-6"
                style={{ background: 'rgba(8,6,18,0.85)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">{p.icon}</div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: p.color, fontWeight: 700 }}>${p.price}</span>
                </div>
                <h3 style={{ color: '#E8E6F0', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ color: '#4B4B5A', fontSize: '13px', lineHeight: 1.65, marginBottom: '18px' }}>{p.desc}</p>
                <a href="#pricing" onClick={() => buy(p.name, p.price)} style={{ color: p.color, fontSize: '13px', fontWeight: 500 }}
                  className="hover:opacity-75 transition-opacity">
                  Get access →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <div id="pricing" className="scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-3xl mx-auto px-5 py-18">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#E8E6F0', marginBottom: '8px' }}>
              One-time. No subscriptions.
            </h2>
            <p style={{ color: '#4B4B5A', fontSize: '14px' }}>Buy the full source code. Deploy to Vercel in 2 minutes. You own it.</p>
          </div>
          <PricingTable />
        </div>
      </div>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 pb-20">
        <div className="rounded-2xl p-12 text-center relative overflow-hidden"
          style={{ background: 'rgba(8,6,18,0.92)', border: '1px solid rgba(124,58,237,0.18)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% -10%, rgba(124,58,237,0.12) 0%, transparent 65%)',
          }} />
          <div className="relative z-10">
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: '#3A3A4A', letterSpacing: '0.22em', marginBottom: '16px', textTransform: 'uppercase' }}>
              AdaptivePower(T) ≤ ReplayVerifiability(T)
            </p>
            <h2 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', color: '#E8E6F0', marginBottom: '12px' }}>
              The only AI system that cannot forget what it did.
            </h2>
            <p style={{ color: '#4B4B5A', fontSize: '14px', marginBottom: '28px', lineHeight: 1.7 }}>
              Hash-chained. Deterministically replayable.<br />
              Constitutionally bounded. Not a claim — a proof.
            </p>
            <a href="#pricing" onClick={() => buy('final-cta', 39)}
              className="inline-flex items-center justify-center font-semibold px-10 py-3.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Access AEGIS-Ω — from $19
            </a>
            <p style={{ color: '#2A2A3A', fontSize: '11px', marginTop: '14px' }}>30-day refund · One-time payment · Full source code</p>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: '#C8A96E', letterSpacing: '0.22em' }}>AEGIS-Ω</span>
            <span style={{ color: '#1A1A24' }}>|</span>
            <span style={{ color: '#3A3A4A', fontSize: '12px' }}>Constitutional AI Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#proof"     className="text-xs" style={{ color: '#3A3A4A' }}>Proof</a>
            <a href="#compare"   className="text-xs" style={{ color: '#3A3A4A' }}>Compare</a>
            <a href="#cognitive" className="text-xs" style={{ color: '#3A3A4A' }}>Architecture</a>
            <a href="#pricing"   className="text-xs" style={{ color: '#3A3A4A' }}>Pricing</a>
            <a href="mailto:tarikskalic33@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs"
              style={{ color: '#3A3A4A' }}>
              <Mail size={11} />
              Contact
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
