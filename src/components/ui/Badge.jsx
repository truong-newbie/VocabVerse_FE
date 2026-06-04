import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/12 text-destructive',
  muted: 'bg-muted text-muted-foreground',
}

export default function Badge({ children, className, variant = 'secondary' }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
