import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const PUBLIC_COLLECTIONS_BASE = '/public/collections'

/**
 * @typedef {import('@/types/publicCollection').PublicCollection} PublicCollection
 * @typedef {import('@/types/publicCollection').PublicCollectionListResponse} PublicCollectionListResponse
 * @typedef {import('@/types/publicCollection').PublicCollectionQueryParams} PublicCollectionQueryParams
 * @typedef {import('@/types/publicCollection').PublicCollectionVocabularyListResponse} PublicCollectionVocabularyListResponse
 * @typedef {import('@/types/publicCollection').ClonePublicCollectionResponse} ClonePublicCollectionResponse
 */

export const publicCollectionService = {
  /** @param {PublicCollectionQueryParams} params @returns {Promise<PublicCollectionListResponse>} */
  async getPublicCollections(params = {}) {
    const response = await apiClient.get(PUBLIC_COLLECTIONS_BASE, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @returns {Promise<PublicCollection>} */
  async getPublicCollectionById(collectionId) {
    const response = await apiClient.get(`${PUBLIC_COLLECTIONS_BASE}/${collectionId}`)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @param {PublicCollectionQueryParams} params @returns {Promise<PublicCollectionVocabularyListResponse>} */
  async getPublicCollectionVocabularies(collectionId, params = {}) {
    const response = await apiClient.get(`${PUBLIC_COLLECTIONS_BASE}/${collectionId}/vocabularies`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  /** @param {string | number} collectionId @returns {Promise<ClonePublicCollectionResponse>} */
  async clonePublicCollection(collectionId) {
    const response = await apiClient.post(`${PUBLIC_COLLECTIONS_BASE}/${collectionId}/clone`)
    return unwrapApiResponse(response)
  },
}
