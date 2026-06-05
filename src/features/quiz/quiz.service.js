import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const QUIZZES_BASE = '/quizzes'

/**
 * @typedef {import('@/types/quiz').CreateQuizSessionRequest} CreateQuizSessionRequest
 * @typedef {import('@/types/quiz').QuizSession} QuizSession
 * @typedef {import('@/types/quiz').QuizQuestionsResponse} QuizQuestionsResponse
 * @typedef {import('@/types/quiz').SubmitQuizAnswerRequest} SubmitQuizAnswerRequest
 * @typedef {import('@/types/quiz').SubmitQuizAnswerResponse} SubmitQuizAnswerResponse
 */

export const quizService = {
  /** @param {CreateQuizSessionRequest} payload @returns {Promise<QuizSession>} */
  async createQuizSession(payload) {
    const response = await apiClient.post(`${QUIZZES_BASE}/sessions`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<QuizSession>} */
  async getQuizSession(sessionId) {
    const response = await apiClient.get(`${QUIZZES_BASE}/sessions/${sessionId}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<QuizQuestionsResponse>} */
  async getQuizQuestions(sessionId) {
    const response = await apiClient.get(`${QUIZZES_BASE}/sessions/${sessionId}/questions`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @param {string | number} questionId @param {SubmitQuizAnswerRequest} payload @returns {Promise<SubmitQuizAnswerResponse>} */
  async submitQuizAnswer(sessionId, questionId, payload) {
    const response = await apiClient.post(`${QUIZZES_BASE}/sessions/${sessionId}/questions/${questionId}/answer`, payload)
    return unwrapApiResponse(response)
  },
}
