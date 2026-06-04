import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return unwrapApiResponse(response)
  },

  async register(payload) {
    const response = await apiClient.post('/auth/register', payload)
    return unwrapApiResponse(response)
  },

  async getCurrentUser() {
    const response = await apiClient.get('/user')
    return unwrapApiResponse(response)
  },

  async logout() {
    return apiClient.post('/auth/logout')
  },
}
