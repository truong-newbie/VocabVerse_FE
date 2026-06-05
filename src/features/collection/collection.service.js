import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const COLLECTIONS_BASE = '/collections'

/**
 * @typedef {import('@/types/collection').Collection} Collection
 * @typedef {import('@/types/collection').CollectionListResponse} CollectionListResponse
 * @typedef {import('@/types/collection').CollectionQueryParams} CollectionQueryParams
 * @typedef {import('@/types/collection').CreateCollectionRequest} CreateCollectionRequest
 * @typedef {import('@/types/collection').UpdateCollectionRequest} UpdateCollectionRequest
 */

export const collectionService = {
  /** @param {CollectionQueryParams} params @returns {Promise<CollectionListResponse>} */
  async getCollections(params = {}) {
    const response = await apiClient.get(COLLECTIONS_BASE, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  /** @param {string | number} id @returns {Promise<Collection>} */
  async getCollectionById(id) {
    const response = await apiClient.get(`${COLLECTIONS_BASE}/${id}`)
    return unwrapApiResponse(response)
  },

  /** @param {CreateCollectionRequest} payload @returns {Promise<Collection>} */
  async createCollection(payload) {
    const response = await apiClient.post(COLLECTIONS_BASE, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} id @param {UpdateCollectionRequest} payload @returns {Promise<Collection>} */
  async updateCollection(id, payload) {
    const response = await apiClient.put(`${COLLECTIONS_BASE}/${id}`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} id @returns {Promise<void>} */
  async deleteCollection(id) {
    const response = await apiClient.delete(`${COLLECTIONS_BASE}/${id}`)
    return unwrapApiResponse(response)
  },
}
