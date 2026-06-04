export type RoleplayTopic = 'Job Interview' | 'Travel' | 'Daily Conversation' | 'Business Meeting' | 'Restaurant' | 'IELTS Speaking' | string

export type RoleplayDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | string

export type RoleplayPersona = 'Teacher' | 'Interviewer' | 'Friend' | 'Customer' | 'Manager' | string

export type RoleplayRole = 'USER' | 'AI' | 'ASSISTANT' | 'SYSTEM' | string

export type RoleplayCorrection = {
  original?: string
  originalSentence?: string
  corrected?: string
  correctedSentence?: string
  explanation?: string
  betterExpression?: string
  suggestion?: string
}

export type RoleplayMessage = {
  id?: string | number
  messageId?: string | number
  role?: RoleplayRole
  sender?: RoleplayRole
  content?: string
  message?: string
  text?: string
  correction?: RoleplayCorrection
  corrections?: RoleplayCorrection[]
  createdAt?: string
  timestamp?: string
}

export type RoleplayReport = {
  summary?: string
  strengths?: string[] | string
  weaknesses?: string[] | string
  suggestedVocabulary?: string[] | string
  vocabulary?: string[] | string
  grammarFeedback?: string[] | string
  grammar?: string[] | string
  overallScore?: number
  score?: number
  fluencyScore?: number
  grammarScore?: number
  vocabularyScore?: number
  recommendations?: string[] | string
  mistakes?: string[] | string
}

export type RoleplaySession = {
  id?: string | number
  sessionId?: string | number
  topic?: RoleplayTopic
  difficulty?: RoleplayDifficulty
  persona?: RoleplayPersona
  scenario?: string
  scenarioDescription?: string
  status?: 'ACTIVE' | 'ENDED' | 'COMPLETED' | string
  messages?: RoleplayMessage[]
  conversation?: RoleplayMessage[]
  report?: RoleplayReport
  summary?: string
  score?: number
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  endedAt?: string
}

export type RoleplaySessionListResponse = RoleplaySession[] | {
  content?: RoleplaySession[]
  items?: RoleplaySession[]
  data?: RoleplaySession[]
  sessions?: RoleplaySession[]
  totalElements?: number
  totalItems?: number
  total?: number
  totalPages?: number
  page?: number
  number?: number
  size?: number
}

export type CreateRoleplaySessionRequest = {
  topic: RoleplayTopic
  difficulty: RoleplayDifficulty
  persona: RoleplayPersona
}

export type SendRoleplayMessageRequest = {
  message: string
}

export type SendRoleplayMessageResponse = RoleplayMessage | {
  userMessage?: RoleplayMessage
  aiMessage?: RoleplayMessage
  message?: RoleplayMessage | string
  session?: RoleplaySession
}

export type EndRoleplaySessionResponse = RoleplaySession | {
  session?: RoleplaySession
  report?: RoleplayReport
}

export type RoleplaySessionQueryParams = {
  page?: number
  size?: number
}
