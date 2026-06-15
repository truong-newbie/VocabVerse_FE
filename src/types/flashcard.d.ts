import type { ReviewResult } from './review'
import type { Vocabulary } from './vocabulary'

export type FlashcardSessionSource = 'ALL' | 'COLLECTION' | 'REVIEW_DUE'

export type CreateFlashcardSessionRequest = {
  source: FlashcardSessionSource
  collectionId?: string | number
}

export type FlashcardSession = {
  id?: string | number
  sessionId?: string | number
  source?: FlashcardSessionSource
  collectionId?: string | number
  totalCards?: number
  answeredCards?: number
  status?: 'ACTIVE' | 'COMPLETED' | string
  createdAt?: string
  completedAt?: string
}

export type FlashcardCard = {
  id?: string | number
  vocabularyId?: string | number
  vocabulary?: Vocabulary
  term?: string
  word?: string
  pronunciation?: string
  phonetic?: string
  partOfSpeech?: string
  meaning?: string
  meaningEn?: string
  vietnameseMeaning?: string
  meaningVi?: string
  definition?: string
  translationVi?: string
  exampleSentence?: string
  example?: string
  examples?: Array<{ sentence?: string; text?: string; example?: string; translation?: string }>
  note?: string
  synonyms?: string[] | string
  memoryTip?: string
}

export type FlashcardCardsResponse = FlashcardCard[] | {
  items?: FlashcardCard[]
  content?: FlashcardCard[]
  cards?: FlashcardCard[]
  vocabularies?: FlashcardCard[]
  data?: FlashcardCard[]
  total?: number
}

export type SubmitFlashcardAnswerRequest = {
  result: ReviewResult
}

export type SubmitFlashcardAnswerResponse = {
  vocabularyId?: string | number
  result?: ReviewResult
  nextReviewAt?: string
  learningStatus?: string
  repetitionCount?: number
}
