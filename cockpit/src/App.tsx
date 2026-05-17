import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Plus, Trash2, Send, StopCircle, Cpu } from 'lucide-react'
import { useAgent } from './hooks/useAgent.js'
import { useSessions } from './hooks/useSessions.js'
import type { Provider } from './lib/agent.js'

const PROVIDERS: { value: Provider; label: string }[] = [
  { value: 'dashscope', label: 'DashScope (Qwen)' },
  { value: 'ollama', label: 'Ollama (local)' },
]

export default function App() {
  const [provider, setProvider] = useState<Provider>('dashscope')
  const { messages, streaming, error, send, reset } = useAgent(provider)
  const { sessions, activeId, setActiveId, createSession, updateSession, deleteSession } = useSessions()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (activeId) updateSession(activeId, messages)
  }, [messages, activeId, updateSession])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')
    await send(text)
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleNewChat = () => {
    reset()
    createSession()
  }

  const handleSelectSession = (id: string) => {
    reset()
    setActiveId(id)
  }

  return (
    <div className="flex h-screen bg-aegis-bg text-aegis-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-aegis-border bg-aegis-surface">
        <div className="flex items-center gap-2 p-4 border-b border-aegis-border">
          <Cpu size={18} className="text-aegis-accent" />
          <span className="font-semibold text-sm tracking-wide">AEGIS Cockpit</span>
        </div>

        <div className="p-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-aegis-muted hover:text-aegis-text hover:bg-aegis-border transition-colors"
          >
            <Plus size={15} />
            New chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sessions.map(s => (
            <div
              key={s.id}
              className={`group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                s.id === activeId
                  ? 'bg-aegis-border text-aegis-text'
                  : 'text-aegis-muted hover:bg-aegis-border hover:text-aegis-text'
              }`}
              onClick={() => handleSelectSession(s.id)}
            >
              <span className="flex-1 truncate">{s.title}</span>
              <button
                onClick={e => { e.stopPropagation(); deleteSession(s.id) }}
                className="opacity-0 group-hover:opacity-100 text-aegis-muted hover:text-red-400 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-aegis-border">
          <select
            value={provider}
            onChange={e => setProvider(e.target.value as Provider)}
            className="w-full bg-aegis-bg border border-aegis-border rounded-lg px-2 py-1.5 text-xs text-aegis-muted focus:outline-none focus:border-aegis-accent"
          >
            {PROVIDERS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-aegis-muted">
              <Cpu size={40} className="text-aegis-border" />
              <p className="text-sm">Start a conversation</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-aegis-accent text-white rounded-br-sm'
                    : 'bg-aegis-surface border border-aegis-border rounded-bl-sm'
                }`}
              >
                {m.content}
                {streaming && i === messages.length - 1 && m.role === 'assistant' && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-aegis-accent animate-pulse rounded-sm align-middle" />
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-red-400 text-xs text-center bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-aegis-border">
          <div className="flex gap-2 bg-aegis-surface border border-aegis-border rounded-2xl px-4 py-3 focus-within:border-aegis-accent transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Message AEGIS… (Shift+Enter for newline)"
              rows={1}
              className="flex-1 bg-transparent text-sm text-aegis-text placeholder-aegis-muted resize-none focus:outline-none max-h-32 overflow-y-auto"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <button
              onClick={streaming ? reset : () => void handleSend()}
              disabled={!streaming && !input.trim()}
              className="self-end text-aegis-muted hover:text-aegis-accent disabled:opacity-30 transition-colors"
            >
              {streaming ? <StopCircle size={20} /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-aegis-muted text-xs mt-2 text-center">
            sovereign-runtime v0.5.3 · {provider === 'ollama' ? 'Ollama local' : 'DashScope cloud'}
          </p>
        </div>
      </div>
    </div>
  )
}
