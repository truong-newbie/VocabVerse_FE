import { FiInbox } from 'react-icons/fi'

export default function AdminEmptyState({ title = 'No data', description = 'There is nothing to show yet.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.025] p-10 text-center">
      <FiInbox className="mx-auto h-8 w-8 text-slate-600" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}
