import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const ADMIN_BASE = '/admin'

export const adminService = {
  async getDashboardStats() {
    const response = await apiClient.get(`${ADMIN_BASE}/dashboard`)
    return unwrapApiResponse(response)
  },

  async getUsers(params = {}) {
    const response = await apiClient.get(`${ADMIN_BASE}/users`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        search: params.search || undefined,
      },
    })
    return unwrapApiResponse(response)
  },

  async updateUserRole(userId, role) {
    const response = await apiClient.patch(`${ADMIN_BASE}/users/${userId}/role`, { role })
    return unwrapApiResponse(response)
  },

  async updateUserStatus(userId, status) {
    const response = await apiClient.patch(`${ADMIN_BASE}/users/${userId}/status`, { status })
    return unwrapApiResponse(response)
  },

  async getCollections(params = {}) {
    const response = await apiClient.get(`${ADMIN_BASE}/collections`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        visibility: params.visibility && params.visibility !== 'ALL' ? params.visibility : undefined,
      },
    })
    return unwrapApiResponse(response)
  },

  async deleteCollection(collectionId) {
    const response = await apiClient.delete(`${ADMIN_BASE}/collections/${collectionId}`)
    return unwrapApiResponse(response)
  },

  async moderateCollection(collectionId, payload) {
    const response = await apiClient.post(`${ADMIN_BASE}/collections/${collectionId}/moderate`, payload)
    return unwrapApiResponse(response)
  },

  async getPublicCollections(params = {}) {
    const response = await apiClient.get(`${ADMIN_BASE}/public-collections`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  async getPublicCollectionVocabulary(collectionId, params = {}) {
    const response = await apiClient.get(`${ADMIN_BASE}/public-collections/${collectionId}/vocabularies`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 5,
      },
    })
    return unwrapApiResponse(response)
  },

  async hidePublicCollection(collectionId, reason) {
    const response = await apiClient.post(`${ADMIN_BASE}/public-collections/${collectionId}/hide`, { reason })
    return unwrapApiResponse(response)
  },

  async getShadowingLessons(params = {}) {
    const response = await apiClient.get(`${ADMIN_BASE}/shadowing/lessons`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  async uploadShadowingLesson(payload) {
    const formData = new FormData()
    formData.append('file', payload.file)
    if (payload.title) formData.append('title', payload.title)
    if (payload.description) formData.append('description', payload.description)

    const response = await apiClient.post(`${ADMIN_BASE}/shadowing/lessons/upload`, formData)
    return unwrapApiResponse(response)
  },

  async getShadowingSubtitles(lessonId) {
    const response = await apiClient.get(`${ADMIN_BASE}/shadowing/lessons/${lessonId}/subtitles`)
    return unwrapApiResponse(response)
  },

  async createShadowingSubtitle(lessonId, payload) {
    const response = await apiClient.post(`${ADMIN_BASE}/shadowing/lessons/${lessonId}/subtitles`, payload)
    return unwrapApiResponse(response)
  },

  async updateShadowingSubtitle(lessonId, subtitleId, payload) {
    const response = await apiClient.put(`${ADMIN_BASE}/shadowing/lessons/${lessonId}/subtitles/${subtitleId}`, payload)
    return unwrapApiResponse(response)
  },

  async deleteShadowingSubtitle(lessonId, subtitleId) {
    const response = await apiClient.delete(`${ADMIN_BASE}/shadowing/lessons/${lessonId}/subtitles/${subtitleId}`)
    return unwrapApiResponse(response)
  },

  async importShadowingSubtitles(lessonId, payload) {
    const response = await apiClient.post(`${ADMIN_BASE}/shadowing/lessons/${lessonId}/subtitles/import`, payload)
    return unwrapApiResponse(response)
  },

  async generateAiShadowingSubtitles(lessonId) {
    const response = await apiClient.post(`${ADMIN_BASE}/shadowing/lessons/${lessonId}/subtitles/generate-ai`)
    return unwrapApiResponse(response)
  },

  async getShadowingProcessingStatus(lessonId) {
    const response = await apiClient.get(`${ADMIN_BASE}/shadowing/lessons/${lessonId}/status`)
    return unwrapApiResponse(response)
  },

  async getNotifications(params = {}) {
    const response = await apiClient.get(`${ADMIN_BASE}/notifications`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  async getSystemHealth() {
    const response = await apiClient.get(`${ADMIN_BASE}/system/health`)
    return unwrapApiResponse(response)
  },
}
