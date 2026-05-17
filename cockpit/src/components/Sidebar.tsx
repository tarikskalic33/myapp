import { Plus, Trash2, Cpu } from 'lucide-react'
import type { Session } from '../hooks/useSessions.js'
import type { Provider } from '../lib/agent.js'
import { TelemetryPanel } from './TelemetryPanel.js'

const PROVIDERS: { value: Provider; label: string }[] = [
  { value: 'dashscope', label: 'DashScope (Qwen)' },
  { value: 'ollama', label: 'Ollama (local)' },
]

interface SidebarProps {
  sessions: Session[]
  activeId: string | null
  provider: Provider
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onProviderChange: (p: Provider) => void
}

export function Sidebar({
  sessions, activeId, provider,
  onNewChat, onSelectSession, onDeleteSession, onProviderChange,
}: SidebarProps) {
  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-aegis-border bg-aegis-surface">
      <div className="flex items-center gap-2 p-4 border-b border-aegis-border">
        <Cpu size={18} className="text-aegis-accent" />
        <span className="font-semibold text-sm tracking-wide">AEGIS Cockpit</span>
      </div>

      <div className="p-2">
        <button
          onClick={onNewChat}
          aria-label="New chat"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-aegis-muted hover:text-aegis-text hover:bg-aegis-border transition-colors"
        >
          <Plus size={15} />
          New chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sessions.length === 0 && (
          <p className="text-aegis-muted text-xs px-3 py-4 text-center">No sessions yet</p>
        )}
        {sessions.map(s => (
          <div
            key={s.id}
            className={`group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
              s.id === activeId
                ? 'bg-aegis-border text-aegis-text'
                : 'text-aegis-muted hover:bg-aegis-border hover:text-aegis-text'
            }`}
            onClick={() => onSelectSession(s.id)}
          >
            <span className="flex-1 truncate">{s.title}</span>
            <button
              onClick={e => { e.stopPropagation(); onDeleteSession(s.id) }}
              aria-label={`Delete session ${s.title}`}
              className="opacity-0 group-hover:opacity-100 text-aegis-muted hover:text-red-400 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </nav>

      <TelemetryPanel />

      <div className="p-3 border-t border-aegis-border space-y-2">
        <select
          value={provider}
          onChange={e => onProviderChange(e.target.value as Provider)}
          className="w-full bg-aegis-bg border border-aegis-border rounded-lg px-2 py-1.5 text-xs text-aegis-muted focus:outline-none focus:border-aegis-accent"
        >
          {PROVIDERS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <p className="text-aegis-muted text-xs text-center opacity-50">sovereign-runtime v0.5.3</p>
      </div>
    </aside>
  )
}
