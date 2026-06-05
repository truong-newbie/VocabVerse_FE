export function createEmptyVocabularyImportRow() {
  return {
    term: '',
    meaning: '',
    vietnameseMeaning: '',
    partOfSpeech: '',
    pronunciation: '',
    exampleSentence: '',
    note: '',
  }
}

export function getVocabularyImportRowErrors(row) {
  const errors = {}
  if (!row.term?.trim()) errors.term = 'Term is required'
  if (!row.meaning?.trim()) errors.meaning = 'Meaning is required'
  return errors
}

export function normalizeVocabularyImportRow(row = {}) {
  const example = Array.isArray(row.examples) && row.examples[0] ? row.examples[0] : null

  return {
    term: String(row.term ?? row.word ?? '').trim(),
    meaning: String(row.meaning ?? row.meaningEn ?? '').trim(),
    vietnameseMeaning: String(row.vietnameseMeaning ?? row.meaningVi ?? '').trim(),
    pronunciation: String(row.pronunciation ?? row.phonetic ?? '').trim(),
    partOfSpeech: String(row.partOfSpeech ?? '').trim(),
    exampleSentence: String(row.exampleSentence ?? row.example ?? example?.sentence ?? example?.text ?? '').trim(),
    note: String(row.note ?? row.memoryTip ?? '').trim(),
  }
}

export function mapImportRowToCreateRequest(row) {
  const exampleSentence = row.exampleSentence?.trim()

  return {
    word: row.term.trim(),
    meaningEn: row.meaning.trim(),
    meaningVi: row.vietnameseMeaning?.trim() || '',
    phonetic: row.pronunciation?.trim() || '',
    partOfSpeech: row.partOfSpeech?.trim() || '',
    examples: exampleSentence ? [{ sentence: exampleSentence, translation: '' }] : [],
    synonyms: [],
    antonyms: [],
    note: row.note?.trim() || '',
  }
}
