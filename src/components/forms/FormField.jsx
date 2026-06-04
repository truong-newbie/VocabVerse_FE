import { cn } from '@/utils/cn'

export default function FormField({ id, label, error, hint, children, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-semibold text-foreground" htmlFor={id}>{label}</label>
      {children}
      {error ? <p className="text-sm font-medium text-destructive" role="alert">{error}</p> : null}
      {!error && hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
