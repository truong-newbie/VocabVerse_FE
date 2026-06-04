import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const TYPING_BASE = '/api/v1/typing'

/**
 * @typedef {import('@/types/typing').CreateTypingSessionRequest} CreateTypingSessionRequest
 * @typedef {import('@/types/typing').TypingSession} TypingSession
 * @typedef {import('@/types/typing').TypingQuestionsResponse} TypingQuestionsResponse
 * @typedef {import('@/types/typing').SubmitTypingAnswerRequest} SubmitTypingAnswerRequest
 * @typedef {import('@/types/typing').SubmitTypingAnswerResponse} SubmitTypingAnswerResponse
 */

export const typingService = {
  /** @param {CreateTypingSessionRequest} payload @returns {Promise<TypingSession>} */
  async createTypingSession(payload) {
    const response = await apiClient.post(`${TYPING_BASE}/sessions`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<TypingSession>} */
  async getTypingSession(sessionId) {
    const response = await apiClient.get(`${TYPING_BASE}/sessions/${sessionId}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<TypingQuestionsResponse>} */
  async getTypingQuestions(sessionId) {
    const response = await apiClient.get(`${TYPING_BASE}/sessions/${sessionId}/questions`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @param {string | number} questionId @param {SubmitTypingAnswerRequest} payload @returns {Promise<SubmitTypingAnswerResponse>} */
  async submitTypingAnswer(sessionId, questionId, payload) {
    const response = await apiClient.post(`${TYPING_BASE}/sessions/${sessionId}/questions/${questionId}/answer`, payload)
    return unwrapApiResponse(response)
  },
}
