import { useState } from 'react'
import { toast } from 'sonner'
import { FiEye, FiEyeOff, FiRefreshCw } from 'react-icons/fi'
import AdminDataTable from '@/components/admin/AdminDataTable'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminPageShell from '@/components/admin/AdminPageShell'
import StatusBadge from '@/components/admin/StatusBadge'
import Button from '@/components/ui/Button'
import { extractList, extractTotalPages, formatDate, getCollectionTitle, getId, getOwnerName, getVocabularyCount } from '@/features/admin/adminUtils'
import { useAdminPublicCollectionVocabulary, useAdminPublicCollections, useHideAdminPublicCollection } from '@/features/admin/useAdmin'

const pageSize = 10

export default function AdminPublicCollectionsPage() {
  const [page, setPage] = useState(0)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [moderationReason, setModerationReason] = useState('Violates public collection guidelines')
  const publicCollectionsQuery = useAdminPublicCollections({ page, size: pageSize })
  const hideMutation = useHideAdminPublicCollection()
  const selectedId = getId(selectedCollection)
  const vocabularyQuery = useAdminPublicCollectionVocabulary(selectedId, { page: 0, size: 5 }, { enabled: Boolean(selectedId) })
  const collections = extractList(publicCollectionsQuery.data, ['collections', 'publicCollections'])
  const vocabularyPreview = extractList(vocabularyQuery.data, ['vocabularies', 'words'])
  const totalPages = extractTotalPages(publicCollectionsQuery.data, pageSize)

  const hideCollection = async (collection) => {
    const collectionId = getId(collection)
    if (!collectionId) return

    try {
      await hideMutation.mutateAsync({ collectionId, reason: moderationReason.trim() || 'Hidden by admin moderation' })
      toast.success('Public collection hidden')
      setSelectedCollection(null)
    } catch (error) {
      toast.error(error.message || 'Unable to hide collection')
    }
  }

  const columns = [
    { key: 'title', header: 'Title', render: (collection) => <span className="font-semibold text-white">{getCollectionTitle(collection)}</span> },
    { key: 'owner', header: 'Owner', render: getOwnerName },
    { key: 'vocabularyCount', header: 'Vocabulary Preview', render: (collection) => `${getVocabularyCount(collection)} words` },
    { key: 'status', header: 'Status', render: (collection) => <StatusBadge status={collection.status || collection.moderationStatus || 'PUBLIC'} /> },
    { key: 'createdAt', header: 'Created At', render: (collection) => formatDate(collection.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (collection) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setSelectedCollection(collection)}><FiEye aria-hidden="true" /> View owner</Button>
          <Button size="sm" variant="destructive" disabled={hideMutation.isPending} onClick={() => hideCollection(collection)}><FiEyeOff aria-hidden="true" /> Hide</Button>
        </div>
      ),
    },
  ]

  return (
    <AdminPageShell
      eyebrow="Moderation"
      title="Public Collection Moderation"
      description="Inspect public collections, review owners and vocabulary previews, and hide content with a moderation reason."
      error={publicCollectionsQuery.error}
      onRetry={() => publicCollectionsQuery.refetch()}
      actions={<Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => publicCollectionsQuery.refetch()}><FiRefreshCw aria-hidden="true" /> Refresh</Button>}
    >
      <AdminDataTable
        columns={columns}
        rows={collections}
        isLoading={publicCollectionsQuery.isLoading}
        emptyTitle="No public collections to moderate"
        emptyDescription="Public collection submissions will appear here."
        getRowKey={getId}
        pagination={{ page, totalPages, isLastPage: page + 1 >= totalPages || collections.length < pageSize, onPageChange: setPage }}
      />

      {selectedCollection ? (
        <section className="mt-5 grid gap-5 rounded-2xl border border-white/10 bg-white/[0.035] p-5 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{getCollectionTitle(selectedCollection)}</h2>
                <p className="mt-1 text-sm text-slate-500">Owner: {getOwnerName(selectedCollection)}</p>
              </div>
              <Button variant="ghost" className="border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setSelectedCollection(null)}>Close</Button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">{selectedCollection.description || 'No collection description.'}</p>
            <label className="mt-5 block text-sm font-semibold text-slate-300" htmlFor="moderation-reason">Moderation reason</label>
            <textarea
              id="moderation-reason"
              className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
              value={moderationReason}
              onChange={(event) => setModerationReason(event.target.value)}
            />
            <Button className="mt-4" variant="destructive" disabled={hideMutation.isPending} onClick={() => hideCollection(selectedCollection)}>
              <FiEyeOff aria-hidden="true" /> Hide collection
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <h3 className="font-semibold text-white">Vocabulary preview</h3>
            {vocabularyQuery.isLoading ? <AdminLoadingState rows={4} /> : (
              <div className="mt-4 space-y-3">
                {vocabularyPreview.length ? vocabularyPreview.map((word, index) => (
                  <div key={getId(word) || index} className="rounded-xl bg-white/[0.04] p-3">
                    <p className="font-semibold text-white">{word.term || word.word || 'Untitled word'}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{word.meaning || word.meaningEn || word.meaningVi || 'No meaning available'}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No vocabulary preview available.</p>}
              </div>
            )}
          </div>
        </section>
      ) : null}
    </AdminPageShell>
  )
}
