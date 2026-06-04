import { cn } from '@/utils/cn'

export default function DashboardSection({ title, description, actions, children, className }) {
  return (
    <section className={cn('rounded-card border border-border bg-card p-6 text-card-foreground shadow-sm', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
