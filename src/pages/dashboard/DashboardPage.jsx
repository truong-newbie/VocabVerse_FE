import { FiBookOpen, FiCalendar, FiLayers, FiPlus, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/common/EmptyState'
import FeatureCard from '../../components/common/FeatureCard'
import PageHeader from '../../components/common/PageHeader'
import ResponsiveContentContainer from '../../components/common/ResponsiveContentContainer'
import StatCard from '../../components/common/StatCard'

const stats = [
  { label: 'Words Learned', value: '320', helper: '+24 this week', icon: FiBookOpen, tone: 'primary' },
  { label: 'Review Due Today', value: '25', helper: '2 collections waiting', icon: FiCalendar, tone: 'warning' },
  { label: 'Current Streak', value: '12 days', helper: 'Keep today alive', icon: FiZap, tone: 'success' },
  { label: 'Quiz Accuracy', value: '82%', helper: 'Last 10 sessions', icon: FiTarget, tone: 'primary' },
]

const reviewItems = [
  { title: 'TOEIC 600 Words', words: 25, due: 'Due today' },
  { title: 'Business Conversation', words: 12, due: 'Due in 2 hours' },
]

export default function DashboardPage() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Today plan"
        title="Dashboard"
        description="Track your learning progress and stay consistent. Start with due reviews, then move into focused practice."
        actions={<Button><FiPlus aria-hidden="true" /> Create Collection</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Learning statistics">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-card border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Review Today</h2>
              <p className="mt-1 text-sm text-muted-foreground">Spaced repetition keeps difficult words visible at the right time.</p>
            </div>
            <Badge variant="warning">25 due</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {reviewItems.map((item) => (
              <div key={item.title} className="flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.words} words · {item.due}</p>
                </div>
                <Button variant="secondary">Review</Button>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-card border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Learning Activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <FiTrendingUp aria-hidden="true" className="h-6 w-6 text-success" />
          </div>
          <div className="mt-8 flex h-48 items-end gap-2" aria-label="Learning activity chart placeholder">
            {[36, 54, 42, 70, 62, 86, 58, 75, 94, 68, 78, 88].map((height, index) => (
              <div key={height + index} className="flex flex-1 items-end rounded-full bg-muted">
                <div className="w-full rounded-full bg-primary" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <FeatureCard title="Collections" description="Organize words by goals, exams, or real-life topics." icon={FiLayers} badge="Foundation" actionLabel="View collections" />
        <FeatureCard title="Flashcards" description="Flip, rate, and move through vocabulary with minimal distractions." icon={FiZap} badge="Practice" actionLabel="Start flashcards" />
        <FeatureCard title="AI Roleplay" description="Practice realistic conversations and prepare for corrections." icon={FiBookOpen} badge="AI" actionLabel="Open roleplay" />
      </section>

      <EmptyState
        icon={FiLayers}
        title="Start your first collection"
        description="When backend data is connected, this area can show recent collections. For now, the foundation is ready for collection cards and API-backed states."
        action={<Button>Create Collection</Button>}
      />
    </ResponsiveContentContainer>
  )
}
