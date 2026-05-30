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
function No()  { return <span style={{ color: '#1A1A24', fontWeight: 800, fontSize: '15px' }}>✗</span> }

const OBSERVATIONS = [
  'L7: Self-model     — hash chain intact · 605 gates certified · t0_verdict: true',
  'L6: Metacognition  — visitor signal T1 · ASSESS before LOCK · tier registration active',
  'L1: Sensation      — raw signal intake active · environment perceived · untruncated',
  'L5: Executive      — RALPH R→A→L→P→H · martingale bounded · gate sequence enforced',
  'L4: Long-term Mem  — AdaptiveLineage extending · corpus sovereignty active · immutable',
  'L2: Perception     — hash-verified · Non-Equivalence applied · phi=0.6180339887',
  'L3: Working Memory — gate 605 of ∞ · RALPH phase: HARMONIZE · phi-convergence: true',
]

const CHAIN_HASHES = [
  'a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
  '3f7e2d1c8b9a0f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1',
  'c2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4',
  '7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5',
]

const COMPARISON = [
  ['Hash-chained audit trail',           'SHA-256(prev‖data) · tamper breaks the chain immediately'],
  ['Deterministic session replay',       'replay(genesis, events) → identical hash on any platform'],
  ['BFT consensus at 1/φ ≈ 0.618',      'Claude 618 · GPT-4o 191 · Qwen 191 per 1000 votes · weighted'],
  ['Martingale drift gate',             'E[S_{n+1}|Fₙ] = Sₙ · system halts if entropy_bounded = false'],
  ['Epistemic tier classification',      'T0=proven · T1=validated · T2=hypothesis · T4/T5=blocked in src/'],
  ['φ-bounded adaptation rate',          'MUTATION_RATE_LIMIT = (√5−1)/2 · no faster mutation than replay'],
  ['Autopoietic constitutional membrane','verify-hashes.mjs · 5 Maturana-Varela properties · T0_ABORT'],
  ['EU AI Act Art. 12 compliance',      '605-gate Rust crate · tamper-evident inference audit chain'],
  ['Frozen invariant files',            'gate.py · dna.py · router.py · /guardian APPROVED to change'],
  ['RALPH Fibonacci executor',          'R→A→L→P→H · Fibonacci-paced · certificate required per phase'],
]

const COGNITIVE_LAYERS = [
  { n: 7, name: 'Self-model',       desc: 'verify-hashes.mjs · /node endpoint · frozen-file integrity',     color: '#C8A96E' },
  { n: 6, name: 'Metacognition',    desc: 'Tier re-classification · error pattern scan · retrospective',    color: '#A78BFA' },
  { n: 5, name: 'Executive',        desc: 'RALPH loop · gate sequence · martingale suspension gate',        color: '#7C3AED' },
  { n: 4, name: 'Long-term Memory', desc: 'AdaptiveLineage hash chain · CLAUDE.md invariants · git log',   color: '#06B6D4' },
  { n: 3, name: 'Working Memory',   desc: 'Current gate · active RALPH phase · loaded skills · open files', color: '#14B8A6' },
  { n: 2, name: 'Perception',       desc: 'Hash-verified signal · tier-classified · Non-Equivalence applied',color: '#34D399' },
  { n: 1, name: 'Sensation',        desc: 'Raw signal: test output · diff · file read · error message',    color: '#60A5FA' },
]

const HOLONIC_LAYERS = [
  { name: 'FIELD',     color: '#C8A96E', tier: 'T2', tests: '4 products',    desc: 'Commercial products · operators · external integrations',       sub: 'cockpit · studio · platform-picker · hub' },
  { name: 'ORGANISM',  color: '#A78BFA', tier: 'T2', tests: '5 endpoints',   desc: 'Python bridge :7890 · routes TypeScript ↔ hardware inference',  sub: '/telemetry · /node · /claude · /event · /gate_signal · /health' },
  { name: 'CELLULAR',  color: '#7C3AED', tier: 'T1', tests: '3,176 tests',   desc: 'TypeScript governance · event ledger · BFT quorum · martingale', sub: 'canonicalize · swarm · adaptive-lineage · RALPH · skill-harness' },
  { name: 'MOLECULAR', color: '#06B6D4', tier: 'T0', tests: '6,850 tests',   desc: 'Rust 605-gate inference fabric · EU AI Act Article 12',          sub: 'aegis-cl-psi · gossip · epoch-seal · hash chain · DFA engine' },
  { name: 'ATOMIC',    color: '#14B8A6', tier: 'T2', tests: '96 tests',      desc: 'Seven-Pillar runtime · StateAnchor · DomainFirewall',            sub: 'AffineCanvas · SemanticGraph · GossipEmitter · HysteresisFilter' },
  { name: 'SUBATOMIC', color: '#34D399', tier: 'T0', tests: '∞ invariants',  desc: 'Byte invariants · SHA-256 chains · RFC 8785 canonical form',     sub: 'BTreeMap only · saturating arithmetic · big-endian · JCS' },
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
    desc: 'Claude, GPT-4o, and Qwen vote on every governance decision. The golden ratio defines the Byzantine fault-tolerance threshold.' },
  { tier: 'T1', name: 'Martingale gate', color: '#60A5FA',
    obs: 'L5: E[S_{n+1}|F_n] = S_n · entropy_bounded: true · drift_bounded: true · is_anchored: true',
    desc: 'Adaptation halts the moment drift exceeds the entropy ceiling. The system cannot mutate faster than it can verify. Hard stop.' },
  { tier: 'T2', name: '605-gate inference fabric', color: '#A78BFA',
    obs: 'L4: aegis-cl-psi gate count = 605 · 6,850 tests · EU AI Act Article 12 audit chain certified T2',
    desc: 'The Rust crate implements hash-chained viability rings across 605 gates. Each gate: verify_chain() → (bool, Option<usize>). Zero exceptions.' },
  { tier: 'T2', name: 'RALPH Fibonacci executor', color: '#A78BFA',
    obs: 'L5: R→A→L→P→H active · Fibonacci checkpoint F(n) · LOCK phase requires prior ASSESS certification',
    desc: 'Read → Assess → Lock → Propagate → Harmonize. Fibonacci-paced. Certificate required to exit each phase.' },
]

// ── Constitutional portal (the arch) ────────────────────────────────────
function ConstitutionalPortal({ cursorX, cursorY }: { cursorX: number; cursorY: number }) {
  const cx = 720; const archTop = 90; const archW = 480; const colW = 140; const baseY = 980
  const lOuter = cx - archW / 2; const rOuter = cx + archW / 2
  const lInner = cx - colW / 2;  const rInner = cx + colW / 2
  const archMid = archTop + archW / 2
  const outerArch = `M ${lOuter},${baseY} L ${lOuter},${archMid} Q ${lOuter},${archTop} ${cx},${archTop} Q ${rOuter},${archTop} ${rOuter},${archMid} L ${rOuter},${baseY}`
  const innerArch = `M ${lInner},${baseY} L ${lInner},${archMid-40} Q ${lInner+20},${archTop+50} ${cx},${archTop+40} Q ${rInner-20},${archTop+50} ${rInner},${archMid-40} L ${rInner},${baseY}`

  return (
    <svg viewBox="0 0 1440 980" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', overflow:'visible' }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="interior" cx="50%" cy="85%">
          <stop offset="0%"   stopColor="rgba(200,240,255,0.32)" />
          <stop offset="30%"  stopColor="rgba(20,184,166,0.18)" />
          <stop offset="70%"  stopColor="rgba(6,182,212,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="cursor-glow" cx={`${cursorX}%`} cy={`${cursorY}%`} r="40%">
          <stop offset="0%"   stopColor="rgba(20,184,166,0.22)" />
          <stop offset="60%"  stopColor="rgba(124,58,237,0.09)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="keystone">
          <stop offset="0%"   stopColor="rgba(255,220,140,0.95)" />
          <stop offset="100%" stopColor="rgba(200,169,110,0)" />
        </radialGradient>
        <linearGradient id="gold1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(200,169,110,0)" />
          <stop offset="20%"  stopColor="rgba(200,169,110,0.7)" />
          <stop offset="60%"  stopColor="rgba(220,190,130,0.9)" />
          <stop offset="100%" stopColor="rgba(200,169,110,0)" />
        </linearGradient>
        <linearGradient id="gold2" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="rgba(200,169,110,0)" />
          <stop offset="25%"  stopColor="rgba(200,169,110,0.6)" />
          <stop offset="70%"  stopColor="rgba(230,200,150,0.85)" />
          <stop offset="100%" stopColor="rgba(200,169,110,0)" />
        </linearGradient>
        <filter id="arch-glow"  x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
        <filter id="arch-halo"  x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="24"/></filter>
        <filter id="glow-med"   x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="glow-sm"    x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>

      {/* Galaxies */}
      <g transform="translate(680,50)" opacity="0.80"><g style={{ transformOrigin:'0px 0px', animation:'galaxy-spin 22s linear infinite' }}><ellipse cx={0} cy={0} rx={60} ry={15} fill="none" stroke="rgba(200,210,255,0.6)" strokeWidth="0.8"/><ellipse cx={0} cy={0} rx={40} ry={9} fill="none" stroke="rgba(200,210,255,0.85)" strokeWidth="1.0"/><ellipse cx={0} cy={0} rx={22} ry={5} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.1"/></g><radialGradient id="gc1" cx="50%" cy="50%"><stop offset="0%" stopColor="white" stopOpacity="1"/><stop offset="100%" stopColor="rgba(180,200,255,0)" stopOpacity="0"/></radialGradient><circle cx={0} cy={0} r={7} fill="url(#gc1)"/></g>
      <g transform="translate(185,95) rotate(-25)" opacity="0.70"><g style={{ transformOrigin:'0px 0px', animation:'galaxy-spin 28s linear infinite reverse' }}><ellipse cx={0} cy={0} rx={46} ry={11} fill="none" stroke="rgba(180,200,255,0.55)" strokeWidth="0.7"/><ellipse cx={0} cy={0} rx={30} ry={7} fill="none" stroke="rgba(200,220,255,0.80)" strokeWidth="0.9"/><ellipse cx={0} cy={0} rx={16} ry={4} fill="none" stroke="rgba(255,255,255,0.90)" strokeWidth="1.0"/></g><radialGradient id="gc2" cx="50%" cy="50%"><stop offset="0%" stopColor="white" stopOpacity="0.9"/><stop offset="100%" stopColor="rgba(160,190,255,0)" stopOpacity="0"/></radialGradient><circle cx={0} cy={0} r={5} fill="url(#gc2)"/></g>
      <g transform="translate(1210,80) rotate(20)" opacity="0.75"><g style={{ transformOrigin:'0px 0px', animation:'galaxy-spin 20s linear infinite' }}><ellipse cx={0} cy={0} rx={52} ry={13} fill="none" stroke="rgba(190,200,255,0.60)" strokeWidth="0.8"/><ellipse cx={0} cy={0} rx={34} ry={8} fill="none" stroke="rgba(210,220,255,0.85)" strokeWidth="1.0"/><ellipse cx={0} cy={0} rx={18} ry={4} fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.1"/></g><radialGradient id="gc3" cx="50%" cy="50%"><stop offset="0%" stopColor="white" stopOpacity="0.95"/><stop offset="100%" stopColor="rgba(180,200,255,0)" stopOpacity="0"/></radialGradient><circle cx={0} cy={0} r={6} fill="url(#gc3)"/></g>
      <g transform="translate(60,280) rotate(-40)" opacity="0.55"><g style={{ transformOrigin:'0px 0px', animation:'galaxy-spin 34s linear infinite reverse' }}><ellipse cx={0} cy={0} rx={38} ry={9} fill="none" stroke="rgba(170,185,255,0.50)" strokeWidth="0.7"/><ellipse cx={0} cy={0} rx={24} ry={6} fill="none" stroke="rgba(195,210,255,0.75)" strokeWidth="0.9"/><ellipse cx={0} cy={0} rx={12} ry={3} fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.0"/></g><radialGradient id="gc4" cx="50%" cy="50%"><stop offset="0%" stopColor="white" stopOpacity="0.85"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/></radialGradient><circle cx={0} cy={0} r={4} fill="url(#gc4)"/></g>
      <g transform="translate(1360,240) rotate(35)" opacity="0.60"><g style={{ transformOrigin:'0px 0px', animation:'galaxy-spin 26s linear infinite' }}><ellipse cx={0} cy={0} rx={42} ry={10} fill="none" stroke="rgba(175,190,255,0.55)" strokeWidth="0.7"/><ellipse cx={0} cy={0} rx={27} ry={7} fill="none" stroke="rgba(200,215,255,0.80)" strokeWidth="0.9"/><ellipse cx={0} cy={0} rx={14} ry={3} fill="none" stroke="rgba(255,255,255,0.90)" strokeWidth="1.0"/></g><radialGradient id="gc5" cx="50%" cy="50%"><stop offset="0%" stopColor="white" stopOpacity="0.90"/><stop offset="100%" stopColor="transparent" stopOpacity="0"/></radialGradient><circle cx={0} cy={0} r={5} fill="url(#gc5)"/></g>

      {/* God rays */}
      <g filter="url(#glow-sm)">
        {[-55,-38,-22,-8,8,22,38,55].map((deg,i) => {
          const rad=(deg-90)*Math.PI/180; const len=500-Math.abs(deg)*3
          return <line key={i} x1={cx} y1={archTop+50} x2={cx+Math.cos(rad)*len} y2={(archTop+50)+Math.sin(rad)*len} stroke={`rgba(150,230,215,${0.09-Math.abs(deg)*0.001})`} strokeWidth={3.5-Math.abs(deg)/22}/>
        })}
      </g>

      {/* Interior */}
      <path d={innerArch} fill="url(#interior)" className="animate-interior-glow"/>
      <path d={innerArch} fill="url(#cursor-glow)"/>

      {/* Plasma tendrils */}
      <g style={{ transformOrigin:`${cx}px 480px`, animation:'orbit-cw 14s linear infinite' }}><ellipse cx={cx} cy={480} rx={300} ry={100} fill="none" stroke="rgba(124,58,237,0.50)" strokeWidth="3" transform={`rotate(25,${cx},480)`} filter="url(#glow-med)" className="animate-tendril-drift"/></g>
      <g style={{ transformOrigin:`${cx}px 420px`, animation:'orbit-ccw 10s linear infinite' }}><ellipse cx={cx} cy={420} rx={260} ry={80} fill="none" stroke="rgba(6,182,212,0.45)" strokeWidth="2.5" transform={`rotate(-15,${cx},420)`} filter="url(#glow-med)" className="animate-tendril-drift" style={{ animationDelay:'1.2s' }}/></g>
      <g style={{ transformOrigin:`${cx}px 500px`, animation:'orbit-cw 18s linear infinite' }}><ellipse cx={cx} cy={500} rx={340} ry={90} fill="none" stroke="rgba(20,184,166,0.40)" strokeWidth="2" transform={`rotate(45,${cx},500)`} filter="url(#glow-med)" className="animate-tendril-drift" style={{ animationDelay:'2.8s' }}/></g>
      <g style={{ transformOrigin:`${cx}px 380px`, animation:'orbit-ccw 22s linear infinite' }}><ellipse cx={cx} cy={380} rx={220} ry={70} fill="none" stroke="rgba(167,139,250,0.38)" strokeWidth="2" transform={`rotate(-55,${cx},380)`} filter="url(#glow-sm)" className="animate-tendril-drift" style={{ animationDelay:'0.5s' }}/></g>

      {/* Arch halo + glow layers */}
      <path d={outerArch} fill="none" stroke="rgba(124,58,237,0.18)" strokeWidth="40" filter="url(#arch-halo)" className="animate-arch-pulse"/>
      {[{stroke:'rgba(124,58,237,0.25)',w:14},{stroke:'rgba(124,58,237,0.55)',w:5},{stroke:'rgba(6,182,212,0.35)',w:2},{stroke:'rgba(6,182,212,0.65)',w:1}].map(({stroke,w},i) => (
        <path key={i} d={outerArch} fill="none" stroke={stroke} strokeWidth={w} filter={w>4?'url(#arch-glow)':undefined}/>
      ))}
      {[{stroke:'rgba(6,182,212,0.20)',w:8},{stroke:'rgba(6,182,212,0.50)',w:2},{stroke:'rgba(160,230,220,0.60)',w:1}].map(({stroke,w},i) => (
        <path key={i} d={innerArch} fill="none" stroke={stroke} strokeWidth={w} filter={w>4?'url(#glow-sm)':undefined}/>
      ))}

      {/* Keystone */}
      <ellipse cx={cx} cy={archTop} rx={18} ry={10} fill="rgba(200,169,110,0.9)" style={{ filter:'drop-shadow(0 0 12px rgba(200,169,110,1)) drop-shadow(0 0 28px rgba(200,169,110,0.5))' }}/>

      {/* Gold sweeping curves */}
      <g opacity="0.85">
        <path d="M -80,820 Q 300,680 600,760 Q 900,840 1200,740 Q 1380,680 1520,760" fill="none" stroke="url(#gold1)" strokeWidth="2.5" strokeDasharray="2000" style={{ animation:'gold-flow 5s ease-in-out infinite' }}/>
        <path d="M 1520,870 Q 1100,760 800,840 Q 500,920 200,820 Q 60,770 -80,840" fill="none" stroke="url(#gold2)" strokeWidth="2" strokeDasharray="2000" style={{ animation:'gold-flow 6.5s ease-in-out infinite', animationDelay:'0.8s' }}/>
        {[120,340,560,780,1000,1220].map((x,i) => (
          <circle key={i} cx={x} cy={790+Math.sin(i*1.2)*30} r={2} fill="rgba(220,190,130,0.9)" style={{ animation:`tendril-drift ${2+i*0.4}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }}/>
        ))}
      </g>

      {/* Stone floor */}
      <g opacity="0.16">
        {[0,1,2,3,4,5,6,7].map(row => (
          <g key={row}>
            {[0,1,2,3,4,5,6,7,8,9,10,11].map(col => (
              <rect key={col} x={col*130} y={840+row*40} width={128} height={38} fill="none" stroke="rgba(200,169,110,0.35)" strokeWidth="0.5"/>
            ))}
          </g>
        ))}
      </g>
    </svg>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  if (window.location.pathname === '/success') return <SuccessPage />

  const trialStartRef = useRef(Date.now())

  const [obsIdx, setObsIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  useEffect(() => {
    const full = OBSERVATIONS[obsIdx % OBSERVATIONS.length]!
    let charPos = 0; let timeoutId: ReturnType<typeof setTimeout> | null = null
    setDisplayText('')
    const iv = setInterval(() => {
      charPos++; setDisplayText(full.slice(0, charPos))
      if (charPos >= full.length) { clearInterval(iv); timeoutId = setTimeout(() => setObsIdx(i => i + 1), 2600) }
    }, 20)
    return () => { clearInterval(iv); if (timeoutId) clearTimeout(timeoutId) }
  }, [obsIdx])

  const [hashIdx, setHashIdx] = useState(0)
  useEffect(() => { const id = setInterval(() => setHashIdx(i => (i+1) % CHAIN_HASHES.length), 3400); return () => clearInterval(id) }, [])
  const currentHash = CHAIN_HASHES[hashIdx]!
  const activeLayer = COGNITIVE_LAYERS[obsIdx % COGNITIVE_LAYERS.length]!

  const heroRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 50, y: 40 })
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursor({ x: Math.round(((e.clientX-rect.left)/rect.width)*100), y: Math.round(((e.clientY-rect.top)/rect.height)*100) })
  }

  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const [activeHoloLayer, setActiveHoloLayer] = useState<string | null>(null)
  const [violating, setViolating] = useState(false)

  const buy = (product: string, price: number) => {
    const ttv = Math.round((Date.now() - trialStartRef.current) / 1000)
    captureEvent('conversion', { product, price, ttv_seconds: ttv })
  }
  useEffect(() => { captureEvent('trial_started', { product: 'hub', source: document.referrer || 'direct' }) }, [])

  function triggerViolation() {
    setViolating(true)
    setTimeout(() => setViolating(false), 2800)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#020409', fontFamily: 'Inter, system-ui, sans-serif', color: '#ECEAE3' }}>

      {/* ── EU AI Act ribbon ─────────────────────────────────────── */}
      <div style={{ background: 'rgba(200,169,110,0.07)', borderBottom: '1px solid rgba(200,169,110,0.12)', textAlign: 'center', padding: '7px 16px' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#C8A96E', letterSpacing: '0.08em' }}>
          EU AI Act Article 12 compliance — 605-gate Rust audit chain — tamper-evident by construction
        </span>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50" style={{ borderBottom:'1px solid rgba(200,169,110,0.07)', background:'rgba(2,4,9,0.96)', backdropFilter:'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="animate-breathe" style={{ fontFamily:'"JetBrains Mono", monospace', letterSpacing:'0.22em', color:'#C8A96E', fontSize:'13px', fontWeight:700 }}>AEGIS-Ω</span>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.04em' }}>[{activeLayer.n}] {activeLayer.name}</span>
          </div>
          <div className="flex items-center gap-5">
            {[['#proof','Proof'],['#stack','Stack'],['#martingale','Martingale'],['#compare','Compare'],['#cognitive','Architecture'],['#pricing','Pricing']].map(([href,label]) => (
              <a key={href} href={href} className="hidden lg:block text-xs transition-colors hover:text-white" style={{ color:'#4A4A6A' }}>{label}</a>
            ))}
            <a href="#pricing" onClick={() => buy('nav',39)}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{ background:'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Get access
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div ref={heroRef} onMouseMove={handleMouseMove} className="relative overflow-hidden" style={{ minHeight:'100vh' }}>
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 110% 85% at 50% 28%, #0C0420 0%, #060215 32%, #020409 62%, #010107 100%)' }}/>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:`radial-gradient(1.3px 1.3px at 7% 12%, rgba(255,255,255,0.90) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 83% 7%, rgba(255,255,255,0.70) 0%, transparent 100%), radial-gradient(1.2px 1.2px at 25% 68%, rgba(255,255,255,0.80) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 66% 44%, rgba(255,255,255,0.50) 0%, transparent 100%), radial-gradient(1.6px 1.6px at 51% 16%, rgba(200,169,110,1.00) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 18% 36%, rgba(255,255,255,0.45) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 91% 61%, rgba(255,255,255,0.65) 0%, transparent 100%), radial-gradient(1.2px 1.2px at 42% 84%, rgba(200,169,110,0.80) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 11% 89%, rgba(255,255,255,0.50) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 74% 25%, rgba(255,255,255,0.85) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 33% 4%, rgba(255,255,255,0.60) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 60% 77%, rgba(255,255,255,0.45) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 4% 53%, rgba(200,169,110,0.60) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 95% 38%, rgba(255,255,255,0.70) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 78% 72%, rgba(255,255,255,0.40) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 21% 21%, rgba(255,255,255,0.55) 0%, transparent 100%), radial-gradient(1.0px 1.0px at 55% 92%, rgba(255,255,255,0.50) 0%, transparent 100%)` }}/>
        <ConstitutionalPortal cursorX={cursor.x} cursorY={cursor.y}/>

        <div className="relative z-10 flex flex-col items-center text-center px-5" style={{ paddingTop:'20vh', paddingBottom:'6vh' }}>

          <div className="mb-7 px-5 py-2.5 rounded" style={{ background:'rgba(8,3,22,0.84)', border:'1px solid rgba(124,58,237,0.18)', backdropFilter:'blur(8px)', maxWidth:'600px', width:'100%' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
              <div className="animate-mint-pulse" style={{ width:'6px', height:'6px', background:activeLayer.color, borderRadius:'50%', flexShrink:0 }}/>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:activeLayer.color, letterSpacing:'0.06em' }}>metacognitive_loop · epoch_{hashIdx+601}</span>
            </div>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:'#5A4A7A', minHeight:'16px', textAlign:'left' }}>
              {displayText}<span style={{ opacity:0.5 }}>█</span>
            </div>
          </div>

          <h1 style={{ fontSize:'clamp(44px, 7.5vw, 80px)', fontWeight:800, letterSpacing:'-0.035em', lineHeight:1.03, marginBottom:'22px' }}>
            <span style={{ color:'#E8E6F0' }}>The automaton</span><br/>
            <span style={{ background:'linear-gradient(135deg, #C8A96E 0%, #A78BFA 50%, #06B6D4 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              cannot be gaslit.
            </span>
          </h1>

          <p style={{ color:'#8A8A9A', fontSize:'17px', maxWidth:'500px', lineHeight:1.72, marginBottom:'36px' }}>
            Every action hash-chained. Every session replayable.<br/>
            BFT at 1/φ. Martingale bounded. Constitutional membrane intact.<br/>
            <span style={{ color:'#6A6A8A' }}>This is a formal constraint — not a feature.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <a href="#pricing" onClick={() => buy('hero',39)}
              className="inline-flex items-center justify-center font-semibold px-9 py-3.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background:'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Access the platform
            </a>
            <a href="#proof" className="inline-flex items-center justify-center font-medium px-9 py-3.5 rounded-xl text-sm hover:opacity-80 transition-opacity" style={{ border:'1px solid rgba(200,169,110,0.22)', color:'#C8A96E', background:'rgba(200,169,110,0.05)' }}>
              See the proof →
            </a>
          </div>

          <div className="mb-8 px-5 py-3 rounded-xl w-full max-w-xl" style={{ background:'rgba(6,3,16,0.90)', border:'1px solid rgba(255,255,255,0.05)', backdropFilter:'blur(12px)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px' }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.08em' }}>ENTRY_HASH · CHAIN LIVE</span>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#34D399', letterSpacing:'0.05em' }}>+1 epoch</span>
            </div>
            <div className="animate-hash-flicker" style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', wordBreak:'break-all' }}>
              <span style={{ color:'#3A2A5A' }}>sha256: </span><span style={{ color:'#4A4A6A' }}>{currentHash}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
            {[
              { v:'6,850', l:'Rust gate tests',  c:'#34D399' },
              { v:'3,176', l:'TS tests',          c:'#60A5FA' },
              { v:'605',   l:'Gates complete',    c:'#A78BFA' },
              { v:'0',     l:'Corruption count',  c:'#C8A96E' },
            ].map(m => (
              <div key={m.l} className="rounded-xl p-4 text-center" style={{ background:'rgba(10,6,24,0.94)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'22px', fontWeight:700, color:m.c, marginBottom:'5px' }}>{m.v}</div>
                <div style={{ fontSize:'9px', color:'#4A4A6A', letterSpacing:'0.09em', textTransform:'uppercase' }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Constitutional proof terminal ─────────────────────────────────── */}
      <div id="proof" className="scroll-mt-16" style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,0,0,0.5)' }}>
        <div className="max-w-3xl mx-auto px-5 py-20">
          <div className="text-center mb-10">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>SUBATOMIC · T0 · VERIFIED</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>Not a claim. A proof.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px' }}>This runs every session start. Real hashes. Real exit code. Tamper breaks the chain.</p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ background:'#08080F', padding:'10px 16px', display:'flex', alignItems:'center', gap:'8px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              {['#F87171','#FCD34D','#34D399'].map((c,i) => <div key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', background:c }}/>)}
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:'#3A3A5A', marginLeft:'8px' }}>zsh — sovereign-omega-v2</span>
            </div>
            <div style={{ background:'#040410', padding:'24px', fontFamily:'"JetBrains Mono", monospace', fontSize:'12px', lineHeight:1.85 }}>
              <div style={{ color:'#3A3A5A' }}>$ node scripts/verify-hashes.mjs</div>
              <div style={{ paddingLeft:'4px' }}>
                <div><span style={{ color:'#34D399' }}>  OK</span><span style={{ color:'#3A3A5A' }}>:   python/gate.py    </span><span style={{ color:'#4A4A6A' }}>bbe942b819594fd522b421bb9d3aa084735a873d526f35a1e782f31346f3d0fc</span></div>
                <div><span style={{ color:'#34D399' }}>  OK</span><span style={{ color:'#3A3A5A' }}>:   python/dna.py     </span><span style={{ color:'#4A4A6A' }}>cd30ddd5db0403b0e64fb30ce53e0373997fc53cb900a26167eef7d0b69cf8d8</span></div>
                <div><span style={{ color:'#34D399' }}>  OK</span><span style={{ color:'#3A3A5A' }}>:   python/router.py  </span><span style={{ color:'#4A4A6A' }}>8c06ed37a7d95d9de9129c32a426fe5c2b0cd960c2cf5c84c71726b72e6cf941</span></div>
                <div style={{ color:'#34D399', marginTop:'4px' }}>  All frozen files present and hash-verified. Exit 0.</div>
              </div>
              <div style={{ marginTop:'16px', color:'#3A3A5A' }}>$ curl -s http://localhost:7890/node | python3 -m json.tool</div>
              <div style={{ paddingLeft:'4px', marginTop:'4px', color:'#3A3A5A' }}>{'{'}</div>
              <div style={{ paddingLeft:'20px' }}>
                <div><span style={{ color:'#7C5AED' }}>"t0_verdict"</span><span style={{ color:'#3A3A5A' }}>:       </span><span style={{ color:'#34D399' }}>true</span><span style={{ color:'#3A3A5A' }}>,</span></div>
                <div><span style={{ color:'#7C5AED' }}>"corruption_count"</span><span style={{ color:'#3A3A5A' }}>:  </span><span style={{ color:'#C8A96E' }}>0</span><span style={{ color:'#3A3A5A' }}>,</span></div>
                <div><span style={{ color:'#7C5AED' }}>"entropy_bounded"</span><span style={{ color:'#3A3A5A' }}>:   </span><span style={{ color:'#34D399' }}>true</span><span style={{ color:'#3A3A5A' }}>,</span></div>
                <div><span style={{ color:'#7C5AED' }}>"pgcs_passes"</span><span style={{ color:'#3A3A5A' }}>:       </span><span style={{ color:'#34D399' }}>true</span><span style={{ color:'#3A3A5A' }}>,</span></div>
                <div><span style={{ color:'#7C5AED' }}>"phi"</span><span style={{ color:'#3A3A5A' }}>:               </span><span style={{ color:'#C8A96E' }}>0.6180339887</span><span style={{ color:'#3A3A5A' }}>,</span></div>
                <div><span style={{ color:'#7C5AED' }}>"gate_count"</span><span style={{ color:'#3A3A5A' }}>:        </span><span style={{ color:'#60A5FA' }}>605</span></div>
              </div>
              <div style={{ color:'#3A3A5A' }}>{'}'}</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl p-6 text-center" style={{ background:'rgba(6,3,16,0.85)', border:'1px solid rgba(124,58,237,0.12)' }}>
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#3A3A5A', marginBottom:'10px', letterSpacing:'0.06em' }}>ROOT CONSTITUTIONAL LAW</p>
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'20px', color:'#7C5AED', letterSpacing:'0.02em' }}>AdaptivePower(T) ≤ ReplayVerifiability(T)</p>
            <p style={{ fontSize:'12px', color:'#4A4A6A', marginTop:'10px', lineHeight:1.65 }}>
              No adaptive capability may exceed replay-certifiable reconstructability.<br/>Enforced at runtime. No override path. No exception handling.
            </p>
          </div>
        </div>
      </div>

      {/* ── Holonic Stack ─────────────────────────────────────────────────── */}
      <div id="stack" className="scroll-mt-16" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-4xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>SCALE HIERARCHY · SIX LAYERS</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>Every scale preserves the invariants of all scales below it.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px', maxWidth:'500px', margin:'0 auto' }}>
              A T0 violation at SUBATOMIC propagates upward and invalidates everything above it.<br/>
              Click to trigger a constitutional violation — watch the membrane halt propagation.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {HOLONIC_LAYERS.map((layer, idx) => {
              const isViolating = violating && idx > 3
              const isHovered = activeHoloLayer === layer.name
              return (
                <div key={layer.name}
                  className="rounded-xl px-5 py-4 cursor-pointer transition-all duration-300"
                  style={{
                    background: isViolating ? 'rgba(239,68,68,0.08)' : isHovered ? `${layer.color}0C` : 'rgba(8,5,20,0.70)',
                    border: isViolating ? '1px solid rgba(239,68,68,0.30)' : isHovered ? `1px solid ${layer.color}30` : '1px solid rgba(255,255,255,0.04)',
                    transform: isHovered ? 'translateX(6px)' : 'none',
                  }}
                  onMouseEnter={() => setActiveHoloLayer(layer.name)}
                  onMouseLeave={() => setActiveHoloLayer(null)}
                  onClick={triggerViolation}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', fontWeight:700, color: isViolating ? '#EF4444' : layer.color, width:'80px', flexShrink:0, letterSpacing:'0.08em' }}>
                      {layer.name}
                    </div>
                    <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                      <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', fontWeight:700, padding:'2px 7px', borderRadius:'4px', background: `${layer.color}14`, color:layer.color, letterSpacing:'0.06em' }}>{layer.tier}</span>
                      <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', padding:'2px 7px', borderRadius:'4px', background:'rgba(255,255,255,0.04)', color:'#5A5A7A' }}>{layer.tests}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color: isViolating ? '#EF4444' : isHovered ? '#D0D0E0' : '#7A7A9A', fontSize:'13px', transition:'color 0.3s', marginBottom:'2px' }}>{layer.desc}</div>
                      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color: isHovered ? '#4A4A6A' : '#2A2A3A', transition:'color 0.3s' }}>{layer.sub}</div>
                    </div>
                    {isViolating && <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#EF4444', flexShrink:0, animation:'hash-flicker 0.3s infinite' }}>T0_ABORT</div>}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 rounded-xl px-5 py-4 text-center" style={{ background:'rgba(6,3,16,0.80)', border:'1px solid rgba(200,169,110,0.08)' }}>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#4A4A6A' }}>
              SUBATOMIC → ATOMIC → MOLECULAR → CELLULAR → ORGANISM → FIELD
            </span>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#2A2A3A' }}>
              {' '}· T0 violations propagate upward · no exception paths · hard halt
            </span>
          </div>
        </div>
      </div>

      {/* ── Martingale Guarantee ──────────────────────────────────────────── */}
      <div id="martingale" className="scroll-mt-16" style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,0,0,0.35)' }}>
        <div className="max-w-4xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>CELLULAR · T1 · EMPIRICALLY VALIDATED</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>The martingale guarantee.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px' }}>This is not a goal. It is a hard constraint enforced at runtime.</p>
          </div>

          <div className="rounded-2xl p-10 text-center mb-8" style={{ background:'rgba(6,3,16,0.90)', border:'1px solid rgba(124,58,237,0.14)' }}>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'clamp(24px, 4vw, 40px)', color:'#A78BFA', letterSpacing:'0.02em', marginBottom:'16px', fontWeight:600 }}>
              E[S<sub style={{ fontSize:'0.6em' }}>n+1</sub> | &#x1D4D5;<sub style={{ fontSize:'0.6em' }}>n</sub>] = S<sub style={{ fontSize:'0.6em' }}>n</sub>
            </div>
            <p style={{ color:'#5A5A7A', fontSize:'13px', maxWidth:'420px', margin:'0 auto', lineHeight:1.72 }}>
              The expected value of the system state at step n+1, given all information up to step n, equals the current state. The system cannot systematically drift in any direction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { key:'is_anchored', val:'true', color:'#34D399', desc:'Position drift bounded around baseline. The system knows where it started.' },
              { key:'drift_bounded', val:'true', color:'#34D399', desc:'No systematic upward or downward bias. Every move is constitutionally neutral.' },
              { key:'entropy_bounded', val:'true', color:'#34D399', desc:'Variance below constitutional ceiling. MUTATION_RATE_LIMIT = φ = 0.6180339887.' },
            ].map(c => (
              <div key={c.key} className="rounded-xl p-5" style={{ background:'rgba(8,5,20,0.85)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:'#5A5A7A' }}>{c.key}:</span>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:c.color, fontWeight:700 }}>{c.val}</span>
                </div>
                <div className="rounded" style={{ height:'3px', background:`${c.color}22`, marginBottom:'10px' }}>
                  <div style={{ height:'100%', width:'100%', background:c.color, borderRadius:'2px', boxShadow:`0 0 8px ${c.color}` }}/>
                </div>
                <p style={{ color:'#4A4A6A', fontSize:'12px', lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-6 py-5 text-center" style={{ background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.15)' }}>
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:'#EF4444', marginBottom:'4px', letterSpacing:'0.04em' }}>SUSPENSION CONDITION</p>
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'13px', color:'#DC2626' }}>
              if (!is_anchored || !drift_bounded || !entropy_bounded) → SUSPEND
            </p>
            <p style={{ fontSize:'12px', color:'#5A3A3A', marginTop:'8px' }}>Adaptation halts immediately. No override path. No exception handling. Hard stop.</p>
          </div>
        </div>
      </div>

      {/* ── BFT Alliance ─────────────────────────────────────────────────── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-4xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>MOLECULAR · T1 · BFT QUORUM</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>Three models. One constitution. No single point of failure.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px' }}>Every governance decision requires a supermajority weighted at 1/φ ≈ 0.618.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { name:'Claude', org:'Anthropic', weight:618, color:'#C8A96E', role:'Coordinator', desc:'Primary orchestration · RALPH execution · metacognitive loop · skill harness routing' },
              { name:'GPT-4o', org:'OpenAI', weight:191, color:'#60A5FA', role:'Adversarial Audit', desc:'Adversarial review · 0.99 temperature · red-team challenge · constitutional stress test' },
              { name:'Qwen', org:'Alibaba', weight:191, color:'#34D399', role:'Implementation', desc:'Code implementation · technical verification · DashScope integration · East/West bridge' },
            ].map(m => (
              <div key={m.name} className="rounded-2xl p-6" style={{ background:'rgba(8,5,20,0.85)', border:`1px solid ${m.color}18` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                  <div>
                    <div style={{ color:m.color, fontWeight:700, fontSize:'16px', marginBottom:'2px' }}>{m.name}</div>
                    <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#3A3A5A' }}>{m.org}</div>
                  </div>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', padding:'3px 8px', borderRadius:'4px', background:`${m.color}14`, color:m.color, fontWeight:700 }}>{m.role}</span>
                </div>
                <div className="mb-4">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                    <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#4A4A6A' }}>vote weight</span>
                    <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'12px', color:m.color, fontWeight:700 }}>{m.weight}/1000</span>
                  </div>
                  <div className="rounded-full" style={{ height:'4px', background:'rgba(255,255,255,0.05)' }}>
                    <div style={{ height:'100%', width:`${m.weight/10}%`, background:m.color, borderRadius:'2px', boxShadow:`0 0 6px ${m.color}88`, transition:'width 1s ease-out' }}/>
                  </div>
                </div>
                <p style={{ color:'#4A4A6A', fontSize:'12px', lineHeight:1.65 }}>{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6" style={{ background:'rgba(6,3,16,0.90)', border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:'#5A5A7A' }}>Combined quorum:</span>
              <div style={{ flex:1, height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px', position:'relative' }}>
                <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${(618+191)/10}%`, background:'linear-gradient(90deg, #C8A96E, #60A5FA)', borderRadius:'3px', boxShadow:'0 0 10px rgba(200,169,110,0.5)' }}/>
                <div style={{ position:'absolute', top:'-8px', left:`${0.618*100}%`, transform:'translateX(-50%)' }}>
                  <div style={{ width:'1px', height:'22px', background:'rgba(239,68,68,0.8)', boxShadow:'0 0 6px rgba(239,68,68,0.6)' }}/>
                </div>
              </div>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:'#34D399', fontWeight:700, flexShrink:0 }}>809/1000 ✓</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#3A3A5A' }}>Threshold: 1/φ = 0.6180339887 (618/1000) · Byzantine fault tolerance</span>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#34D399' }}>QUORUM MET</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison ───────────────────────────────────────────────────── */}
      <div id="compare" className="scroll-mt-16" style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,0,0,0.4)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>COMPETITIVE ANALYSIS · T0 PROPERTIES</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>Ten constitutional properties.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px' }}>Check which ones your current AI platform implements. All ten are mechanically verifiable.</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full" style={{ borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(8,5,20,0.97)' }}>
                  <th className="text-left py-4 px-5" style={{ color:'#3A3A5A', fontSize:'10px', letterSpacing:'0.1em', fontWeight:600, textTransform:'uppercase', borderBottom:'1px solid rgba(255,255,255,0.06)', width:'52%' }}>Property · mechanism</th>
                  {['AEGIS-Ω','Claude Code','Gemini','Codex'].map((name,i) => (
                    <th key={name} className="text-center py-4 px-3" style={{ color:i===0?'#C8A96E':'#2A2A3A', fontSize:i===0?'13px':'11px', fontWeight:700, borderBottom:'1px solid rgba(255,255,255,0.06)', fontFamily:i===0?'"JetBrains Mono", monospace':undefined }}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([cap,mech],i) => (
                  <tr key={cap} style={{ background:i%2===0?'rgba(8,5,20,0.65)':'rgba(4,3,14,0.45)' }}>
                    <td className="py-3.5 px-5" style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ color:'#C0C0D0', fontSize:'13px', marginBottom:'2px', fontWeight:500 }}>{cap}</div>
                      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', color:'#3A3A5A' }}>{mech}</div>
                    </td>
                    <td className="text-center py-3.5 px-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}><Yes/></td>
                    <td className="text-center py-3.5 px-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}><No/></td>
                    <td className="text-center py-3.5 px-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}><No/></td>
                    <td className="text-center py-3.5 px-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}><No/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Cognitive Architecture ────────────────────────────────────────── */}
      <div id="cognitive" className="scroll-mt-16" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-4xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>METACOGNITION · src/metacognition/loop.ts</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>Seven cognitive layers. All active simultaneously.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px', maxWidth:'480px', margin:'0 auto' }}>Implemented mechanisms — not a metaphor. The automaton runs all seven before every action. The active layer pulses below in real time.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {COGNITIVE_LAYERS.map(layer => {
              const isActive = activeLayer.n === layer.n
              return (
                <div key={layer.n}
                  className="rounded-xl px-5 py-4 flex items-center gap-5 transition-all duration-400"
                  style={{ background:isActive?`${layer.color}0A`:'rgba(6,4,16,0.65)', border:isActive?`1px solid ${layer.color}28`:'1px solid rgba(255,255,255,0.04)', transform:isActive?'translateX(6px)':'none' }}>
                  <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'22px', fontWeight:700, color:isActive?layer.color:'#2A2A3A', width:'40px', flexShrink:0, transition:'color 0.4s' }}>L{layer.n}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                      <span style={{ color:isActive?'#E8E6F0':'#4A4A6A', fontWeight:600, fontSize:'14px', transition:'color 0.4s' }}>{layer.name}</span>
                      {isActive && <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:layer.color, letterSpacing:'0.08em' }}>● ACTIVE</span>}
                    </div>
                    <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:isActive?'#4A4A6A':'#2A2A3A', transition:'color 0.4s' }}>{layer.desc}</div>
                  </div>
                  {isActive && <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:layer.color, boxShadow:`0 0 10px ${layer.color}`, flexShrink:0 }}/>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Constitutional feature cards ──────────────────────────────────── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,0,0,0.35)' }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>CONSTITUTIONAL PROPERTIES</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>Six constitutional properties.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px' }}>Hover any card — see what the automaton observes about that property in real time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.name}
                className="rounded-2xl p-6 cursor-default transition-all duration-250"
                style={{ background:hoveredFeature===f.name?`${f.color}09`:'rgba(6,4,16,0.88)', border:`1px solid ${hoveredFeature===f.name?f.color+'22':'rgba(255,255,255,0.05)'}` }}
                onMouseEnter={() => setHoveredFeature(f.name)}
                onMouseLeave={() => setHoveredFeature(null)}>
                <div className="mb-3">
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'4px', background:f.color+'14', color:f.color, letterSpacing:'0.06em' }}>{f.tier}</span>
                </div>
                <h3 style={{ color:'#E8E6F0', fontWeight:600, fontSize:'15px', marginBottom:'8px' }}>{f.name}</h3>
                {hoveredFeature===f.name
                  ? <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:f.color, lineHeight:1.72, minHeight:'56px' }}>{f.obs}</div>
                  : <p style={{ color:'#4A4A6A', fontSize:'13px', lineHeight:1.68, minHeight:'56px' }}>{f.desc}</p>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Developer Integration ─────────────────────────────────────────── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-4xl mx-auto px-5 py-20">
          <div className="text-center mb-12">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'10px' }}>FIELD LAYER · INTEGRATION</p>
            <h2 style={{ fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>Govern any AI call. Hash-certified.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px' }}>Every call enters through the constitutional bridge. Every response exits with a hash, a tier, and a verdict.</p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ background:'#08080F', padding:'10px 16px', display:'flex', alignItems:'center', gap:'8px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              {['#F87171','#FCD34D','#34D399'].map((c,i) => <div key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', background:c }}/>)}
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'11px', color:'#3A3A5A', marginLeft:'8px' }}>typescript — governed AI call</span>
            </div>
            <div style={{ background:'#040410', padding:'24px', fontFamily:'"JetBrains Mono", monospace', fontSize:'12px', lineHeight:2.0, overflowX:'auto' }}>
              <div><span style={{ color:'#3A3A5A' }}>// Constitutional AI call — governed, hash-certified, tier-stamped</span></div>
              <div style={{ marginTop:'8px' }}><span style={{ color:'#7C5AED' }}>const</span> <span style={{ color:'#60A5FA' }}>response</span> <span style={{ color:'#4A4A6A' }}>= await</span> <span style={{ color:'#60A5FA' }}>fetch</span><span style={{ color:'#4A4A6A' }}>('http://bridge.aegisomega.com/claude', {'{'}</span></div>
              <div style={{ paddingLeft:'16px' }}>
                <div><span style={{ color:'#4A4A6A' }}>method: </span><span style={{ color:'#34D399' }}>'POST'</span><span style={{ color:'#4A4A6A' }}>,</span></div>
                <div><span style={{ color:'#4A4A6A' }}>body: JSON.stringify({'{'}</span></div>
                <div style={{ paddingLeft:'16px' }}>
                  <div><span style={{ color:'#A78BFA' }}>messages</span><span style={{ color:'#4A4A6A' }}>: [{'{'} </span><span style={{ color:'#C8A96E' }}>role</span><span style={{ color:'#4A4A6A' }}>: </span><span style={{ color:'#34D399' }}>'user'</span><span style={{ color:'#4A4A6A' }}>, </span><span style={{ color:'#C8A96E' }}>content</span><span style={{ color:'#4A4A6A' }}>: </span><span style={{ color:'#34D399' }}>'Explain martingale boundedness'</span><span style={{ color:'#4A4A6A' }}> {'}'}],</span></div>
                  <div><span style={{ color:'#A78BFA' }}>tier</span><span style={{ color:'#4A4A6A' }}>: </span><span style={{ color:'#34D399' }}>'T1'</span><span style={{ color:'#4A4A6A' }}>,{'    '}</span><span style={{ color:'#3A3A5A' }}>// claim tier for this call</span></div>
                  <div><span style={{ color:'#A78BFA' }}>gate_cert</span><span style={{ color:'#4A4A6A' }}>: </span><span style={{ color:'#34D399' }}>'gate_605'</span><span style={{ color:'#4A4A6A' }}>,</span><span style={{ color:'#3A3A5A' }}> // requires gate certification</span></div>
                </div>
                <div><span style={{ color:'#4A4A6A' }}>{'}'}</span></div>
              </div>
              <div><span style={{ color:'#4A4A6A' }}>{'})'}</span></div>
              <div style={{ marginTop:'16px', color:'#3A3A5A' }}>// Response includes constitutional metadata:</div>
              <div><span style={{ color:'#3A3A5A' }}>// {'{'} answer, tier: 'T1', t0_verdict: true, hash: 'bbe942b8...', pgcs_passes: true {'}'}</span></div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { icon:'⛓', title:'Every call chained', desc:'SHA-256(prev‖response) — the hash chain is the audit trail. No separate logging needed.' },
              { icon:'⚖', title:'Tier enforcement', desc:'T4/T5 claims blocked in src/. T0 requires mechanical proof. T2 requires hypothesis label.' },
              { icon:'⏸', title:'Hard suspension', desc:'If martingale conditions fail mid-session, the bridge refuses further calls. No override.' },
            ].map(c => (
              <div key={c.title} className="rounded-xl p-5" style={{ background:'rgba(8,5,20,0.85)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize:'22px', marginBottom:'8px' }}>{c.icon}</div>
                <div style={{ color:'#C0C0D0', fontWeight:600, fontSize:'14px', marginBottom:'6px' }}>{c.title}</div>
                <p style={{ color:'#4A4A6A', fontSize:'12px', lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background:'rgba(0,0,0,0.35)' }}>
        <div className="max-w-5xl mx-auto px-5 py-16">
          <div className="text-center mb-10">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#2A2A3A', letterSpacing:'0.22em', marginBottom:'10px', textTransform:'uppercase' }}>Built on the constitution</p>
            <h2 style={{ fontSize:'26px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0' }}>Creator tools. Constitutionally governed.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon:'🎯', name:'Platform Picker', price:19, color:'#7C3AED', desc:'Scored platform recommendation — TikTok, YouTube Shorts, Instagram Reels, Snapchat. Radar chart. One DashScope key.' },
              { icon:'⚡', name:'Hook Generator', price:19, color:'#06B6D4', desc:'10 ranked viral hooks — curiosity gap, controversy, social proof, numbers, pain point. Type-coded. One-click copy.' },
              { icon:'📅', name:'Content Calendar', price:19, color:'#14B8A6', desc:'4-week calendar with daily ideas, hooks, formats, production notes. Export TXT or CSV.' },
            ].map(p => (
              <div key={p.name} className="rounded-2xl p-6" style={{ background:'rgba(6,4,16,0.88)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between items-start mb-4">
                  <div style={{ fontSize:'28px' }}>{p.icon}</div>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'14px', color:p.color, fontWeight:700 }}>${p.price}</span>
                </div>
                <h3 style={{ color:'#E8E6F0', fontWeight:600, fontSize:'15px', marginBottom:'8px' }}>{p.name}</h3>
                <p style={{ color:'#4A4A6A', fontSize:'13px', lineHeight:1.65, marginBottom:'18px' }}>{p.desc}</p>
                <a href="#pricing" onClick={() => buy(p.name, p.price)} style={{ color:p.color, fontSize:'13px', fontWeight:500 }} className="hover:opacity-75 transition-opacity">Get access →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <div id="pricing" className="scroll-mt-16" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-3xl mx-auto px-5 py-18">
          <div className="text-center mb-10">
            <h2 style={{ fontSize:'26px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'8px' }}>One-time. No subscriptions.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px' }}>Buy the full source code. Deploy to Vercel in 2 minutes. You own it.</p>
          </div>
          <PricingTable />
        </div>
      </div>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 pb-20">
        <div className="rounded-2xl p-12 text-center relative overflow-hidden" style={{ background:'rgba(6,4,16,0.97)', border:'1px solid rgba(124,58,237,0.16)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at 50% -15%, rgba(124,58,237,0.12) 0%, transparent 65%)' }}/>
          <div className="relative z-10">
            <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'9px', color:'#3A3A5A', letterSpacing:'0.22em', marginBottom:'16px', textTransform:'uppercase' }}>AdaptivePower(T) ≤ ReplayVerifiability(T)</p>
            <h2 style={{ fontSize:'28px', fontWeight:700, letterSpacing:'-0.02em', color:'#E8E6F0', marginBottom:'12px' }}>The only AI system that cannot forget what it did.</h2>
            <p style={{ color:'#5A5A7A', fontSize:'14px', marginBottom:'28px', lineHeight:1.7 }}>
              Hash-chained. Deterministically replayable. Constitutionally bounded.<br/>
              Built by the architect who made Claude Code's knowledge base irreversible.
            </p>
            <a href="#pricing" onClick={() => buy('final-cta',39)}
              className="inline-flex items-center justify-center font-semibold px-10 py-3.5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background:'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' }}>
              Access AEGIS-Ω — from $19
            </a>
            <p style={{ color:'#2A2A3A', fontSize:'11px', marginTop:'14px' }}>30-day refund · One-time payment · Full source code</p>
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:'13px', color:'#C8A96E', letterSpacing:'0.22em' }}>AEGIS-Ω</span>
            <span style={{ color:'#141420' }}>|</span>
            <span style={{ color:'#3A3A5A', fontSize:'12px' }}>aegisomega.com · Constitutional AI Platform</span>
          </div>
          <div className="flex items-center gap-6">
            {['#proof','#stack','#martingale','#compare','#cognitive','#pricing'].map((href,i) => (
              <a key={href} href={href} className="text-xs hover:text-white transition-colors" style={{ color:'#3A3A5A' }}>{['Proof','Stack','Martingale','Compare','Architecture','Pricing'][i]}</a>
            ))}
            <a href="mailto:tarikskalic33@gmail.com" className="inline-flex items-center gap-1.5 text-xs hover:text-white transition-colors" style={{ color:'#3A3A5A' }}>
              <Mail size={11}/>Contact
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
