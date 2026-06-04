import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiEdit3,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import { getCollectionTitle } from '@/features/collection/collectionUtils'
import { useCollections } from '@/features/collection/useCollections'
import { useExportAllVocabulariesPdf } from '@/features/export/usePdfExport'
import VocabularyCard from '@/features/vocabulary/components/VocabularyCard'
import VocabularyFormDialog from '@/features/vocabulary/components/VocabularyFormDialog'
import {
  formatVocabularyDate,
  getVocabularyCollectionIds,
  getVocabularyCollections,
  getVocabularyExample,
  getVocabularyMeaning,
  getVocabularyTerm,
  normalizeVocabularyList,
} from '@/features/vocabulary/vocabularyUtils'
import {
  useAddVocabularyToCollection,
  useCollectionVocabularies,
  useCreateVocabulary,
  useDeleteVocabulary,
  useRemoveVocabularyFromCollection,
  useUpdateVocabulary,
  useVocabularies,
  useVocabulary,
} from '@/features/vocabulary/useVocabularies'

const PAGE_SIZE = 10
const ALL_COLLECTIONS = 'ALL'
const ALL_POS = 'ALL'

function normalizeCollectionList(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.content || payload?.items || payload?.data || payload?.collections || []
}

function VocabularySkeleton() {
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
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="mt-6 h-8 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-muted" />
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

function VocabularyDetailDialog({ vocabularyId, collections, onClose }) {
  const [selectedCollectionId, setSelectedCollectionId] = useState('')
  const query = useVocabulary(vocabularyId, { enabled: Boolean(vocabularyId) })
  const addMutation = useAddVocabularyToCollection()
  const removeMutation = useRemoveVocabularyFromCollection()
  const vocabulary = query.data
  const linkedCollectionIds = vocabulary ? getVocabularyCollectionIds(vocabulary) : []
  const linkedCollections = vocabulary ? getVocabularyCollections(vocabulary) : []
  const availableCollections = collections.filter((collection) => !linkedCollectionIds.includes(String(collection.id)))

  if (!vocabularyId) return null

  const handleAdd = async () => {
    if (!selectedCollectionId) return

    try {
      await addMutation.mutateAsync({ collectionId: selectedCollectionId, vocabularyId })
      toast.success('Vocabulary added to collection')
      setSelectedCollectionId('')
      query.refetch()
    } catch (error) {
      toast.error(error.message || 'Unable to add vocabulary to collection')
    }
  }

  const handleRemove = async (collectionId) => {
    try {
      await removeMutation.mutateAsync({ collectionId, vocabularyId })
      toast.success('Vocabulary removed from collection')
      query.refetch()
    } catch (error) {
      toast.error(error.message || 'Unable to remove vocabulary from collection')
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-dialog border border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="vocabulary-detail-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Vocabulary detail</p>
            <h2 id="vocabulary-detail-title" className="mt-2 text-4xl font-bold tracking-tight">{vocabulary ? getVocabularyTerm(vocabulary) : 'Loading vocabulary...'}</h2>
          </div>
          <Button variant="ghost" className="h-10 w-10 px-0" onClick={onClose} aria-label="Close vocabulary detail"><FiX aria-hidden="true" /></Button>
        </div>

        {query.isLoading ? (
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
          </div>
        ) : query.error ? (
          <div className="mt-6">
            <ErrorFallback title="Unable to open vocabulary" description={query.error.message} onRetry={() => query.refetch()} />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Meaning</p>
                <p className="mt-1 font-semibold">{getVocabularyMeaning(vocabulary)}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Part of speech</p>
                <p className="mt-1 font-semibold">{vocabulary.partOfSpeech || 'Not set'}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="mt-1 font-semibold">{formatVocabularyDate(vocabulary.updatedAt || vocabulary.createdAt)}</p>
              </div>
            </div>

            {vocabulary.pronunciation ? <p className="rounded-2xl bg-primary/10 p-4 text-primary">Pronunciation: {vocabulary.pronunciation}</p> : null}
            {vocabulary.vietnameseMeaning ? <p className="rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">Vietnamese: {vocabulary.vietnameseMeaning}</p> : null}
            {getVocabularyExample(vocabulary) ? <p className="rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">Example: {getVocabularyExample(vocabulary)}</p> : null}
            {vocabulary.note ? <p className="rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">Note: {vocabulary.note}</p> : null}

            <div className="rounded-card border border-border bg-background/70 p-5">
              <h3 className="text-xl font-semibold">Collection links</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {linkedCollections.length ? linkedCollections.map((collection) => (
                  <span key={collection.id} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                    {collection.title || collection.name || `Collection ${collection.id}`}
                    <button type="button" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemove(collection.id)} aria-label="Remove from collection">x</button>
                  </span>
                )) : <p className="text-sm text-muted-foreground">This vocabulary is not linked to any collection yet.</p>}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                <select className="h-11 rounded-button border border-input bg-background px-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" value={selectedCollectionId} onChange={(event) => setSelectedCollectionId(event.target.value)}>
                  <option value="">Select collection...</option>
                  {availableCollections.map((collection) => (
                    <option key={collection.id} value={String(collection.id)}>{getCollectionTitle(collection)}</option>
                  ))}
                </select>
                <Button onClick={handleAdd} disabled={!selectedCollectionId || addMutation.isPending}>Add to collection</Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default function VocabulariesPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [partOfSpeech, setPartOfSpeech] = useState(ALL_POS)
  const [collectionFilter, setCollectionFilter] = useState(ALL_COLLECTIONS)
  const [formState, setFormState] = useState({ open: false, mode: 'create', vocabulary: null })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [detailId, setDetailId] = useState(null)

  const collectionQuery = useCollections({ page: 0, size: 100 })
  const collections = normalizeCollectionList(collectionQuery.data)
  const allVocabulariesQuery = useVocabularies({ page, size: PAGE_SIZE }, { enabled: collectionFilter === ALL_COLLECTIONS })
  const collectionVocabulariesQuery = useCollectionVocabularies(collectionFilter, { page, size: PAGE_SIZE }, { enabled: collectionFilter !== ALL_COLLECTIONS })
  const createMutation = useCreateVocabulary()
  const updateMutation = useUpdateVocabulary()
  const deleteMutation = useDeleteVocabulary()
  const exportAllVocabulariesPdf = useExportAllVocabulariesPdf()

  const activeQuery = collectionFilter === ALL_COLLECTIONS ? allVocabulariesQuery : collectionVocabulariesQuery
  const normalized = normalizeVocabularyList(activeQuery.data, PAGE_SIZE)
  const partOfSpeechOptions = useMemo(() => {
    const values = new Set(normalized.items.map((item) => item.partOfSpeech).filter(Boolean))
    return [ALL_POS, ...values]
  }, [normalized.items])
  const filteredVocabularies = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return normalized.items.filter((vocabulary) => {
      const haystack = [
        getVocabularyTerm(vocabulary),
        getVocabularyMeaning(vocabulary),
        vocabulary.vietnameseMeaning,
        vocabulary.partOfSpeech,
        getVocabularyExample(vocabulary),
        vocabulary.note,
      ].filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = !keyword || haystack.includes(keyword)
      const matchesPartOfSpeech = partOfSpeech === ALL_POS || vocabulary.partOfSpeech === partOfSpeech
      return matchesSearch && matchesPartOfSpeech
    })
  }, [normalized.items, partOfSpeech, search])

  const openCreateForm = () => setFormState({ open: true, mode: 'create', vocabulary: null })
  const openEditForm = (vocabulary) => setFormState({ open: true, mode: 'edit', vocabulary })
  const closeForm = () => setFormState({ open: false, mode: 'create', vocabulary: null })

  const handleSubmitVocabulary = async (payload) => {
    try {
      if (formState.mode === 'edit') {
        await updateMutation.mutateAsync({ id: formState.vocabulary.id, payload })
        toast.success('Vocabulary updated')
      } else {
        await createMutation.mutateAsync(payload)
        toast.success('Vocabulary created')
        setPage(0)
      }
      closeForm()
    } catch (error) {
      toast.error(error.message || 'Unable to save vocabulary')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('Vocabulary deleted')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error.message || 'Unable to delete vocabulary')
    }
  }

  const handleExportAllVocabulariesPdf = async () => {
    try {
      await exportAllVocabulariesPdf.mutateAsync()
      toast.success('Vocabulary PDF download started')
    } catch (error) {
      toast.error(error.message || 'Unable to export vocabulary PDF')
    }
  }

  if (activeQuery.isLoading || collectionQuery.isLoading) return <VocabularySkeleton />

  if (activeQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          title="Vocabulary"
          description="Manage words and phrases for collections and practice."
          actions={
            <>
              <Button variant="secondary" onClick={handleExportAllVocabulariesPdf} disabled={exportAllVocabulariesPdf.isPending}>
                <FiDownload aria-hidden="true" /> {exportAllVocabulariesPdf.isPending ? 'Exporting...' : 'Export all PDF'}
              </Button>
              <Button onClick={openCreateForm}><FiPlus aria-hidden="true" /> Add Vocabulary</Button>
            </>
          }
        />
        <ErrorFallback title="Unable to load vocabulary" description={activeQuery.error.message} onRetry={() => activeQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  const totalPages = Math.max(1, normalized.totalPages)
  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Vocabulary manager"
        title="Vocabulary"
        description="Create, organize, and connect vocabulary to collections before flashcards, quizzes, and typing practice."
        actions={
          <>
            <Button variant="secondary" onClick={handleExportAllVocabulariesPdf} disabled={exportAllVocabulariesPdf.isPending}>
              <FiDownload aria-hidden="true" /> {exportAllVocabulariesPdf.isPending ? 'Exporting...' : 'Export all PDF'}
            </Button>
            <Button onClick={openCreateForm}><FiPlus aria-hidden="true" /> Add Vocabulary</Button>
          </>
        }
      />

      <section className="rounded-card border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto] xl:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <FiSearch aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            <input className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vocabulary..." aria-label="Search vocabulary" />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2">
            <FiFilter aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            <select className="bg-transparent text-sm outline-none" value={collectionFilter} onChange={(event) => { setCollectionFilter(event.target.value); setPage(0) }} aria-label="Filter by collection">
              <option value={ALL_COLLECTIONS}>All collections</option>
              {collections.map((collection) => <option key={collection.id} value={String(collection.id)}>{getCollectionTitle(collection)}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2">
            <FiBookOpen aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            <select className="bg-transparent text-sm outline-none" value={partOfSpeech} onChange={(event) => setPartOfSpeech(event.target.value)} aria-label="Filter by part of speech">
              {partOfSpeechOptions.map((item) => <option key={item} value={item}>{item === ALL_POS ? 'All parts of speech' : item}</option>)}
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">{normalized.totalItems} total</Badge>
        <Badge variant="secondary">Page {page + 1} of {totalPages}</Badge>
        <Badge variant="secondary">{collectionFilter === ALL_COLLECTIONS ? 'All collections' : 'Collection filtered'}</Badge>
      </div>

      {filteredVocabularies.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Vocabulary grid">
          {filteredVocabularies.map((vocabulary) => (
            <VocabularyCard key={vocabulary.id} vocabulary={vocabulary} onOpen={(item) => setDetailId(item.id)} onEdit={openEditForm} onDelete={setDeleteTarget} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={FiBookOpen}
          title={search || partOfSpeech !== ALL_POS || collectionFilter !== ALL_COLLECTIONS ? 'No vocabulary matches your filters' : 'No vocabulary yet'}
          description={search || partOfSpeech !== ALL_POS || collectionFilter !== ALL_COLLECTIONS ? 'Try a different keyword, part of speech, or collection filter.' : 'Add your first word or phrase, then connect it to a collection for practice.'}
          action={<Button onClick={openCreateForm}><FiPlus aria-hidden="true" /> Add Vocabulary</Button>}
        />
      )}

      <section className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Showing {filteredVocabularies.length} vocabulary items from this page.</p>
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
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FiEdit3 aria-hidden="true" /></div>
          <h2 className="mt-4 text-xl font-semibold">Ready for practice</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Vocabulary entries can be connected to collections now. Flashcard, quiz, and typing session flows are intentionally not implemented in this step.</p>
        </div>
        <div className="rounded-card border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold">Export and security rules</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">PDF export uses the authenticated API client with blob responses. The UI never sends user identity fields or exposes tokens in URLs.</p>
        </div>
      </section>

      <VocabularyFormDialog open={formState.open} mode={formState.mode} vocabulary={formState.vocabulary} collections={collections} isSubmitting={isMutating} onSubmit={handleSubmitVocabulary} onClose={closeForm} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete vocabulary"
        description={deleteTarget ? `Delete "${getVocabularyTerm(deleteTarget)}"? This action cannot be undone.` : ''}
        confirmLabel="Delete Vocabulary"
        destructive
        isSubmitting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <VocabularyDetailDialog vocabularyId={detailId} collections={collections} onClose={() => setDetailId(null)} />
    </ResponsiveContentContainer>
  )
}
