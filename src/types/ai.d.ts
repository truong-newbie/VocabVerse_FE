export type NormalizeVocabularyRequest = {
  rawText: string
  groqApiKey?: string
}

export type NormalizeVocabularyResult = {
  term?: string
  meaning?: string
  pronunciation?: string
  partOfSpeech?: string
  exampleSentence?: string
  vietnameseMeaning?: string
  synonyms?: string[]
  antonyms?: string[]
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | string
  aiExplanation?: string
}
