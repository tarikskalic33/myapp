import { ProductCard } from './components/ProductCard.js'
import { PricingTable } from './components/PricingTable.js'
import { Zap } from 'lucide-react'

const PRODUCTS = [
  {
    icon: '🎯',
    name: 'Platform Picker',
    description: 'Tell the AI your content niche, style, and goals. Get a ranked recommendation across TikTok, YouTube Shorts, Reels, and Snapchat Spotlight.',
    features: [
      'Radar chart with platform scores',
      'Ranked results with reasoning',
      'Share summary to clipboard',
      'Zero backend — runs in browser',
    ],
    accentColor: '#7C3AED',
    glowColor: '#A78BFA',
    price: 19,
  },
  {
    icon: '⚡',
    name: 'Hook Generator',
    description: 'Turn any topic into 10 scroll-stopping hooks, each ranked by viral potential with type labels: curiosity gap, controversy, social proof, and more.',
    features: [
      '10 hooks per generation',
      'Type-coded with colour badges',
      'Star & save favourites locally',
      'Export all hooks to clipboard',
    ],
    accentColor: '#D97706',
    glowColor: '#FCD34D',
    price: 19,
  },
  {
    icon: '📅',
    name: 'Content Calendar',
    description: '4-week content plan with daily post ideas — hooks, formats, content pillars, and production notes. Download as .txt or .csv.',
    features: [
      '4 weeks × N posts per week',
      'Colour-coded content pillars',
      'Copy individual posts',
      'Export as TXT or CSV',
    ],
    accentColor: '#16A34A',
    glowColor: '#86EFAC',
    price: 19,
  },
]

export default function App() {
  return (
    <div className="min-h-screen bg-hub-bg text-hub-text">

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <div
          className="animate-fade-up inline-flex items-center gap-2 bg-hub-accent/10 border border-hub-accent/30 rounded-full px-4 py-1.5 text-hub-glow text-sm font-medium mb-8"
          style={{ animationDelay: '0ms' }}
        >
          <Zap size={14} />
          Creator AI Toolkit
        </div>
        <h1
          className="animate-fade-up text-5xl md:text-6xl font-bold text-hub-text tracking-tight mb-6"
          style={{ animationDelay: '80ms' }}
        >
          Three tools.<br />
          <span className="text-hub-glow">One DashScope key.</span>
        </h1>
        <p
          className="animate-fade-up text-hub-muted text-lg max-w-xl mx-auto"
          style={{ animationDelay: '160ms' }}
        >
          AI-powered platform matching, viral hook writing, and content calendar planning —
          all zero-backend, all running in your browser.
        </p>
      </div>

      {/* Product cards */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.name} {...p} delay={200 + i * 100} />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <h2 className="text-2xl font-bold text-hub-text mb-3">How it works</h2>
        <p className="text-hub-muted mb-8">
          Each tool runs entirely in your browser. You supply your own free DashScope API key — no middleman, no subscription.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-left">
          {[
            { step: '1', title: 'Get a free API key', desc: 'Sign up at DashScope (Alibaba Cloud) — the free tier covers hundreds of requests.' },
            { step: '2', title: 'Deploy to Vercel', desc: 'Fork the repo, set your key as an env variable, deploy in 2 minutes.' },
            { step: '3', title: 'Start creating', desc: 'Open the tool, fill in your details, and get AI results instantly.' },
          ].map(item => (
            <div key={item.step} className="bg-hub-surface border border-hub-border rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-hub-accent/20 text-hub-glow font-bold text-sm flex items-center justify-center mb-3">
                {item.step}
              </div>
              <div className="font-semibold text-hub-text text-sm mb-1">{item.title}</div>
              <p className="text-hub-muted text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-hub-text mb-2">Pricing</h2>
          <p className="text-hub-muted">Buy once, own forever. No subscriptions.</p>
        </div>
        <PricingTable />
      </div>

      {/* Footer */}
      <div className="border-t border-hub-border">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-hub-glow" />
            <span className="text-hub-muted text-sm font-medium">AEGIS Creator Toolkit</span>
          </div>
          <p className="text-hub-muted text-xs">
            Zero backend · Buyer supplies DashScope key · Built with React + Qwen AI
          </p>
        </div>
      </div>
    </div>
  )
}
