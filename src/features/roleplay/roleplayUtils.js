export const ROLEPLAY_PAGE_SIZE = 10

export const roleplayTopics = ['Job Interview', 'Travel', 'Daily Conversation', 'Business Meeting', 'Restaurant', 'IELTS Speaking']
export const roleplayDifficulties = ['Beginner', 'Intermediate', 'Advanced']
export const roleplayPersonas = ['Teacher', 'Interviewer', 'Friend', 'Customer', 'Manager']

export function normalizeRoleplaySessionList(payload, fallbackSize = ROLEPLAY_PAGE_SIZE) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      totalItems: payload.length,
      totalPages: 1,
      page: 0,
      size: payload.length || fallbackSize,
    }
  }

  const items = payload?.content || payload?.items || payload?.data || payload?.sessions || []
  const totalItems = Number(payload?.totalElements ?? payload?.totalItems ?? payload?.total ?? items.length)
  const size = Number(payload?.size ?? fallbackSize)
  return {
    items,
    totalItems,
    totalPages: Number(payload?.totalPages ?? Math.max(1, Math.ceil(totalItems / size))),
    page: Number(payload?.number ?? payload?.page ?? 0),
    size,
  }
}

export function getRoleplaySessionId(session) {
  return session?.sessionId || session?.id
}

export function getScenarioDescription(values) {
  const topic = values?.topic || 'Daily Conversation'
  const difficulty = values?.difficulty || 'Beginner'
  const persona = values?.persona || 'Teacher'
  return `Practice a ${difficulty.toLowerCase()} ${topic.toLowerCase()} conversation with an AI ${persona.toLowerCase()}. Focus on clear replies, natural phrasing, and learning from corrections.`
}

export function normalizeRoleplayMessages(session) {
  return session?.messages || session?.conversation || []
}

export function getMessageId(message, index) {
  return message?.messageId || message?.id || `${getMessageRole(message)}-${index}`
}

export function getMessageRole(message) {
  const role = String(message?.role || message?.sender || 'AI').toUpperCase()
  if (role === 'ASSISTANT') return 'AI'
  return role
}

export function isUserMessage(message) {
  return getMessageRole(message) === 'USER'
}

export function getMessageText(message) {
  if (typeof message === 'string') return message
  return message?.content || message?.message || message?.text || ''
}

export function getMessageCorrections(message) {
  if (Array.isArray(message?.corrections)) return message.corrections
  if (message?.correction) return [message.correction]
  return []
}

export function formatRoleplayDate(value) {
  if (!value) return 'No date yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No date yet'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

export function getSessionReport(sessionOrResponse) {
  return sessionOrResponse?.report || sessionOrResponse?.session?.report || sessionOrResponse
}

export function normalizeStringList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  if (typeof value === 'string') return value.split('\n').flatMap((line) => line.split(',')).map((item) => item.trim()).filter(Boolean)
  return []
}

export function getReportScore(report, session) {
  return Number(report?.overallScore ?? report?.score ?? session?.score ?? 0)
}

export function getDifficultyTone(difficulty) {
  if (difficulty === 'Advanced' || difficulty === 'Hard') return 'destructive'
  if (difficulty === 'Intermediate' || difficulty === 'Medium') return 'warning'
  return 'success'
}

export function extractMessagesFromSendResponse(response, fallbackUserMessage) {
  if (response?.session) return normalizeRoleplayMessages(response.session)
  const messages = []
  if (response?.userMessage) messages.push(response.userMessage)
  else if (fallbackUserMessage) messages.push({ role: 'USER', content: fallbackUserMessage, createdAt: new Date().toISOString() })
  if (response?.aiMessage) messages.push(response.aiMessage)
  else if (response?.message) {
    messages.push(typeof response.message === 'string' ? { role: 'AI', content: response.message, createdAt: new Date().toISOString() } : response.message)
  } else if (getMessageText(response)) {
    messages.push({ ...response, role: response?.role || 'AI' })
  }
  return messages
}
