import { apiClient } from '../../services/apiClient'

function unwrap(response) {
  return response.data?.result || response.data
}

export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return unwrap(response)
  },

  async register(payload) {
    const response = await apiClient.post('/auth/register', payload)
    return unwrap(response)
  },

  async getCurrentUser() {
    const response = await apiClient.get('/user')
    return unwrap(response)
  },

  async logout() {
    return apiClient.post('/auth/logout')
  },
}
