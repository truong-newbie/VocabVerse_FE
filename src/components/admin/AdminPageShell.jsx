import Button from '@/components/ui/Button'

function formatErrorMeta(error) {
  const parts = []
  if (error?.status) parts.push(`HTTP ${error.status}`)
  if (error?.code) parts.push(`Code: ${error.code}`)
  return parts.join(' | ')
}

function formatErrorDetails(error) {
  const details = error?.details
  if (!details || typeof details !== 'object') return null

  const usefulDetails = {
    path: details.path,
    timestamp: details.timestamp,
    error: details.error,
    errorCode: details.errorCode,
  }

  const entries = Object.entries(usefulDetails).filter(([, value]) => value)
  if (!entries.length) return null

  return entries.map(([key, value]) => `${key}: ${value}`).join(' | ')
}

export default function AdminPageShell({ eyebrow, title, description, actions, error, onRetry, children }) {
  const errorMeta = formatErrorMeta(error)
  const errorDetails = formatErrorDetails(error)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p> : null}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5">
          <p className="font-semibold text-rose-100">Unable to load admin data</p>
          <p className="mt-2 text-sm leading-6 text-rose-200/80">{error.message || 'The provider is unavailable. Try again.'}</p>
          {errorMeta ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-100/80">{errorMeta}</p> : null}
          {errorDetails ? <p className="mt-2 text-xs leading-5 text-rose-100/70">{errorDetails}</p> : null}
          {onRetry ? <Button className="mt-4" variant="outline" onClick={onRetry}>Retry</Button> : null}
        </div>
      ) : children}
    </div>
  )
}
