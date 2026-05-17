import { useEffect, useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { useAgent } from './hooks/useAgent.js'
import { useSessions } from './hooks/useSessions.js'
import { Sidebar } from './components/Sidebar.js'
import { MessageList } from './components/MessageList.js'
import { InputBar } from './components/InputBar.js'
import type { Provider } from './lib/agent.js'

const DEFAULT_SYSTEM = 'You are AEGIS, a sovereign intelligence assistant. Be concise, precise, and direct.'

export default function App() {
  const [provider, setProvider] = useState<Provider>('dashscope')
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM)
  const [showSystem, setShowSystem] = useState(false)
  const [input, setInput] = useState('')

  const { messages, streaming, error, send, reset, loadMessages } = useAgent(provider)
  const { sessions, activeId, setActiveId, createSession, updateSession, deleteSession } = useSessions()

  useEffect(() => {
    if (activeId) updateSession(activeId, messages)
  }, [messages, activeId, updateSession])

  const handleSend = () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')
    const context = messages.length === 0 && systemPrompt.trim()
      ? [{ role: 'system' as const, content: systemPrompt }]
      : undefined
    void send(text, context)
  }

  const handleNewChat = () => { reset(); createSession() }

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id)
    loadMessages(session?.messages ?? [])
    setActiveId(id)
  }

  const handleExport = () => {
    const text = messages
      .filter(m => m.role !== 'system')
      .map(m => `[${m.role.toUpperCase()}]\n${m.content}`)
      .join('\n\n---\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aegis-chat-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-aegis-bg text-aegis-text overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        provider={provider}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={deleteSession}
        onProviderChange={setProvider}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-aegis-border bg-aegis-surface/50">
          <button
            onClick={() => setShowSystem(v => !v)}
            className="flex items-center gap-1.5 text-xs text-aegis-muted hover:text-aegis-text transition-colors"
          >
            System prompt
            <ChevronDown size={13} className={`transition-transform ${showSystem ? 'rotate-180' : ''}`} />
          </button>
          {messages.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs text-aegis-muted hover:text-aegis-text transition-colors"
            >
              <Download size={13} />
              Export
            </button>
          )}
        </div>

        {showSystem && (
          <div className="px-4 py-2 border-b border-aegis-border bg-aegis-surface/30">
            <textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={2}
              className="w-full bg-transparent text-xs text-aegis-muted placeholder-aegis-muted/50 resize-none focus:outline-none"
              placeholder="System prompt…"
            />
          </div>
        )}

        <MessageList messages={messages} streaming={streaming} error={error} />

        <InputBar
          value={input}
          streaming={streaming}
          onChange={setInput}
          onSend={handleSend}
          onStop={reset}
        />
      </div>
    </div>
  )
}
