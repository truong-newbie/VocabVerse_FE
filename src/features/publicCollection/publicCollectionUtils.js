export const PUBLIC_COLLECTION_PAGE_SIZE = 10

function isPublicCollection(collection) {
  return !collection?.visibility || String(collection.visibility).toUpperCase() === 'PUBLIC'
}

export function normalizePublicCollectionList(payload, fallbackSize = PUBLIC_COLLECTION_PAGE_SIZE) {
  if (Array.isArray(payload)) {
    const publicItems = payload.filter(isPublicCollection)
    return {
      items: publicItems,
      totalItems: publicItems.length,
      totalPages: 1,
      page: 0,
      size: publicItems.length || fallbackSize,
    }
  }

  const items = payload?.content || payload?.items || payload?.data || payload?.collections || []
  const publicItems = items.filter(isPublicCollection)
  const serverTotalItems = Number(payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? items.length)
  const totalItems = publicItems.length === items.length ? serverTotalItems : publicItems.length
  const size = Number(payload?.size ?? fallbackSize)

  return {
    items: publicItems,
    totalItems,
    totalPages: Number(payload?.totalPages ?? Math.max(1, Math.ceil(totalItems / size))),
    page: Number(payload?.number ?? payload?.page ?? 0),
    size,
  }
}

export function getPublicCollectionTitle(collection) {
  return collection?.title || collection?.name || 'Untitled public collection'
}

export function getPublicCollectionDescription(collection) {
  return collection?.description || 'No description provided by the collection owner.'
}

export function getPublicVocabularyCount(collection) {
  return Number(
    collection?.totalVocabularyCount ??
      collection?.totalVocabularies ??
      collection?.vocabularyCount ??
      collection?.wordCount ??
      collection?.totalWords ??
      0,
  )
}

function looksPrivateOwnerValue(value) {
  if (!value || typeof value !== 'string') return true
  const trimmed = value.trim()
  if (!trimmed) return true
  if (trimmed.includes('@')) return true
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)) return true
  return false
}

export function getPublicOwnerDisplayName(collection) {
  const directName =
    collection?.ownerName ||
    collection?.publisherName ||
    collection?.authorName ||
    collection?.ownerDisplayName ||
    collection?.createdByName

  if (!looksPrivateOwnerValue(directName)) return directName.trim()

  if (typeof collection?.createdBy === 'string' && !looksPrivateOwnerValue(collection.createdBy)) return collection.createdBy.trim()
  const owner = collection?.owner || collection?.createdBy
  const ownerName = owner?.displayName || owner?.fullName || owner?.username || owner?.name
  return looksPrivateOwnerValue(ownerName) ? 'Public contributor' : ownerName.trim()
}

export function getPublicCloneCount(collection) {
  return Number(collection?.clonedCount ?? collection?.cloneCount ?? 0)
}

export function getClonedCollectionId(response) {
  return (
    response?.collectionId ??
    response?.id ??
    response?.collection?.id ??
    response?.clonedCollection?.id ??
    response?.data?.collectionId ??
    response?.data?.id ??
    null
  )
}

export function formatPublicCollectionDate(value) {
  if (!value) return 'No date yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No date yet'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}
