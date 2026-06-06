import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const AI_VOCABULARY_BASE = '/ai/vocabulary'

/**
 * @typedef {import('@/types/ai').NormalizeVocabularyResult} NormalizeVocabularyResult
 * @typedef {import('@/types/ai').NormalizeBulkVocabularyRequest} NormalizeBulkVocabularyRequest
 * @typedef {import('@/types/ai').NormalizeBulkVocabularyResult} NormalizeBulkVocabularyResult
 */

export const aiService = {
  /** @param {string | { rawText: string }} input @returns {Promise<NormalizeVocabularyResult>} */
  async normalizeVocabulary(input) {
    const payload = typeof input === 'string' ? { rawText: input } : input
    const response = await apiClient.post(`${AI_VOCABULARY_BASE}/normalize`, { rawText: payload.rawText })
    const data = unwrapApiResponse(response)
    const wrapper = response.data || {}

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return {
        ...data,
        _meta: {
          remainingUses: wrapper.remainingUses ?? wrapper.remaining ?? wrapper.quotaRemaining ?? data.remainingUses ?? data.remaining ?? data.quotaRemaining,
          dailyLimit: wrapper.dailyLimit ?? wrapper.limit ?? data.dailyLimit ?? data.limit,
        },
      }
    }

    return data
  },

  /** @param {NormalizeBulkVocabularyRequest} payload @returns {Promise<NormalizeBulkVocabularyResult>} */
  async normalizeBulkVocabulary(payload) {
    const userApiKey = payload.userApiKey || payload.groqApiKey
    const response = await apiClient.post(`${AI_VOCABULARY_BASE}/normalize-bulk`, {
      rawText: payload.rawText,
      provider: payload.provider || 'GROQ',
      ...(userApiKey ? { userApiKey } : {}),
    })
    return unwrapApiResponse(response)
  },
}
