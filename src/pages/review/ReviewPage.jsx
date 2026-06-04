import { toast } from 'sonner'
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiRepeat,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DashboardSection from '@/components/dashboard/DashboardSection'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import StatCard from '@/components/common/StatCard'
import {
  formatReviewDate,
  getResultTone,
  getReviewExample,
  getReviewMeaning,
  getReviewRepetitionCount,
  getReviewStatus,
  getReviewTerm,
  getReviewVocabularyId,
  normalizeReviewHistory,
  normalizeTodayReviews,
} from '@/features/review/reviewUtils'
import {
  useLearningProgress,
  useReviewHistory,
  useSubmitReviewResult,
  useTodayReviews,
} from '@/features/review/useReviews'

const reviewActions = [
  { result: 'AGAIN', label: 'Again', meaning: 'forgot', tone: 'destructive' },
  { result: 'HARD', label: 'Hard', meaning: 'difficult', tone: 'warning' },
  { result: 'GOOD', label: 'Good', meaning: 'remembered', tone: 'primary' },
  { result: 'EASY', label: 'Easy', meaning: 'very easy', tone: 'success' },
]

function number(value) {
  return Number(value || 0)
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(number(value))
}

function statusVariant(status) {
  if (status === 'MASTERED') return 'success'
  if (status === 'REVIEWING') return 'primary'
  if (status === 'LEARNING') return 'warning'
  return 'secondary'
}

function ReviewSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-card border border-border bg-card p-5 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded-full bg-muted" />
            <div className="mt-5 h-4 w-36 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-96 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-96 animate-pulse rounded-card border border-border bg-card" />
      </div>
    </ResponsiveContentContainer>
  )
}

function LearningStatusBar({ progress }) {
  const segments = [
    { label: 'New', value: progress?.newCount, className: 'bg-secondary' },
    { label: 'Learning', value: progress?.learningCount, className: 'bg-warning' },
    { label: 'Reviewing', value: progress?.reviewingCount, className: 'bg-primary' },
    { label: 'Mastered', value: progress?.masteredCount, className: 'bg-success' },
  ]
  const total = segments.reduce((sum, item) => sum + number(item.value), 0)

  return (
    <div>
      <div className="flex h-4 overflow-hidden rounded-full bg-muted" aria-label="Learning progress distribution">
        {segments.map((segment) => (
          <div key={segment.label} className={segment.className} style={{ width: total ? `${(number(segment.value) / total) * 100}%` : '25%' }} title={`${segment.label}: ${formatNumber(segment.value)}`} />
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {segments.map((segment) => (
          <div key={segment.label} className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">{segment.label}</p>
            <p className="mt-1 text-2xl font-bold">{formatNumber(segment.value)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ item, onSubmit, isSubmitting }) {
  const vocabularyId = getReviewVocabularyId(item)
  const term = getReviewTerm(item)
  const meaning = getReviewMeaning(item)
  const example = getReviewExample(item)
  const status = getReviewStatus(item)

  return (
    <article className="rounded-card border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant(status)}>{status}</Badge>
            {item.partOfSpeech ? <Badge variant="secondary">{item.partOfSpeech}</Badge> : null}
            {item.collectionName ? <Badge variant="muted">{item.collectionName}</Badge> : null}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">{term}</h2>
          {item.pronunciation ? <p className="mt-1 text-sm font-semibold text-primary">{item.pronunciation}</p> : null}
        </div>
        <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Repetition {getReviewRepetitionCount(item)}</p>
          <p className="mt-1">Next: {formatReviewDate(item.nextReviewAt)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-sm text-muted-foreground">Meaning</p>
          <p className="mt-2 font-semibold leading-7">{meaning}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="text-sm text-muted-foreground">Vietnamese meaning</p>
          <p className="mt-2 font-semibold leading-7">{item.vietnameseMeaning || item.vocabulary?.vietnameseMeaning || 'Not provided'}</p>
        </div>
      </div>

      {example ? <p className="mt-4 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Example: </span>{example}</p> : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-4">
        {reviewActions.map((action) => (
          <Button key={action.result} variant={action.tone === 'primary' ? 'primary' : action.tone === 'destructive' ? 'destructive' : 'secondary'} disabled={isSubmitting || !vocabularyId} onClick={() => onSubmit(vocabularyId, action.result)} aria-label={`${action.label}: ${action.meaning}`}>
            {action.label}
            <span className="text-xs opacity-80">{action.meaning}</span>
          </Button>
        ))}
      </div>
    </article>
  )
}

function ReviewHistoryList({ items }) {
  if (!items.length) {
    return (
      <EmptyState
        icon={FiClock}
        title="No review history yet"
        description="Your recent review results will appear here after you submit AGAIN, HARD, GOOD, or EASY."
        action={<Button variant="secondary">Start reviewing</Button>}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="hidden grid-cols-[1fr_120px_170px_170px] gap-4 border-b border-border bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground md:grid">
        <span>Vocabulary</span>
        <span>Result</span>
        <span>Reviewed</span>
        <span>Status change</span>
      </div>
      <div className="divide-y divide-border">
        {items.slice(0, 8).map((item, index) => (
          <div key={item.id || `${getReviewTerm(item)}-${index}`} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_120px_170px_170px] md:items-center">
            <div>
              <p className="font-semibold">{getReviewTerm(item)}</p>
              <p className="mt-1 text-sm text-muted-foreground">Next: {formatReviewDate(item.nextReviewAt)}</p>
            </div>
            <Badge variant={getResultTone(item.result)}>{item.result || 'UNKNOWN'}</Badge>
            <p className="text-sm text-muted-foreground">{formatReviewDate(item.reviewedAt)}</p>
            <p className="text-sm text-muted-foreground">{item.previousStatus || 'N/A'} ? {item.newStatus || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const navigate = useNavigate()
  const todayQuery = useTodayReviews()
  const historyQuery = useReviewHistory()
  const progressQuery = useLearningProgress()
  const submitMutation = useSubmitReviewResult()

  const isLoading = todayQuery.isLoading || historyQuery.isLoading || progressQuery.isLoading
  const firstError = todayQuery.error || historyQuery.error || progressQuery.error

  const todayItems = normalizeTodayReviews(todayQuery.data)
  const historyItems = normalizeReviewHistory(historyQuery.data)
  const progress = progressQuery.data || {}

  const handleRetry = () => {
    todayQuery.refetch()
    historyQuery.refetch()
    progressQuery.refetch()
  }

  const handleSubmit = async (vocabularyId, result) => {
    try {
      await submitMutation.mutateAsync({ vocabularyId, result })
      toast.success(`Review saved: ${result}`)
    } catch (error) {
      toast.error(error.message || 'Unable to submit review result')
    }
  }

  if (isLoading) return <ReviewSkeleton />

  if (firstError) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Review Today" description="Review due vocabulary with spaced repetition." />
        <ErrorFallback title="Unable to load reviews" description={firstError.message || 'Review data could not be loaded.'} onRetry={handleRetry} />
      </ResponsiveContentContainer>
    )
  }

  const summaryStats = [
    { label: 'Words Due', value: formatNumber(progress.dueTodayCount ?? todayItems.length), helper: 'Vocabulary waiting today', icon: FiCalendar, tone: 'warning' },
    { label: 'Reviewed Today', value: formatNumber(progress.reviewedTodayCount), helper: 'Completed review actions', icon: FiCheckCircle, tone: 'success' },
    { label: 'Current Streak', value: `${formatNumber(progress.currentStreak)} days`, helper: 'Consistency indicator', icon: FiZap, tone: 'primary' },
    { label: 'Total Vocabulary', value: formatNumber(progress.totalVocabularies), helper: 'Tracked in learning progress', icon: FiBookOpen, tone: 'primary' },
  ]

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Spaced repetition"
        title="Review Today"
        description="Work through due vocabulary and tell the system how well you remembered each item."
        actions={
          <>
            <Button onClick={() => navigate('/vocabularies')}><FiBookOpen aria-hidden="true" /> Explore vocabulary</Button>
            <Button variant="secondary" onClick={handleRetry}><FiRefreshCw aria-hidden="true" /> Refresh</Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Review summary">
        {summaryStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardSection title="Due Vocabularies Today" description="Choose how well you remembered each item. Results update review scheduling.">
          {todayItems.length ? (
            <div className="space-y-4">
              {todayItems.map((item) => (
                <ReviewCard key={getReviewVocabularyId(item)} item={item} onSubmit={handleSubmit} isSubmitting={submitMutation.isPending} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FiAward}
              title="No reviews due today"
              description="You are caught up. Keep momentum by adding new vocabulary or browsing collections."
              action={<Button onClick={() => navigate('/collections')}>Explore Collections</Button>}
            />
          )}
        </DashboardSection>

        <DashboardSection title="Learning Progress" description="Current distribution of your vocabulary learning states.">
          <LearningStatusBar progress={progress} />
          <div className="mt-5 rounded-2xl border border-border bg-background/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiTarget aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold">Review button meanings</p>
                <p className="mt-1 text-sm text-muted-foreground">AGAIN = forgot, HARD = difficult, GOOD = remembered, EASY = very easy.</p>
              </div>
            </div>
          </div>
        </DashboardSection>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardSection title="Recent Review History" description="Latest submitted review results and learning-status transitions.">
          <ReviewHistoryList items={historyItems} />
        </DashboardSection>

        <DashboardSection title="Review Method" description="Use honest feedback. The schedule improves when ratings reflect real recall.">
          <div className="space-y-3">
            {reviewActions.map((action) => (
              <div key={action.result} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/70 p-4">
                <div>
                  <p className="font-semibold">{action.result}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{action.meaning}</p>
                </div>
                <Badge variant={action.tone}>{action.label}</Badge>
              </div>
            ))}
          </div>
        </DashboardSection>
      </section>
    </ResponsiveContentContainer>
  )
}
