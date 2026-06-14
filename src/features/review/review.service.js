import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const REVIEWS_BASE = '/reviews'
const LEARNING_PROGRESS_BASE = '/learning/progress'
const COLLECTIONS_BASE = '/collections'
const REVIEW_SETTING_PATH = 'review-setting'
const LEGACY_REVIEW_SETTINGS_PATH = 'review-settings'

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

function shouldTryLegacyReviewSettings(error) {
  if (error?.code === 'SCHEDULER_NOT_SUPPORTED') return false
  return [404, 405, 500].includes(Number(error?.status))
}

function getReviewSettingUrl(collectionId, path = REVIEW_SETTING_PATH) {
  return `${COLLECTIONS_BASE}/${collectionId}/${path}`
}

function toLegacyReviewSettingsPayload(payload) {
  const legacyPayload = {
    ...payload,
    reviewEnabled: payload.enabled,
    emailReminderEnabled: payload.emailEnabled,
  }

  if (payload.intervals) {
    legacyPayload.reviewIntervals = payload.intervals
  }

  return legacyPayload
}

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
    try {
      const response = await apiClient.get(getReviewSettingUrl(collectionId))
      return unwrapApiResponse(response)
    } catch (error) {
      if (!shouldTryLegacyReviewSettings(error)) throw error
      const response = await apiClient.get(getReviewSettingUrl(collectionId, LEGACY_REVIEW_SETTINGS_PATH))
      return unwrapApiResponse(response)
    }
  },

  /** @param {string | number} collectionId @param {UpdateCollectionReviewSettingsRequest} payload @returns {Promise<CollectionReviewSettings>} */
  async updateCollectionReviewSettings(collectionId, payload) {
    try {
      const response = await apiClient.patch(getReviewSettingUrl(collectionId), payload)
      return unwrapApiResponse(response)
    } catch (error) {
      if (payload.schedulerType === 'FSRS') throw error
      if (!shouldTryLegacyReviewSettings(error)) throw error
      const response = await apiClient.put(getReviewSettingUrl(collectionId, LEGACY_REVIEW_SETTINGS_PATH), toLegacyReviewSettingsPayload(payload))
      return unwrapApiResponse(response)
    }
  },

  /** @param {string | number} collectionId @returns {Promise<CollectionReviewSettings | object>} */
  async disableCollectionReview(collectionId) {
    try {
      const response = await apiClient.patch(getReviewSettingUrl(collectionId), { enabled: false })
      return unwrapApiResponse(response)
    } catch (error) {
      if (!shouldTryLegacyReviewSettings(error)) throw error
      const response = await apiClient.post(`${getReviewSettingUrl(collectionId, LEGACY_REVIEW_SETTINGS_PATH)}/disable`)
      return unwrapApiResponse(response)
    }
  },

  /** @param {string | number} collectionId @returns {Promise<object>} */
  async resetCollectionReviewSchedule(collectionId) {
    try {
      const response = await apiClient.post(`${getReviewSettingUrl(collectionId)}/reset`)
      return unwrapApiResponse(response)
    } catch (error) {
      if (!shouldTryLegacyReviewSettings(error)) throw error
      const response = await apiClient.post(`${getReviewSettingUrl(collectionId, LEGACY_REVIEW_SETTINGS_PATH)}/reset`)
      return unwrapApiResponse(response)
    }
  },
}
