import { FiCpu, FiUser } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import { formatRoleplayDate, getMessageCorrections, getMessageText, isUserMessage } from '../roleplayUtils'

export default function ChatMessage({ message }) {
  const isUser = isUserMessage(message)
  const text = getMessageText(message)
  const corrections = getMessageCorrections(message)

  return (
    <article className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FiCpu aria-hidden="true" />
        </div>
      ) : null}
      <div className={`max-w-[86%] rounded-[22px] border p-4 shadow-sm ${isUser ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-card-foreground'}`}>
        <div className="flex items-center justify-between gap-3">
          <Badge variant={isUser ? 'secondary' : 'primary'}>{isUser ? 'You' : 'AI Coach'}</Badge>
          <span className={`text-xs ${isUser ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
            {formatRoleplayDate(message?.createdAt || message?.timestamp)}
          </span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{text}</p>
        {corrections.length ? (
          <div className={`mt-4 rounded-2xl p-3 text-sm ${isUser ? 'bg-primary-foreground/10' : 'bg-muted'}`}>
            <p className="font-semibold">Correction</p>
            {corrections.map((correction, index) => (
              <div key={index} className="mt-2 space-y-1">
                {correction.original || correction.originalSentence ? <p><span className="font-semibold">Original: </span>{correction.original || correction.originalSentence}</p> : null}
                {correction.corrected || correction.correctedSentence ? <p><span className="font-semibold">Corrected: </span>{correction.corrected || correction.correctedSentence}</p> : null}
                {correction.explanation ? <p><span className="font-semibold">Why: </span>{correction.explanation}</p> : null}
                {correction.betterExpression || correction.suggestion ? <p><span className="font-semibold">Better: </span>{correction.betterExpression || correction.suggestion}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <FiUser aria-hidden="true" />
        </div>
      ) : null}
    </article>
  )
}
