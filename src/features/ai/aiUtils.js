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

export function extractAiNormalizeQuotaInfo(payload) {
  const source = payload?._meta || payload || {}
  const remainingUses = source.remainingUses ?? source.remaining ?? source.quotaRemaining ?? source.remainingToday
  const dailyLimit = source.dailyLimit ?? source.limit ?? source.dailyQuota

  if (remainingUses === undefined && dailyLimit === undefined) return null

  return {
    remainingUses,
    dailyLimit,
  }
}

export function getFriendlyAiError(error) {
  const status = error?.status
  const code = String(error?.code || error?.details?.errorCode || error?.details?.code || '').toUpperCase()
  const message = error?.message || ''
  const lowerMessage = message.toLowerCase()

  if (code === 'AI_DAILY_LIMIT_REACHED') {
    return {
      title: 'Đã hết lượt AI Normalize hôm nay',
      description: 'Bạn đã dùng hết 3 lượt AI Normalize miễn phí hôm nay. Vui lòng quay lại vào ngày mai.',
    }
  }

  if (status === 401 || code === 'UNAUTHORIZED') {
    return {
      title: 'Phiên đăng nhập hết hạn',
      description: 'Vui lòng đăng nhập lại.',
    }
  }

  if (status === 429 || code.includes('RATE') || lowerMessage.includes('rate limit')) {
    return {
      title: 'AI đang bị giới hạn tốc độ',
      description: 'AI đang bị giới hạn tốc độ. Vui lòng thử lại sau.',
    }
  }

  if (status === 408 || code.includes('TIMEOUT') || lowerMessage.includes('timeout')) {
    return {
      title: 'AI xử lý quá lâu',
      description: 'AI xử lý quá lâu. Vui lòng thử lại.',
    }
  }

  if (status === 502 || status === 503 || status === 504 || code.includes('PROVIDER') || lowerMessage.includes('provider')) {
    return {
      title: 'AI chưa sẵn sàng',
      description: 'AI hiện chưa sẵn sàng. Vui lòng thử lại sau.',
    }
  }

  if (code.includes('INVALID_INPUT')) {
    return {
      title: 'Nội dung chưa hợp lệ',
      description: 'Vui lòng nhập nội dung từ vựng cần normalize.',
    }
  }

  if (code.includes('RESPONSE_INVALID') || lowerMessage.includes('invalid response') || lowerMessage.includes('did not include')) {
    return {
      title: 'AI trả về dữ liệu không hợp lệ',
      description: 'AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.',
    }
  }

  return {
    title: 'AI Normalize thất bại',
    description: message || 'Không thể AI Normalize. Vui lòng thử lại.',
  }
}
