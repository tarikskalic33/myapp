import { ShoppingCart } from 'lucide-react'

interface Tier {
  name: string
  price: number
  originalPrice?: number
  desc: string
  items: string[]
  highlight: boolean
  badge?: string
  gumroadUrl?: string
}

const TIERS: Tier[] = [
  {
    name: 'Single Tool',
    price: 19,
    desc: 'Pick any one — Platform Picker, Hook Generator, or Content Calendar.',
    items: [
      '1 AI tool of your choice',
      'Unlimited runs (your API key)',
      'No subscriptions, ever',
      'Full source code',
    ],
    highlight: false,
    gumroadUrl: 'https://gumroad.com/l/aegis-single',
  },
  {
    name: 'Starter Pack',
    price: 29,
    originalPrice: 38,
    desc: 'Any two tools at a discount. Mix and match what you need.',
    items: [
      '2 AI tools of your choice',
      'Save $9 vs buying separate',
      'Unlimited runs (your API key)',
      'No subscriptions, ever',
      'Full source code',
    ],
    highlight: true,
    badge: 'Most popular',
    gumroadUrl: 'https://gumroad.com/l/aegis-starter-pack',
  },
  {
    name: 'Full Toolkit',
    price: 39,
    originalPrice: 57,
    desc: 'All three tools — the complete creator AI arsenal.',
    items: [
      'All 3 AI tools',
      'Save $18 vs buying separate',
      'Unlimited runs (your API key)',
      'No subscriptions, ever',
      'Full source code',
      'Future tool updates included',
    ],
    highlight: false,
    badge: 'Best value',
    gumroadUrl: 'https://gumroad.com/l/aegis-full-toolkit',
  },
]

export function PricingTable() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {TIERS.map(tier => (
        <div
          key={tier.name}
          className={`rounded-2xl p-6 border flex flex-col gap-4 ${
            tier.highlight
              ? 'border-hub-accent/50 bg-hub-accent/5 shadow-lg shadow-hub-accent/10'
              : 'border-hub-border bg-hub-surface'
          }`}
        >
          {tier.badge && (
            <span className="text-xs font-semibold text-hub-glow bg-hub-accent/10 border border-hub-accent/30 rounded-full px-3 py-0.5 w-fit">
              {tier.badge}
            </span>
          )}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-hub-text">${tier.price}</span>
              {tier.originalPrice && (
                <span className="text-hub-muted text-sm line-through">${tier.originalPrice}</span>
              )}
            </div>
            <div className="font-semibold text-hub-text mt-0.5">{tier.name}</div>
            <p className="text-hub-muted text-sm mt-1">{tier.desc}</p>
          </div>
          <ul className="space-y-1.5 flex-1">
            {tier.items.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-hub-muted">
                <span className="text-hub-glow">✓</span>
                {item}
              </li>
            ))}
          </ul>
          {tier.gumroadUrl && (
            <a
              href={tier.gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all ${
                tier.highlight
                  ? 'bg-hub-accent text-white hover:opacity-90'
                  : 'border border-hub-accent/50 text-hub-glow hover:bg-hub-accent/10'
              }`}
            >
              <ShoppingCart size={14} />
              Get {tier.name}
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
