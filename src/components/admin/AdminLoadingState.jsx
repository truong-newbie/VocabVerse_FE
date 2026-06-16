import Skeleton from '@/components/common/Skeleton'

export default function AdminLoadingState({ rows = 4 }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-14 rounded-xl bg-white/[0.06]" />
      ))}
    </div>
  )
}
