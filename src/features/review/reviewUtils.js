export function normalizeTodayReviews(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.items || payload?.content || payload?.vocabularies || payload?.reviews || payload?.dueVocabularies || []
}

export function normalizeReviewHistory(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.items || payload?.content || payload?.history || []
}

export function getReviewVocabularyId(item) {
  return item?.vocabularyId || item?.id
}

export function getReviewTerm(item) {
  return item?.term || item?.word || item?.vocabulary?.term || item?.vocabulary?.word || 'Untitled vocabulary'
}

export function getReviewMeaning(item) {
  return item?.meaning || item?.vocabulary?.meaning || item?.vietnameseMeaning || item?.vocabulary?.vietnameseMeaning || 'No meaning yet'
}

export function getReviewExample(item) {
  return item?.exampleSentence || item?.example || item?.vocabulary?.exampleSentence || item?.vocabulary?.example || ''
}

export function getReviewStatus(item) {
  return item?.currentLearningStatus || item?.learningStatus || item?.status || item?.vocabulary?.learningStatus || 'NEW'
}

export function getReviewRepetitionCount(item) {
  return Number(item?.repetitionCount ?? item?.repetitions ?? item?.vocabulary?.repetitionCount ?? 0)
}

export function formatReviewDate(value) {
  if (!value) return 'Not scheduled'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not scheduled'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

export function getResultTone(result) {
  if (result === 'EASY') return 'success'
  if (result === 'GOOD') return 'primary'
  if (result === 'HARD') return 'warning'
  if (result === 'AGAIN') return 'destructive'
  return 'secondary'
}
