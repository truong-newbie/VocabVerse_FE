import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const SHADOWING_BASE = '/api/v1/shadowing/lessons'
const ADMIN_SHADOWING_BASE = '/api/v1/admin/shadowing/lessons'

/**
 * @typedef {import('@/types/shadowing').ShadowingLesson} ShadowingLesson
 * @typedef {import('@/types/shadowing').ShadowingLessonListResponse} ShadowingLessonListResponse
 * @typedef {import('@/types/shadowing').ShadowingLessonQueryParams} ShadowingLessonQueryParams
 * @typedef {import('@/types/shadowing').UploadShadowingLessonRequest} UploadShadowingLessonRequest
 * @typedef {import('@/types/shadowing').CreateYoutubeShadowingLessonRequest} CreateYoutubeShadowingLessonRequest
 * @typedef {import('@/types/shadowing').ShadowingProcessingStatus} ShadowingProcessingStatus
 */

export const shadowingService = {
  /** @param {ShadowingLessonQueryParams} params @returns {Promise<ShadowingLessonListResponse>} */
  async getShadowingLessons(params = {}) {
    const response = await apiClient.get(SHADOWING_BASE, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  /** @param {string | number} lessonId @returns {Promise<ShadowingLesson>} */
  async getShadowingLessonById(lessonId) {
    const response = await apiClient.get(`${SHADOWING_BASE}/${lessonId}`)
    return unwrapApiResponse(response)
  },

  /** @param {UploadShadowingLessonRequest} payload @returns {Promise<ShadowingLesson>} */
  async uploadShadowingLesson(payload) {
    const formData = new FormData()
    formData.append('file', payload.file)
    if (payload.title) formData.append('title', payload.title)
    if (payload.description) formData.append('description', payload.description)

    const response = await apiClient.post(`${ADMIN_SHADOWING_BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return unwrapApiResponse(response)
  },

  /** @param {CreateYoutubeShadowingLessonRequest} payload @returns {Promise<ShadowingLesson>} */
  async createYoutubeShadowingLesson(payload) {
    const response = await apiClient.post(`${ADMIN_SHADOWING_BASE}/youtube`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} lessonId @returns {Promise<ShadowingProcessingStatus>} */
  async getShadowingProcessingStatus(lessonId) {
    const response = await apiClient.get(`${ADMIN_SHADOWING_BASE}/${lessonId}/status`)
    return unwrapApiResponse(response)
  },
}
