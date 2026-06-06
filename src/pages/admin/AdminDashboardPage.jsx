import { FiBookOpen, FiClock, FiLayers, FiRepeat, FiUsers, FiUserPlus, FiVideo, FiZap } from 'react-icons/fi'
import AdminPageShell from '@/components/admin/AdminPageShell'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import { useAdminDashboardStats } from '@/features/admin/useAdmin'
import { normalizeStats } from '@/features/admin/adminUtils'

export default function AdminDashboardPage() {
  const statsQuery = useAdminDashboardStats()
  const stats = normalizeStats(statsQuery.data)

  return (
    <AdminPageShell
      eyebrow="Command center"
      title="Admin Dashboard"
      description="Operational overview for users, collections, vocabulary volume, shadowing content, and review activity."
      error={statsQuery.error}
      onRetry={() => statsQuery.refetch()}
    >
      {statsQuery.isLoading ? (
        <AdminLoadingState rows={8} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Total Users" value={stats.totalUsers} icon={FiUsers} tone="blue" detail="All registered accounts." />
          <AdminStatCard label="Active Users" value={stats.activeUsers} icon={FiZap} tone="emerald" detail="Currently active or enabled." />
          <AdminStatCard label="Collections" value={stats.collections} icon={FiLayers} tone="cyan" detail="Private, public, and system sets." />
          <AdminStatCard label="Public Collections" value={stats.publicCollections} icon={FiBookOpen} tone="amber" detail="Visible in the public library." />
          <AdminStatCard label="Total Vocabulary" value={stats.totalVocabulary} icon={FiBookOpen} tone="blue" detail="Words stored across the platform." />
          <AdminStatCard label="Shadowing Lessons" value={stats.shadowingLessons} icon={FiVideo} tone="cyan" detail="Uploaded and generated lessons." />
          <AdminStatCard label="Reviews Today" value={stats.reviewsToday} icon={FiRepeat} tone="emerald" detail="Review attempts completed today." />
          <AdminStatCard label="New Users Today" value={stats.newUsersToday} icon={FiUserPlus} tone="amber" detail="Accounts created in the last day." />
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-200"><FiClock aria-hidden="true" /></span>
          <div>
            <h2 className="text-lg font-semibold text-white">Admin workflow</h2>
            <p className="mt-1 text-sm text-slate-500">Use the sidebar to manage users, moderate collections, publish shadowing content, and inspect platform health.</p>
          </div>
        </div>
      </section>
    </AdminPageShell>
  )
}
