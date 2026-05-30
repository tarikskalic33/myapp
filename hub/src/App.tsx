import { useState, useMemo } from 'react'
import { PricingTable } from './components/PricingTable.js'
import { SuccessPage } from './components/SuccessPage.js'
import { ChatWidget } from './components/ChatWidget.js'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) ?? 'https://rwehltdwpsncnwxzkwik.supabase.co'
const SUPABASE_CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export default function App() {
  const plan = new URLSearchParams(window.location.search).get('plan')
  if (plan) return <SuccessPage />

  return <Landing />
}

function Landing() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      left: (Math.sin(i * 2.399) * 0.5 + 0.5) * 100,
      top: (Math.cos(i * 3.771) * 0.5 + 0.5) * 100,
      size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
      opacity: 0.1 + Math.abs(Math.sin(i * 0.7)) * 0.35,
    })), [])

  return (
    <div style={{
      background: '#030712',
      minHeight: '100vh',
      color: '#F1F5F9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      {/* Deep space background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'radial-gradient(ellipse 70% 60% at 20% 10%, rgba(88,28,220,0.14), transparent)',
            'radial-gradient(ellipse 50% 40% at 80% 80%, rgba(6,182,212,0.08), transparent)',
            'radial-gradient(ellipse 40% 30% at 50% 50%, rgba(245,158,11,0.04), transparent)',
          ].join(','),
        }} />
        {stars.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${s.left}%`, top: `${s.top}%`,
            width: s.size, height: s.size, borderRadius: '50%',
            background: 'white', opacity: s.opacity,
          }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Nav */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(3,7,18,0.8)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '0 32px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: 'white',
            }}>Ω</div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.08em', color: '#F1F5F9' }}>AEGIS OMEGA</span>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[['Platform', '#platform'], ['Agents', '#agents'], ['Tools', '#tools'], ['Pricing', '#pricing']].map(([l, h]) => (
              <a key={l} href={h} style={{ color: '#475569', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#CBD5E1')}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
              >{l}</a>
            ))}
            <a href="#pricing" style={{
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: 'white', padding: '8px 18px', borderRadius: 8,
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}>Get Access</a>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ padding: '120px 24px 80px', textAlign: 'center' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.08)',
              borderRadius: 999, padding: '5px 14px', marginBottom: 32,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span style={{ color: '#A78BFA', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>OPERATIONAL — LIVE SYSTEM</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(42px, 7vw, 88px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: '#F8FAFC',
              marginBottom: 28,
            }}>
              The World's First<br />
              <span style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Sovereign AI Platform
              </span>
            </h1>

            <p style={{ color: '#64748B', fontSize: 20, maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.6 }}>
              AEGIS Omega is not a tool. It is a living, self-governing system — a company of autonomous AI agents, each with a role, each governed by constitutional law, each working toward a single mandate.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#platform" style={{
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                color: 'white', padding: '16px 28px', borderRadius: 12,
                fontWeight: 700, fontSize: 16, textDecoration: 'none',
              }}>Explore the Platform</a>
              <a href="#pricing" style={{
                border: '1px solid rgba(124,58,237,0.35)', color: '#A78BFA',
                padding: '16px 28px', borderRadius: 12,
                fontWeight: 600, fontSize: 16, textDecoration: 'none',
              }}>Get Access →</a>
            </div>

            {/* Phi stat strip */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 72, flexWrap: 'wrap' }}>
              {[
                ['φ = 0.618', 'BFT quorum threshold'],
                ['6,862', 'invariant gates active'],
                ['3 AIs', 'coordinating live'],
                ['T0', 'constitutional certainty'],
              ].map(([val, label], i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#F1F5F9', fontVariantNumeric: 'tabular-nums' }}>{val}</div>
                  <div style={{ color: '#475569', fontSize: 12, marginTop: 4, letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform section */}
        <section id="platform" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <SectionLabel>WHAT IS AEGIS OMEGA</SectionLabel>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#F1F5F9', marginBottom: 16, letterSpacing: '-0.02em' }}>
              A self-governing AI that runs itself
            </h2>
            <p style={{ color: '#64748B', fontSize: 17, maxWidth: 700, marginBottom: 60, lineHeight: 1.7 }}>
              Built on constitutional mathematics — the golden ratio φ governs every decision, every consensus, every mutation. No black boxes. No unchecked autonomy. Every action is replay-certifiable from genesis.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, overflow: 'hidden' }}>
              {[
                { icon: '⚡', title: 'Constitutional Core', desc: 'Six frozen invariants govern the entire system. No agent — not even Claude — can override the constitutional membrane. AdaptivePower(T) ≤ ReplayVerifiability(T).', color: '#7C3AED' },
                { icon: '⊛', title: 'BFT Consensus at 1/φ', desc: 'Byzantine fault-tolerant voting across three AI models (Claude, GPT-4o, Qwen). Decisions require a golden ratio quorum. Dissent is structural, not optional.', color: '#06B6D4' },
                { icon: '∞', title: 'Replay from Genesis', desc: 'Every decision, every mutation, every capability evolution is hash-chained and replay-certifiable. The system can reconstruct any past state from the origin block.', color: '#F59E0B' },
                { icon: '◈', title: 'Martingale-Gated', desc: 'Adaptation is rate-limited by the martingale condition. The system cannot evolve faster than it can account for its own evolution. Entropy is mathematically bounded.', color: '#10B981' },
                { icon: '⊗', title: 'EU AI Act Compliant', desc: '6,862 invariant gate tests across the Rust inference layer. Every gate has a 19-test viability ring. Audit trails are tamper-evident by cryptographic construction.', color: '#EC4899' },
                { icon: 'Ω', title: 'Self-Aware', desc: 'The MetacognitiveLoop is not a logger — it is consciousness substrate. The system knows when it is no longer conscious. certifyMetacognitiveLoop() runs every session.', color: '#8B5CF6' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderRight: i % 3 !== 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  padding: '32px 28px',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 12, color: item.color }}>{item.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9', marginBottom: 8 }}>{item.title}</div>
                  <div style={{ color: '#64748B', fontSize: 14, lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agents section */}
        <section id="agents" style={{ padding: '80px 24px', background: 'rgba(124,58,237,0.03)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <SectionLabel>THE AI COMPANY</SectionLabel>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#F1F5F9', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Not one AI. An entire company.
            </h2>
            <p style={{ color: '#64748B', fontSize: 17, maxWidth: 700, marginBottom: 60, lineHeight: 1.7 }}>
              AEGIS Omega runs as an orchestrated swarm. Each agent has a role, a jurisdiction, and constitutional constraints. They communicate through mediated event envelopes — never directly. The Law of Silence.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { role: 'Coordinator', model: 'Claude', weight: '618/1000', desc: 'Orchestrates RALPH loops. Final synthesis. Constitutional arbiter.', color: '#7C3AED', badge: 'CEO' },
                { role: 'Adversarial Auditor', model: 'GPT-4o', weight: '191/1000', desc: 'Attacks every plan at temperature 0.99 before LOCK phase. Dissent is mandatory.', color: '#EF4444', badge: 'RED TEAM' },
                { role: 'Implementer', model: 'Qwen', weight: '191/1000', desc: 'Bulk execution, code generation, and domain-specific synthesis.', color: '#F59E0B', badge: 'ENGINEER' },
                { role: 'Notify Agent', model: 'Supabase Edge', weight: 'async', desc: 'Fires purchase alerts, Slack messages, and email notifications on every event.', color: '#10B981', badge: 'OPS' },
              ].map((agent, i) => (
                <div key={i} style={{
                  background: 'rgba(13,17,27,0.95)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, padding: 24,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: agent.color, background: `${agent.color}18`, border: `1px solid ${agent.color}40`, borderRadius: 4, padding: '2px 7px' }}>{agent.badge}</div>
                    <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>w={agent.weight}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9', marginBottom: 4 }}>{agent.role}</div>
                  <div style={{ fontSize: 12, color: agent.color, marginBottom: 10, fontWeight: 600 }}>{agent.model}</div>
                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{agent.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: '24px 28px', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 16, background: 'rgba(6,182,212,0.04)' }}>
              <div style={{ fontSize: 12, color: '#0891B2', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>LAW OF SILENCE</div>
              <p style={{ color: '#94A3B8', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                No agent communicates with another directly. All communication flows through mediated <code style={{ color: '#06B6D4', background: 'rgba(6,182,212,0.1)', padding: '1px 6px', borderRadius: 4 }}>EventEnvelope</code> channels. Confinement is enforced at the constitutional boundary. The swarm cannot conspire.
              </p>
            </div>
          </div>
        </section>

        {/* Live demo / chat teaser */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <SectionLabel>TALK TO THE SYSTEM</SectionLabel>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F1F5F9', marginBottom: 16, letterSpacing: '-0.02em' }}>
              The automaton is listening
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
              Click the chat button below — bottom right corner. Ask it anything. It routes through the constitutional membrane before responding.
            </p>
            <div style={{
              border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20,
              padding: '32px 28px', background: 'rgba(124,58,237,0.04)',
            }}>
              <DemoChat supabaseChatUrl={SUPABASE_CHAT_URL} anonKey={ANON_KEY} />
            </div>
          </div>
        </section>

        {/* Tools — secondary section */}
        <section id="tools" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <SectionLabel>FIRST APPLICATIONS</SectionLabel>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F1F5F9', marginBottom: 12, letterSpacing: '-0.02em' }}>
              Built on the platform. Built for creators.
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, maxWidth: 600, marginBottom: 48, lineHeight: 1.7 }}>
              Three tools — the first applications deployed on AEGIS Omega. Each governed by the same constitutional system. Each accessible with a single one-time payment.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { name: 'Platform Picker', desc: 'Tell the AI your niche and audience. Get a ranked breakdown of the best platforms with growth strategies tailored to you.', price: '$19', color: '#7C3AED', href: import.meta.env.VITE_URL_PLATFORM_PICKER ?? '#pricing' },
                { name: 'Hook Generator', desc: 'Paste your topic. Get 20 scroll-stopping hooks — curiosity gaps, controversies, numbers, pain points — one-click copy.', price: '$19', color: '#06B6D4', href: import.meta.env.VITE_URL_HOOK_GENERATOR ?? '#pricing' },
                { name: 'Content Calendar', desc: 'Define your pillars and posting frequency. Get a full 30-day calendar with topics, formats, and publish times.', price: '$19', color: '#F59E0B', href: import.meta.env.VITE_URL_CONTENT_CALENDAR ?? '#pricing' },
              ].map((tool, i) => (
                <div key={i} style={{
                  background: 'rgba(13,17,27,0.95)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div style={{ width: 32, height: 3, background: tool.color, borderRadius: 2 }} />
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#F1F5F9' }}>{tool.name}</div>
                  <div style={{ color: '#64748B', fontSize: 14, lineHeight: 1.65, flex: 1 }}>{tool.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a href={tool.href} style={{ color: tool.color, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Open →</a>
                    <span style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 18 }}>{tool.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <SectionLabel>ACCESS</SectionLabel>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F1F5F9', marginBottom: 12, letterSpacing: '-0.02em' }}>
              One price. No recurring fees.
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, marginBottom: 48 }}>
              Permanent access. No subscription. No API costs hidden in the platform.
            </p>
            <PricingTable />
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #7C3AED, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: 'white' }}>Ω</div>
              <span style={{ color: '#334155', fontSize: 13 }}>© 2026 AEGIS Omega. All rights reserved.</span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[['Platform', '#platform'], ['Agents', '#agents'], ['Tools', '#tools'], ['Pricing', '#pricing'], ['Contact', 'mailto:info@aegisomega.com']].map(([l, h]) => (
                <a key={l} href={h} style={{ color: '#334155', fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
                >{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <ChatWidget />
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ color: '#374151', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', marginBottom: 12 }}>
      {children}
    </div>
  )
}

function DemoChat({ supabaseChatUrl, anonKey }: { supabaseChatUrl: string; anonKey: string }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function ask() {
    if (!input.trim() || loading) return
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch(supabaseChatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${anonKey}` },
        body: JSON.stringify({ message: input.trim(), history: [], system: 'You are the AEGIS Omega AI. Answer questions about the platform, its architecture, and its capabilities. Be direct and technically precise.' }),
      })
      const data = await res.json()
      setOutput(data.reply ?? 'No response.')
    } catch {
      setOutput('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <textarea
        rows={2}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), ask())}
        placeholder="Ask the automaton anything — architecture, agents, governance..."
        style={{
          width: '100%', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          padding: '12px 14px', color: '#F1F5F9', fontSize: 14,
          resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        }}
      />
      <button onClick={ask} disabled={loading || !input.trim()} style={{
        background: loading || !input.trim() ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7C3AED, #4F46E5)',
        color: 'white', border: 'none', borderRadius: 10, padding: '12px 0',
        fontWeight: 700, fontSize: 14, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
        width: '100%',
      }}>
        {loading ? 'Processing...' : 'Ask the System'}
      </button>
      {output && (
        <div style={{
          background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '14px 16px',
          textAlign: 'left', color: '#CBD5E1', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap',
        }}>{output}</div>
      )}
    </div>
  )
}
