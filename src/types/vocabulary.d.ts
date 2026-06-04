export type Vocabulary = {
  id: string | number
  term?: string
  word?: string
  meaning?: string
  pronunciation?: string
  partOfSpeech?: string
  exampleSentence?: string
  example?: string
  vietnameseMeaning?: string
  note?: string
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
  term: string
  meaning: string
  pronunciation?: string
  partOfSpeech?: string
  exampleSentence?: string
  vietnameseMeaning?: string
  note?: string
  collectionIds?: Array<string | number>
}

export type UpdateVocabularyRequest = Partial<CreateVocabularyRequest>
