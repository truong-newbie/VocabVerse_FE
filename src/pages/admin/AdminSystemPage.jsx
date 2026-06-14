import { FiDatabase, FiRefreshCw, FiServer, FiShare2 } from 'react-icons/fi'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import { useAdminSystemHealth } from '@/features/admin/useAdmin'

function normalizeHealth(data) {
  const source = data?.components || data?.services || data || {}
  const items = [
    { key: 'database', label: 'Database', icon: FiDatabase, status: source.database?.status || source.db?.status || source.database || source.db },
    { key: 'redis', label: 'Redis', icon: FiServer, status: source.redis?.status || source.cache?.status || source.redis || source.cache },
    { key: 'rabbitmq', label: 'RabbitMQ', icon: FiShare2, status: source.rabbitmq?.status || source.rabbitMq?.status || source.queue?.status || source.rabbitmq || source.rabbitMq || source.queue },
  ]

  return items.map((item) => ({ ...item, status: typeof item.status === 'string' ? item.status : item.status ? 'UP' : 'DOWN' }))
}

export default function AdminSystemPage() {
  const healthQuery = useAdminSystemHealth()
  const services = normalizeHealth(healthQuery.data)

  return (
    <AdminPageShell
      eyebrow="Infrastructure"
      title="System Health"
      description="Monitor critical platform dependencies. Green means UP; red means DOWN or unavailable."
      error={healthQuery.error}
      onRetry={() => healthQuery.refetch()}
      actions={<Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => healthQuery.refetch()}><FiRefreshCw aria-hidden="true" /> Refresh</Button>}
    >
      {healthQuery.isLoading ? <AdminLoadingState rows={3} /> : services.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.key} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-slate-200"><service.icon aria-hidden="true" /></span>
                  <div>
                    <p className="font-semibold text-white">{service.label}</p>
                    <p className="mt-1 text-xs text-slate-500">Dependency status</p>
                  </div>
                </div>
                <StatusBadge status={String(service.status || 'DOWN').toUpperCase() === 'UP' ? 'UP' : 'DOWN'} />
              </div>
            </article>
          ))}
        </div>
      ) : <AdminEmptyState title="No health data" description="System status will appear once the backend health endpoint returns service components." />}
    </AdminPageShell>
  )
}
