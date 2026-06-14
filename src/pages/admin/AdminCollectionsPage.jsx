import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiEye, FiFilter, FiRefreshCw, FiShield, FiTrash2 } from 'react-icons/fi'
import AdminDataTable from '@/components/admin/AdminDataTable'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import { extractList, extractTotalPages, formatDate, getCollectionTitle, getId, getOwnerName, getVocabularyCount } from '@/features/admin/adminUtils'
import { useAdminCollections, useDeleteAdminCollection, useModerateAdminCollection } from '@/features/admin/useAdmin'

const pageSize = 10
const visibilityOptions = ['ALL', 'PUBLIC', 'PRIVATE', 'SYSTEM']

export default function AdminCollectionsPage() {
  const [page, setPage] = useState(0)
  const [visibility, setVisibility] = useState('ALL')
  const [selectedCollection, setSelectedCollection] = useState(null)
  const collectionsQuery = useAdminCollections({ page, size: pageSize, visibility })
  const deleteMutation = useDeleteAdminCollection()
  const moderateMutation = useModerateAdminCollection()
  const collections = extractList(collectionsQuery.data, ['collections'])
  const totalPages = extractTotalPages(collectionsQuery.data, pageSize)

  const columns = useMemo(() => [
    {
      key: 'title',
      header: 'Title',
      render: (collection) => (
        <div>
          <p className="font-semibold text-white">{getCollectionTitle(collection)}</p>
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{collection.description || 'No description'}</p>
        </div>
      ),
    },
    { key: 'owner', header: 'Owner', render: getOwnerName },
    { key: 'visibility', header: 'Visibility', render: (collection) => <StatusBadge status={collection.visibility || 'PRIVATE'} /> },
    { key: 'vocabularyCount', header: 'Vocabulary Count', render: getVocabularyCount },
    { key: 'createdAt', header: 'Created At', render: (collection) => formatDate(collection.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (collection) => {
        const collectionId = getId(collection)
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setSelectedCollection(collection)}><FiEye aria-hidden="true" /> View</Button>
            <Button
              size="sm"
              variant="ghost"
              className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
              disabled={!collectionId || moderateMutation.isPending}
              onClick={async () => {
                try {
                  await moderateMutation.mutateAsync({ collectionId, payload: { action: 'APPROVE', reason: 'Reviewed by admin' } })
                  toast.success('Collection moderated')
                } catch (error) {
                  toast.error(error.message || 'Unable to moderate collection')
                }
              }}
            >
              <FiShield aria-hidden="true" /> Moderate
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={!collectionId || deleteMutation.isPending}
              onClick={async () => {
                if (!window.confirm(`Delete "${getCollectionTitle(collection)}"?`)) return
                try {
                  await deleteMutation.mutateAsync(collectionId)
                  toast.success('Collection deleted')
                } catch (error) {
                  toast.error(error.message || 'Unable to delete collection')
                }
              }}
            >
              <FiTrash2 aria-hidden="true" /> Delete
            </Button>
          </div>
        )
      },
    },
  ], [deleteMutation, moderateMutation])

  return (
    <AdminPageShell
      eyebrow="Content operations"
      title="Collection Management"
      description="Review collection ownership, visibility, vocabulary count, and apply moderation or deletion actions."
      error={collectionsQuery.error}
      onRetry={() => collectionsQuery.refetch()}
      actions={<Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => collectionsQuery.refetch()}><FiRefreshCw aria-hidden="true" /> Refresh</Button>}
    >
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <FiFilter className="text-slate-500" aria-hidden="true" />
        {visibilityOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={option === visibility ? 'rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-950' : 'rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white'}
            onClick={() => {
              setVisibility(option)
              setPage(0)
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <AdminDataTable
        className="mt-5"
        columns={columns}
        rows={collections}
        isLoading={collectionsQuery.isLoading}
        emptyTitle="No collections found"
        emptyDescription="No collections match this visibility filter."
        getRowKey={getId}
        pagination={{ page, totalPages, isLastPage: page + 1 >= totalPages || collections.length < pageSize, onPageChange: setPage }}
      />

      {selectedCollection ? (
        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">{getCollectionTitle(selectedCollection)}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">{selectedCollection.description || 'No description provided.'}</p>
            </div>
            <Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setSelectedCollection(null)}>Close</Button>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Owner</dt><dd className="mt-1 text-sm text-white">{getOwnerName(selectedCollection)}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Visibility</dt><dd className="mt-1"><StatusBadge status={selectedCollection.visibility || 'PRIVATE'} /></dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Vocabulary</dt><dd className="mt-1 text-sm text-white">{getVocabularyCount(selectedCollection)}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Created</dt><dd className="mt-1 text-sm text-white">{formatDate(selectedCollection.createdAt)}</dd></div>
          </dl>
        </section>
      ) : null}
    </AdminPageShell>
  )
}
