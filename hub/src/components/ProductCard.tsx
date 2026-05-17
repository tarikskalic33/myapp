import { ExternalLink } from 'lucide-react'

interface ProductCardProps {
  icon: string
  name: string
  description: string
  features: string[]
  accentColor: string
  glowColor: string
  price: number
  deployUrl?: string
  delay?: number
}

export function ProductCard({
  icon,
  name,
  description,
  features,
  accentColor,
  glowColor,
  price,
  deployUrl,
  delay = 0,
}: ProductCardProps) {
  return (
    <div
      className="animate-fade-up bg-hub-surface border border-hub-border rounded-2xl p-6 flex flex-col gap-4 hover:border-hub-accent/40 transition-all group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
        >
          {icon}
        </div>
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ background: `${glowColor}20`, color: glowColor }}
        >
          ${price}
        </span>
      </div>

      <div>
        <h3 className="font-bold text-hub-text text-lg mb-1">{name}</h3>
        <p className="text-hub-muted text-sm leading-relaxed">{description}</p>
      </div>

      <ul className="space-y-1.5 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-hub-muted">
            <span style={{ color: glowColor }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {deployUrl ? (
        <a
          href={deployUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all text-white"
          style={{ background: accentColor }}
        >
          Launch app
          <ExternalLink size={14} />
        </a>
      ) : (
        <div className="flex items-center justify-center text-sm text-hub-muted py-3 rounded-xl border border-hub-border">
          Deploy your own ↗
        </div>
      )}
    </div>
  )
}
