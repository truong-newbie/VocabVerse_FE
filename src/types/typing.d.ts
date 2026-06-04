export type TypingSessionSource = 'ALL' | 'COLLECTION' | 'REVIEW_DUE'

export type CreateTypingSessionRequest = {
  source: TypingSessionSource
  collectionId?: string | number
}

export type TypingSession = {
  id?: string | number
  sessionId?: string | number
  source?: TypingSessionSource
  collectionId?: string | number
  totalQuestions?: number
  answeredQuestions?: number
  correctCount?: number
  wrongCount?: number
  score?: number
  status?: 'ACTIVE' | 'COMPLETED' | string
  createdAt?: string
  completedAt?: string
}

export type TypingQuestion = {
  id?: string | number
  questionId?: string | number
  vocabularyId?: string | number
  promptText?: string
  prompt?: string
  questionText?: string
  term?: string
  word?: string
  meaning?: string
  vietnameseMeaning?: string
  hint?: string
  correctAnswer?: string
  expectedAnswer?: string
  answer?: string
}

export type TypingQuestionsResponse = TypingQuestion[] | {
  items?: TypingQuestion[]
  content?: TypingQuestion[]
  questions?: TypingQuestion[]
  data?: TypingQuestion[]
  total?: number
}

export type SubmitTypingAnswerRequest = {
  answer: string
}

export type SubmitTypingAnswerResponse = {
  questionId?: string | number
  userAnswer?: string
  selectedAnswer?: string
  answer?: string
  correctAnswer?: string
  expectedAnswer?: string
  isCorrect?: boolean
  correct?: boolean
  similarityScore?: number
  similarity?: number
  score?: number
  correctCount?: number
  wrongCount?: number
  explanation?: string
}
