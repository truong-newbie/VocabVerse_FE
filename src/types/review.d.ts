export type ReviewResult = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'

export type LearningStatus = 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED' | string

export type ReviewSchedulerType = 'FIXED_INTERVAL' | 'SM2' | 'FSRS'

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

export type ReviewStatsResponse = {
  wordsDue?: number
  dueTodayCount?: number
  reviewedToday?: number
  reviewedTodayCount?: number
  currentStreak?: number
  streak?: number
  totalVocabulary?: number
  totalVocabularies?: number
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

export type CollectionReviewSettings = {
  id?: string | number
  collectionId?: string | number
  enabled?: boolean
  emailEnabled?: boolean
  schedulerType?: ReviewSchedulerType | null
  intervals?: number[]
  lastResetAt?: string | null
  createdAt?: string
  updatedAt?: string
  reviewEnabled?: boolean
  emailReminderEnabled?: boolean
  emailReminder?: boolean
  reminderTime?: string
  timezone?: string | null
  reviewIntervals?: number[]
}

export type UpdateCollectionReviewSettingsRequest = {
  enabled?: boolean
  emailEnabled?: boolean
  schedulerType?: ReviewSchedulerType
  intervals?: number[]
  reminderTime?: string | null
  timezone?: string | null
}
