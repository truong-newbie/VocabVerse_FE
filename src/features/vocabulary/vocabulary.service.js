import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const VOCABULARIES_BASE = '/vocabularies'
const COLLECTIONS_BASE = '/collections'

/**
 * @typedef {import('@/types/vocabulary').Vocabulary} Vocabulary
 * @typedef {import('@/types/vocabulary').VocabularyListResponse} VocabularyListResponse
 * @typedef {import('@/types/vocabulary').VocabularyQueryParams} VocabularyQueryParams
 * @typedef {import('@/types/vocabulary').CreateVocabularyRequest} CreateVocabularyRequest
 * @typedef {import('@/types/vocabulary').UpdateVocabularyRequest} UpdateVocabularyRequest
 */

export const vocabularyService = {
  /** @param {VocabularyQueryParams} params @returns {Promise<VocabularyListResponse>} */
  async getVocabularies(params = {}) {
    const response = await apiClient.get(VOCABULARIES_BASE, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  /** @param {string | number} id @returns {Promise<Vocabulary>} */
  async getVocabularyById(id) {
    const response = await apiClient.get(`${VOCABULARIES_BASE}/${id}`)
    return unwrapApiResponse(response)
  },

  /** @param {CreateVocabularyRequest} payload @returns {Promise<Vocabulary>} */
  async createVocabulary(payload) {
    const response = await apiClient.post(VOCABULARIES_BASE, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} id @param {UpdateVocabularyRequest} payload @returns {Promise<Vocabulary>} */
  async updateVocabulary(id, payload) {
    const response = await apiClient.put(`${VOCABULARIES_BASE}/${id}`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} id @returns {Promise<void>} */
  async deleteVocabulary(id) {
    const response = await apiClient.delete(`${VOCABULARIES_BASE}/${id}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @param {string | number} vocabularyId @returns {Promise<void>} */
  async addVocabularyToCollection(collectionId, vocabularyId) {
    const response = await apiClient.post(`${COLLECTIONS_BASE}/${collectionId}/vocabularies/${vocabularyId}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @param {string | number} vocabularyId @returns {Promise<void>} */
  async removeVocabularyFromCollection(collectionId, vocabularyId) {
    const response = await apiClient.delete(`${COLLECTIONS_BASE}/${collectionId}/vocabularies/${vocabularyId}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @param {VocabularyQueryParams} params @returns {Promise<VocabularyListResponse>} */
  async getCollectionVocabularies(collectionId, params = {}) {
    const response = await apiClient.get(`${COLLECTIONS_BASE}/${collectionId}/vocabularies`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },
}
