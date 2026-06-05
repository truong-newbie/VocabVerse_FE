export const AI_NORMALIZE_FIELDS = [
  'term',
  'meaning',
  'vietnameseMeaning',
  'pronunciation',
  'partOfSpeech',
  'exampleSentence',
  'synonyms',
  'antonyms',
  'difficulty',
  'aiExplanation',
]

function toString(value) {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

export function normalizeStringList(value) {
  if (Array.isArray(value)) return value.map(toString).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map(toString).filter(Boolean)
  return []
}

function getFirstExample(value) {
  if (Array.isArray(value) && value[0]) {
    return value[0].sentence || value[0].text || value[0].example || ''
  }
  return ''
}

function unwrapNormalizePayload(payload) {
  return (
    payload?.normalizedVocabulary ||
    payload?.vocabulary ||
    payload?.item ||
    payload?.result ||
    payload?.data ||
    payload
  )
}

export function normalizeAiVocabularyResult(payload) {
  const source = unwrapNormalizePayload(payload)
  if (!source || typeof source !== 'object' || Array.isArray(source)) return null

  return {
    term: toString(source.term ?? source.word ?? source.vocabularyTerm),
    meaning: toString(source.meaning ?? source.meaningEn ?? source.definition),
    vietnameseMeaning: toString(source.vietnameseMeaning ?? source.meaningVi ?? source.translationVi),
    pronunciation: toString(source.pronunciation ?? source.phonetic),
    partOfSpeech: toString(source.partOfSpeech ?? source.pos),
    exampleSentence: toString(source.exampleSentence ?? source.example ?? getFirstExample(source.examples)),
    synonyms: normalizeStringList(source.synonyms),
    antonyms: normalizeStringList(source.antonyms),
    difficulty: toString(source.difficulty),
    aiExplanation: toString(source.aiExplanation ?? source.explanation ?? source.reasoning),
  }
}

export function extractAiVocabularyRows(payload) {
  const source =
    payload?.vocabularies ||
    payload?.items ||
    payload?.rows ||
    payload?.results ||
    payload?.normalizedVocabularies ||
    payload?.data?.vocabularies ||
    payload?.data?.items ||
    payload?.result?.vocabularies ||
    payload?.result?.items ||
    payload

  if (Array.isArray(source)) return source.map(normalizeAiVocabularyResult).filter(Boolean)
  const single = normalizeAiVocabularyResult(source)
  return single ? [single] : []
}

export function isValidAiVocabularyResult(result) {
  return Boolean(result?.term && result?.meaning)
}

export function getFriendlyAiError(error) {
  const status = error?.status
  const code = String(error?.code || error?.details?.errorCode || '').toUpperCase()
  const message = error?.message || ''
  const lowerMessage = message.toLowerCase()

  if (status === 429 || code.includes('RATE') || lowerMessage.includes('rate limit')) {
    return {
      title: 'AI rate limit reached',
      description: 'The AI provider is throttling requests. Wait a moment, then try again.',
    }
  }

  if (status === 408 || code.includes('TIMEOUT') || lowerMessage.includes('timeout')) {
    return {
      title: 'AI request timed out',
      description: 'The provider took too long to respond. Try a shorter input or retry in a moment.',
    }
  }

  if (status === 502 || status === 503 || status === 504 || code.includes('PROVIDER') || lowerMessage.includes('provider')) {
    return {
      title: 'AI provider unavailable',
      description: 'The AI provider is temporarily unavailable. Your input is safe; retry when the service recovers.',
    }
  }

  if (code.includes('INVALID') || lowerMessage.includes('invalid response') || lowerMessage.includes('did not include')) {
    return {
      title: 'AI returned an invalid response',
      description: 'The backend response could not be parsed into vocabulary fields. Retry or inspect the debug panel in development.',
    }
  }

  return {
    title: 'AI normalize failed',
    description: message || 'The AI request failed. Check your input and try again.',
  }
}
