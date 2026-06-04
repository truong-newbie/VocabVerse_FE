export type ReviewResult = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'

export type LearningStatus = 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED' | string

export type ReviewVocabulary = {
  id: string | number
  vocabularyId?: string | number
  term?: string
  word?: string
  meaning?: string
  pronunciation?: string
  partOfSpeech?: string
  exampleSentence?: string
  example?: string
  vietnameseMeaning?: string
  currentLearningStatus?: LearningStatus
  learningStatus?: LearningStatus
  status?: LearningStatus
  nextReviewAt?: string
  repetitionCount?: number
  repetitions?: number
  collectionName?: string
}

export type TodayReviewsResponse = ReviewVocabulary[] | {
  items?: ReviewVocabulary[]
  content?: ReviewVocabulary[]
  vocabularies?: ReviewVocabulary[]
  reviews?: ReviewVocabulary[]
  dueVocabularies?: ReviewVocabulary[]
  totalDue?: number
}

export type SubmitReviewRequest = {
  result: ReviewResult
}

export type ReviewHistoryItem = {
  id?: string | number
  vocabularyId?: string | number
  vocabulary?: ReviewVocabulary
  term?: string
  word?: string
  result?: ReviewResult
  reviewedAt?: string
  nextReviewAt?: string
  previousStatus?: LearningStatus
  newStatus?: LearningStatus
  collectionName?: string
}

export type ReviewHistoryResponse = ReviewHistoryItem[] | {
  items?: ReviewHistoryItem[]
  content?: ReviewHistoryItem[]
  history?: ReviewHistoryItem[]
  totalElements?: number
}

export type LearningProgress = {
  totalVocabularies?: number
  dueTodayCount?: number
  reviewedTodayCount?: number
  currentStreak?: number
  newCount?: number
  learningCount?: number
  reviewingCount?: number
  masteredCount?: number
}

export type VocabularyProgress = {
  vocabularyId?: string | number
  learningStatus?: LearningStatus
  nextReviewAt?: string
  repetitionCount?: number
  easeFactor?: number
}
