export default function LoadingScreen({ title = 'Loading your learning space...', description = 'Preparing cards, reviews, and practice data.' }) {
  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <div className="w-full max-w-xl rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-5 h-8 w-3/4 animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-muted" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        </div>
        <p className="mt-6 text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
