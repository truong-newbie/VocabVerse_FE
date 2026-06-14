import type { Vocabulary, VocabularyListResponse } from './vocabulary'

export type PublicOwner = {
  id?: string | number
  displayName?: string
  fullName?: string
  username?: string
  name?: string
  avatarUrl?: string
}

export type PublicCollection = {
  id: string | number
  title?: string
  name?: string
  description?: string
  visibility?: 'PUBLIC' | string
  owner?: PublicOwner
  ownerName?: string
  publisherName?: string
  authorName?: string
  ownerDisplayName?: string
  createdByName?: string
  createdBy?: PublicOwner | string
  totalVocabularyCount?: number
  totalVocabularies?: number
  vocabularyCount?: number
  wordCount?: number
  totalWords?: number
  clonedCount?: number
  cloneCount?: number
  createdAt?: string
  updatedAt?: string
  lastUpdated?: string
}

export type PublicCollectionListResponse = PublicCollection[] | {
  content?: PublicCollection[]
  items?: PublicCollection[]
  data?: PublicCollection[]
  collections?: PublicCollection[]
  totalElements?: number
  totalItems?: number
  total?: number
  totalPages?: number
  page?: number
  number?: number
  size?: number
}

export type PublicCollectionQueryParams = {
  page?: number
  size?: number
}

export type PublicCollectionVocabulary = Vocabulary

export type PublicCollectionVocabularyListResponse = VocabularyListResponse

export type ClonePublicCollectionResponse = {
  id?: string | number
  collectionId?: string | number
  collection?: { id?: string | number }
  clonedCollection?: { id?: string | number }
  data?: {
    id?: string | number
    collectionId?: string | number
  }
  title?: string
  name?: string
  visibility?: 'PRIVATE' | string
  clonedFromCollectionId?: string | number
}
