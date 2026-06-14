import { FiTrendingUp } from 'react-icons/fi'
import { cn } from '@/utils/cn'

export default function AdminStatCard({ label, value, detail, icon, tone = 'slate' }) {
  const IconComponent = icon || FiTrendingUp
  const toneClass = {
    slate: 'from-slate-500/18 to-slate-500/5 text-slate-200',
    blue: 'from-blue-500/22 to-blue-500/5 text-blue-200',
    cyan: 'from-cyan-500/22 to-cyan-500/5 text-cyan-200',
    emerald: 'from-emerald-500/22 to-emerald-500/5 text-emerald-200',
    amber: 'from-amber-500/22 to-amber-500/5 text-amber-200',
    rose: 'from-rose-500/22 to-rose-500/5 text-rose-200',
  }[tone]

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/15">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value ?? '0'}</p>
        </div>
        <span className={cn('grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br', toneClass)}>
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      {detail ? <p className="mt-4 text-sm leading-6 text-slate-400">{detail}</p> : null}
    </article>
  )
}
