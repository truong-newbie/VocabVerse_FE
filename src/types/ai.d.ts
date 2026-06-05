export type NormalizeVocabularyRequest = {
  rawText: string
  groqApiKey?: string
}

export type NormalizeVocabularyResult = {
  term?: string
  word?: string
  meaning?: string
  meaningEn?: string
  pronunciation?: string
  phonetic?: string
  partOfSpeech?: string
  exampleSentence?: string
  examples?: Array<{ sentence?: string; text?: string; translation?: string }>
  vietnameseMeaning?: string
  meaningVi?: string
  synonyms?: string[]
  antonyms?: string[]
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | string
  aiExplanation?: string
  explanation?: string
}

export type NormalizeBulkVocabularyRequest = NormalizeVocabularyRequest

export type NormalizeBulkVocabularyResult = {
  vocabularies?: NormalizeVocabularyResult[]
  items?: NormalizeVocabularyResult[]
  rows?: NormalizeVocabularyResult[]
  results?: NormalizeVocabularyResult[]
} | NormalizeVocabularyResult[]

export type ParsedNormalizeVocabularyResult = {
  term: string
  meaning: string
  vietnameseMeaning: string
  pronunciation: string
  partOfSpeech: string
  exampleSentence: string
  synonyms: string[]
  antonyms: string[]
  difficulty: string
  aiExplanation: string
}
