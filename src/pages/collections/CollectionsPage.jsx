import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiBookOpen, FiChevronLeft, FiChevronRight, FiDownload, FiLayers, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import CollectionCard from '@/features/collection/components/CollectionCard'
import { formatCollectionDate, getCollectionTitle, getVocabularyCount } from '@/features/collection/collectionUtils'
import CollectionFormDialog from '@/features/collection/components/CollectionFormDialog'
import { useExportCollectionPdf } from '@/features/export/usePdfExport'
import {
  useCollection,
  useCollections,
  useCreateCollection,
  useDeleteCollection,
  useUpdateCollection,
} from '@/features/collection/useCollections'

const PAGE_SIZE = 10
const visibilityFilters = ['ALL', 'PRIVATE', 'PUBLIC', 'SYSTEM']

function normalizeCollectionList(payload) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      totalItems: payload.length,
      totalPages: 1,
      page: 0,
      size: payload.length || PAGE_SIZE,
    }
  }

  const items = payload?.content || payload?.items || payload?.data || payload?.collections || []
  const totalItems = Number(payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? items.length)
  const size = Number(payload?.size ?? PAGE_SIZE)
  return {
    items,
    totalItems,
    totalPages: Number(payload?.totalPages ?? Math.max(1, Math.ceil(totalItems / size))),
    page: Number(payload?.number ?? payload?.page ?? 0),
    size,
  }
}

function CollectionsSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-card border border-border bg-card p-5 shadow-sm">
            <div className="flex justify-between">
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="mt-6 h-7 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="mt-8 grid grid-cols-3 gap-2">
              <div className="h-10 animate-pulse rounded-button bg-muted" />
              <div className="h-10 animate-pulse rounded-button bg-muted" />
              <div className="h-10 animate-pulse rounded-button bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </ResponsiveContentContainer>
  )
}

function CollectionDetailDialog({ collectionId, onClose, onExport, isExporting }) {
  const query = useCollection(collectionId, { enabled: Boolean(collectionId) })
  const collection = query.data

  if (!collectionId) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section className="w-full max-w-2xl rounded-dialog border border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="collection-detail-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Collection detail</p>
            <h2 id="collection-detail-title" className="mt-2 text-3xl font-semibold">{collection ? getCollectionTitle(collection) : 'Loading collection...'}</h2>
          </div>
          <Button variant="ghost" className="h-10 w-10 px-0" onClick={onClose} aria-label="Close collection detail"><FiX aria-hidden="true" /></Button>
        </div>

        {query.isLoading ? (
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
          </div>
        ) : query.error ? (
          <div className="mt-6">
            <ErrorFallback title="Unable to open collection" description={query.error.message} onRetry={() => query.refetch()} />
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-6 text-muted-foreground">{collection.description || 'No description provided.'}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="mt-1 font-semibold">{collection.visibility || 'PRIVATE'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Vocabulary</p>
                <p className="mt-1 font-semibold">{getVocabularyCount(collection)} words</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="mt-1 font-semibold">{formatCollectionDate(collection.updatedAt || collection.lastUpdated || collection.createdAt)}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
              Vocabulary table and import flows are intentionally not implemented in this step.
            </div>
            <Button className="w-full" onClick={() => onExport(collection)} disabled={isExporting}>
              <FiDownload aria-hidden="true" /> {isExporting ? 'Exporting collection PDF...' : 'Export collection PDF'}
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

export default function CollectionsPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [visibility, setVisibility] = useState('ALL')
  const [formState, setFormState] = useState({ open: false, mode: 'create', collection: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [detailId, setDetailId] = useState(null)

  const collectionsQuery = useCollections({ page, size: PAGE_SIZE })
  const createMutation = useCreateCollection()
  const updateMutation = useUpdateCollection()
  const deleteMutation = useDeleteCollection()
  const exportCollectionPdf = useExportCollectionPdf()

  const normalized = normalizeCollectionList(collectionsQuery.data)
  const filteredCollections = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return normalized.items.filter((collection) => {
      const title = getCollectionTitle(collection).toLowerCase()
      const description = (collection.description || '').toLowerCase()
      const matchesSearch = !keyword || title.includes(keyword) || description.includes(keyword)
      const matchesVisibility = visibility === 'ALL' || collection.visibility === visibility
      return matchesSearch && matchesVisibility
    })
  }, [normalized.items, search, visibility])

  const openCreateForm = () => setFormState({ open: true, mode: 'create', collection: null })
  const openEditForm = (collection) => setFormState({ open: true, mode: 'edit', collection })
  const closeForm = () => setFormState({ open: false, mode: 'create', collection: null })

  const handleSubmitCollection = async (payload) => {
    try {
      if (formState.mode === 'edit') {
        await updateMutation.mutateAsync({ id: formState.collection.id, payload })
        toast.success('Collection updated')
      } else {
        await createMutation.mutateAsync(payload)
        toast.success('Collection created')
        setPage(0)
      }
      closeForm()
    } catch (error) {
      toast.error(error.message || 'Unable to save collection')
    }
  }

  const handleDeleteRequest = (collection) => {
    if (collection.visibility === 'SYSTEM') {
      toast.error('SYSTEM collections cannot be deleted')
      return
    }
    setDeleteTarget(collection)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('Collection deleted')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error.message || 'Unable to delete collection')
    }
  }

  const handleExportCollectionPdf = async (collection) => {
    if (!collection?.id) return

    try {
      await exportCollectionPdf.mutateAsync(collection.id)
      toast.success('Collection PDF download started')
    } catch (error) {
      toast.error(error.message || 'Unable to export collection PDF')
    }
  }

  if (collectionsQuery.isLoading) return <CollectionsSkeleton />

  if (collectionsQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="My Collections" description="Manage vocabulary collections and learning sets." actions={<Button onClick={openCreateForm}><FiPlus aria-hidden="true" /> Create Collection</Button>} />
        <ErrorFallback title="Unable to load collections" description={collectionsQuery.error.message} onRetry={() => collectionsQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  const totalPages = Math.max(1, normalized.totalPages)
  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Collection manager"
        title="My Collections"
        description="Organize vocabulary by exam, topic, difficulty, or real-life speaking goal."
        actions={<Button onClick={openCreateForm}><FiPlus aria-hidden="true" /> Create Collection</Button>}
      />

      <section className="rounded-card border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <FiSearch aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search collections..."
              aria-label="Search collections"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {visibilityFilters.map((item) => (
              <Button key={item} variant={visibility === item ? 'primary' : 'secondary'} onClick={() => setVisibility(item)}>
                {item === 'ALL' ? 'All' : item}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">{normalized.totalItems} total</Badge>
          <Badge variant="secondary">Page {page + 1} of {totalPages}</Badge>
          <Badge variant={visibility === 'SYSTEM' ? 'primary' : 'secondary'}>{visibility === 'ALL' ? 'All visibility' : visibility}</Badge>
        </div>
      </div>

      {filteredCollections.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Collection grid">
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onOpen={(item) => setDetailId(item.id)}
              onEdit={openEditForm}
              onDelete={handleDeleteRequest}
              onExport={handleExportCollectionPdf}
              isExporting={exportCollectionPdf.isPending}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={FiLayers}
          title={search || visibility !== 'ALL' ? 'No collections match your filters' : 'No collections yet'}
          description={search || visibility !== 'ALL' ? 'Try a different keyword or visibility filter.' : 'Create your first collection to organize vocabulary and start learning.'}
          action={<Button onClick={openCreateForm}><FiPlus aria-hidden="true" /> Create Collection</Button>}
        />
      )}

      <section className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Showing {filteredCollections.length} collections from this page. Use pagination for more server results.</p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>
            <FiChevronLeft aria-hidden="true" /> Previous
          </Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>
            Next <FiChevronRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-card p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FiBookOpen aria-hidden="true" /></div>
          <h2 className="mt-4 text-xl font-semibold">Detail and learning actions</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Open shows metadata now. Vocabulary import and CRUD are reserved for the next implementation step.</p>
        </div>
        <div className="rounded-card border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold">Security rules</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Requests use the authenticated API client. The UI does not send user identity fields, and SYSTEM collections cannot be selected in forms or deleted from the grid.</p>
        </div>
      </section>

      <CollectionFormDialog
        open={formState.open}
        mode={formState.mode}
        collection={formState.collection}
        isSubmitting={isMutating}
        onSubmit={handleSubmitCollection}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete collection"
        description={deleteTarget ? `Delete "${getCollectionTitle(deleteTarget)}"? This action cannot be undone.` : ''}
        confirmLabel="Delete Collection"
        destructive
        isSubmitting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <CollectionDetailDialog
        collectionId={detailId}
        onClose={() => setDetailId(null)}
        onExport={handleExportCollectionPdf}
        isExporting={exportCollectionPdf.isPending}
      />
    </ResponsiveContentContainer>
  )
}

