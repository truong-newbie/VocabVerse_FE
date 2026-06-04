import { FiAlertTriangle } from 'react-icons/fi'
import Button from '../ui/Button'

export default function ErrorFallback({ title = 'Something went wrong', description = 'Please try again. If the issue continues, check the API connection.', onRetry }) {
  return (
    <section className="rounded-card border border-destructive/30 bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
            <FiAlertTriangle aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
        {onRetry ? <Button variant="outline" onClick={onRetry}>Try again</Button> : null}
      </div>
    </section>
  )
}
