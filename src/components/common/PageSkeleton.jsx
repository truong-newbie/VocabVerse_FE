import ResponsiveContentContainer from './ResponsiveContentContainer'
import Skeleton, { SkeletonText } from './Skeleton'

const variantConfig = {
  dashboard: { statCount: 8, cardCount: 2, gridClass: 'sm:grid-cols-2 xl:grid-cols-4' },
  table: { statCount: 0, cardCount: 1, gridClass: 'sm:grid-cols-2' },
  cards: { statCount: 0, cardCount: 6, gridClass: 'md:grid-cols-2 xl:grid-cols-3' },
  detail: { statCount: 3, cardCount: 2, gridClass: 'lg:grid-cols-2' },
  form: { statCount: 0, cardCount: 2, gridClass: 'lg:grid-cols-[1fr_0.8fr]' },
}

export default function PageSkeleton({ variant = 'dashboard', title = 'Loading page...', description = 'Preparing this VocabVerse workspace.' }) {
  const config = variantConfig[variant] || variantConfig.dashboard

  return (
    <ResponsiveContentContainer className="space-y-8" role="status" aria-live="polite" aria-label={title}>
      <section className="rounded-card border border-border bg-card p-6 shadow-sm">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="mt-4 h-10 w-full max-w-sm rounded-full" />
        <SkeletonText className="mt-4 max-w-2xl" lines={2} />
        <p className="sr-only">{description}</p>
      </section>

      {config.statCount ? (
        <section className={`grid gap-4 ${config.gridClass}`}>
          {Array.from({ length: config.statCount }).map((_, index) => (
            <div key={index} className="rounded-card border border-border bg-card p-5 shadow-sm">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="mt-4 h-8 w-20 rounded-full" />
              <Skeleton className="mt-5 h-4 w-36 rounded-full" />
            </div>
          ))}
        </section>
      ) : null}

      <section className={`grid gap-6 ${config.gridClass}`}>
        {Array.from({ length: config.cardCount }).map((_, index) => (
          <div key={index} className="rounded-card border border-border bg-card p-5 shadow-sm">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="mt-5 h-8 w-2/3 rounded-full" />
            <SkeletonText className="mt-4" lines={3} />
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Skeleton className="h-10 rounded-button" />
              <Skeleton className="h-10 rounded-button" />
              <Skeleton className="h-10 rounded-button" />
            </div>
          </div>
        ))}
      </section>
    </ResponsiveContentContainer>
  )
}
