const TIERS = [
  {
    name: 'Single Tool',
    price: 19,
    desc: 'Any one tool — Platform Picker, Hook Generator, or Content Calendar.',
    items: ['1 AI tool', 'Your own API key', 'No subscriptions', 'Source code included'],
    highlight: false,
  },
  {
    name: 'Starter Pack',
    price: 29,
    desc: 'Any two tools at a discount. Mix and match.',
    items: ['2 AI tools', 'Save $9 vs buying separate', 'Your own API key', 'Source code included'],
    highlight: true,
  },
  {
    name: 'Full Toolkit',
    price: 39,
    desc: 'All three tools — the complete creator AI arsenal.',
    items: ['All 3 AI tools', 'Save $18 vs buying separate', 'Your own API key', 'Source code included'],
    highlight: false,
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
          {tier.highlight && (
            <span className="text-xs font-semibold text-hub-glow bg-hub-accent/10 border border-hub-accent/30 rounded-full px-3 py-0.5 w-fit">
              Most popular
            </span>
          )}
          <div>
            <div className="text-3xl font-bold text-hub-text mb-0.5">${tier.price}</div>
            <div className="font-semibold text-hub-text">{tier.name}</div>
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
        </div>
      ))}
    </div>
  )
}
