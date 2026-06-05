export type Vocabulary = {
  id: string | number
  term?: string
  word?: string
  meaning?: string
  meaningEn?: string
  meaningVi?: string
  phonetic?: string
  audioUrl?: string
  pronunciation?: string
  partOfSpeech?: string
  exampleSentence?: string
  example?: string
  examples?: Array<{ sentence?: string; text?: string; translation?: string }>
  vietnameseMeaning?: string
  note?: string
  synonyms?: string[]
  antonyms?: string[]
  collectionIds?: Array<string | number>
  collections?: Array<{ id: string | number; title?: string; name?: string }>
  createdAt?: string
  updatedAt?: string
}

export type VocabularyListResponse = Vocabulary[] | {
  content?: Vocabulary[]
  items?: Vocabulary[]
  data?: Vocabulary[]
  vocabularies?: Vocabulary[]
  totalElements?: number
  totalItems?: number
  total?: number
  totalPages?: number
  page?: number
  number?: number
  size?: number
}

export type VocabularyQueryParams = {
  page?: number
  size?: number
}

export type CreateVocabularyRequest = {
  word: string
  phonetic?: string
  audioUrl?: string
  partOfSpeech?: string
  meaningVi?: string
  meaningEn: string
  synonyms?: string[]
  antonyms?: string[]
  examples?: Array<{ sentence?: string; translation?: string }>
  collectionIds?: Array<string | number>
}

export type UpdateVocabularyRequest = Partial<CreateVocabularyRequest>
