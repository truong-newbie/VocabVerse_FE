export function getSessionId(session) {
  return session?.sessionId || session?.id || null
}

export function normalizeFlashcardCards(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.items || payload?.content || payload?.cards || payload?.vocabularies || []
}

export function getCardVocabularyId(card) {
  return card?.vocabularyId || card?.id
}

export function getCardTerm(card) {
  return card?.term || card?.word || 'Untitled term'
}

export function getCardMeaning(card) {
  return card?.meaning || card?.vietnameseMeaning || 'No meaning yet'
}

export function getCardExample(card) {
  return card?.exampleSentence || card?.example || ''
}

export function normalizeStringList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

export function getAnswerTone(result) {
  if (result === 'EASY') return 'success'
  if (result === 'GOOD') return 'primary'
  if (result === 'HARD') return 'warning'
  if (result === 'AGAIN') return 'destructive'
  return 'secondary'
}
