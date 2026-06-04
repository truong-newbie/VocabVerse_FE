export function getQuizSessionId(session) {
  return session?.sessionId || session?.id || null
}

export function normalizeQuizQuestions(payload) {
  if (Array.isArray(payload)) return payload
  return payload?.items || payload?.content || payload?.questions || payload?.data || []
}

export function getQuizQuestionId(question) {
  return question?.questionId || question?.id || question?.vocabularyId
}

export function getQuizQuestionType(question) {
  return question?.questionType || question?.type || 'TERM_TO_MEANING'
}

export function formatQuestionType(type) {
  if (type === 'MEANING_TO_TERM') return 'Meaning to term'
  return 'Term to meaning'
}

export function getQuizQuestionText(question) {
  if (question?.questionText) return question.questionText
  if (question?.prompt) return question.prompt
  if (getQuizQuestionType(question) === 'MEANING_TO_TERM') {
    return `Which term means "${question?.meaning || question?.vietnameseMeaning || 'this meaning'}"?`
  }
  return `What does "${question?.term || 'this term'}" mean?`
}

export function normalizeQuizOptions(question) {
  const rawOptions = question?.options || question?.choices || []

  return rawOptions.map((option, index) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        id: String(option),
        value: option,
        label: String(option),
      }
    }

    const value = option?.value ?? option?.id ?? option?.optionId ?? option?.text ?? option?.label ?? option?.term ?? option?.meaning ?? index
    const label = option?.label ?? option?.text ?? option?.term ?? option?.meaning ?? String(value)

    return {
      ...option,
      id: option?.id ?? option?.optionId ?? value,
      value,
      label,
    }
  })
}

export function normalizeAnswerValue(value) {
  if (value === undefined || value === null) return ''
  return String(value)
}

export function getFeedbackCorrectAnswer(feedback, question) {
  return (
    feedback?.correctAnswer ??
    feedback?.correctOptionId ??
    feedback?.correctAnswerId ??
    question?.correctAnswer ??
    question?.correctOptionId ??
    question?.correctAnswerId ??
    ''
  )
}

export function isCorrectAnswer(feedback, selectedAnswer, question) {
  if (typeof feedback?.isCorrect === 'boolean') return feedback.isCorrect
  if (typeof feedback?.correct === 'boolean') return feedback.correct

  const correctAnswer = getFeedbackCorrectAnswer(feedback, question)
  if (correctAnswer === '') return false

  return normalizeAnswerValue(selectedAnswer) === normalizeAnswerValue(correctAnswer)
}

export function getSessionTotalQuestions(session, questions) {
  return Number(session?.totalQuestions ?? questions.length ?? 0)
}
