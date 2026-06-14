function toString(value) {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function normalizeStringList(value) {
  if (Array.isArray(value)) return value.map(toString).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map(toString).filter(Boolean)
  return []
}

function unique(values) {
  return [...new Set(values.map(toString).filter(Boolean))]
}

function unwrapDictionaryPayload(payload) {
  const source = payload?.dictionary || payload?.entry || payload?.result || payload?.data || payload
  if (Array.isArray(source)) return source[0]
  return source
}

function normalizeDefinition(definition) {
  const text = toString(definition?.definition ?? definition?.meaning ?? definition?.meaningEn ?? definition?.text)
  const example = toString(definition?.example ?? definition?.exampleSentence ?? definition?.sentence)

  return {
    definition: text,
    example,
    synonyms: normalizeStringList(definition?.synonyms),
    antonyms: normalizeStringList(definition?.antonyms),
  }
}

function normalizeMeaning(meaning) {
  const definitions = Array.isArray(meaning?.definitions)
    ? meaning.definitions.map(normalizeDefinition).filter((item) => item.definition)
    : [normalizeDefinition(meaning)].filter((item) => item.definition)

  return {
    partOfSpeech: toString(meaning?.partOfSpeech ?? meaning?.pos),
    definitions,
    synonyms: normalizeStringList(meaning?.synonyms),
    antonyms: normalizeStringList(meaning?.antonyms),
  }
}

export function normalizeDictionaryResult(payload) {
  const source = unwrapDictionaryPayload(payload)
  if (!source || typeof source !== 'object') return null

  const phonetics = Array.isArray(source.phonetics) ? source.phonetics : []
  const firstAudio = phonetics.find((item) => item?.audio)?.audio
  const firstPhonetic = phonetics.find((item) => item?.text)?.text
  const directDefinitions = source.definition || source.meaning || source.meaningEn
  const sourceMeanings = Array.isArray(source.meanings)
    ? source.meanings
    : Array.isArray(source.definitions)
      ? [{ partOfSpeech: source.partOfSpeech, definitions: source.definitions }]
      : directDefinitions
        ? [{ partOfSpeech: source.partOfSpeech, definitions: [{ definition: directDefinitions, example: source.example || source.exampleSentence }] }]
        : []

  const meanings = sourceMeanings.map(normalizeMeaning).filter((meaning) => meaning.definitions.length)
  const definitionSynonyms = meanings.flatMap((meaning) => [
    ...meaning.synonyms,
    ...meaning.definitions.flatMap((definition) => definition.synonyms),
  ])
  const definitionAntonyms = meanings.flatMap((meaning) => [
    ...meaning.antonyms,
    ...meaning.definitions.flatMap((definition) => definition.antonyms),
  ])
  const examples = unique([
    ...normalizeStringList(source.examples),
    ...meanings.flatMap((meaning) => meaning.definitions.map((definition) => definition.example)),
  ])

  const word = toString(source.word ?? source.term)
  const result = {
    word,
    phonetic: toString(source.phonetic ?? source.pronunciation ?? firstPhonetic),
    audioUrl: toString(source.audioUrl ?? source.audio ?? firstAudio),
    meanings,
    examples,
    synonyms: unique([...normalizeStringList(source.synonyms), ...definitionSynonyms]),
    antonyms: unique([...normalizeStringList(source.antonyms), ...definitionAntonyms]),
    source,
  }

  if (!result.word && !result.meanings.length) return null
  return result
}

export function dictionaryToVocabulary(result, collectionIds = []) {
  const firstMeaning = result?.meanings?.[0]
  const firstDefinition = firstMeaning?.definitions?.[0]
  const exampleSentence = firstDefinition?.example || result?.examples?.[0] || ''

  return {
    word: result?.word || '',
    meaningEn: firstDefinition?.definition || '',
    phonetic: result?.phonetic || '',
    audioUrl: result?.audioUrl || '',
    partOfSpeech: firstMeaning?.partOfSpeech || '',
    meaningVi: '',
    examples: exampleSentence ? [{ sentence: exampleSentence, translation: '' }] : [],
    synonyms: result?.synonyms || [],
    antonyms: result?.antonyms || [],
    collectionIds,
  }
}

export function aiResultToDictionaryVocabulary(result, collectionIds = []) {
  const exampleSentence = result?.exampleSentence || result?.examples?.[0]?.sentence || result?.examples?.[0]?.text || ''

  return {
    word: result?.term || result?.word || '',
    meaningEn: result?.meaning || result?.meaningEn || '',
    phonetic: result?.pronunciation || result?.phonetic || '',
    audioUrl: '',
    partOfSpeech: result?.partOfSpeech || '',
    meaningVi: result?.vietnameseMeaning || result?.meaningVi || '',
    examples: exampleSentence ? [{ sentence: exampleSentence, translation: '' }] : [],
    synonyms: normalizeStringList(result?.synonyms),
    antonyms: normalizeStringList(result?.antonyms),
    collectionIds,
  }
}

export function vocabularyDraftForDialog(payload) {
  const example = payload?.examples?.[0]?.sentence || payload?.examples?.[0]?.text || ''

  return {
    word: payload?.word || '',
    meaningEn: payload?.meaningEn || '',
    phonetic: payload?.phonetic || '',
    partOfSpeech: payload?.partOfSpeech || '',
    exampleSentence: example,
    examples: payload?.examples || [],
    meaningVi: payload?.meaningVi || '',
    synonyms: payload?.synonyms || [],
    antonyms: payload?.antonyms || [],
    collectionIds: payload?.collectionIds || [],
  }
}

export function buildAiNormalizeInput(result) {
  if (!result) return ''
  const firstMeaning = result.meanings?.[0]
  const firstDefinition = firstMeaning?.definitions?.[0]
  const lines = [
    `Word: ${result.word}`,
    result.phonetic ? `Pronunciation: ${result.phonetic}` : '',
    firstMeaning?.partOfSpeech ? `Part of speech: ${firstMeaning.partOfSpeech}` : '',
    firstDefinition?.definition ? `Definition: ${firstDefinition.definition}` : '',
    firstDefinition?.example ? `Example: ${firstDefinition.example}` : '',
    result.synonyms?.length ? `Synonyms: ${result.synonyms.join(', ')}` : '',
    result.antonyms?.length ? `Antonyms: ${result.antonyms.join(', ')}` : '',
  ]
  return lines.filter(Boolean).join('\n')
}

export function getFriendlyDictionaryError(error) {
  const status = error?.status
  const message = error?.message || ''
  const lowerMessage = message.toLowerCase()

  if (status === 408 || lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return {
      title: 'Dictionary search timed out',
      description: 'The provider took too long to respond. Retry the same word in a moment.',
    }
  }

  if (status === 502 || status === 503 || status === 504 || lowerMessage.includes('provider')) {
    return {
      title: 'Dictionary provider unavailable',
      description: 'The dictionary provider is temporarily unavailable. Retry when the service recovers.',
    }
  }

  if (lowerMessage.includes('network')) {
    return {
      title: 'Network error',
      description: 'VocabVerse could not reach the dictionary service. Check the API connection and retry.',
    }
  }

  return {
    title: 'Dictionary search failed',
    description: message || 'Unable to search this word right now. Please try again.',
  }
}
