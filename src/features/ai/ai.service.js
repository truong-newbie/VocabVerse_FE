import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const AI_VOCABULARY_BASE = '/api/v1/ai/vocabulary'

/**
 * @typedef {import('@/types/ai').NormalizeVocabularyResult} NormalizeVocabularyResult
 */

export const aiService = {
  /** @param {string} rawText @returns {Promise<NormalizeVocabularyResult>} */
  async normalizeVocabulary(rawText) {
    const response = await apiClient.post(`${AI_VOCABULARY_BASE}/normalize`, { rawText })
    return unwrapApiResponse(response)
  },
}
