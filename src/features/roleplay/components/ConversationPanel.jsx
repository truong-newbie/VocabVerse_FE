import { useEffect, useRef } from 'react'
import { FiSend } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import ChatMessage from './ChatMessage'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
      AI is typing...
    </div>
  )
}

export default function ConversationPanel({ messages, draft, onDraftChange, onSend, isSending, isEnded }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isSending])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <section className="flex min-h-[720px] flex-col rounded-[28px] border border-border bg-background shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-xl font-semibold">Conversation</h2>
        <p className="mt-1 text-sm text-muted-foreground">Press Enter to send. Shift+Enter adds a new line.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {messages.length ? messages.map((message, index) => (
          <ChatMessage key={message?.id || message?.messageId || index} message={message} />
        )) : (
          <div className="grid h-full min-h-72 place-items-center rounded-[24px] border border-dashed border-border bg-card/70 p-8 text-center">
            <div>
              <h3 className="text-2xl font-semibold">Start the conversation</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Introduce yourself or answer the AI persona's first question.</p>
            </div>
          </div>
        )}
        {isSending ? <TypingIndicator /> : null}
        <div ref={scrollRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <textarea
            className="min-h-24 resize-none rounded-button border border-input bg-card px-4 py-3 text-sm leading-6 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-70"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isEnded ? 'Session ended.' : 'Type your message...'}
            disabled={isSending || isEnded}
          />
          <Button className="h-auto min-h-12 sm:w-28" onClick={onSend} disabled={!draft.trim() || isSending || isEnded}>
            <FiSend aria-hidden="true" /> Send
          </Button>
        </div>
      </div>
    </section>
  )
}
