import { cn } from '../../utils/cn'

export default function StatCard({ label, value, icon: Icon, helper, tone = 'primary' }) {
  const toneClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/12 text-success',
    warning: 'bg-warning/15 text-warning',
    destructive: 'bg-destructive/12 text-destructive',
  }[tone]

  return (
    <article className="rounded-card border border-border bg-card p-5 text-card-foreground shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        {Icon ? (
          <div className={cn('rounded-2xl p-3', toneClass)}>
            <Icon aria-hidden="true" className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {helper ? <p className="mt-4 text-sm text-muted-foreground">{helper}</p> : null}
    </article>
  )
}
