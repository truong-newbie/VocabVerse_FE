import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiEye, FiRefreshCw, FiSearch } from 'react-icons/fi'
import AdminDataTable from '@/components/admin/AdminDataTable'
import AdminPageShell from '@/components/admin/AdminPageShell'
import RoleBadge from '@/components/admin/RoleBadge'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import { extractList, extractTotalPages, formatDate, getDisplayName, getId } from '@/features/admin/adminUtils'
import { useAdminUsers, useUpdateAdminUserRole, useUpdateAdminUserStatus } from '@/features/admin/useAdmin'

const pageSize = 10

export default function AdminUsersPage() {
  const [page, setPage] = useState(0)
  const [searchDraft, setSearchDraft] = useState('')
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const usersQuery = useAdminUsers({ page, size: pageSize, search })
  const updateRoleMutation = useUpdateAdminUserRole()
  const updateStatusMutation = useUpdateAdminUserStatus()
  const users = extractList(usersQuery.data, ['users'])
  const totalPages = extractTotalPages(usersQuery.data, pageSize)

  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Name',
      render: (user) => (
        <div>
          <p className="font-semibold text-white">{getDisplayName(user)}</p>
          <p className="mt-1 text-xs text-slate-500">ID: {getId(user) || '—'}</p>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (user) => user.email || '—' },
    { key: 'role', header: 'Role', render: (user) => <RoleBadge role={user.role} /> },
    { key: 'status', header: 'Status', render: (user) => <StatusBadge status={user.status || (user.enabled === false ? 'DISABLED' : 'ACTIVE')} /> },
    { key: 'createdAt', header: 'Created At', render: (user) => formatDate(user.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => {
        const userId = getId(user)
        const nextRole = String(user.role || 'USER').toUpperCase() === 'ADMIN' ? 'USER' : 'ADMIN'
        const currentStatus = String(user.status || (user.enabled === false ? 'DISABLED' : 'ACTIVE')).toUpperCase()
        const nextStatus = ['ACTIVE', 'ENABLED'].includes(currentStatus) ? 'SUSPENDED' : 'ACTIVE'

        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setSelectedUser(user)}>
              <FiEye aria-hidden="true" /> View
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
              disabled={!userId || updateRoleMutation.isPending}
              onClick={async () => {
                try {
                  await updateRoleMutation.mutateAsync({ userId, role: nextRole })
                  toast.success(`Role updated to ${nextRole}`)
                } catch (error) {
                  toast.error(error.message || 'Unable to update role')
                }
              }}
            >
              Make {nextRole}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
              disabled={!userId || updateStatusMutation.isPending}
              onClick={async () => {
                try {
                  await updateStatusMutation.mutateAsync({ userId, status: nextStatus })
                  toast.success(`Status updated to ${nextStatus}`)
                } catch (error) {
                  toast.error(error.message || 'Unable to update status')
                }
              }}
            >
              {nextStatus === 'ACTIVE' ? 'Activate' : 'Suspend'}
            </Button>
          </div>
        )
      },
    },
  ], [updateRoleMutation, updateStatusMutation])

  const submitSearch = (event) => {
    event.preventDefault()
    setPage(0)
    setSearch(searchDraft.trim())
  }

  return (
    <AdminPageShell
      eyebrow="Identity"
      title="User Management"
      description="Search users, inspect account details, and adjust roles or status through admin-scoped actions."
      error={usersQuery.error}
      onRetry={() => usersQuery.refetch()}
      actions={<Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => usersQuery.refetch()}><FiRefreshCw aria-hidden="true" /> Refresh</Button>}
    >
      <form className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:flex-row" onSubmit={submitSearch}>
        <div className="flex min-h-11 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3">
          <FiSearch aria-hidden="true" className="text-slate-500" />
          <input
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by name or email"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <AdminDataTable
        className="mt-5"
        columns={columns}
        rows={users}
        isLoading={usersQuery.isLoading}
        emptyTitle="No users found"
        emptyDescription="Try a different search term or refresh the admin user list."
        getRowKey={getId}
        pagination={{ page, totalPages, isLastPage: page + 1 >= totalPages || users.length < pageSize, onPageChange: setPage }}
      />

      {selectedUser ? (
        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">User detail</h2>
              <p className="mt-1 text-sm text-slate-500">{selectedUser.email || 'No email available'}</p>
            </div>
            <Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setSelectedUser(null)}>Close</Button>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Name</dt><dd className="mt-1 text-sm text-white">{getDisplayName(selectedUser)}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Role</dt><dd className="mt-1"><RoleBadge role={selectedUser.role} /></dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Status</dt><dd className="mt-1"><StatusBadge status={selectedUser.status || 'ACTIVE'} /></dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Created</dt><dd className="mt-1 text-sm text-white">{formatDate(selectedUser.createdAt)}</dd></div>
          </dl>
        </section>
      ) : null}
    </AdminPageShell>
  )
}
