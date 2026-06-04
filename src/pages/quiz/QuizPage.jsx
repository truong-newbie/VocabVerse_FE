import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiHelpCircle,
  FiLayers,
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
  formatQuestionType,
  getFeedbackCorrectAnswer,
  getQuizQuestionId,
  getQuizQuestionText,
  getQuizQuestionType,
  getQuizSessionId,
  getSessionTotalQuestions,
  isCorrectAnswer,
  normalizeAnswerValue,
  normalizeQuizOptions,
  normalizeQuizQuestions,
} from '@/features/quiz/quizUtils'
import {
  useCreateQuizSession,
  useQuizQuestions,
  useQuizSession,
  useSubmitQuizAnswer,
} from '@/features/quiz/useQuizzes'

const sessionSources = [
  { value: 'ALL', label: 'All vocabularies', description: 'Quiz from your full vocabulary bank.', icon: FiBookOpen },
  { value: 'COLLECTION', label: 'Collection', description: 'Focus questions on one selected collection.', icon: FiLayers },
  { value: 'REVIEW_DUE', label: 'Due review', description: 'Practice words currently due for review.', icon: FiTarget },
]

const questionTypes = [
  { value: 'TERM_TO_MEANING', label: 'Term to meaning', description: 'Read the English term and choose its meaning.' },
  { value: 'MEANING_TO_TERM', label: 'Meaning to term', description: 'Read the meaning and choose the matching English term.' },
]

function normalizeCollectionList(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.data || payload?.collections || []
}

function answerMatchesOption(answer, option) {
  const normalizedAnswer = normalizeAnswerValue(answer)
  return [option.id, option.value, option.label].some((value) => normalizeAnswerValue(value) === normalizedAnswer)
}

function QuizSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-28 animate-pulse rounded-card border border-border bg-card" />
      </div>
      <div className="h-[440px] animate-pulse rounded-[28px] border border-border bg-card" />
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
  questionType,
  collections,
  isLoadingCollections,
  onSourceChange,
  onCollectionChange,
  onQuestionTypeChange,
  onStart,
  isStarting,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <DashboardSection
        title="Choose quiz setup"
        description="Pick a vocabulary source and the direction of each multiple-choice question."
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
            <label className="text-sm font-semibold text-foreground" htmlFor="quiz-collection">Collection</label>
            <select
              id="quiz-collection"
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

        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground">Question type</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {questionTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onQuestionTypeChange(item.value)}
                className={`rounded-card border p-4 text-left transition hover:shadow-md ${questionType === item.value ? 'border-primary bg-primary/5' : 'border-border bg-background/70'}`}
              >
                <p className="font-semibold">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <Button className="mt-6 w-full" size="lg" disabled={isStarting || (source === 'COLLECTION' && !collectionId)} onClick={onStart}>
          <FiZap aria-hidden="true" /> {isStarting ? 'Starting quiz...' : 'Start quiz'}
        </Button>
      </DashboardSection>

      <DashboardSection title="Quiz rules" description="Answers are submitted to the backend one question at a time.">
        <div className="space-y-3">
          <div className="rounded-2xl bg-muted p-4">
            <p className="font-semibold">Multiple choice only</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Typing practice is intentionally not implemented in this page.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <p className="font-semibold">No answer spam</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Correct/wrong feedback stays inside the quiz UI instead of showing a toast for every answer.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <p className="font-semibold">Protected session</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">The authenticated API client sends the token; no user id is sent from the frontend.</p>
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
  selectedAnswer,
  feedback,
  onSelectAnswer,
  onSubmitAnswer,
  onNext,
  isSubmitting,
  isLastQuestion,
}) {
  const options = normalizeQuizOptions(question)
  const questionType = getQuizQuestionType(question)
  const hasFeedback = Boolean(feedback)
  const correct = hasFeedback ? isCorrectAnswer(feedback, feedback.selectedAnswer, question) : false
  const correctAnswer = hasFeedback ? getFeedbackCorrectAnswer(feedback, question) : ''

  return (
    <article className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant="primary">Question {questionNumber} of {total}</Badge>
        <Badge variant="secondary">{formatQuestionType(questionType)}</Badge>
      </div>

      <div className="mt-8 rounded-[24px] bg-muted/70 p-6 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Choose the best answer</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
          {getQuizQuestionText(question)}
        </h2>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {options.map((option, index) => {
          const isSelected = normalizeAnswerValue(selectedAnswer) === normalizeAnswerValue(option.value)
          const isSubmittedSelection = hasFeedback && normalizeAnswerValue(feedback.selectedAnswer) === normalizeAnswerValue(option.value)
          const isCorrectOption = hasFeedback && answerMatchesOption(correctAnswer, option)
          const stateClass = isCorrectOption
            ? 'border-success bg-success/10 text-foreground'
            : isSubmittedSelection && !correct
              ? 'border-destructive bg-destructive/10 text-foreground'
              : isSelected
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-background/70 text-foreground hover:border-primary/50 hover:bg-primary/5'

          return (
            <button
              key={`${option.id}-${index}`}
              type="button"
              className={`rounded-card border p-5 text-left transition ${stateClass}`}
              onClick={() => onSelectAnswer(option.value)}
              disabled={hasFeedback || isSubmitting}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-card font-bold shadow-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg font-semibold leading-7">{option.label}</span>
              </div>
            </button>
          )
        })}
      </div>

      {!options.length ? (
        <div className="mt-6 rounded-card border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          This question does not include multiple-choice options from the backend.
        </div>
      ) : null}

      {hasFeedback ? (
        <div className={`mt-6 rounded-card border p-5 ${correct ? 'border-success/30 bg-success/10' : 'border-destructive/30 bg-destructive/10'}`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${correct ? 'bg-success/12 text-success' : 'bg-destructive/12 text-destructive'}`}>
              {correct ? <FiCheckCircle aria-hidden="true" /> : <FiXCircle aria-hidden="true" />}
            </div>
            <div>
              <p className="font-semibold">{correct ? 'Correct answer' : 'Wrong answer'}</p>
              {correctAnswer !== '' ? <p className="mt-1 text-sm leading-6 text-muted-foreground">Correct answer: {String(correctAnswer)}</p> : null}
              {feedback.explanation ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{feedback.explanation}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {hasFeedback ? 'Review the feedback, then continue.' : 'Select one option before submitting.'}
        </p>
        {hasFeedback ? (
          <Button onClick={onNext}>
            {isLastQuestion ? 'Show result' : 'Next question'} <FiChevronRight aria-hidden="true" />
          </Button>
        ) : (
          <Button disabled={!selectedAnswer || isSubmitting || !options.length} onClick={onSubmitAnswer}>
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
      const questionKey = String(getQuizQuestionId(question) ?? index)
      const feedback = feedbackByQuestion[questionKey]
      if (!feedback) return null
      return {
        question,
        questionKey,
        feedback,
        correct: isCorrectAnswer(feedback, feedback.selectedAnswer, question),
      }
    })
    .filter(Boolean)

  const answeredCount = answeredResults.length
  const correctCount = answeredResults.filter((item) => item.correct).length
  const wrongCount = Math.max(answeredCount - correctCount, 0)
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0
  const score = session?.score ?? `${accuracy}%`

  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-[28px] border border-success/30 bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-success/12 text-success">
          <FiAward aria-hidden="true" className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Quiz complete</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          You completed the quiz session. Each answer was submitted through the authenticated backend API.
        </p>
        <Button className="mt-6" onClick={onRestart}><FiRefreshCw aria-hidden="true" /> Start another quiz</Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Score" value={score} icon={FiAward} tone="primary" />
        <StatCard label="Correct" value={correctCount} icon={FiCheckCircle} tone="success" />
        <StatCard label="Wrong" value={wrongCount} icon={FiXCircle} tone="destructive" />
        <StatCard label="Accuracy" value={`${accuracy}%`} icon={FiTarget} tone={accuracy >= 70 ? 'success' : 'warning'} />
      </section>

      <DashboardSection title="Review answers" description="Compare your selected answer with the backend's correct answer.">
        <div className="space-y-3">
          {answeredResults.map((item, index) => {
            const correctAnswer = getFeedbackCorrectAnswer(item.feedback, item.question)
            return (
              <div key={item.questionKey} className="rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">Question {index + 1}: {getQuizQuestionText(item.question)}</p>
                  <Badge variant={item.correct ? 'success' : 'destructive'}>{item.correct ? 'Correct' : 'Wrong'}</Badge>
                </div>
                <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                  <p className="rounded-xl bg-muted p-3"><span className="font-semibold text-foreground">Your answer: </span>{String(item.feedback.selectedAnswer)}</p>
                  <p className="rounded-xl bg-muted p-3"><span className="font-semibold text-foreground">Correct answer: </span>{correctAnswer !== '' ? String(correctAnswer) : 'Not provided'}</p>
                </div>
              </div>
            )
          })}
        </div>
      </DashboardSection>
    </ResponsiveContentContainer>
  )
}

export default function QuizPage() {
  const [source, setSource] = useState('ALL')
  const [collectionId, setCollectionId] = useState('')
  const [questionType, setQuestionType] = useState('TERM_TO_MEANING')
  const [sessionId, setSessionId] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [feedbackByQuestion, setFeedbackByQuestion] = useState({})
  const [completed, setCompleted] = useState(false)

  const collectionsQuery = useCollections({ page: 0, size: 100 })
  const collections = normalizeCollectionList(collectionsQuery.data)
  const createSession = useCreateQuizSession()
  const sessionQuery = useQuizSession(sessionId, { enabled: Boolean(sessionId) })
  const questionsQuery = useQuizQuestions(sessionId, { enabled: Boolean(sessionId) })
  const submitAnswer = useSubmitQuizAnswer()
  const questions = normalizeQuizQuestions(questionsQuery.data)
  const session = sessionQuery.data
  const currentQuestion = questions[currentIndex]
  const currentQuestionKey = currentQuestion ? String(getQuizQuestionId(currentQuestion) ?? currentIndex) : ''
  const currentFeedback = currentQuestionKey ? feedbackByQuestion[currentQuestionKey] : null
  const answeredCount = Object.keys(feedbackByQuestion).length
  const totalQuestions = getSessionTotalQuestions(session, questions)

  const resultSession = useMemo(() => ({
    ...session,
    correctCount: session?.correctCount,
    wrongCount: session?.wrongCount,
  }), [session])

  const resetSessionState = () => {
    setSessionId(null)
    setCurrentIndex(0)
    setSelectedAnswer('')
    setFeedbackByQuestion({})
    setCompleted(false)
  }

  const handleStart = async () => {
    try {
      const sessionResponse = await createSession.mutateAsync({
        source,
        questionType,
        ...(source === 'COLLECTION' ? { collectionId } : {}),
      })
      const nextSessionId = getQuizSessionId(sessionResponse)
      if (!nextSessionId) throw new Error('Quiz session response did not include a session id')
      setSessionId(nextSessionId)
      setCurrentIndex(0)
      setSelectedAnswer('')
      setFeedbackByQuestion({})
      setCompleted(false)
      toast.success('Quiz session started')
    } catch (error) {
      toast.error(error.message || 'Unable to start quiz session')
    }
  }

  const handleSubmitAnswer = async () => {
    if (!sessionId || !currentQuestion || !selectedAnswer) return
    const questionId = getQuizQuestionId(currentQuestion)
    if (!questionId) {
      toast.error('Current question does not include a question id')
      return
    }

    try {
      const response = await submitAnswer.mutateAsync({ sessionId, questionId, answer: selectedAnswer })
      setFeedbackByQuestion((current) => ({
        ...current,
        [String(questionId)]: {
          ...response,
          selectedAnswer,
        },
      }))
    } catch (error) {
      toast.error(error.message || 'Unable to submit quiz answer')
    }
  }

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setCompleted(true)
      return
    }
    setCurrentIndex((index) => index + 1)
    setSelectedAnswer('')
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
          eyebrow="Quiz practice"
          title="Quiz"
          description="Start a real multiple-choice quiz session from all vocabulary, one collection, or due review items."
        />
        <SessionSetup
          source={source}
          collectionId={collectionId}
          questionType={questionType}
          collections={collections}
          isLoadingCollections={collectionsQuery.isLoading}
          onSourceChange={(value) => { setSource(value); setCollectionId('') }}
          onCollectionChange={setCollectionId}
          onQuestionTypeChange={setQuestionType}
          onStart={handleStart}
          isStarting={createSession.isPending}
        />
      </ResponsiveContentContainer>
    )
  }

  if (questionsQuery.isLoading || sessionQuery.isLoading) return <QuizSkeleton />

  if (questionsQuery.error || sessionQuery.error) {
    const error = questionsQuery.error || sessionQuery.error
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          title="Quiz"
          description="Continue your quiz session."
          actions={<Button variant="secondary" onClick={resetSessionState}>Back to setup</Button>}
        />
        <ErrorFallback
          title="Unable to load quiz"
          description={error.message || 'Quiz session data could not be loaded.'}
          onRetry={() => { questionsQuery.refetch(); sessionQuery.refetch() }}
        />
      </ResponsiveContentContainer>
    )
  }

  if (!questions.length) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          title="Quiz"
          description="No questions are available for this quiz source."
          actions={<Button variant="secondary" onClick={resetSessionState}>Back to setup</Button>}
        />
        <EmptyState
          icon={FiHelpCircle}
          title="Not enough vocabulary for a quiz"
          description="Add more vocabulary or choose another source before starting a multiple-choice quiz."
          action={<Button onClick={resetSessionState}>Choose another source</Button>}
        />
      </ResponsiveContentContainer>
    )
  }

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Quiz session"
        title="Quiz"
        description="Select an option, submit it, read the feedback, then continue to the next question."
        actions={<Button variant="secondary" onClick={resetSessionState}><FiRefreshCw aria-hidden="true" /> End session</Button>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Answered" value={`${answeredCount}/${questions.length}`} icon={FiCheckCircle} tone="primary" />
        <StatCard label="Source" value={source === 'REVIEW_DUE' ? 'Due' : source === 'COLLECTION' ? 'Collection' : 'All'} icon={FiLayers} tone="success" />
        <StatCard label="Question Type" value={questionType === 'MEANING_TO_TERM' ? 'Meaning' : 'Term'} icon={FiTarget} tone="warning" />
      </section>

      <ProgressBar currentIndex={currentIndex} total={questions.length || totalQuestions} answeredCount={answeredCount} />

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        total={questions.length}
        selectedAnswer={currentFeedback?.selectedAnswer ?? selectedAnswer}
        feedback={currentFeedback}
        onSelectAnswer={setSelectedAnswer}
        onSubmitAnswer={handleSubmitAnswer}
        onNext={handleNext}
        isSubmitting={submitAnswer.isPending}
        isLastQuestion={currentIndex >= questions.length - 1}
      />
    </ResponsiveContentContainer>
  )
}
