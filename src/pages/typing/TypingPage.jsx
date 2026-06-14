import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiHelpCircle,
  FiLayers,
  FiPenTool,
  FiRefreshCw,
  FiTarget,
  FiXCircle,
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
  getTypingCorrectAnswer,
  getTypingHint,
  getTypingPromptText,
  getTypingQuestionId,
  getTypingSessionId,
  getTypingSessionTotalQuestions,
  getTypingSimilarityScore,
  getTypingUserAnswer,
  isTypingAnswerCorrect,
  normalizeTypingAnswer,
  normalizeTypingQuestions,
} from '@/features/typing/typingUtils'
import {
  useCreateTypingSession,
  useSubmitTypingAnswer,
  useTypingQuestions,
  useTypingSession,
} from '@/features/typing/useTyping'

const answerSchema = z.object({
  answer: z.string().trim().min(1, 'Type an answer before submitting.'),
})

const sessionSources = [
  { value: 'ALL', label: 'All vocabularies', description: 'Practice recall across your full word bank.', icon: FiBookOpen },
  { value: 'COLLECTION', label: 'Collection', description: 'Type answers from one selected collection.', icon: FiLayers },
  { value: 'REVIEW_DUE', label: 'Due review', description: 'Practice vocabulary currently due for review.', icon: FiTarget },
]

function normalizeCollectionList(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.data || payload?.collections || []
}

function TypingSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-36 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
      </div>
      <div className="h-[420px] animate-pulse rounded-[28px] border border-border bg-card" />
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

function SessionSetup({
  source,
  collectionId,
  collections,
  isLoadingCollections,
  onSourceChange,
  onCollectionChange,
  onStart,
  isStarting,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <DashboardSection
        title="Choose typing setup"
        description="Pick a vocabulary source. The backend will create the typing question set for this session."
      >
        <div className="grid gap-4">
          {sessionSources.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onSourceChange(item.value)}
                className={`rounded-card border p-5 text-left transition hover:shadow-md ${source === item.value ? 'border-primary bg-primary/5' : 'border-border bg-background/70'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {source === 'COLLECTION' ? (
          <div className="mt-5">
            <label className="text-sm font-semibold text-foreground" htmlFor="typing-collection">Collection</label>
            <select
              id="typing-collection"
              className="mt-2 h-12 w-full rounded-button border border-input bg-background px-4 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
              value={collectionId}
              onChange={(event) => onCollectionChange(event.target.value)}
              disabled={isLoadingCollections}
            >
              <option value="">{isLoadingCollections ? 'Loading collections...' : 'Select collection...'}</option>
              {collections.map((collection) => <option key={collection.id} value={String(collection.id)}>{getCollectionTitle(collection)}</option>)}
            </select>
          </div>
        ) : null}

        <Button className="mt-6 w-full" size="lg" disabled={isStarting || (source === 'COLLECTION' && !collectionId)} onClick={onStart}>
          <FiZap aria-hidden="true" /> {isStarting ? 'Starting practice...' : 'Start practice'}
        </Button>
      </DashboardSection>

      <DashboardSection title="Typing rules" description="Recall practice is stricter than multiple-choice learning.">
        <div className="space-y-3">
          <div className="rounded-2xl bg-muted p-4">
            <p className="font-semibold">Type, then press Enter</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">The input is focused automatically for every new question.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <p className="font-semibold">Trimmed answer</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Leading and trailing spaces are removed before submission.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <p className="font-semibold">Backend scoring</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">If the API returns a similarity score, it appears in the feedback panel.</p>
          </div>
        </div>
      </DashboardSection>
    </section>
  )
}

function QuestionCard({
  question,
  questionNumber,
  total,
  feedback,
  answerValue,
  answerError,
  answerRegistration,
  answerInputRef,
  onSubmit,
  onNext,
  isSubmitting,
  isLastQuestion,
}) {
  const hasFeedback = Boolean(feedback)
  const correct = hasFeedback ? isTypingAnswerCorrect(feedback, question) : false
  const correctAnswer = hasFeedback ? getTypingCorrectAnswer(feedback, question) : ''
  const userAnswer = hasFeedback ? getTypingUserAnswer(feedback) : answerValue
  const similarityScore = hasFeedback ? getTypingSimilarityScore(feedback) : null
  const hint = getTypingHint(question)

  return (
    <article className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant="primary">Question {questionNumber} of {total}</Badge>
        <Badge variant="secondary">Typing recall</Badge>
      </div>

      <div className="mt-8 rounded-[24px] bg-muted/70 p-6 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Type the matching answer</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
          {getTypingPromptText(question)}
        </h2>
        {hint ? <p className="mx-auto mt-5 max-w-2xl rounded-2xl bg-card p-4 text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Hint: </span>{hint}</p> : null}
      </div>

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <label className="text-sm font-semibold text-foreground" htmlFor="typing-answer">Your answer</label>
        <input
          id="typing-answer"
          className="h-14 w-full rounded-button border border-input bg-background px-5 text-lg font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-70"
          placeholder="Type your answer and press Enter..."
          autoComplete="off"
          disabled={hasFeedback || isSubmitting}
          {...answerRegistration}
          ref={(element) => {
            answerRegistration.ref(element)
            answerInputRef.current = element
          }}
        />
        {answerError ? <p className="text-sm font-semibold text-destructive">{answerError.message}</p> : null}
      </form>

      {hasFeedback ? (
        <div className={`mt-6 rounded-card border p-5 ${correct ? 'border-success/30 bg-success/10' : 'border-destructive/30 bg-destructive/10'}`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${correct ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive'}`}>
              {correct ? <FiCheckCircle aria-hidden="true" /> : <FiXCircle aria-hidden="true" />}
            </div>
            <div className="w-full">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold">{correct ? 'Correct answer' : 'Needs correction'}</p>
                {similarityScore !== null ? <Badge variant={similarityScore >= 80 ? 'success' : 'warning'}>{similarityScore}% similar</Badge> : null}
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <p className="rounded-xl bg-card p-3"><span className="font-semibold text-foreground">Your answer: </span>{String(userAnswer)}</p>
                <p className="rounded-xl bg-card p-3"><span className="font-semibold text-foreground">Correct answer: </span>{correctAnswer ? String(correctAnswer) : 'Not provided'}</p>
              </div>
              {feedback.explanation ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{feedback.explanation}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {hasFeedback ? 'Review the feedback, then continue.' : 'Submit is disabled until the answer is not empty.'}
        </p>
        {hasFeedback ? (
          <Button onClick={onNext}>
            {isLastQuestion ? 'Show result' : 'Next question'} <FiChevronRight aria-hidden="true" />
          </Button>
        ) : (
          <Button disabled={!normalizeTypingAnswer(answerValue) || isSubmitting} onClick={onSubmit}>
            {isSubmitting ? 'Submitting...' : 'Submit answer'}
          </Button>
        )}
      </div>
    </article>
  )
}

function CompletionScreen({ questions, feedbackByQuestion, session, onRestart }) {
  const answeredResults = questions
    .map((question, index) => {
      const questionKey = String(getTypingQuestionId(question) ?? index)
      const feedback = feedbackByQuestion[questionKey]
      if (!feedback) return null
      return {
        question,
        questionKey,
        feedback,
        correct: isTypingAnswerCorrect(feedback, question),
        similarityScore: getTypingSimilarityScore(feedback),
      }
    })
    .filter(Boolean)

  const answeredCount = answeredResults.length
  const correctCount = answeredResults.filter((item) => item.correct).length
  const wrongCount = Math.max(answeredCount - correctCount, 0)
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0
  const averageSimilarity = answeredResults.length
    ? Math.round(answeredResults.reduce((sum, item) => sum + (item.similarityScore ?? (item.correct ? 100 : 0)), 0) / answeredResults.length)
    : 0
  const score = session?.score ?? `${accuracy}%`

  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-[28px] border border-success/30 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-success/12 text-success">
          <FiAward aria-hidden="true" className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Typing practice complete</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          You completed the typing session. Each answer was submitted through the authenticated backend API.
        </p>
        <Button className="mt-6" onClick={onRestart}><FiRefreshCw aria-hidden="true" /> Start another practice</Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Score" value={score} icon={FiAward} tone="primary" />
        <StatCard label="Correct" value={correctCount} icon={FiCheckCircle} tone="success" />
        <StatCard label="Wrong" value={wrongCount} icon={FiXCircle} tone="destructive" />
        <StatCard label="Accuracy" value={`${accuracy}%`} icon={FiTarget} tone={accuracy >= 70 ? 'success' : 'warning'} />
        <StatCard label="Avg Similarity" value={`${averageSimilarity}%`} icon={FiPenTool} tone={averageSimilarity >= 80 ? 'success' : 'warning'} />
      </section>

      <DashboardSection title="Review typed answers" description="Compare each typed answer with the backend's expected answer.">
        <div className="space-y-3">
          {answeredResults.map((item, index) => {
            const correctAnswer = getTypingCorrectAnswer(item.feedback, item.question)
            const userAnswer = getTypingUserAnswer(item.feedback)
            return (
              <div key={item.questionKey} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">Question {index + 1}: {getTypingPromptText(item.question)}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.similarityScore !== null ? <Badge variant={item.similarityScore >= 80 ? 'success' : 'warning'}>{item.similarityScore}% similar</Badge> : null}
                    <Badge variant={item.correct ? 'success' : 'destructive'}>{item.correct ? 'Correct' : 'Wrong'}</Badge>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                  <p className="rounded-xl bg-muted p-3"><span className="font-semibold text-foreground">Your answer: </span>{String(userAnswer)}</p>
                  <p className="rounded-xl bg-muted p-3"><span className="font-semibold text-foreground">Correct answer: </span>{correctAnswer ? String(correctAnswer) : 'Not provided'}</p>
                </div>
              </div>
            )
          })}
        </div>
      </DashboardSection>
    </ResponsiveContentContainer>
  )
}

export default function TypingPage() {
  const location = useLocation()
  const initialSessionState = location.state || {}
  const [source, setSource] = useState(initialSessionState.source || 'ALL')
  const [collectionId, setCollectionId] = useState(initialSessionState.collectionId || '')
  const [sessionId, setSessionId] = useState(initialSessionState.sessionId || null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedbackByQuestion, setFeedbackByQuestion] = useState({})
  const [completed, setCompleted] = useState(false)
  const answerInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: { answer: '' },
  })

  const collectionsQuery = useCollections({ page: 0, size: 100 })
  const collections = normalizeCollectionList(collectionsQuery.data)
  const createSession = useCreateTypingSession()
  const sessionQuery = useTypingSession(sessionId, { enabled: Boolean(sessionId) })
  const questionsQuery = useTypingQuestions(sessionId, { enabled: Boolean(sessionId) })
  const submitAnswer = useSubmitTypingAnswer()
  const questions = normalizeTypingQuestions(questionsQuery.data)
  const session = sessionQuery.data
  const currentQuestion = questions[currentIndex]
  const currentQuestionKey = currentQuestion ? String(getTypingQuestionId(currentQuestion) ?? currentIndex) : ''
  const currentFeedback = currentQuestionKey ? feedbackByQuestion[currentQuestionKey] : null
  const answeredCount = Object.keys(feedbackByQuestion).length
  const totalQuestions = getTypingSessionTotalQuestions(session, questions)
  const answerValue = watch('answer') || ''
  const answerRegistration = register('answer')

  const resultSession = useMemo(() => ({
    ...session,
    correctCount: session?.correctCount,
    wrongCount: session?.wrongCount,
  }), [session])

  useEffect(() => {
    reset({ answer: '' })
    const focusTimer = window.setTimeout(() => answerInputRef.current?.focus(), 0)
    return () => window.clearTimeout(focusTimer)
  }, [currentQuestionKey, reset])

  const resetSessionState = () => {
    setSessionId(null)
    setCurrentIndex(0)
    setFeedbackByQuestion({})
    setCompleted(false)
    reset({ answer: '' })
  }

  const handleStart = async () => {
    try {
      const sessionResponse = await createSession.mutateAsync({
        source,
        ...(source === 'COLLECTION' ? { collectionId } : {}),
      })
      const nextSessionId = getTypingSessionId(sessionResponse)
      if (!nextSessionId) throw new Error('Typing session response did not include a session id')
      setSessionId(nextSessionId)
      setCurrentIndex(0)
      setFeedbackByQuestion({})
      setCompleted(false)
      reset({ answer: '' })
      toast.success('Typing practice started')
    } catch (error) {
      toast.error(error.message || 'Unable to start typing session')
    }
  }

  const handleSubmitAnswer = async (values) => {
    if (!sessionId || !currentQuestion) return
    const questionId = getTypingQuestionId(currentQuestion)
    if (!questionId) {
      toast.error('Current question does not include a question id')
      return
    }

    const answer = normalizeTypingAnswer(values.answer)
    if (!answer) return

    try {
      const response = await submitAnswer.mutateAsync({ sessionId, questionId, answer })
      setFeedbackByQuestion((current) => ({
        ...current,
        [String(questionId)]: {
          ...response,
          userAnswer: response?.userAnswer ?? answer,
        },
      }))
    } catch (error) {
      toast.error(error.message || 'Unable to submit typing answer')
    }
  }

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setCompleted(true)
      return
    }
    setCurrentIndex((index) => index + 1)
  }

  if (completed) {
    return (
      <CompletionScreen
        questions={questions}
        feedbackByQuestion={feedbackByQuestion}
        session={resultSession}
        onRestart={resetSessionState}
      />
    )
  }

  if (!sessionId) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          eyebrow="Typing practice"
          title="Typing Practice"
          description="Start a real typing recall session from all vocabulary, one collection, or due review items."
        />
        <SessionSetup
          source={source}
          collectionId={collectionId}
          collections={collections}
          isLoadingCollections={collectionsQuery.isLoading}
          onSourceChange={(value) => { setSource(value); setCollectionId('') }}
          onCollectionChange={setCollectionId}
          onStart={handleStart}
          isStarting={createSession.isPending}
        />
      </ResponsiveContentContainer>
    )
  }

  if (questionsQuery.isLoading || sessionQuery.isLoading) return <TypingSkeleton />

  if (questionsQuery.error || sessionQuery.error) {
    const error = questionsQuery.error || sessionQuery.error
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          title="Typing Practice"
          description="Continue your typing practice session."
          actions={<Button variant="secondary" onClick={resetSessionState}>Back to setup</Button>}
        />
        <ErrorFallback
          title="Unable to load typing practice"
          description={error.message || 'Typing practice data could not be loaded.'}
          onRetry={() => { questionsQuery.refetch(); sessionQuery.refetch() }}
        />
      </ResponsiveContentContainer>
    )
  }

  if (!questions.length) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          title="Typing Practice"
          description="No typing questions are available for this source."
          actions={<Button variant="secondary" onClick={resetSessionState}>Back to setup</Button>}
        />
        <EmptyState
          icon={FiHelpCircle}
          title="No vocabulary available"
          description="Add vocabulary or choose another source before starting typing practice."
          action={<Button onClick={resetSessionState}>Choose another source</Button>}
        />
      </ResponsiveContentContainer>
    )
  }

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Typing session"
        title="Typing Practice"
        description="Type the answer, press Enter to submit, read the feedback, then continue."
        actions={<Button variant="secondary" onClick={resetSessionState}><FiRefreshCw aria-hidden="true" /> End session</Button>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Answered" value={`${answeredCount}/${questions.length}`} icon={FiCheckCircle} tone="primary" />
        <StatCard label="Source" value={source === 'REVIEW_DUE' ? 'Due' : source === 'COLLECTION' ? 'Collection' : 'All'} icon={FiLayers} tone="success" />
        <StatCard label="Mode" value="Typing" icon={FiPenTool} tone="warning" />
      </section>

      <ProgressBar currentIndex={currentIndex} total={questions.length || totalQuestions} answeredCount={answeredCount} />

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        total={questions.length}
        feedback={currentFeedback}
        answerValue={currentFeedback ? getTypingUserAnswer(currentFeedback) : answerValue}
        answerError={errors.answer}
        answerRegistration={answerRegistration}
        answerInputRef={answerInputRef}
        onSubmit={handleSubmit(handleSubmitAnswer)}
        onNext={handleNext}
        isSubmitting={submitAnswer.isPending}
        isLastQuestion={currentIndex >= questions.length - 1}
      />
    </ResponsiveContentContainer>
  )
}
