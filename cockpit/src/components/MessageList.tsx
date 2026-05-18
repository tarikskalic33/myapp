import { useEffect, useRef } from 'react'
import { Cpu } from 'lucide-react'
import type { ChatMessage } from '../lib/agent.js'

interface MessageListProps {
  messages: ChatMessage[]
  streaming: boolean
  error: string | null
}

export function MessageList({ messages, streaming, error }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const visible = messages.filter(m => m.role !== 'system')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-aegis-muted">
          <Cpu size={40} className="text-aegis-border" />
          <p className="text-sm">Start a conversation</p>
          <p className="text-xs opacity-50">Shift+Enter for newline · Enter to send</p>
        </div>
      )}

      {visible.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-aegis-accent text-white rounded-br-sm'
                : 'bg-aegis-surface border border-aegis-border rounded-bl-sm'
            }`}
          >
            {m.content}
            {streaming && i === visible.length - 1 && m.role === 'assistant' && (
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
  )
}
