export type DashboardSummary = {
  totalVocabularies?: number
  totalVocabulary?: number
  totalWords?: number
  totalCollections?: number
  newWordsCount?: number
  newCount?: number
  learningCount?: number
  reviewingCount?: number
  masteredCount?: number
  dueTodayCount?: number
  reviewDueToday?: number
  completedFlashcardSessions?: number
  flashcardSessionsCompleted?: number
  completedQuizSessions?: number
  quizSessionsCompleted?: number
  completedTypingSessions?: number
  typingSessionsCompleted?: number
  currentStreak?: number
  quizAccuracy?: number
}

export type LearningStatusStats = {
  newWordsCount?: number
  newCount?: number
  learningCount?: number
  reviewingCount?: number
  masteredCount?: number
  completedFlashcardSessions?: number
  completedQuizSessions?: number
  completedTypingSessions?: number
}

export type ReviewDueItem = {
  id?: string | number
  collectionId?: string | number
  collectionName?: string
  title?: string
  wordsDue?: number
  dueCount?: number
  dueAt?: string
  status?: string
}

export type RecentActivityItem = {
  id?: string | number
  type?: string
  title?: string
  message?: string
  description?: string
  createdAt?: string
  date?: string
  status?: string
  collectionName?: string
  wordsReviewed?: number
}

export type DashboardReviewDueResponse = ReviewDueItem[] | {
  items?: ReviewDueItem[]
  reviewDue?: ReviewDueItem[]
  dueCollections?: ReviewDueItem[]
}

export type DashboardRecentActivityResponse = RecentActivityItem[] | {
  items?: RecentActivityItem[]
  recentActivity?: RecentActivityItem[]
  reviewHistory?: RecentActivityItem[]
  notifications?: RecentActivityItem[]
}
