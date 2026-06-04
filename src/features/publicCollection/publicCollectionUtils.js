export const PUBLIC_COLLECTION_PAGE_SIZE = 10

export function normalizePublicCollectionList(payload, fallbackSize = PUBLIC_COLLECTION_PAGE_SIZE) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      totalItems: payload.length,
      totalPages: 1,
      page: 0,
      size: payload.length || fallbackSize,
    }
  }

  const items = payload?.content || payload?.items || payload?.data || payload?.collections || []
  const totalItems = Number(payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? items.length)
  const size = Number(payload?.size ?? fallbackSize)

  return {
    items,
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

export function getPublicOwnerDisplayName(collection) {
  if (collection?.ownerDisplayName) return collection.ownerDisplayName
  if (typeof collection?.createdBy === 'string') return collection.createdBy
  const owner = collection?.owner || collection?.createdBy
  return owner?.displayName || owner?.username || owner?.name || 'Public contributor'
}

export function getPublicCloneCount(collection) {
  return Number(collection?.clonedCount ?? collection?.cloneCount ?? 0)
}

export function formatPublicCollectionDate(value) {
  if (!value) return 'No date yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No date yet'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}
