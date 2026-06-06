import { cn } from '@/utils/cn'

const statusStyles = {
  ACTIVE: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  ENABLED: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  UP: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  COMPLETED: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  PUBLISHED: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  READY: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  PROCESSING: 'border-blue-400/25 bg-blue-400/10 text-blue-200',
  PENDING: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
  INACTIVE: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
  DISABLED: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
  HIDDEN: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
  FAILED: 'border-rose-400/25 bg-rose-400/10 text-rose-200',
  DOWN: 'border-rose-400/25 bg-rose-400/10 text-rose-200',
  SUSPENDED: 'border-rose-400/25 bg-rose-400/10 text-rose-200',
}

export default function StatusBadge({ status = 'UNKNOWN', className }) {
  const normalized = String(status || 'UNKNOWN').toUpperCase()
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold', statusStyles[normalized] || 'border-white/10 bg-white/5 text-slate-300', className)}>
      {normalized}
    </span>
  )
}
