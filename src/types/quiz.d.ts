export type QuizSessionSource = 'ALL' | 'COLLECTION' | 'REVIEW_DUE'

export type QuizQuestionType = 'TERM_TO_MEANING' | 'MEANING_TO_TERM'

export type CreateQuizSessionRequest = {
  source: QuizSessionSource
  collectionId?: string | number
  questionType?: QuizQuestionType
}

export type QuizSession = {
  id?: string | number
  sessionId?: string | number
  source?: QuizSessionSource
  collectionId?: string | number
  questionType?: QuizQuestionType
  totalQuestions?: number
  answeredQuestions?: number
  correctCount?: number
  wrongCount?: number
  score?: number
  status?: 'ACTIVE' | 'COMPLETED' | string
  createdAt?: string
  completedAt?: string
}

export type QuizOption = {
  id?: string | number
  optionId?: string | number
  value?: string | number
  label?: string
  text?: string
  term?: string
  meaning?: string
}

export type QuizQuestion = {
  id?: string | number
  questionId?: string | number
  vocabularyId?: string | number
  questionText?: string
  prompt?: string
  term?: string
  meaning?: string
  vietnameseMeaning?: string
  questionType?: QuizQuestionType
  type?: QuizQuestionType
  options?: Array<QuizOption | string | number>
  choices?: Array<QuizOption | string | number>
  correctAnswer?: string | number
  correctAnswerId?: string | number
  correctOptionId?: string | number
  explanation?: string
}

export type QuizQuestionsResponse = QuizQuestion[] | {
  items?: QuizQuestion[]
  content?: QuizQuestion[]
  questions?: QuizQuestion[]
  data?: QuizQuestion[]
  total?: number
}

export type SubmitQuizAnswerRequest = {
  answer: string | number
}

export type SubmitQuizAnswerResponse = {
  questionId?: string | number
  selectedAnswer?: string | number
  answer?: string | number
  correctAnswer?: string | number
  correctAnswerId?: string | number
  correctOptionId?: string | number
  isCorrect?: boolean
  correct?: boolean
  explanation?: string
  score?: number
  correctCount?: number
  wrongCount?: number
}
