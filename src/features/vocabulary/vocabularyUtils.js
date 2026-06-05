export function getVocabularyTerm(vocabulary) {
  return vocabulary?.term || vocabulary?.word || 'Untitled term'
}

export function getVocabularyMeaning(vocabulary) {
  return vocabulary?.meaning || vocabulary?.meaningEn || vocabulary?.vietnameseMeaning || vocabulary?.meaningVi || 'No meaning yet'
}

export function getVocabularyExample(vocabulary) {
  if (Array.isArray(vocabulary?.examples) && vocabulary.examples[0]) {
    return vocabulary.examples[0].sentence || vocabulary.examples[0].text || ''
  }
  return vocabulary?.exampleSentence || vocabulary?.example || ''
}

export function getVocabularyCollectionIds(vocabulary) {
  if (Array.isArray(vocabulary?.collectionIds)) return vocabulary.collectionIds.map(String)
  if (Array.isArray(vocabulary?.collections)) return vocabulary.collections.map((collection) => String(collection.id))
  return []
}

export function getVocabularyCollections(vocabulary) {
  if (Array.isArray(vocabulary?.collections)) return vocabulary.collections
  if (Array.isArray(vocabulary?.collectionIds)) return vocabulary.collectionIds.map((id) => ({ id, title: `Collection ${id}` }))
  return []
}

export function formatVocabularyDate(value) {
  if (!value) return 'No date yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No date yet'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function normalizeVocabularyList(payload, fallbackSize = 10) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      totalItems: payload.length,
      totalPages: 1,
      page: 0,
      size: payload.length || fallbackSize,
    }
  }

  const items = payload?.content || payload?.items || payload?.data || payload?.vocabularies || []
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
