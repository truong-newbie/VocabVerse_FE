export function extractList(payload, keys = []) {
  if (Array.isArray(payload)) return payload
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }
  return payload?.content || payload?.items || payload?.data || payload?.users || payload?.collections || payload?.lessons || payload?.logs || []
}

export function extractTotal(payload, fallback = 0) {
  if (Array.isArray(payload)) return payload.length
  return payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? fallback
}

export function extractTotalPages(payload, pageSize = 10) {
  if (Array.isArray(payload)) return Math.max(1, Math.ceil(payload.length / pageSize))
  return payload?.totalPages ?? Math.max(1, Math.ceil(extractTotal(payload) / pageSize))
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function getId(item) {
  return item?.id ?? item?.userId ?? item?.collectionId ?? item?.lessonId ?? item?.videoId
}

export function getDisplayName(user) {
  return user?.fullName || user?.displayName || user?.username || user?.name || 'Unnamed user'
}

export function getCollectionTitle(collection) {
  return collection?.title || collection?.name || 'Untitled collection'
}

export function getOwnerName(item) {
  const owner = item?.owner || item?.user || item?.createdBy
  return owner?.fullName || owner?.displayName || owner?.username || owner?.email || item?.ownerName || item?.ownerEmail || '—'
}

export function getVocabularyCount(collection) {
  return collection?.vocabularyCount ?? collection?.totalVocabularyCount ?? collection?.totalVocabularies ?? collection?.wordCount ?? collection?.totalWords ?? 0
}

export function normalizeStats(payload = {}) {
  return {
    totalUsers: payload.totalUsers ?? payload.users ?? 0,
    activeUsers: payload.activeUsers ?? payload.activeUserCount ?? 0,
    collections: payload.collections ?? payload.totalCollections ?? 0,
    publicCollections: payload.publicCollections ?? payload.totalPublicCollections ?? 0,
    totalVocabulary: payload.totalVocabulary ?? payload.totalVocabularies ?? payload.vocabulary ?? 0,
    shadowingLessons: payload.shadowingLessons ?? payload.totalShadowingLessons ?? 0,
    reviewsToday: payload.reviewsToday ?? payload.todayReviews ?? 0,
    newUsersToday: payload.newUsersToday ?? payload.todayNewUsers ?? 0,
  }
}
