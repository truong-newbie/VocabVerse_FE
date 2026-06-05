import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const AI_VOCABULARY_BASE = '/ai/vocabulary'

/**
 * @typedef {import('@/types/ai').NormalizeVocabularyResult} NormalizeVocabularyResult
 */

export const aiService = {
  /** @param {string | { rawText: string, groqApiKey?: string }} input @returns {Promise<NormalizeVocabularyResult>} */
  async normalizeVocabulary(input) {
    const payload = typeof input === 'string' ? { rawText: input } : input
    const response = await apiClient.post(`${AI_VOCABULARY_BASE}/normalize`, {
      rawText: payload.rawText,
      ...(payload.groqApiKey ? { groqApiKey: payload.groqApiKey } : {}),
    })
    return unwrapApiResponse(response)
  },
}
