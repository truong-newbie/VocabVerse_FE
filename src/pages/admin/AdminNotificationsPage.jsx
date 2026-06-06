import { useState } from 'react'
import { FiMail, FiRefreshCw, FiXCircle } from 'react-icons/fi'
import AdminDataTable from '@/components/admin/AdminDataTable'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminStatCard from '@/components/admin/AdminStatCard'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import { extractList, extractTotalPages, formatDate, getId } from '@/features/admin/adminUtils'
import { useAdminNotifications } from '@/features/admin/useAdmin'

const pageSize = 10

export default function AdminNotificationsPage() {
  const [page, setPage] = useState(0)
  const notificationsQuery = useAdminNotifications({ page, size: pageSize })
  const logs = extractList(notificationsQuery.data, ['logs', 'notifications', 'history'])
  const totalPages = extractTotalPages(notificationsQuery.data, pageSize)
  const emailsSent = notificationsQuery.data?.emailsSent ?? notificationsQuery.data?.sent ?? logs.filter((item) => String(item.status).toUpperCase() === 'SENT').length
  const emailsFailed = notificationsQuery.data?.emailsFailed ?? notificationsQuery.data?.failed ?? logs.filter((item) => String(item.status).toUpperCase() === 'FAILED').length

  const columns = [
    { key: 'recipient', header: 'Recipient', render: (log) => log.recipient || log.email || log.to || '—' },
    { key: 'type', header: 'Type', render: (log) => log.type || log.template || log.subject || 'Notification' },
    { key: 'status', header: 'Status', render: (log) => <StatusBadge status={log.status || (log.failed ? 'FAILED' : 'SENT')} /> },
    { key: 'message', header: 'Message', render: (log) => <span className="line-clamp-2">{log.message || log.error || log.subject || '—'}</span> },
    { key: 'createdAt', header: 'Created At', render: (log) => formatDate(log.createdAt || log.sentAt || log.timestamp) },
  ]

  return (
    <AdminPageShell
      eyebrow="Monitoring"
      title="Notification Monitoring"
      description="Track email delivery counts, failed sends, and recent notification provider logs when backend APIs are available."
      error={notificationsQuery.error}
      onRetry={() => notificationsQuery.refetch()}
      actions={<Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => notificationsQuery.refetch()}><FiRefreshCw aria-hidden="true" /> Refresh</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminStatCard label="Emails Sent" value={emailsSent} icon={FiMail} tone="emerald" detail="Successful email deliveries reported by the provider." />
        <AdminStatCard label="Emails Failed" value={emailsFailed} icon={FiXCircle} tone="rose" detail="Failed sends requiring investigation or retry." />
      </div>

      <AdminDataTable
        className="mt-5"
        columns={columns}
        rows={logs}
        isLoading={notificationsQuery.isLoading}
        emptyTitle="No notification logs"
        emptyDescription="Recent email or notification logs will appear when the backend returns data."
        getRowKey={getId}
        pagination={{ page, totalPages, isLastPage: page + 1 >= totalPages || logs.length < pageSize, onPageChange: setPage }}
      />
    </AdminPageShell>
  )
}
