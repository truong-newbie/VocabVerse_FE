import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const FLASHCARDS_BASE = '/flashcards'

/**
 * @typedef {import('@/types/flashcard').CreateFlashcardSessionRequest} CreateFlashcardSessionRequest
 * @typedef {import('@/types/flashcard').FlashcardSession} FlashcardSession
 * @typedef {import('@/types/flashcard').FlashcardCardsResponse} FlashcardCardsResponse
 * @typedef {import('@/types/flashcard').SubmitFlashcardAnswerRequest} SubmitFlashcardAnswerRequest
 * @typedef {import('@/types/flashcard').SubmitFlashcardAnswerResponse} SubmitFlashcardAnswerResponse
 */

export const flashcardService = {
  /** @param {CreateFlashcardSessionRequest} payload @returns {Promise<FlashcardSession>} */
  async createFlashcardSession(payload) {
    const response = await apiClient.post(`${FLASHCARDS_BASE}/sessions`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<FlashcardSession>} */
  async getFlashcardSession(sessionId) {
    const response = await apiClient.get(`${FLASHCARDS_BASE}/sessions/${sessionId}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<FlashcardCardsResponse>} */
  async getFlashcardCards(sessionId) {
    const response = await apiClient.get(`${FLASHCARDS_BASE}/sessions/${sessionId}/cards`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @param {string | number} vocabularyId @param {SubmitFlashcardAnswerRequest} payload @returns {Promise<SubmitFlashcardAnswerResponse>} */
  async submitFlashcardAnswer(sessionId, vocabularyId, payload) {
    const response = await apiClient.post(`${FLASHCARDS_BASE}/sessions/${sessionId}/cards/${vocabularyId}/answer`, payload)
    return unwrapApiResponse(response)
  },
}
