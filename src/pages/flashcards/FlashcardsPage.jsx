import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiRefreshCw,
  FiRotateCw,
  FiTarget,
  FiZap,
} from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DashboardSection from '@/components/dashboard/DashboardSection'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import StatCard from '@/components/common/StatCard'
import { getCollectionTitle } from '@/features/collection/collectionUtils'
import { useCollections } from '@/features/collection/useCollections'
import {
  getAnswerTone,
  getCardExample,
  getCardMeaning,
  getCardTerm,
  getCardVocabularyId,
  getSessionId,
  normalizeFlashcardCards,
  normalizeStringList,
} from '@/features/flashcard/flashcardUtils'
import {
  useCreateFlashcardSession,
  useFlashcardCards,
  useFlashcardSession,
  useSubmitFlashcardAnswer,
} from '@/features/flashcard/useFlashcards'

const sessionSources = [
  { value: 'ALL', label: 'All vocabularies', description: 'Practice across your full word bank.', icon: FiBookOpen },
  { value: 'COLLECTION', label: 'Collection', description: 'Focus on one selected collection.', icon: FiLayers },
  { value: 'REVIEW_DUE', label: 'Due review', description: 'Use vocabulary currently due for spaced repetition.', icon: FiTarget },
]

const answerActions = [
  { result: 'AGAIN', label: 'Again', meaning: 'forgot', shortcut: '1', tone: 'destructive' },
  { result: 'HARD', label: 'Hard', meaning: 'difficult', shortcut: '2', tone: 'warning' },
  { result: 'GOOD', label: 'Good', meaning: 'remembered', shortcut: '3', tone: 'primary' },
  { result: 'EASY', label: 'Easy', meaning: 'very easy', shortcut: '4', tone: 'success' },
]

function normalizeCollectionList(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.data || payload?.collections || []
}

function FlashcardSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mx-auto h-[420px] max-w-4xl animate-pulse rounded-[28px] border border-border bg-card" />
    </ResponsiveContentContainer>
  )
}

function ProgressBar({ currentIndex, total, answeredCount }) {
  const current = total ? Math.min(currentIndex + 1, total) : 0
  const percent = total ? Math.round((answeredCount / total) * 100) : 0

  return (
    <section className="rounded-card border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Progress</p>
          <p className="mt-1 text-2xl font-bold">{current} / {total || 0}</p>
        </div>
        <Badge variant="primary">{percent}% answered</Badge>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}

function FlashcardStudyCard({ card, flipped, onFlip }) {
  const synonyms = normalizeStringList(card?.synonyms)

  return (
    <button
      type="button"
      className="group mx-auto block w-full max-w-4xl text-left [perspective:1400px]"
      onClick={onFlip}
      aria-label={flipped ? 'Show front side' : 'Show answer'}
    >
      <div className={`relative min-h-[420px] transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <article className="absolute inset-0 flex flex-col justify-center rounded-[28px] border border-border bg-card p-8 text-center shadow-sm [backface-visibility:hidden] sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Front</p>
          <h2 className="mt-6 text-5xl font-black tracking-tight text-foreground sm:text-7xl">{getCardTerm(card)}</h2>
          {card?.pronunciation ? <p className="mt-4 text-xl font-semibold text-primary">{card.pronunciation}</p> : null}
          {card?.partOfSpeech ? <Badge className="mx-auto mt-5" variant="secondary">{card.partOfSpeech}</Badge> : null}
          <p className="mt-8 text-sm text-muted-foreground">Click card or press Space to flip.</p>
        </article>

        <article className="absolute inset-0 flex flex-col justify-center rounded-[28px] border border-primary/25 bg-card p-8 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Back</p>
            <h3 className="mt-5 text-3xl font-bold text-foreground">{getCardMeaning(card)}</h3>
            {card?.vietnameseMeaning ? <p className="mt-3 text-xl font-semibold text-muted-foreground">{card.vietnameseMeaning}</p> : null}
            {getCardExample(card) ? <p className="mt-6 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Example: </span>{getCardExample(card)}</p> : null}
            {synonyms.length ? (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {synonyms.map((item) => <Badge key={item} variant="success">{item}</Badge>)}
              </div>
            ) : null}
            {card?.note || card?.memoryTip ? <p className="mt-5 text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Memory tip: </span>{card.note || card.memoryTip}</p> : null}
          </div>
        </article>
      </div>
    </button>
  )
}

function SessionSetup({ source, collectionId, collections, onSourceChange, onCollectionChange, onStart, isStarting }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Choose session source</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Start from all vocabulary, one collection, or the due review queue.</p>
        <div className="mt-6 grid gap-4">
          {sessionSources.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onSourceChange(item.value)}
              className={`rounded-card border p-5 text-left transition hover:shadow-md ${source === item.value ? 'border-primary bg-primary/5' : 'border-border bg-background/70'}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {source === 'COLLECTION' ? (
          <div className="mt-5">
            <label className="text-sm font-semibold text-foreground" htmlFor="flashcard-collection">Collection</label>
            <select
              id="flashcard-collection"
              className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              value={collectionId}
              onChange={(event) => onCollectionChange(event.target.value)}
            >
              <option value="">Select collection...</option>
              {collections.map((collection) => <option key={collection.id} value={String(collection.id)}>{getCollectionTitle(collection)}</option>)}
            </select>
          </div>
        ) : null}

        <Button className="mt-6 w-full" size="lg" disabled={isStarting || (source === 'COLLECTION' && !collectionId)} onClick={onStart}>
          <FiZap aria-hidden="true" /> {isStarting ? 'Starting session...' : 'Start flashcards'}
        </Button>
      </div>

      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Keyboard shortcuts</h2>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-muted p-4"><span>Flip card</span><Badge variant="primary">Space</Badge></div>
          {answerActions.map((action) => (
            <div key={action.result} className="flex items-center justify-between rounded-2xl bg-muted p-4">
              <span>{action.label} = {action.meaning}</span>
              <Badge variant={getAnswerTone(action.result)}>{action.shortcut}</Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CompletionScreen({ summary, total, onRestart }) {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-[28px] border border-success/30 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-success/12 text-success">
          <FiAward aria-hidden="true" className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Session complete</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">You reviewed every card in this flashcard session. Results were submitted to the backend as you answered.</p>
        <Button className="mt-6" onClick={onRestart}><FiRefreshCw aria-hidden="true" /> Start another session</Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Cards Reviewed" value={total} icon={FiCheckCircle} tone="success" />
        <StatCard label="Again" value={summary.AGAIN || 0} icon={FiRefreshCw} tone="destructive" />
        <StatCard label="Hard" value={summary.HARD || 0} icon={FiTarget} tone="warning" />
        <StatCard label="Good" value={summary.GOOD || 0} icon={FiBookOpen} tone="primary" />
        <StatCard label="Easy" value={summary.EASY || 0} icon={FiZap} tone="success" />
      </section>
    </ResponsiveContentContainer>
  )
}

export default function FlashcardsPage() {
  const [source, setSource] = useState('ALL')
  const [collectionId, setCollectionId] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [answered, setAnswered] = useState({})
  const [completed, setCompleted] = useState(false)

  const collectionsQuery = useCollections({ page: 0, size: 100 })
  const collections = normalizeCollectionList(collectionsQuery.data)
  const createSession = useCreateFlashcardSession()
  const sessionQuery = useFlashcardSession(sessionId, { enabled: Boolean(sessionId) })
  const cardsQuery = useFlashcardCards(sessionId, { enabled: Boolean(sessionId) })
  const submitAnswer = useSubmitFlashcardAnswer()
  const cards = normalizeFlashcardCards(cardsQuery.data)
  const currentCard = cards[currentIndex]
  const answeredCount = Object.keys(answered).length

  const summary = useMemo(() => Object.values(answered).reduce((acc, result) => ({ ...acc, [result]: (acc[result] || 0) + 1 }), {}), [answered])

  const resetSessionState = () => {
    setSessionId(null)
    setCurrentIndex(0)
    setFlipped(false)
    setAnswered({})
    setCompleted(false)
  }

  const handleStart = async () => {
    try {
      const session = await createSession.mutateAsync({
        source,
        ...(source === 'COLLECTION' ? { collectionId } : {}),
      })
      const nextSessionId = getSessionId(session)
      if (!nextSessionId) throw new Error('Flashcard session response did not include a session id')
      setSessionId(nextSessionId)
      setCurrentIndex(0)
      setFlipped(false)
      setAnswered({})
      setCompleted(false)
      toast.success('Flashcard session started')
    } catch (error) {
      toast.error(error.message || 'Unable to start flashcard session')
    }
  }

  const moveToIndex = useCallback((index) => {
    if (!cards.length) return
    setCurrentIndex(Math.min(Math.max(index, 0), cards.length - 1))
    setFlipped(false)
  }, [cards.length])

  const handleAnswer = useCallback(async (result) => {
    if (!sessionId || !currentCard || !flipped) return
    const vocabularyId = getCardVocabularyId(currentCard)
    if (!vocabularyId) {
      toast.error('Current card does not include a vocabulary id')
      return
    }

    try {
      await submitAnswer.mutateAsync({ sessionId, vocabularyId, result })
      const nextAnswered = { ...answered, [String(vocabularyId)]: result }
      setAnswered(nextAnswered)
      const allAnswered = Object.keys(nextAnswered).length >= cards.length
      if (allAnswered) {
        setCompleted(true)
        toast.success('Flashcard session complete')
        return
      }
      const nextIndex = currentIndex + 1 < cards.length ? currentIndex + 1 : cards.findIndex((card) => !nextAnswered[String(getCardVocabularyId(card))])
      moveToIndex(nextIndex >= 0 ? nextIndex : currentIndex)
    } catch (error) {
      toast.error(error.message || 'Unable to submit flashcard answer')
    }
  }, [answered, cards, currentCard, currentIndex, flipped, moveToIndex, sessionId, submitAnswer])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!sessionId || completed || !cards.length) return
      if (event.code === 'Space') {
        event.preventDefault()
        setFlipped((value) => !value)
      }
      if (!flipped) return
      const action = answerActions.find((item) => item.shortcut === event.key)
      if (action) {
        event.preventDefault()
        handleAnswer(action.result)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cards.length, completed, flipped, sessionId, currentCard, answered, currentIndex, handleAnswer])

  if (completed) return <CompletionScreen summary={summary} total={cards.length} onRestart={resetSessionState} />

  if (!sessionId) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          eyebrow="Flashcard practice"
          title="Flashcards"
          description="Choose a source, flip each card, and submit recall quality to keep spaced repetition accurate."
        />
        <SessionSetup
          source={source}
          collectionId={collectionId}
          collections={collections}
          onSourceChange={(value) => { setSource(value); setCollectionId('') }}
          onCollectionChange={setCollectionId}
          onStart={handleStart}
          isStarting={createSession.isPending}
        />
      </ResponsiveContentContainer>
    )
  }

  if (cardsQuery.isLoading || sessionQuery.isLoading) return <FlashcardSkeleton />

  if (cardsQuery.error || sessionQuery.error) {
    const error = cardsQuery.error || sessionQuery.error
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Flashcards" description="Continue your flashcard session." actions={<Button variant="secondary" onClick={resetSessionState}>Back to setup</Button>} />
        <ErrorFallback title="Unable to load flashcards" description={error.message || 'Flashcard session data could not be loaded.'} onRetry={() => { cardsQuery.refetch(); sessionQuery.refetch() }} />
      </ResponsiveContentContainer>
    )
  }

  if (!cards.length) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Flashcards" description="No cards are available for this session source." actions={<Button variant="secondary" onClick={resetSessionState}>Back to setup</Button>} />
        <EmptyState
          icon={FiBookOpen}
          title="No vocabulary available"
          description="Add vocabulary or choose another source before starting a flashcard session."
          action={<Button onClick={resetSessionState}>Choose another source</Button>}
        />
      </ResponsiveContentContainer>
    )
  }

  const currentVocabularyId = getCardVocabularyId(currentCard)
  const currentAnswered = answered[String(currentVocabularyId)]

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Study session"
        title="Flashcards"
        description="Flip the card, rate your recall, and move through the session. Space flips the card; 1-4 submits an answer after flipping."
        actions={<Button variant="secondary" onClick={resetSessionState}><FiRefreshCw aria-hidden="true" /> End session</Button>}
      />

      <ProgressBar currentIndex={currentIndex} total={cards.length} answeredCount={answeredCount} />

      <FlashcardStudyCard card={currentCard} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />

      <section className="rounded-card border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <Button variant="secondary" disabled={currentIndex <= 0} onClick={() => moveToIndex(currentIndex - 1)}><FiChevronLeft aria-hidden="true" /> Previous</Button>
            <Button variant="secondary" disabled={currentIndex >= cards.length - 1} onClick={() => moveToIndex(currentIndex + 1)}>Next <FiChevronRight aria-hidden="true" /></Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 lg:min-w-[520px]">
            {answerActions.map((action) => (
              <Button
                key={action.result}
                variant={action.tone === 'primary' ? 'primary' : action.tone === 'destructive' ? 'destructive' : 'secondary'}
                disabled={!flipped || submitAnswer.isPending || Boolean(currentAnswered)}
                onClick={() => handleAnswer(action.result)}
                aria-label={`${action.label}: ${action.meaning}`}
              >
                {action.label}
                <span className="text-xs opacity-80">{action.shortcut}</span>
              </Button>
            ))}
          </div>
        </div>
        {!flipped ? <p className="mt-4 text-sm text-muted-foreground">Flip the card before choosing AGAIN, HARD, GOOD, or EASY.</p> : null}
        {currentAnswered ? <p className="mt-4 text-sm text-success">This card was answered as {currentAnswered}. Move to another card or finish the session.</p> : null}
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {answerActions.map((action) => (
          <div key={action.result} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Badge variant={getAnswerTone(action.result)}>{action.result}</Badge>
            <p className="mt-3 font-semibold">{action.meaning}</p>
            <p className="mt-1 text-sm text-muted-foreground">Shortcut: {action.shortcut}</p>
          </div>
        ))}
      </section>
    </ResponsiveContentContainer>
  )
}
