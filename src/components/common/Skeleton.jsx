import { cn } from '@/utils/cn'

export default function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-2xl bg-muted', className)} aria-hidden="true" {...props} />
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn('h-4 rounded-full', index === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}
