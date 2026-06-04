export type CollectionVisibility = 'PRIVATE' | 'PUBLIC' | 'SYSTEM'

export type Collection = {
  id: string | number
  title?: string
  name?: string
  description?: string
  visibility?: CollectionVisibility
  totalVocabularyCount?: number
  totalVocabularies?: number
  vocabularyCount?: number
  wordCount?: number
  totalWords?: number
  createdAt?: string
  updatedAt?: string
  lastUpdated?: string
}

export type CollectionListResponse = Collection[] | {
  content?: Collection[]
  items?: Collection[]
  data?: Collection[]
  collections?: Collection[]
  totalElements?: number
  totalItems?: number
  total?: number
  totalPages?: number
  page?: number
  number?: number
  size?: number
}

export type CollectionQueryParams = {
  page?: number
  size?: number
}

export type CreateCollectionRequest = {
  title: string
  description?: string
  visibility: 'PRIVATE' | 'PUBLIC'
}

export type UpdateCollectionRequest = Partial<CreateCollectionRequest>
