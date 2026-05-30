import { useEffect, useRef } from 'react'
import { SuccessPage } from './components/SuccessPage.js'
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Code,
  Database,
  Gauge,
  Mail,
  Network,
  ShieldCheck,
  TerminalSquare,
  Zap,
} from 'lucide-react'

function captureEvent(event: string, props?: Record<string, unknown>): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ph = (window as any).posthog
  if (typeof ph?.capture === 'function') ph.capture(event, props)
}

const CORE_METRICS = [
  { value: '9,748', label: 'Invariant tests' },
  { value: '113K+', label: 'Polyglot LOC' },
  { value: '605', label: 'Governance gates' },
  { value: '0', label: 'Silent state drift' },
]

const PLATFORM_LAYERS = [
  {
    Icon: ShieldCheck,
    title: 'Constitutional Runtime',
    kicker: 'Replay-verifiable control plane',
    desc: 'Every transition is sequence-numbered, hash-chained, and replayable from genesis so adaptive behavior cannot outrun proof.',
    bullets: ['AdaptivePower(T) ≤ ReplayVerifiability(T)', 'RFC 8785 canonical state hashing', 'Deterministic Rust + TypeScript execution'],
  },
  {
    Icon: Network,
    title: 'Swarm Governance Fabric',
    kicker: 'Distributed coherence layer',
    desc: 'Peer messages, epochs, watchdogs, and quarantine boundaries operate as a fault-aware nervous system instead of isolated dashboards.',
    bullets: ['Gossip health and peer state gates', 'Epoch synchronization and recovery paths', 'BFT boundary monitoring'],
  },
  {
    Icon: Activity,
    title: 'Operator Cockpit',
    kicker: 'Human-in-the-loop AI command surface',
    desc: 'A premium cockpit for inspecting telemetry, constitutional verdicts, memory events, and agent output from one controlled interface.',
    bullets: ['AI chat with telemetry context', 'Read-only observability surfaces', 'Audit-first operator workflows'],
  },
]

const PROOF_POINTS = [
  {
    Icon: Database,
    label: 'Tamper-evident memory',
    copy: 'Ledger records extend from a genesis hash and fail closed when replay diverges.',
  },
  {
    Icon: Gauge,
    label: 'Bounded adaptation',
    copy: 'Entropy budgets and martingale gates keep autonomous power inside verifiable limits.',
  },
  {
    Icon: TerminalSquare,
    label: 'Built to ship',
    copy: 'The repo contains runnable React apps, Rust crates, Supabase functions, and operator tooling.',
  },
  {
    Icon: BrainCircuit,
    label: 'AI-native stack',
    copy: 'Designed around agents, governance events, telemetry, and deterministic replay—not a wrapper around a prompt box.',
  },
]

const DEPLOYMENT_SURFACES = [
  {
    name: 'Cockpit',
    href: 'https://aegis-cockpit.vercel.app',
    desc: 'Operator-facing AI command UI with constitutional telemetry hooks.',
    tag: 'Command surface',
  },
  {
    name: 'Studio',
    href: 'https://aegis-studio.vercel.app',
    desc: 'Observability layer for runtime health, drift, replay, and governance state.',
    tag: 'Observability',
  },
  {
    name: 'Runtime',
    href: 'https://github.com/tarikskalic/AEGIS--',
    desc: 'Source-level runtime: ledgers, hypervisor policy, gossip fabric, and proofs.',
    tag: 'Core system',
  },
]

const FAQS = [
  {
    q: 'Is AEGIS-Ω a creator-tool bundle?',
    a: 'No. The platform includes creator-facing utilities, but the core product is a constitutional AI runtime with replay, telemetry, governance gates, and operator surfaces.',
  },
  {
    q: 'What makes it “full stack”?',
    a: 'It spans Rust runtime primitives, TypeScript governance modules, React operator interfaces, Supabase edge functions, telemetry views, and deployment-ready web surfaces.',
  },
  {
    q: 'What is the premium claim backed by?',
    a: 'The public story is now anchored in concrete proof: invariant tests, gate counts, hash-chain replay, deterministic serialization, and named product surfaces instead of generic marketing copy.',
  },
  {
    q: 'How should a buyer evaluate it?',
    a: 'Start with the README claims, run the test suites, inspect the runtime modules, then use the cockpit and studio as the human-facing layer over the verifiable substrate.',
  },
]

export default function App() {
  const trialStartRef = useRef<number | null>(null)
  const isSuccess = window.location.pathname === '/success'

  useEffect(() => {
    if (isSuccess) return
    trialStartRef.current = Date.now()
    captureEvent('trial_started', { product: 'hub', source: document.referrer || 'direct' })
  }, [isSuccess])

  const handlePrimaryClick = (target: string) => {
    const startedAt = trialStartRef.current ?? Date.now()
    const ttv = Math.round((Date.now() - startedAt) / 1000)
    captureEvent('platform_cta_click', { target, ttv_seconds: ttv })
  }

  if (isSuccess) return <SuccessPage />

  return (
    <div className="min-h-screen overflow-hidden bg-hub-bg text-hub-text">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-hub-accent/20 blur-[120px]" />
        <div className="absolute bottom-[-16rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-phi/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-hub-border/70 bg-hub-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a
            href="#top"
            className="text-sm font-semibold text-phi animate-breathe"
            style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.22em' }}
          >
            AEGIS-Ω
          </a>
          <div className="flex items-center gap-6">
            <a href="#platform" className="hidden text-xs text-hub-muted transition-colors hover:text-hub-text sm:block">Platform</a>
            <a href="#proof" className="hidden text-xs text-hub-muted transition-colors hover:text-hub-text sm:block">Proof</a>
            <a href="#deployment" className="hidden text-xs text-hub-muted transition-colors hover:text-hub-text sm:block">Deploy</a>
            <a
              href="https://github.com/tarikskalic/AEGIS--"
              onClick={() => handlePrimaryClick('github')}
              className="rounded-full border border-phi/40 px-4 py-2 text-xs font-semibold text-phi transition-all hover:border-phi hover:bg-phi/10"
            >
              View system
            </a>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:pt-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-phi/30 bg-phi/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-phi">
              <ShieldCheck size={14} />
              Constitutional AI Runtime
            </div>
            <h1 className="max-w-4xl text-[clamp(3.2rem,8vw,6.8rem)] font-black leading-[0.88] tracking-[-0.07em]">
              Ultra-premium AI control plane.
              <span className="block bg-gradient-to-r from-phi via-white to-hub-glow bg-clip-text text-transparent">
                Proof, not vibes.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-hub-muted">
              AEGIS-Ω is a full-stack, self-governing AI platform: deterministic runtime, swarm governance,
              replay-verifiable memory, operator cockpit, and production web surfaces presented as one coherent system.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://github.com/tarikskalic/AEGIS--"
                onClick={() => handlePrimaryClick('hero-github')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-phi px-7 py-4 text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
              >
                Inspect the runtime <ArrowRight size={16} />
              </a>
              <a
                href="#platform"
                className="inline-flex items-center justify-center rounded-xl border border-hub-border bg-hub-surface/70 px-7 py-4 text-sm font-semibold text-hub-text transition-all hover:border-hub-glow/50"
              >
                See platform layers
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-phi/20 bg-hub-surface/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="rounded-[1.5rem] border border-hub-border bg-black/25 p-5">
              <div className="mb-5 flex items-center justify-between border-b border-hub-border pb-4">
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.24em] text-phi">Runtime Status</div>
                  <div className="mt-1 text-2xl font-bold">Replay coherent</div>
                </div>
                <span className="h-3 w-3 rounded-full bg-aegis-T0 shadow-[0_0_24px_rgba(52,211,153,0.9)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CORE_METRICS.map(metric => (
                  <div key={metric.label} className="rounded-2xl border border-hub-border bg-hub-bg/80 p-4">
                    <div className="text-3xl font-black tracking-tight text-hub-text">{metric.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-hub-muted">{metric.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-phi/20 bg-phi/10 p-4 font-mono text-xs leading-6 text-phi">
                <div>AdaptivePower(T) ≤ ReplayVerifiability(T)</div>
                <div className="text-hub-muted">state_hash = SHA-256(prev_hash ‖ canonical_event)</div>
                <div className="text-aegis-T0">verdict: chain intact · policy enforced · operator visible</div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-24">
          <div className="mb-10 max-w-3xl">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-hub-glow">Platform architecture</div>
            <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">Not three tiny tools. A governed AI stack.</h2>
            <p className="mt-4 text-base leading-7 text-hub-muted">
              The landing page now matches the README: it leads with constitutional runtime, distributed state,
              observability, and operator control instead of underselling the system as a discount creator bundle.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {PLATFORM_LAYERS.map(({ Icon, title, kicker, desc, bullets }) => (
              <article key={title} className="rounded-[1.5rem] border border-hub-border bg-hub-surface/80 p-6 transition-all hover:-translate-y-1 hover:border-phi/40 hover:shadow-2xl hover:shadow-phi/5">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-phi/30 bg-phi/10 text-phi">
                  <Icon size={22} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-hub-glow">{kicker}</div>
                <h3 className="mt-2 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-hub-muted">{desc}</p>
                <ul className="mt-5 space-y-2">
                  {bullets.map(bullet => (
                    <li key={bullet} className="flex gap-2 text-sm text-hub-muted">
                      <span className="mt-1 text-phi">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="proof" className="border-y border-hub-border/70 bg-hub-surface/35 scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-phi">Proof layer</div>
                <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">Premium means evidence on screen.</h2>
                <p className="mt-4 text-base leading-7 text-hub-muted">
                  AEGIS-Ω should feel like an institutional AI platform: precise, technical, verified, and controlled.
                  These proof blocks put the substrate in front of the buyer before the CTA.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {PROOF_POINTS.map(({ Icon, label, copy }) => (
                  <div key={label} className="rounded-2xl border border-hub-border bg-hub-bg/80 p-5">
                    <Icon className="mb-4 text-hub-glow" size={22} />
                    <h3 className="font-bold text-hub-text">{label}</h3>
                    <p className="mt-2 text-sm leading-6 text-hub-muted">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="deployment" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-24">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-hub-glow">Deployment surfaces</div>
              <h2 className="text-4xl font-black tracking-[-0.04em] md:text-5xl">One system, multiple operator faces.</h2>
            </div>
            <a
              href="mailto:tarikskalic33@gmail.com?subject=AEGIS-%CE%A9%20platform%20review"
              onClick={() => handlePrimaryClick('contact')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-phi/40 px-5 py-3 text-sm font-semibold text-phi transition-all hover:bg-phi/10"
            >
              Request platform review <Mail size={15} />
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {DEPLOYMENT_SURFACES.map(surface => (
              <a
                key={surface.name}
                href={surface.href}
                onClick={() => handlePrimaryClick(`surface-${surface.name.toLowerCase()}`)}
                className="group rounded-2xl border border-hub-border bg-hub-surface p-6 transition-all hover:-translate-y-1 hover:border-hub-glow/50"
              >
                <div className="mb-4 w-fit rounded-full border border-hub-glow/30 bg-hub-glow/10 px-3 py-1 text-xs font-semibold text-hub-glow">{surface.tag}</div>
                <h3 className="text-2xl font-bold">{surface.name}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-hub-muted">{surface.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-phi">
                  Open surface <ArrowRight className="transition-transform group-hover:translate-x-1" size={15} />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="mb-8 text-center text-3xl font-black tracking-[-0.04em]">FAQ</h2>
          <div className="flex flex-col gap-4">
            {FAQS.map(item => (
              <div key={item.q} className="rounded-2xl border border-hub-border bg-hub-surface/80 p-6">
                <h3 className="font-bold text-hub-text">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-hub-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20">
          <div className="rounded-[2rem] border border-phi/25 bg-gradient-to-br from-phi/15 via-hub-surface to-hub-accent/10 p-10 text-center shadow-2xl shadow-black/30">
            <Code className="mx-auto mb-5 text-phi" size={28} />
            <h2 className="text-4xl font-black tracking-[-0.05em]">Ship the platform story the code deserves.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-hub-muted">
              The page now sells AEGIS-Ω as a serious AI operating layer: runtime, governance, observability,
              deployment, and proof. No more “$39 bundle” first impression.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://github.com/tarikskalic/AEGIS--"
                onClick={() => handlePrimaryClick('final-github')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-phi px-8 py-4 text-sm font-bold text-black hover:opacity-90"
              >
                Audit GitHub README <ArrowRight size={16} />
              </a>
              <a
                href="mailto:tarikskalic33@gmail.com"
                onClick={() => handlePrimaryClick('final-contact')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-hub-border px-8 py-4 text-sm font-semibold text-hub-text hover:border-phi/40"
              >
                Contact operator <Mail size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hub-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div className="flex items-center gap-3">
            <Zap size={16} className="text-phi" />
            <span className="text-sm font-medium text-hub-muted">AEGIS-Ω Constitutional AI Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#platform" className="text-xs text-hub-muted hover:text-hub-text">Platform</a>
            <a href="#proof" className="text-xs text-hub-muted hover:text-hub-text">Proof</a>
            <a href="#deployment" className="text-xs text-hub-muted hover:text-hub-text">Deploy</a>
            <a href="mailto:tarikskalic33@gmail.com" className="inline-flex items-center gap-1.5 text-xs text-hub-muted hover:text-hub-text">
              <Mail size={11} /> Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
