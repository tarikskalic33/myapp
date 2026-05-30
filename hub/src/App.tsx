// EPISTEMIC TIER: T3 — visual projection layer; no governance authority
import { useEffect, useRef } from 'react'
import { PricingTable } from './components/PricingTable.js'
import { SuccessPage } from './components/SuccessPage.js'
import { Mail } from 'lucide-react'

function captureEvent(event: string, props?: Record<string, unknown>): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ph = (window as any).posthog
  if (typeof ph?.capture === 'function') ph.capture(event, props)
}

function Yes() {
  return <span style={{ color: '#34D399', fontWeight: 700, fontSize: '16px' }}>✓</span>
}
function No() {
  return <span style={{ color: '#F87171', fontWeight: 700, fontSize: '16px' }}>✗</span>
}

const COMPARISON_CAPS = [
  'Hash-chained audit trail',
  'Deterministic session replay',
  'BFT multi-model consensus at 1/φ',
  'Martingale drift gate',
  'Epistemic tier classification (T0–T5)',
  'φ-bounded adaptation rate',
  'Autopoietic constitutional membrane',
  'EU AI Act Art. 12 compliance built-in',
  'Frozen invariant files (SHA-256 locked)',
  'RALPH Fibonacci executor',
]

const METRICS = [
  { label: 'Rust gate tests', value: '6,850', color: '#34D399' },
  { label: 'TS tests',        value: '3,176', color: '#60A5FA' },
  { label: 'Gates complete',  value: '605',   color: '#A78BFA' },
  { label: 'Corruption',      value: '0',     color: '#C8A96E' },
]

const FEATURES = [
  {
    tier: 'T0',
    name: 'Replay sovereignty',
    desc: 'Every decision is cryptographically logged and deterministically replayable across Linux, macOS, Docker, WASM, ARM, x86. Same input — always identical output.',
    color: '#34D399',
  },
  {
    tier: 'T0',
    name: 'Constitutional membrane',
    desc: 'Three SHA-256-verified files form an unbreakable boundary. Any mutation triggers T0_ABORT before it can propagate upward through the holonic stack.',
    color: '#34D399',
  },
  {
    tier: 'T1',
    name: 'BFT quorum at 1/φ',
    desc: 'Claude + GPT-4o + Qwen vote on every governance decision. The golden ratio defines the Byzantine fault-tolerance threshold. Three models. One constitution.',
    color: '#60A5FA',
  },
  {
    tier: 'T1',
    name: 'Martingale gating',
    desc: 'Adaptation halts the moment drift exceeds the entropy ceiling. The system cannot mutate faster than it can verify. E[S_{n+1}|F_n] = S_n.',
    color: '#60A5FA',
  },
  {
    tier: 'T2',
    name: '605-gate inference fabric',
    desc: 'The aegis-cl-psi Rust crate implements EU AI Act Article 12 audit chains across 605 verification gates. 6,850 tests. Zero exceptions.',
    color: '#A78BFA',
  },
  {
    tier: 'T2',
    name: 'RALPH executor',
    desc: 'Read → Assess → Lock → Propagate → Harmonize. Fibonacci-paced. No action leaves the cycle without a hash-chain certificate.',
    color: '#A78BFA',
  },
]

const SCALES = [
  { scale: 'FIELD',     desc: 'Commercial products · Claude · ChatGPT · Qwen operators',    w: '100%', color: '#A78BFA' },
  { scale: 'ORGANISM',  desc: 'Python bridge (bridge.py · port 7890) · governance bus',      w: '85%',  color: '#7C3AED' },
  { scale: 'CELLULAR',  desc: 'TypeScript runtime · hash-chained event ledger · BFT swarm', w: '72%',  color: '#06B6D4' },
  { scale: 'MOLECULAR', desc: 'Rust gossip + math fabric · 605 gate modules · EU AI Act',   w: '58%',  color: '#14B8A6' },
  { scale: 'ATOMIC',    desc: 'Seven-Pillar runtime · StateAnchor · GossipEmitter',          w: '45%',  color: '#34D399' },
  { scale: 'SUBATOMIC', desc: 'Byte invariants · SHA-256 chain · deterministic hash inputs', w: '32%',  color: '#C8A96E' },
]

export default function App() {
  if (window.location.pathname === '/success') return <SuccessPage />

  const trialStartRef = useRef(Date.now())

  useEffect(() => {
    captureEvent('trial_started', { product: 'hub', source: document.referrer || 'direct' })
  }, [])

  const buy = (product: string, price: number) => {
    const ttv = Math.round((Date.now() - trialStartRef.current) / 1000)
    captureEvent('conversion', { product, price, ttv_seconds: ttv })
  }

  return (
    <div className="min-h-screen text-hub-text" style={{ background: '#030510', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50"
        style={{ borderBottom: '1px solid rgba(200,169,110,0.10)', background: 'rgba(3,5,16,0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <span style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.22em', color: '#C8A96E', fontSize: '13px', fontWeight: 700 }}>
            AEGIS-Ω
          </span>
          <div className="flex items-center gap-7">
            <a href="#why"      className="hidden sm:block text-xs transition-colors" style={{ color: '#6B6B7A' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ECEAE3' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#6B6B7A' }}>Why</a>
            <a href="#features" className="hidden sm:block text-xs transition-colors" style={{ color: '#6B6B7A' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ECEAE3' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#6B6B7A' }}>Architecture</a>
            <a href="#pricing"  className="hidden sm:block text-xs transition-colors" style={{ color: '#6B6B7A' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ECEAE3' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#6B6B7A' }}>Pricing</a>
            <a href="#pricing" onClick={() => buy('nav', 39)}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Get access
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero (cosmic portal) ─────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: '100vh' }}>

        {/* Deep space base */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 35%, #0E0526 0%, #07031A 35%, #030510 65%, #010108 100%)',
        }} />

        {/* Nebula cluster — upper left */}
        <div className="absolute pointer-events-none" style={{
          top: '5%', left: '3%', width: '340px', height: '260px',
          background: 'radial-gradient(ellipse at 40% 50%, rgba(124,58,237,0.22) 0%, rgba(6,182,212,0.08) 45%, transparent 70%)',
          borderRadius: '50%', transform: 'rotate(-18deg)',
        }} />

        {/* Nebula cluster — lower right */}
        <div className="absolute pointer-events-none" style={{
          bottom: '8%', right: '5%', width: '320px', height: '200px',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(6,182,212,0.18) 0%, rgba(20,184,166,0.08) 50%, transparent 70%)',
          borderRadius: '50%', transform: 'rotate(12deg)',
        }} />

        {/* Small galaxy — mid right */}
        <div className="absolute pointer-events-none" style={{
          top: '35%', right: '10%', width: '140px', height: '90px',
          background: 'radial-gradient(ellipse at center, rgba(200,169,110,0.15) 0%, rgba(124,58,237,0.06) 60%, transparent 100%)',
          borderRadius: '50%', transform: 'rotate(-30deg)',
        }} />

        {/* Stars (scattered) */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            radial-gradient(1.2px 1.2px at 8%   14%, rgba(255,255,255,0.90) 0%, transparent 100%),
            radial-gradient(1px   1px   at 84%  9%,  rgba(255,255,255,0.70) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 27%  72%, rgba(255,255,255,0.80) 0%, transparent 100%),
            radial-gradient(1px   1px   at 68%  48%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 52%  18%, rgba(200,169,110,1.00) 0%, transparent 100%),
            radial-gradient(1px   1px   at 19%  38%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px   1px   at 91%  63%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1.2px 1.2px at 43%  87%, rgba(200,169,110,0.75) 0%, transparent 100%),
            radial-gradient(1px   1px   at 13%  91%, rgba(255,255,255,0.50) 0%, transparent 100%),
            radial-gradient(1px   1px   at 76%  27%, rgba(255,255,255,0.85) 0%, transparent 100%),
            radial-gradient(1px   1px   at 35%  5%,  rgba(255,255,255,0.60) 0%, transparent 100%),
            radial-gradient(1px   1px   at 62%  80%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px   1px   at 5%   55%, rgba(200,169,110,0.60) 0%, transparent 100%),
            radial-gradient(1px   1px   at 97%  40%, rgba(255,255,255,0.70) 0%, transparent 100%)
          `,
        }} />

        {/* Golden light streams */}
        <div className="absolute pointer-events-none" style={{
          top: '12%', left: '8%', width: '3px', height: '220px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200,169,110,0.45) 50%, transparent 100%)',
          transform: 'rotate(32deg)', borderRadius: '2px',
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '18%', right: '10%', width: '2px', height: '160px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200,169,110,0.30) 50%, transparent 100%)',
          transform: 'rotate(-22deg)', borderRadius: '2px',
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '18%', left: '18%', width: '2px', height: '130px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(124,58,237,0.40) 50%, transparent 100%)',
          transform: 'rotate(18deg)', borderRadius: '2px',
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '50%', right: '22%', width: '2px', height: '100px',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(6,182,212,0.30) 50%, transparent 100%)',
          transform: 'rotate(-45deg)', borderRadius: '2px',
        }} />

        {/* The constitutional arch */}
        <div className="absolute left-1/2 pointer-events-none" style={{ top: '6%', transform: 'translateX(-50%)', width: '500px', height: '600px' }}>
          {/* Outermost halo */}
          <div style={{
            position: 'absolute', inset: '-20px 0 0 0',
            borderRadius: '270px 270px 0 0',
            background: 'transparent',
            boxShadow: '0 0 80px rgba(124,58,237,0.30), 0 0 160px rgba(124,58,237,0.10)',
          }} />
          {/* Outer arch border — purple */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '250px 250px 0 0',
            background: 'transparent',
            border: '1px solid rgba(124,58,237,0.38)',
            boxShadow: '0 0 40px rgba(124,58,237,0.25), inset 0 0 60px rgba(124,58,237,0.06)',
          }} />
          {/* Inner edge — cyan */}
          <div style={{
            position: 'absolute', inset: '4px',
            borderRadius: '247px 247px 0 0',
            background: 'transparent',
            border: '1px solid rgba(6,182,212,0.22)',
            boxShadow: 'inset 0 0 30px rgba(6,182,212,0.05)',
          }} />
          {/* Interior atmosphere */}
          <div style={{
            position: 'absolute', inset: '10px',
            borderRadius: '241px 241px 0 0',
            background: 'radial-gradient(ellipse at 50% 85%, rgba(20,184,166,0.09) 0%, rgba(124,58,237,0.07) 45%, transparent 75%)',
          }} />
          {/* Keystone — gold */}
          <div style={{
            position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)',
            width: '28px', height: '14px',
            background: 'linear-gradient(180deg, #C8A96E 0%, #8B7050 100%)',
            borderRadius: '14px 14px 0 0',
            boxShadow: '0 0 20px rgba(200,169,110,0.80), 0 0 40px rgba(200,169,110,0.30)',
          }} />
          {/* Left pillar glow */}
          <div style={{
            position: 'absolute', bottom: 0, left: '2px', width: '12px', height: '80px',
            background: 'linear-gradient(to top, rgba(124,58,237,0.30) 0%, transparent 100%)',
            borderRadius: '2px',
          }} />
          {/* Right pillar glow */}
          <div style={{
            position: 'absolute', bottom: 0, right: '2px', width: '12px', height: '80px',
            background: 'linear-gradient(to top, rgba(6,182,212,0.30) 0%, transparent 100%)',
            borderRadius: '2px',
          }} />
        </div>

        {/* Hero text — above the arch midpoint */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-5"
          style={{ paddingTop: '22vh', paddingBottom: '8vh' }}>

          {/* Constitutional status pill */}
          <div className="inline-flex items-center gap-2 mb-7 px-5 py-2 rounded-full"
            style={{ background: 'rgba(200,169,110,0.07)', border: '1px solid rgba(200,169,110,0.18)', backdropFilter: 'blur(8px)' }}>
            <div style={{ width: '7px', height: '7px', background: '#34D399', borderRadius: '50%', boxShadow: '0 0 10px #34D399' }} />
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#C8A96E', letterSpacing: '0.25em' }}>
              t0_verdict: true · corruption_count: 0
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(46px, 8vw, 82px)', fontWeight: 800, letterSpacing: '-0.03em',
            lineHeight: 1.02, marginBottom: '22px',
          }}>
            <span style={{ color: '#ECEAE3' }}>The AI platform</span><br />
            <span style={{
              background: 'linear-gradient(135deg, #C8A96E 0%, #A78BFA 45%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              with a constitution.
            </span>
          </h1>

          <p style={{ color: '#8A8A9A', fontSize: '18px', maxWidth: '540px', lineHeight: 1.65, marginBottom: '38px' }}>
            Every decision hash-chained. Every session replayable.
            BFT consensus at 1/φ. The only AI system with a
            self-verifying constitutional membrane.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-18">
            <a href="#pricing" onClick={() => buy('hero', 39)}
              className="inline-flex items-center justify-center font-semibold px-9 py-4 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Access the platform
            </a>
            <a href="#why"
              className="inline-flex items-center justify-center font-medium px-9 py-4 rounded-xl text-sm transition-all hover:opacity-80"
              style={{ border: '1px solid rgba(200,169,110,0.22)', color: '#C8A96E', background: 'rgba(200,169,110,0.04)' }}>
              See the proof →
            </a>
          </div>

          {/* Live metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mt-8">
            {METRICS.map(m => (
              <div key={m.label} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(12,14,24,0.85)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '20px', fontWeight: 700, color: m.color, marginBottom: '5px' }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '10px', color: '#5A5A6A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why AEGIS-Ω ───────────────────────────────────────── */}
      <div id="why" className="scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(3,3,12,0.6)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ECEAE3', marginBottom: '10px' }}>
              What Claude Code, Gemini, and Codex can't do
            </h2>
            <p style={{ color: '#6B6B7A', fontSize: '15px' }}>
              Constitutional AI is not a feature. It is an architecture.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(15,17,28,0.9)' }}>
                  <th className="text-left py-3 px-5" style={{ color: '#6B6B7A', fontSize: '11px', letterSpacing: '0.09em', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    Capability
                  </th>
                  {(['AEGIS-Ω', 'Claude Code', 'Gemini', 'Codex'] as const).map((name, i) => (
                    <th key={name} className="text-center py-3 px-4"
                      style={{
                        color: i === 0 ? '#C8A96E' : '#4B4B5A',
                        fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontFamily: i === 0 ? '"JetBrains Mono", monospace' : undefined,
                      }}>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_CAPS.map((cap, i) => (
                  <tr key={cap} style={{ background: i % 2 === 0 ? 'rgba(15,17,28,0.60)' : 'rgba(10,12,22,0.40)' }}>
                    <td className="py-3 px-5" style={{ color: '#C8C8D0', fontSize: '13px' }}>{cap}</td>
                    <td className="text-center py-3 px-4"><Yes /></td>
                    <td className="text-center py-3 px-4"><No /></td>
                    <td className="text-center py-3 px-4"><No /></td>
                    <td className="text-center py-3 px-4"><No /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Architecture / Features ──────────────────────────── */}
      <div id="features" className="scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ECEAE3', marginBottom: '10px' }}>
              Six holonic scales. One constitutional fabric.
            </h2>
            <p style={{ color: '#6B6B7A', fontSize: '15px' }}>
              SUBATOMIC → ATOMIC → MOLECULAR → CELLULAR → ORGANISM → FIELD
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {FEATURES.map(f => (
              <div key={f.name} className="rounded-2xl p-6"
                style={{ background: 'rgba(12,14,24,0.80)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="mb-3">
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', fontWeight: 700,
                    padding: '2px 8px', borderRadius: '4px',
                    background: f.color + '18', color: f.color,
                    letterSpacing: '0.06em',
                  }}>
                    {f.tier}
                  </span>
                </div>
                <h3 style={{ color: '#ECEAE3', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>{f.name}</h3>
                <p style={{ color: '#6B6B7A', fontSize: '13px', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Scale hierarchy */}
          <div className="rounded-2xl p-7" style={{ background: 'rgba(12,14,24,0.60)', border: '1px solid rgba(200,169,110,0.09)' }}>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#C8A96E', letterSpacing: '0.12em', marginBottom: '18px', textTransform: 'uppercase' }}>
              Holonic scale hierarchy
            </p>
            <div className="flex flex-col gap-2.5">
              {SCALES.map(s => (
                <div key={s.scale} className="flex items-center gap-4">
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: s.color, width: '88px', flexShrink: 0, letterSpacing: '0.04em' }}>
                    {s.scale}
                  </span>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '5px', height: '26px', position: 'relative' }}>
                    <div style={{
                      width: s.w, height: '100%', borderRadius: '5px',
                      background: s.color + '16', borderLeft: `2px solid ${s.color}50`,
                      display: 'flex', alignItems: 'center', paddingLeft: '10px',
                    }}>
                      <span style={{ fontSize: '11px', color: '#5A5A6A' }}>{s.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Products (powered by AEGIS) ──────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(3,3,12,0.5)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#C8A96E', letterSpacing: '0.22em', marginBottom: '12px', textTransform: 'uppercase' }}>
              Built on the constitution
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ECEAE3' }}>
              Creator tools. Constitutionally governed.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '🎯', name: 'Platform Picker', price: 19, color: '#7C3AED',
                desc: 'Scored AI platform recommendation across TikTok, YouTube Shorts, Instagram Reels, and Snapchat. Radar chart. One DashScope key.' },
              { icon: '⚡', name: 'Hook Generator', price: 19, color: '#06B6D4',
                desc: '10 ranked viral hooks — curiosity gap, controversy, social proof, numbers, pain point. Each typed, each copyable in one click.' },
              { icon: '📅', name: 'Content Calendar', price: 19, color: '#14B8A6',
                desc: 'A full 4-week content calendar with daily ideas, hooks, formats, and production notes. Export as TXT or CSV.' },
            ].map(p => (
              <div key={p.name} className="rounded-2xl p-6"
                style={{ background: 'rgba(12,14,24,0.85)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">{p.icon}</div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: p.color, fontWeight: 700 }}>
                    ${p.price}
                  </span>
                </div>
                <h3 style={{ color: '#ECEAE3', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ color: '#6B6B7A', fontSize: '13px', lineHeight: 1.65, marginBottom: '18px' }}>{p.desc}</p>
                <a href="#pricing" onClick={() => buy(p.name, p.price)}
                  style={{ color: p.color, fontSize: '13px', fontWeight: 500 }}
                  className="hover:opacity-75 transition-opacity">
                  Get access →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <div id="pricing" className="scroll-mt-16" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-3xl mx-auto px-5 py-20">
          <div className="text-center mb-10">
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ECEAE3', marginBottom: '8px' }}>
              One-time. No subscriptions.
            </h2>
            <p style={{ color: '#6B6B7A', fontSize: '14px' }}>
              Buy the full source code. Deploy to Vercel in 2 minutes. You own it.
            </p>
          </div>
          <PricingTable />
        </div>
      </div>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 pb-20">
        <div className="rounded-2xl p-12 text-center relative overflow-hidden"
          style={{ background: 'rgba(12,14,24,0.90)', border: '1px solid rgba(124,58,237,0.22)' }}>
          {/* Arch echo */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 65%)',
          }} />
          <div className="relative z-10">
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#C8A96E', letterSpacing: '0.22em', marginBottom: '18px', textTransform: 'uppercase' }}>
              Constitutional sovereignty
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#ECEAE3', marginBottom: '12px' }}>
              The only AI platform that proves it works.
            </h2>
            <p style={{ color: '#6B6B7A', fontSize: '14px', marginBottom: '30px', lineHeight: 1.65 }}>
              Hash-chained. Deterministically replayable. Constitutionally bounded.<br />
              Not a claim — a proof.
            </p>
            <a href="#pricing" onClick={() => buy('final-cta', 39)}
              className="inline-flex items-center justify-center font-semibold px-10 py-4 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Access AEGIS-Ω — from $19
            </a>
            <p style={{ color: '#4B4B5A', fontSize: '11px', marginTop: '16px' }}>
              30-day refund · One-time payment · Full source code
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: '#C8A96E', letterSpacing: '0.22em' }}>
              AEGIS-Ω
            </span>
            <span style={{ color: '#1E1E2A' }}>|</span>
            <span style={{ color: '#4B4B5A', fontSize: '12px' }}>Constitutional AI Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#why"      className="text-xs transition-colors" style={{ color: '#4B4B5A' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ECEAE3' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#4B4B5A' }}>Compare</a>
            <a href="#features" className="text-xs transition-colors" style={{ color: '#4B4B5A' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ECEAE3' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#4B4B5A' }}>Architecture</a>
            <a href="#pricing"  className="text-xs transition-colors" style={{ color: '#4B4B5A' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ECEAE3' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#4B4B5A' }}>Pricing</a>
            <a href="mailto:tarikskalic33@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: '#4B4B5A' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ECEAE3' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#4B4B5A' }}>
              <Mail size={11} />
              Contact
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
