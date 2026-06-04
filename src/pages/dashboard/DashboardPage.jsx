import {
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiLayers,
  FiPlus,
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
  useDashboardSummary,
  useLearningStatusStats,
  useRecentActivity,
  useReviewDue,
} from '@/features/dashboard/useDashboard'

function pickNumber(...values) {
  const value = values.find((item) => Number.isFinite(Number(item)))
  return Number(value || 0)
}

function pickArray(payload, ...keys) {
  if (Array.isArray(payload)) return payload
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }
  return []
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(pickNumber(value))
}

function formatPercent(value) {
  const number = pickNumber(value)
  return `${Math.round(number)}%`
}

function formatDate(value) {
  if (!value) return 'Recently'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function DashboardSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-64 animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-card border border-border bg-card p-5 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-muted" />
            <div className="mt-5 h-4 w-36 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-80 animate-pulse rounded-card border border-border bg-card" />
        <div className="h-80 animate-pulse rounded-card border border-border bg-card" />
      </div>
    </ResponsiveContentContainer>
  )
}

function ReviewDueList({ items, onReview }) {
  if (!items.length) {
    return (
      <EmptyState
        icon={FiCheckCircle}
        title="No reviews due today"
        description="You are current on spaced repetition. Use this time to add new vocabulary or start a quick flashcard session."
        action={<Button variant="secondary" onClick={onReview}>Explore review</Button>}
      />
    )
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item, index) => {
        const title = item.collectionName || item.title || `Review set ${index + 1}`
        const wordsDue = pickNumber(item.wordsDue, item.dueCount)
        return (
          <div key={item.id || item.collectionId || title} className="flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{formatNumber(wordsDue)} words due · {formatDate(item.dueAt)}</p>
            </div>
            <Button variant="secondary" onClick={onReview}>Review</Button>
          </div>
        )
      })}
    </div>
  )
}

function ActivityList({ items }) {
  if (!items.length) {
    return (
      <EmptyState
        icon={FiBell}
        title="No recent activity yet"
        description="Completed reviews, quiz sessions, flashcard practice, and notifications will appear here."
        action={<Button variant="secondary">Start flashcard</Button>}
      />
    )
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 8).map((item, index) => (
        <div key={item.id || `${item.type}-${index}`} className="flex gap-3 rounded-2xl border border-border bg-background/70 p-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {item.type?.toLowerCase().includes('review') ? <FiRepeat aria-hidden="true" /> : <FiBell aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="truncate font-semibold">{item.title || item.collectionName || item.message || 'Learning activity'}</p>
              <span className="text-xs font-medium text-muted-foreground">{formatDate(item.createdAt || item.date)}</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description || item.message || item.status || `${formatNumber(item.wordsReviewed)} words reviewed`}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function LearningStatusChart({ values }) {
  const segments = [
    { label: 'New', value: values.newWordsCount, className: 'bg-primary' },
    { label: 'Learning', value: values.learningCount, className: 'bg-warning' },
    { label: 'Reviewing', value: values.reviewingCount, className: 'bg-accent' },
    { label: 'Mastered', value: values.masteredCount, className: 'bg-success' },
  ]
  const total = segments.reduce((sum, segment) => sum + pickNumber(segment.value), 0)

  return (
    <div>
      <div className="flex h-4 overflow-hidden rounded-full bg-muted" aria-label="Vocabulary learning status distribution">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.className}
            style={{ width: total ? `${(pickNumber(segment.value) / total) * 100}%` : '25%' }}
            title={`${segment.label}: ${formatNumber(segment.value)}`}
          />
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

export default function DashboardPage() {
  const navigate = useNavigate()
  const summaryQuery = useDashboardSummary()
  const statusQuery = useLearningStatusStats()
  const reviewDueQuery = useReviewDue()
  const activityQuery = useRecentActivity()

  const isLoading = summaryQuery.isLoading || statusQuery.isLoading || reviewDueQuery.isLoading || activityQuery.isLoading
  const firstError = summaryQuery.error || statusQuery.error || reviewDueQuery.error || activityQuery.error

  const handleRetry = () => {
    summaryQuery.refetch()
    statusQuery.refetch()
    reviewDueQuery.refetch()
    activityQuery.refetch()
  }

  if (isLoading) return <DashboardSkeleton />

  if (firstError) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Dashboard" description="Track your learning progress and stay consistent." />
        <ErrorFallback
          title="Unable to load dashboard"
          description={firstError.message || 'Dashboard data could not be loaded. Check the API connection and try again.'}
          onRetry={handleRetry}
        />
      </ResponsiveContentContainer>
    )
  }

  const summary = summaryQuery.data || {}
  const status = statusQuery.data || {}
  const reviewDueItems = pickArray(reviewDueQuery.data, 'items', 'reviewDue', 'dueCollections')
  const activityPayload = activityQuery.data || {}
  const recentReviewHistory = pickArray(activityPayload, 'reviewHistory', 'recentActivity', 'items')
  const recentNotifications = pickArray(activityPayload, 'notifications')
  const activityItems = recentNotifications.length ? recentNotifications : recentReviewHistory

  const dashboardStats = [
    { label: 'Total Vocabularies', value: formatNumber(summary.totalVocabularies ?? summary.totalVocabulary ?? summary.totalWords), helper: 'Words available to study', icon: FiBookOpen, tone: 'primary' },
    { label: 'Total Collections', value: formatNumber(summary.totalCollections), helper: 'Organized learning sets', icon: FiLayers, tone: 'primary' },
    { label: 'New Words', value: formatNumber(status.newWordsCount ?? status.newCount ?? summary.newWordsCount), helper: 'Ready to learn', icon: FiPlus, tone: 'primary' },
    { label: 'Learning', value: formatNumber(status.learningCount ?? summary.learningCount), helper: 'In active practice', icon: FiTrendingUp, tone: 'warning' },
    { label: 'Reviewing', value: formatNumber(status.reviewingCount ?? summary.reviewingCount), helper: 'In spaced repetition', icon: FiRepeat, tone: 'warning' },
    { label: 'Mastered', value: formatNumber(status.masteredCount ?? summary.masteredCount), helper: 'Strong retention', icon: FiCheckCircle, tone: 'success' },
    { label: 'Due Today', value: formatNumber(summary.dueTodayCount ?? summary.reviewDueToday ?? reviewDueItems.length), helper: 'Review queue', icon: FiCalendar, tone: 'warning' },
    { label: 'Quiz Accuracy', value: formatPercent(summary.quizAccuracy), helper: 'Recent performance', icon: FiTarget, tone: 'primary' },
  ]

  const sessionStats = [
    { label: 'Flashcard Sessions', value: formatNumber(summary.completedFlashcardSessions ?? summary.flashcardSessionsCompleted ?? status.completedFlashcardSessions), icon: FiZap, tone: 'success' },
    { label: 'Quiz Sessions', value: formatNumber(summary.completedQuizSessions ?? summary.quizSessionsCompleted ?? status.completedQuizSessions), icon: FiTarget, tone: 'primary' },
    { label: 'Typing Sessions', value: formatNumber(summary.completedTypingSessions ?? summary.typingSessionsCompleted ?? status.completedTypingSessions), icon: FiEdit3, tone: 'warning' },
  ]

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Today plan"
        title="Dashboard"
        description="Track your learning progress and stay consistent. Start with due reviews, then move into focused practice."
        actions={
          <>
            <Button onClick={() => navigate('/review')}><FiCalendar aria-hidden="true" /> Review today</Button>
            <Button variant="secondary" onClick={() => navigate('/vocabularies')}><FiBookOpen aria-hidden="true" /> Add vocabulary</Button>
            <Button variant="outline" onClick={() => navigate('/collections')}><FiLayers aria-hidden="true" /> Create collection</Button>
            <Button variant="outline" onClick={() => navigate('/flashcards')}><FiZap aria-hidden="true" /> Start flashcard</Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard statistics">
        {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-6 lg:grid-cols-3" aria-label="Completed practice sessions">
        {sessionStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardSection
          title="Review Today"
          description="Collections that need spaced-repetition attention now."
          actions={<Badge variant={reviewDueItems.length ? 'warning' : 'success'}>{formatNumber(reviewDueItems.length)} due</Badge>}
        >
          <ReviewDueList items={reviewDueItems} onReview={() => navigate('/review')} />
        </DashboardSection>

        <DashboardSection title="Learning Status" description="Vocabulary distribution across your learning pipeline.">
          <LearningStatusChart
            values={{
              newWordsCount: status.newWordsCount ?? status.newCount ?? summary.newWordsCount,
              learningCount: status.learningCount ?? summary.learningCount,
              reviewingCount: status.reviewingCount ?? summary.reviewingCount,
              masteredCount: status.masteredCount ?? summary.masteredCount,
            }}
          />
        </DashboardSection>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardSection title="Recent Review History" description="Your latest review and practice signals.">
          <ActivityList items={recentReviewHistory} />
        </DashboardSection>

        <DashboardSection title="Recent Notifications" description="Important learning updates and system messages.">
          <ActivityList items={activityItems} />
        </DashboardSection>
      </section>

      {!pickNumber(summary.totalCollections) && !pickNumber(summary.totalVocabularies, summary.totalVocabulary, summary.totalWords) ? (
        <EmptyState
          icon={FiLayers}
          title="Start your first collection"
          description="Create a focused collection, add vocabulary, then use flashcards and review scheduling to build retention."
          action={<Button onClick={() => navigate('/collections')}>Create Collection</Button>}
        />
      ) : null}
    </ResponsiveContentContainer>
  )
}
