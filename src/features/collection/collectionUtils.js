export function getCollectionTitle(collection) {
  return collection?.title || collection?.name || 'Untitled collection'
}

export function getVocabularyCount(collection) {
  return Number(
    collection?.totalVocabularyCount ??
      collection?.totalVocabularies ??
      collection?.vocabularyCount ??
      collection?.wordCount ??
      collection?.totalWords ??
      0,
  )
}

export function formatCollectionDate(value) {
  if (!value) return 'No date yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No date yet'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}
