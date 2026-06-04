export function getTypingSessionId(session) {
  return session?.sessionId || session?.id || null
}

export function normalizeTypingQuestions(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.items || payload?.content || payload?.questions || payload?.data || []
}

export function getTypingQuestionId(question) {
  return question?.questionId || question?.id || question?.vocabularyId
}

export function getTypingPromptText(question) {
  return question?.promptText || question?.prompt || question?.questionText || question?.meaning || question?.vietnameseMeaning || 'Type the correct English answer.'
}

export function getTypingHint(question) {
  return question?.hint || ''
}

export function normalizeTypingAnswer(value) {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

export function getTypingCorrectAnswer(feedback, question) {
  return (
    feedback?.correctAnswer ??
    feedback?.expectedAnswer ??
    question?.correctAnswer ??
    question?.expectedAnswer ??
    question?.answer ??
    question?.term ??
    question?.word ??
    ''
  )
}

export function getTypingUserAnswer(feedback) {
  return feedback?.userAnswer ?? feedback?.selectedAnswer ?? feedback?.answer ?? ''
}

export function isTypingAnswerCorrect(feedback, question) {
  if (typeof feedback?.isCorrect === 'boolean') return feedback.isCorrect
  if (typeof feedback?.correct === 'boolean') return feedback.correct

  const userAnswer = normalizeTypingAnswer(getTypingUserAnswer(feedback)).toLowerCase()
  const correctAnswer = normalizeTypingAnswer(getTypingCorrectAnswer(feedback, question)).toLowerCase()
  return Boolean(userAnswer && correctAnswer && userAnswer === correctAnswer)
}

export function getTypingSimilarityScore(feedback) {
  const rawScore = feedback?.similarityScore ?? feedback?.similarity
  if (rawScore === undefined || rawScore === null || Number.isNaN(Number(rawScore))) return null
  const score = Number(rawScore)
  return score <= 1 ? Math.round(score * 100) : Math.round(score)
}

export function getTypingSessionTotalQuestions(session, questions) {
  return Number(session?.totalQuestions ?? questions.length ?? 0)
}
