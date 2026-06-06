import Button from '@/components/ui/Button'

export default function AdminPageShell({ eyebrow, title, description, actions, error, onRetry, children }) {
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
          {onRetry ? <Button className="mt-4" variant="outline" onClick={onRetry}>Retry</Button> : null}
        </div>
      ) : children}
    </div>
  )
}
