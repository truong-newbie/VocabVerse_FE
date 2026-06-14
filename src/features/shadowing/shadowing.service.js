import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const SHADOWING_BASE = '/shadowing/lessons'

/**
 * @typedef {import('@/types/shadowing').ShadowingLesson} ShadowingLesson
 * @typedef {import('@/types/shadowing').ShadowingLessonListResponse} ShadowingLessonListResponse
 * @typedef {import('@/types/shadowing').ShadowingLessonQueryParams} ShadowingLessonQueryParams
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
}
