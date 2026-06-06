import { cn } from '@/utils/cn'

export default function RoleBadge({ role = 'USER', className }) {
  const normalized = String(role || 'USER').toUpperCase()
  const classes = normalized === 'ADMIN'
    ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100'
    : 'border-slate-400/20 bg-slate-400/10 text-slate-300'

  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold', classes, className)}>{normalized}</span>
}
