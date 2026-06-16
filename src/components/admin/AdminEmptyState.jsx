import { FiInbox } from 'react-icons/fi'
import EmptyState from '@/components/common/EmptyState'

export default function AdminEmptyState({ title = 'No data', description = 'There is nothing to show yet.' }) {
  return (
    <EmptyState
      icon={FiInbox}
      title={title}
      description={description}
      variant="panel"
      className="border-dashed border-white/12 bg-white/[0.025] text-slate-100 [&_h2]:text-white [&_p]:text-slate-500 [&>div:first-child]:bg-white/[0.06] [&>div:first-child]:text-slate-500"
    />
  )
}
