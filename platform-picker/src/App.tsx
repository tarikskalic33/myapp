import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, TrendingUp } from 'lucide-react'
import { rankPlatforms, type MatcherInput } from './lib/matcher.js'
import { ResultCard } from './components/ResultCard.js'
import type { PlatformRanking } from './lib/matcher.js'

const FIELDS: { key: keyof MatcherInput; label: string; placeholder: string }[] = [
  { key: 'niche',              label: 'Your niche',          placeholder: 'e.g. fitness, cooking, comedy, finance…' },
  { key: 'content_style',      label: 'Content style',       placeholder: 'e.g. talking head, B-roll, tutorials, skits…' },
  { key: 'target_age',         label: 'Target age group',    placeholder: 'e.g. 18–24, 25–34, teens…' },
  { key: 'posting_frequency',  label: 'Posting frequency',   placeholder: 'e.g. daily, 3x/week, weekends only…' },
  { key: 'monetisation_goal',  label: 'Monetisation goal',   placeholder: 'e.g. brand deals, creator fund, sell products…' },
  { key: 'current_following',  label: 'Current following',   placeholder: 'e.g. 0 (starting), 5k, 50k…' },
]

const EMPTY: MatcherInput = {
  niche: '', content_style: '', target_age: '',
  posting_frequency: '', monetisation_goal: '', current_following: '',
}

type State = 'idle' | 'loading' | 'results' | 'error'

export default function App() {
  const [form, setForm] = useState<MatcherInput>(EMPTY)
  const [state, setState] = useState<State>('idle')
  const [results, setResults] = useState<PlatformRanking[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const valid = Object.values(form).every(v => v.trim().length > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || state === 'loading') return
    setState('loading')
    try {
      setResults(await rankPlatforms(form))
      setState('results')
    } catch (err) {
      setErrorMsg((err as Error).message)
      setState('error')
    }
  }

  const reset = () => { setForm(EMPTY); setState('idle'); setResults([]); setErrorMsg('') }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 rounded-full px-4 py-1.5 text-brand-glow text-sm font-medium mb-6">
            <Sparkles size={14} />
            AI-powered platform matching
          </div>
          <h1 className="text-4xl font-bold text-brand-text mb-3 tracking-tight">Platform Picker</h1>
          <p className="text-brand-muted text-lg">
            Tell us about your content. Get ranked recommendations for TikTok, YouTube Shorts, Reels &amp; Spotlight.
          </p>
        </div>

        {(state === 'idle' || state === 'error') && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-brand-muted mb-1.5">{f.label}</label>
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-glow transition-colors"
                />
              </div>
            ))}

            {state === 'error' && (
              <div className="flex items-start gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!valid}
              className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles size={16} />
              Find my best platform
            </button>
          </form>
        )}

        {state === 'loading' && (
          <div className="text-center py-20">
            <Loader2 size={36} className="animate-spin text-brand-glow mx-auto mb-4" />
            <p className="text-brand-muted text-sm">Analysing your profile…</p>
          </div>
        )}

        {state === 'results' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-brand-glow" />
              <h2 className="font-semibold text-brand-text">Your platform ranking</h2>
            </div>
            {results.map((r, i) => <ResultCard key={r.platform} ranking={r} rank={i} />)}
            <button
              onClick={reset}
              className="w-full mt-4 border border-brand-border text-brand-muted hover:border-brand-glow hover:text-brand-glow py-3 rounded-xl text-sm transition-colors"
            >
              Try another profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
