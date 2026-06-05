import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiFileText,
  FiLayers,
  FiPlus,
  FiSearch,
  FiTarget,
  FiTrash2,
  FiType,
  FiUploadCloud,
  FiZap,
} from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import StatCard from '@/components/common/StatCard'
import ImportVocabularyDialog from '@/features/vocabulary/components/ImportVocabularyDialog'
import VocabularyFormDialog from '@/features/vocabulary/components/VocabularyFormDialog'
import { formatCollectionDate, getCollectionTitle, getVocabularyCount } from '@/features/collection/collectionUtils'
import { useCollection } from '@/features/collection/useCollections'
import { useExportCollectionPdf } from '@/features/export/usePdfExport'
import { useCreateFlashcardSession } from '@/features/flashcard/useFlashcards'
import { useCreateQuizSession } from '@/features/quiz/useQuizzes'
import { useCreateTypingSession } from '@/features/typing/useTyping'
import {
  useAddVocabularyToCollection,
  useCollectionVocabularies,
  useCreateVocabulary,
  useRemoveVocabularyFromCollection,
  useVocabularies,
} from '@/features/vocabulary/useVocabularies'
import {
  formatVocabularyDate,
  getVocabularyCollectionIds,
  getVocabularyExample,
  getVocabularyMeaning,
  getVocabularyTerm,
  normalizeVocabularyList,
} from '@/features/vocabulary/vocabularyUtils'

const PAGE_SIZE = 10

function getId(entity) {
  return entity?.id ?? entity?.vocabularyId ?? entity?.collectionId
}

function getSessionId(session) {
  return session?.sessionId || session?.id
}

function getVisibilityVariant(visibility) {
  if (visibility === 'PUBLIC') return 'success'
  if (visibility === 'SYSTEM') return 'primary'
  return 'secondary'
}

function CollectionDetailSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-36 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-11 w-80 max-w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-card border border-border bg-card" />
        ))}
      </div>
      <div className="h-[520px] animate-pulse rounded-card border border-border bg-card" />
    </ResponsiveContentContainer>
  )
}

function VocabularyTable({ vocabularies, onRemove, isRemoving }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-card shadow-sm">
      <div className="hidden grid-cols-[1fr_1.4fr_0.8fr_0.8fr_auto] gap-4 border-b border-border bg-muted/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:grid">
        <span>Word</span>
        <span>Meaning</span>
        <span>Part of speech</span>
        <span>Updated</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-border">
        {vocabularies.map((vocabulary) => {
          const vocabularyId = getId(vocabulary)
          const term = getVocabularyTerm(vocabulary)
          const example = getVocabularyExample(vocabulary)

          return (
            <article key={vocabularyId} className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_1.4fr_0.8fr_0.8fr_auto] lg:items-center">
              <div>
                <p className="text-lg font-semibold text-foreground">{term}</p>
                {vocabulary.phonetic || vocabulary.pronunciation ? (
                  <p className="mt-1 text-sm font-medium text-primary">{vocabulary.phonetic || vocabulary.pronunciation}</p>
                ) : null}
              </div>
              <div>
                <p className="text-sm font-semibold leading-6 text-foreground">{getVocabularyMeaning(vocabulary)}</p>
                {example ? <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{example}</p> : null}
              </div>
              <div>
                <Badge variant="secondary">{vocabulary.partOfSpeech || 'Word'}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{formatVocabularyDate(vocabulary.updatedAt || vocabulary.createdAt)}</p>
              <div className="flex justify-start lg:justify-end">
                <Button
                  variant="outline"
                  disabled={isRemoving}
                  onClick={() => onRemove(vocabulary)}
                  aria-label={`Remove ${term} from collection`}
                >
                  <FiTrash2 aria-hidden="true" /> Remove
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function AddExistingVocabularyDialog({ open, collectionId, currentVocabularyIds, onAdd, onClose, isAdding }) {
  const [search, setSearch] = useState('')
  const vocabulariesQuery = useVocabularies({ page: 0, size: 100 }, { enabled: open })
  const normalized = normalizeVocabularyList(vocabulariesQuery.data, 100)

  const currentIdSet = useMemo(() => new Set(currentVocabularyIds.map(String)), [currentVocabularyIds])
  const candidates = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return normalized.items.filter((vocabulary) => {
      const vocabularyId = getId(vocabulary)
      if (!vocabularyId || currentIdSet.has(String(vocabularyId))) return false
      if (getVocabularyCollectionIds(vocabulary).map(String).includes(String(collectionId))) return false
      if (!keyword) return true
      return `${getVocabularyTerm(vocabulary)} ${getVocabularyMeaning(vocabulary)}`.toLowerCase().includes(keyword)
    })
  }, [collectionId, currentIdSet, normalized.items, search])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-dialog border border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-labelledby="add-existing-vocabulary-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="add-existing-vocabulary-title" className="text-2xl font-semibold">Add existing vocabulary</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Attach a vocabulary you already created to this collection.</p>
          </div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
          <FiSearch aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vocabularies..."
            aria-label="Search vocabularies"
          />
        </div>

        {vocabulariesQuery.isLoading ? (
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : vocabulariesQuery.error ? (
          <div className="mt-5">
            <ErrorFallback title="Unable to load vocabularies" description={vocabulariesQuery.error.message} onRetry={() => vocabulariesQuery.refetch()} />
          </div>
        ) : candidates.length ? (
          <div className="mt-5 space-y-3">
            {candidates.map((vocabulary) => {
              const vocabularyId = getId(vocabulary)
              return (
                <div key={vocabularyId} className="flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{getVocabularyTerm(vocabulary)}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{getVocabularyMeaning(vocabulary)}</p>
                  </div>
                  <Button disabled={isAdding} onClick={() => onAdd(vocabulary)}>
                    <FiPlus aria-hidden="true" /> Add
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={FiBookOpen}
              title="No available vocabulary"
              description="Every matching vocabulary is already in this collection, or no vocabulary exists yet."
            />
          </div>
        )}
      </section>
    </div>
  )
}

export default function CollectionDetailPage() {
  const { collectionId } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [addExistingOpen, setAddExistingOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)
  const [startingMode, setStartingMode] = useState('')

  const collectionQuery = useCollection(collectionId, { enabled: Boolean(collectionId) })
  const vocabulariesQuery = useCollectionVocabularies(collectionId, { page, size: PAGE_SIZE }, { enabled: Boolean(collectionId) })
  const createVocabulary = useCreateVocabulary()
  const addVocabulary = useAddVocabularyToCollection()
  const removeVocabulary = useRemoveVocabularyFromCollection()
  const exportCollectionPdf = useExportCollectionPdf()
  const createFlashcardSession = useCreateFlashcardSession()
  const createQuizSession = useCreateQuizSession()
  const createTypingSession = useCreateTypingSession()

  const collection = collectionQuery.data
  const normalizedVocabularies = normalizeVocabularyList(vocabulariesQuery.data, PAGE_SIZE)
  const totalPages = Math.max(1, normalizedVocabularies.totalPages)
  const vocabularyTotal = normalizedVocabularies.totalItems || getVocabularyCount(collection)
  const currentVocabularyIds = normalizedVocabularies.items.map(getId).filter(Boolean)

  const handleCreateVocabulary = async (payload) => {
    try {
      const collectionIds = Array.from(new Set([...(payload.collectionIds || []), String(collectionId)]))
      await createVocabulary.mutateAsync({ ...payload, collectionIds })
      toast.success('Vocabulary added to collection')
      setCreateDialogOpen(false)
    } catch (error) {
      toast.error(error.message || 'Unable to add vocabulary')
    }
  }

  const handleAddExistingVocabulary = async (vocabulary) => {
    const vocabularyId = getId(vocabulary)
    if (!vocabularyId) {
      toast.error('Selected vocabulary does not include an id')
      return
    }

    try {
      await addVocabulary.mutateAsync({ collectionId, vocabularyId })
      toast.success('Vocabulary added to collection')
      setAddExistingOpen(false)
    } catch (error) {
      toast.error(error.message || 'Unable to add vocabulary to collection')
    }
  }

  const handleConfirmRemove = async () => {
    const vocabularyId = getId(removeTarget)
    if (!collectionId || !vocabularyId) return

    try {
      await removeVocabulary.mutateAsync({ collectionId, vocabularyId })
      toast.success('Vocabulary removed from collection')
      setRemoveTarget(null)
    } catch (error) {
      toast.error(error.message || 'Unable to remove vocabulary from collection')
    }
  }

  const handleExportPdf = async () => {
    try {
      await exportCollectionPdf.mutateAsync(collectionId)
      toast.success('Collection PDF download started')
    } catch (error) {
      toast.error(error.message || 'Unable to export collection PDF')
    }
  }

  const handleStartLearning = async (mode) => {
    const sessionMutationByMode = {
      flashcards: createFlashcardSession,
      quiz: createQuizSession,
      typing: createTypingSession,
    }
    const routeByMode = {
      flashcards: '/flashcards',
      quiz: '/quiz',
      typing: '/typing',
    }
    const mutation = sessionMutationByMode[mode]

    try {
      setStartingMode(mode)
      const session = await mutation.mutateAsync({ source: 'COLLECTION', collectionId })
      const sessionId = getSessionId(session)
      if (!sessionId) throw new Error('Session response did not include a session id')
      navigate(routeByMode[mode], {
        state: {
          sessionId,
          source: 'COLLECTION',
          collectionId: String(collectionId),
        },
      })
    } catch (error) {
      toast.error(error.message || `Unable to start ${mode}`)
    } finally {
      setStartingMode('')
    }
  }

  if (collectionQuery.isLoading) return <CollectionDetailSkeleton />

  if (collectionQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          title="Collection detail"
          description="Open a collection and manage its vocabulary."
          actions={<Button variant="secondary" onClick={() => navigate('/collections')}><FiArrowLeft aria-hidden="true" /> Back</Button>}
        />
        <ErrorFallback title="Unable to load collection" description={collectionQuery.error.message} onRetry={() => collectionQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  const visibility = collection?.visibility || 'PRIVATE'
  const updatedDate = collection?.updatedAt || collection?.lastUpdated || collection?.createdAt
  const learningDisabled = !vocabularyTotal || startingMode !== ''

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Collection detail"
        title={getCollectionTitle(collection)}
        description={collection?.description || 'No description yet. Add vocabulary and start focused practice from this set.'}
        actions={<Button variant="secondary" onClick={() => navigate('/collections')}><FiArrowLeft aria-hidden="true" /> Back to Collections</Button>}
      />

      <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getVisibilityVariant(visibility)}>{visibility}</Badge>
              <Badge variant="secondary">Updated {formatCollectionDate(updatedDate)}</Badge>
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight">Study this collection as a focused learning set.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Add words, remove stale vocabulary, export a PDF, or launch a learning session that only uses this collection.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button disabled={learningDisabled} onClick={() => handleStartLearning('flashcards')}>
              <FiZap aria-hidden="true" /> {startingMode === 'flashcards' ? 'Starting...' : 'Flashcards'}
            </Button>
            <Button variant="secondary" disabled={learningDisabled} onClick={() => handleStartLearning('quiz')}>
              <FiTarget aria-hidden="true" /> {startingMode === 'quiz' ? 'Starting...' : 'Start Quiz'}
            </Button>
            <Button variant="secondary" disabled={learningDisabled} onClick={() => handleStartLearning('typing')}>
              <FiType aria-hidden="true" /> {startingMode === 'typing' ? 'Starting...' : 'Typing'}
            </Button>
            <Button variant="outline" disabled={exportCollectionPdf.isPending} onClick={handleExportPdf}>
              <FiDownload aria-hidden="true" /> {exportCollectionPdf.isPending ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Vocabulary" value={vocabularyTotal} icon={FiBookOpen} tone="primary" />
        <StatCard label="Visibility" value={visibility} icon={FiLayers} tone={visibility === 'PUBLIC' ? 'success' : 'warning'} />
        <StatCard label="PDF Export" value="Available" icon={FiFileText} tone="success" />
      </section>

      <section className="rounded-card border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Vocabulary List</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Words inside this collection. Removing a word here only detaches it from this collection.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => setImportDialogOpen(true)}>
              <FiUploadCloud aria-hidden="true" /> Import Vocabulary
            </Button>
            <Button variant="secondary" onClick={() => setAddExistingOpen(true)}>
              <FiPlus aria-hidden="true" /> Add Existing
            </Button>
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <FiPlus aria-hidden="true" /> New Vocabulary
            </Button>
          </div>
        </div>
      </section>

      {vocabulariesQuery.isLoading ? (
        <div className="space-y-3 rounded-card border border-border bg-card p-5 shadow-sm">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : vocabulariesQuery.error ? (
        <ErrorFallback title="Unable to load vocabulary list" description={vocabulariesQuery.error.message} onRetry={() => vocabulariesQuery.refetch()} />
      ) : normalizedVocabularies.items.length ? (
        <VocabularyTable
          vocabularies={normalizedVocabularies.items}
          onRemove={setRemoveTarget}
          isRemoving={removeVocabulary.isPending}
        />
      ) : (
        <EmptyState
          icon={FiBookOpen}
          title="No vocabulary yet"
          description="Import a word list and normalize it with AI, paste JSON, or create vocabulary manually before starting practice."
          action={<Button onClick={() => setImportDialogOpen(true)}><FiUploadCloud aria-hidden="true" /> Import Vocabulary</Button>}
        />
      )}

      <section className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Showing {normalizedVocabularies.items.length} of {normalizedVocabularies.totalItems} vocabularies.</p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>
            <FiChevronLeft aria-hidden="true" /> Previous
          </Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>
            Next <FiChevronRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      <VocabularyFormDialog
        open={createDialogOpen}
        mode="create"
        collections={collection ? [collection] : []}
        isSubmitting={createVocabulary.isPending}
        onSubmit={handleCreateVocabulary}
        onClose={() => setCreateDialogOpen(false)}
      />

      <ImportVocabularyDialog
        open={importDialogOpen}
        collectionId={collectionId}
        onClose={() => setImportDialogOpen(false)}
        onImported={() => {
          setPage(0)
          vocabulariesQuery.refetch()
          collectionQuery.refetch()
        }}
      />

      <AddExistingVocabularyDialog
        open={addExistingOpen}
        collectionId={collectionId}
        currentVocabularyIds={currentVocabularyIds}
        isAdding={addVocabulary.isPending}
        onAdd={handleAddExistingVocabulary}
        onClose={() => setAddExistingOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(removeTarget)}
        title="Remove vocabulary"
        description={removeTarget ? `Remove "${getVocabularyTerm(removeTarget)}" from this collection? The vocabulary itself will remain in your word bank.` : ''}
        confirmLabel="Remove"
        destructive
        isSubmitting={removeVocabulary.isPending}
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />
    </ResponsiveContentContainer>
  )
}
