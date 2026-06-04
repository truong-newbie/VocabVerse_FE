import { FiArrowRight } from 'react-icons/fi'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function FeatureCard({ title, description, icon: Icon, badge, actionLabel = 'Open', onAction }) {
  return (
    <article className="group rounded-card border border-border bg-card p-5 text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          {Icon ? <Icon aria-hidden="true" className="h-5 w-5" /> : <FiArrowRight aria-hidden="true" className="h-5 w-5" />}
        </div>
        {badge ? <Badge variant="primary">{badge}</Badge> : null}
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{description}</p>
      <Button className="mt-5 w-full justify-between" variant="secondary" onClick={onAction} aria-label={actionLabel}>
        {actionLabel}
        <FiArrowRight aria-hidden="true" />
      </Button>
    </article>
  )
}
