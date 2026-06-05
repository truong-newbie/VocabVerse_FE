import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const AUTH_BASE = '/auth'

export const authService = {
  async login(credentials) {
    const response = await apiClient.post(`${AUTH_BASE}/login`, credentials)
    return unwrapApiResponse(response)
  },

  async register(payload) {
    const response = await apiClient.post(`${AUTH_BASE}/register`, payload)
    return unwrapApiResponse(response)
  },

  async refreshToken(refreshToken) {
    const response = await apiClient.post(`${AUTH_BASE}/refresh`, { refreshToken })
    return unwrapApiResponse(response)
  },

  async getCurrentUser() {
    const response = await apiClient.get('/users/me')
    return unwrapApiResponse(response)
  },

  async logout(refreshToken) {
    const response = await apiClient.post(`${AUTH_BASE}/logout`, refreshToken ? { refreshToken } : undefined)
    return unwrapApiResponse(response)
  },
}
