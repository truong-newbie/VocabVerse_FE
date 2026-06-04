import { FiCheckCircle, FiClock, FiCompass, FiLayers, FiPlus, FiSearch } from 'react-icons/fi'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import ResponsiveContentContainer from '../components/common/ResponsiveContentContainer'
import StatCard from '../components/common/StatCard'

export default function LearningPlaceholderPage({ title, description, primaryAction, icon: Icon = FiCompass, highlights = [] }) {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Foundation page"
        title={title}
        description={description}
        actions={<Button><FiPlus aria-hidden="true" /> {primaryAction}</Button>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Ready components" value="12" helper="Shared UI blocks available" icon={FiCheckCircle} tone="success" />
        <StatCard label="API status" value="Prepared" helper="Hook/service layer next" icon={FiClock} tone="warning" />
        <StatCard label="Route state" value="Protected" helper="Requires auth token" icon={Icon} tone="primary" />
      </section>

      <section className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Page foundation</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">This placeholder reserves the route, layout, actions, empty state, loading/error patterns, and responsive spacing needed before backend-powered business screens are implemented.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Responsive</Badge>
            <Badge variant="success">Accessible</Badge>
            <Badge variant="secondary">Dark mode</Badge>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(highlights.length ? highlights : ['Search and filter', 'Card-based content', 'Action workflow']).map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FiSearch aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Prepared as a clear UI zone for the next implementation phase.</p>
            </div>
          ))}
        </div>
      </section>

      <EmptyState
        icon={FiLayers}
        title={`No ${title.toLowerCase()} data yet`}
        description="Connect the page-specific React Query hook and service when the backend contract is ready. The shared empty state already includes icon, message, and action as required by the docs."
        action={<Button variant="secondary">{primaryAction}</Button>}
      />
    </ResponsiveContentContainer>
  )
}
