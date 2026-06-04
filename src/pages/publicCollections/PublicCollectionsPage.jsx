import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiExternalLink,
  FiGlobe,
  FiLayers,
  FiSearch,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DashboardSection from '@/components/dashboard/DashboardSection'
import EmptyState from '@/components/common/EmptyState'
import ErrorFallback from '@/components/common/ErrorFallback'
import PageHeader from '@/components/common/PageHeader'
import ResponsiveContentContainer from '@/components/common/ResponsiveContentContainer'
import StatCard from '@/components/common/StatCard'
import {
  formatPublicCollectionDate,
  getPublicCloneCount,
  getPublicCollectionDescription,
  getPublicCollectionTitle,
  getPublicOwnerDisplayName,
  getPublicVocabularyCount,
  normalizePublicCollectionList,
  PUBLIC_COLLECTION_PAGE_SIZE,
} from '@/features/publicCollection/publicCollectionUtils'
import {
  useClonePublicCollection,
  usePublicCollection,
  usePublicCollections,
  usePublicCollectionVocabularies,
} from '@/features/publicCollection/usePublicCollections'
import { getVocabularyExample, getVocabularyMeaning, getVocabularyTerm, normalizeVocabularyList } from '@/features/vocabulary/vocabularyUtils'

const VOCABULARY_PAGE_SIZE = 10

function PublicCollectionsSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="rounded-card border border-border bg-card p-6 shadow-sm">
        <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-card border border-border bg-card p-5 shadow-sm">
            <div className="flex justify-between">
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="mt-6 h-8 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-muted" />
            <div className="mt-8 h-11 animate-pulse rounded-button bg-muted" />
          </div>
        ))}
      </div>
    </ResponsiveContentContainer>
  )
}

function DetailSkeleton() {
  return (
    <ResponsiveContentContainer className="space-y-8">
      <div className="h-11 w-40 animate-pulse rounded-button bg-muted" />
      <div className="rounded-[28px] border border-border bg-card p-8 shadow-sm">
        <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
        <div className="mt-5 h-12 w-96 max-w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-4 w-full max-w-3xl animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-card border border-border bg-card" />)}
      </div>
    </ResponsiveContentContainer>
  )
}

function PublicCollectionCard({ collection, onClone, onOpen, isCloning }) {
  const title = getPublicCollectionTitle(collection)
  const description = getPublicCollectionDescription(collection)
  const ownerName = getPublicOwnerDisplayName(collection)
  const vocabularyCount = getPublicVocabularyCount(collection)
  const cloneCount = getPublicCloneCount(collection)
  const updatedDate = collection.updatedAt || collection.lastUpdated || collection.createdAt

  return (
    <article className="group flex h-full flex-col rounded-card border border-border bg-card p-5 text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Badge variant="success"><span className="inline-flex items-center gap-1.5"><FiGlobe aria-hidden="true" /> PUBLIC</span></Badge>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{vocabularyCount} words</span>
      </div>

      <div className="mt-5 flex-1">
        <h2 className="line-clamp-2 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-3 line-clamp-3 min-h-18 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><FiUser aria-hidden="true" className="h-4 w-4" /><span>{ownerName}</span></div>
        <div className="flex items-center gap-2"><FiCopy aria-hidden="true" className="h-4 w-4" /><span>{cloneCount} clones</span></div>
        <div className="flex items-center gap-2"><FiBookOpen aria-hidden="true" className="h-4 w-4" /><span>Updated {formatPublicCollectionDate(updatedDate)}</span></div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onClone} disabled={isCloning} aria-label={`Clone ${title}`}>
          <FiCopy aria-hidden="true" /> {isCloning ? 'Cloning...' : 'Clone'}
        </Button>
        <Button variant="outline" onClick={onOpen} aria-label={`Open ${title}`}>
          <FiExternalLink aria-hidden="true" /> Open
        </Button>
      </div>
    </article>
  )
}

function PublicVocabularyRow({ vocabulary }) {
  const term = getVocabularyTerm(vocabulary)
  const meaning = getVocabularyMeaning(vocabulary)
  const example = getVocabularyExample(vocabulary)

  return (
    <article className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{term}</h3>
            {vocabulary.partOfSpeech ? <Badge variant="primary">{vocabulary.partOfSpeech}</Badge> : null}
          </div>
          {vocabulary.pronunciation ? <p className="mt-1 text-sm font-semibold text-primary">{vocabulary.pronunciation}</p> : null}
          <p className="mt-2 text-base font-semibold text-foreground">{meaning}</p>
          {vocabulary.vietnameseMeaning ? <p className="mt-1 text-sm text-muted-foreground">VI: {vocabulary.vietnameseMeaning}</p> : null}
        </div>
        <Badge variant="muted">Public vocabulary</Badge>
      </div>
      {example ? <p className="mt-4 rounded-xl bg-muted p-3 text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Example: </span>{example}</p> : null}
    </article>
  )
}

function PublicCollectionListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const collectionsQuery = usePublicCollections({ page, size: PUBLIC_COLLECTION_PAGE_SIZE })
  const cloneMutation = useClonePublicCollection()
  const normalized = normalizePublicCollectionList(collectionsQuery.data, PUBLIC_COLLECTION_PAGE_SIZE)

  const filteredCollections = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return normalized.items
    return normalized.items.filter((collection) => {
      const title = getPublicCollectionTitle(collection).toLowerCase()
      const description = getPublicCollectionDescription(collection).toLowerCase()
      const owner = getPublicOwnerDisplayName(collection).toLowerCase()
      return title.includes(keyword) || description.includes(keyword) || owner.includes(keyword)
    })
  }, [normalized.items, search])

  const handleClone = async (collection) => {
    try {
      await cloneMutation.mutateAsync(collection.id)
      toast.success('Collection cloned to your private library')
    } catch (error) {
      toast.error(error.message || 'Unable to clone public collection')
    }
  }

  if (collectionsQuery.isLoading) return <PublicCollectionsSkeleton />

  if (collectionsQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader title="Public Collections" description="Browse public vocabulary collections shared by the community." />
        <ErrorFallback title="Unable to load public collections" description={collectionsQuery.error.message} onRetry={() => collectionsQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  const totalPages = Math.max(1, normalized.totalPages)

  return (
    <ResponsiveContentContainer className="space-y-8">
      <PageHeader
        eyebrow="Public library"
        title="Public Collections"
        description="Discover shared vocabulary sets and clone useful collections into your own private library."
      />

      <section className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Badge variant="success"><span className="inline-flex items-center gap-1.5"><FiGlobe aria-hidden="true" /> Community marketplace</span></Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Browse, preview, then clone</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Only safe public owner names are shown. Sensitive owner fields are intentionally not rendered.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[480px]">
            <StatCard label="Public Sets" value={normalized.totalItems} icon={FiLayers} tone="primary" />
            <StatCard label="Page" value={`${page + 1}/${totalPages}`} icon={FiBookOpen} tone="success" />
            <StatCard label="Visible" value={filteredCollections.length} icon={FiUsers} tone="warning" />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-border bg-card p-4 shadow-sm">
        <label className="sr-only" htmlFor="public-collection-search">Search public collections</label>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
          <FiSearch aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          <input
            id="public-collection-search"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, description, or public owner name..."
          />
        </div>
      </section>

      {filteredCollections.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Public collection grid">
          {filteredCollections.map((collection) => (
            <PublicCollectionCard
              key={collection.id}
              collection={collection}
              onClone={() => handleClone(collection)}
              onOpen={() => navigate(`/public/collections/${collection.id}`)}
              isCloning={cloneMutation.isPending}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={FiGlobe}
          title={search ? 'No public collections match your search' : 'No public collections available'}
          description={search ? 'Try another keyword or clear the search box.' : 'Public collections will appear here when the backend returns shared vocabulary sets.'}
          action={search ? <Button onClick={() => setSearch('')}>Clear Search</Button> : null}
        />
      )}

      <section className="flex flex-col gap-3 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Showing {filteredCollections.length} public collections from this page.</p>
        <div className="flex gap-2">
          <Button variant="secondary" disabled={page <= 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>
            <FiChevronLeft aria-hidden="true" /> Previous
          </Button>
          <Button variant="secondary" disabled={page + 1 >= totalPages} onClick={() => setPage((value) => value + 1)}>
            Next <FiChevronRight aria-hidden="true" />
          </Button>
        </div>
      </section>
    </ResponsiveContentContainer>
  )
}

function PublicCollectionDetailPage({ collectionId }) {
  const navigate = useNavigate()
  const [vocabularyPage, setVocabularyPage] = useState(0)
  const collectionQuery = usePublicCollection(collectionId, { enabled: Boolean(collectionId) })
  const vocabulariesQuery = usePublicCollectionVocabularies(collectionId, { page: vocabularyPage, size: VOCABULARY_PAGE_SIZE }, { enabled: Boolean(collectionId) })
  const cloneMutation = useClonePublicCollection()
  const collection = collectionQuery.data
  const vocabularies = normalizeVocabularyList(vocabulariesQuery.data, VOCABULARY_PAGE_SIZE)

  const handleClone = async () => {
    try {
      await cloneMutation.mutateAsync(collectionId)
      toast.success('Collection cloned to your private library')
    } catch (error) {
      toast.error(error.message || 'Unable to clone public collection')
    }
  }

  if (collectionQuery.isLoading) return <DetailSkeleton />

  if (collectionQuery.error) {
    return (
      <ResponsiveContentContainer className="space-y-8">
        <PageHeader
          title="Public Collection"
          description="Open a public collection preview."
          actions={<Button variant="secondary" onClick={() => navigate('/public/collections')}><FiArrowLeft aria-hidden="true" /> Back</Button>}
        />
        <ErrorFallback title="Unable to load public collection" description={collectionQuery.error.message} onRetry={() => collectionQuery.refetch()} />
      </ResponsiveContentContainer>
    )
  }

  const title = getPublicCollectionTitle(collection)
  const ownerName = getPublicOwnerDisplayName(collection)
  const vocabularyCount = getPublicVocabularyCount(collection)
  const cloneCount = getPublicCloneCount(collection)
  const vocabularyTotalPages = Math.max(1, vocabularies.totalPages)

  return (
    <ResponsiveContentContainer className="space-y-8">
      <div>
        <Button variant="secondary" onClick={() => navigate('/public/collections')}><FiArrowLeft aria-hidden="true" /> Back to public collections</Button>
      </div>

      <section className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <Badge variant="success"><span className="inline-flex items-center gap-1.5"><FiGlobe aria-hidden="true" /> PUBLIC COLLECTION</span></Badge>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{getPublicCollectionDescription(collection)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="secondary"><span className="inline-flex items-center gap-1.5"><FiUser aria-hidden="true" /> {ownerName}</span></Badge>
              <Badge variant="muted">Updated {formatPublicCollectionDate(collection.updatedAt || collection.lastUpdated || collection.createdAt)}</Badge>
            </div>
          </div>
          <Button size="lg" onClick={handleClone} disabled={cloneMutation.isPending}>
            <FiCopy aria-hidden="true" /> {cloneMutation.isPending ? 'Cloning...' : 'Clone Collection'}
          </Button>
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
          Cloning creates a copy in your account. If the backend follows the documented rule, the cloned collection becomes your own PRIVATE collection.
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vocabulary" value={vocabularyCount} icon={FiBookOpen} tone="primary" />
        <StatCard label="Visibility" value="Public" icon={FiGlobe} tone="success" />
        <StatCard label="Owner" value={ownerName} icon={FiUser} tone="warning" />
        <StatCard label="Clones" value={cloneCount} icon={FiCopy} tone="primary" />
      </section>

      <DashboardSection
        title="Vocabulary Preview"
        description="Preview public vocabulary before cloning. This page does not expose private owner data."
        actions={<Badge variant="primary">Page {vocabularyPage + 1} of {vocabularyTotalPages}</Badge>}
      >
        {vocabulariesQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        ) : vocabulariesQuery.error ? (
          <ErrorFallback title="Unable to load vocabulary" description={vocabulariesQuery.error.message} onRetry={() => vocabulariesQuery.refetch()} />
        ) : vocabularies.items.length ? (
          <div className="space-y-3">
            {vocabularies.items.map((vocabulary) => <PublicVocabularyRow key={vocabulary.id} vocabulary={vocabulary} />)}
          </div>
        ) : (
          <EmptyState
            icon={FiBookOpen}
            title="No vocabulary preview available"
            description="The backend did not return vocabulary items for this public collection."
          />
        )}

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Showing {vocabularies.items.length} vocabulary items from this page.</p>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={vocabularyPage <= 0} onClick={() => setVocabularyPage((value) => Math.max(0, value - 1))}>
              <FiChevronLeft aria-hidden="true" /> Previous
            </Button>
            <Button variant="secondary" disabled={vocabularyPage + 1 >= vocabularyTotalPages} onClick={() => setVocabularyPage((value) => value + 1)}>
              Next <FiChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="Privacy Boundary" description="Public discovery intentionally renders only safe collection and owner metadata.">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-muted p-4">
            <FiCheckCircle aria-hidden="true" className="h-5 w-5 text-success" />
            <p className="mt-3 font-semibold">No user id sent</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Requests rely on collection id and backend auth context.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <FiCheckCircle aria-hidden="true" className="h-5 w-5 text-success" />
            <p className="mt-3 font-semibold">No sensitive owner fields</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">The UI displays display name or username only.</p>
          </div>
          <div className="rounded-2xl bg-muted p-4">
            <FiCheckCircle aria-hidden="true" className="h-5 w-5 text-success" />
            <p className="mt-3 font-semibold">Authenticated clone</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Clone uses the shared authenticated API client.</p>
          </div>
        </div>
      </DashboardSection>
    </ResponsiveContentContainer>
  )
}

export default function PublicCollectionsPage() {
  const { collectionId } = useParams()
  if (collectionId) return <PublicCollectionDetailPage collectionId={collectionId} />
  return <PublicCollectionListPage />
}
