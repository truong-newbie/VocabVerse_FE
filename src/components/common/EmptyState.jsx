import Button from '../ui/Button'
import { cn } from '@/utils/cn'

const variants = {
  default: 'rounded-card border border-dashed border-border bg-card/75 p-8 text-center shadow-sm',
  compact: 'rounded-card border border-dashed border-border bg-card/75 p-5 text-center shadow-sm',
  panel: 'rounded-card border border-border bg-card p-8 text-center shadow-sm',
}

const iconSizes = {
  default: 'h-14 w-14 rounded-2xl',
  compact: 'h-11 w-11 rounded-xl',
  panel: 'h-14 w-14 rounded-2xl',
}

export default function EmptyState({ icon: Icon, title = 'No data yet', description = 'There is nothing to show yet.', action, variant = 'default', className }) {
  const isCompact = variant === 'compact'

  return (
    <section className={cn(variants[variant] || variants.default, className)}>
      {Icon ? (
        <div className={cn('mx-auto flex items-center justify-center bg-primary/10 text-primary', iconSizes[variant] || iconSizes.default)}>
          <Icon aria-hidden="true" className={isCompact ? 'h-5 w-5' : 'h-7 w-7'} />
        </div>
      ) : null}
      <h2 className={cn('font-semibold text-foreground', isCompact ? 'mt-4 text-lg' : 'mt-5 text-2xl')}>{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      {action ? <div className={isCompact ? 'mt-4' : 'mt-6'}>{action}</div> : null}
    </section>
  )
}

export function EmptyStateAction({ children, ...props }) {
  return <Button {...props}>{children}</Button>
}
