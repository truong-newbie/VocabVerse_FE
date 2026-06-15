export function getSessionId(session) {
  return session?.sessionId || session?.id || null
}

export function normalizeFlashcardCards(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.items || payload?.content || payload?.cards || payload?.vocabularies || payload?.data || []
}

export function getCardVocabularyId(card) {
  return card?.vocabularyId || card?.vocabulary?.id || card?.id
}

export function getCardTerm(card) {
  return card?.term || card?.word || card?.vocabulary?.term || card?.vocabulary?.word || 'Untitled term'
}

export function getCardPronunciation(card) {
  return card?.pronunciation || card?.phonetic || card?.vocabulary?.pronunciation || card?.vocabulary?.phonetic || ''
}

export function getCardPartOfSpeech(card) {
  return card?.partOfSpeech || card?.vocabulary?.partOfSpeech || ''
}

export function getCardMeaning(card) {
  return (
    card?.meaning ||
    card?.meaningEn ||
    card?.definition ||
    card?.vocabulary?.meaning ||
    card?.vocabulary?.meaningEn ||
    card?.vocabulary?.definition ||
    card?.vietnameseMeaning ||
    card?.meaningVi ||
    card?.translationVi ||
    card?.vocabulary?.vietnameseMeaning ||
    card?.vocabulary?.meaningVi ||
    card?.vocabulary?.translationVi ||
    'No meaning yet'
  )
}

export function getCardVietnameseMeaning(card) {
  return (
    card?.vietnameseMeaning ||
    card?.meaningVi ||
    card?.translationVi ||
    card?.vocabulary?.vietnameseMeaning ||
    card?.vocabulary?.meaningVi ||
    card?.vocabulary?.translationVi ||
    ''
  )
}

export function getCardExample(card) {
  if (Array.isArray(card?.examples) && card.examples[0]) {
    return card.examples[0].sentence || card.examples[0].text || card.examples[0].example || ''
  }
  if (Array.isArray(card?.vocabulary?.examples) && card.vocabulary.examples[0]) {
    return card.vocabulary.examples[0].sentence || card.vocabulary.examples[0].text || card.vocabulary.examples[0].example || ''
  }
  return card?.exampleSentence || card?.example || card?.vocabulary?.exampleSentence || card?.vocabulary?.example || ''
}

export function getCardNote(card) {
  return card?.note || card?.memoryTip || card?.vocabulary?.note || card?.vocabulary?.memoryTip || ''
}

export function getCardSynonyms(card) {
  return card?.synonyms || card?.vocabulary?.synonyms || []
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
