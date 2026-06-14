import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const REVIEWS_BASE = '/reviews'
const LEARNING_PROGRESS_BASE = '/learning/progress'
const COLLECTIONS_BASE = '/collections'

/**
 * @typedef {import('@/types/review').TodayReviewsResponse} TodayReviewsResponse
 * @typedef {import('@/types/review').ReviewStatsResponse} ReviewStatsResponse
 * @typedef {import('@/types/review').SubmitReviewRequest} SubmitReviewRequest
 * @typedef {import('@/types/review').ReviewHistoryResponse} ReviewHistoryResponse
 * @typedef {import('@/types/review').LearningProgress} LearningProgress
 * @typedef {import('@/types/review').VocabularyProgress} VocabularyProgress
 * @typedef {import('@/types/review').CollectionReviewSettings} CollectionReviewSettings
 * @typedef {import('@/types/review').UpdateCollectionReviewSettingsRequest} UpdateCollectionReviewSettingsRequest
 */

export const reviewService = {
  /** @returns {Promise<TodayReviewsResponse>} */
  async getTodayReviews() {
    const response = await apiClient.get(`${REVIEWS_BASE}/today`)
    return unwrapApiResponse(response)
  },

  /** @returns {Promise<ReviewStatsResponse>} */
  async getReviewStats() {
    const response = await apiClient.get(`${REVIEWS_BASE}/stats`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} vocabularyId @param {SubmitReviewRequest} payload @returns {Promise<VocabularyProgress>} */
  async submitReviewResult(vocabularyId, payload) {
    const response = await apiClient.post(`${REVIEWS_BASE}/${vocabularyId}`, payload)
    return unwrapApiResponse(response)
  },

  /** @returns {Promise<ReviewHistoryResponse>} */
  async getReviewHistory() {
    const response = await apiClient.get(`${REVIEWS_BASE}/history`)
    return unwrapApiResponse(response)
  },

  /** @returns {Promise<LearningProgress>} */
  async getLearningProgress() {
    const response = await apiClient.get(LEARNING_PROGRESS_BASE)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} vocabularyId @returns {Promise<VocabularyProgress>} */
  async getVocabularyProgress(vocabularyId) {
    const response = await apiClient.get(`${LEARNING_PROGRESS_BASE}/${vocabularyId}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @returns {Promise<CollectionReviewSettings>} */
  async getCollectionReviewSettings(collectionId) {
    const response = await apiClient.get(`${COLLECTIONS_BASE}/${collectionId}/review-settings`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @param {UpdateCollectionReviewSettingsRequest} payload @returns {Promise<CollectionReviewSettings>} */
  async updateCollectionReviewSettings(collectionId, payload) {
    const response = await apiClient.put(`${COLLECTIONS_BASE}/${collectionId}/review-settings`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @returns {Promise<CollectionReviewSettings | object>} */
  async disableCollectionReview(collectionId) {
    const response = await apiClient.post(`${COLLECTIONS_BASE}/${collectionId}/review-settings/disable`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @returns {Promise<object>} */
  async resetCollectionReviewSchedule(collectionId) {
    const response = await apiClient.post(`${COLLECTIONS_BASE}/${collectionId}/review-settings/reset`)
    return unwrapApiResponse(response)
  },
}
