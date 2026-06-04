import axios from 'axios'
import { authStorage, useAuthStore } from '../app/store/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let refreshPromise = null

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const refreshToken = authStorage.getRefreshToken()

    if (status !== 401 || !refreshToken || originalRequest?._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise = refreshPromise || apiClient.post('/auth/refresh', { refreshToken })
      const response = await refreshPromise
      refreshPromise = null

      const payload = response.data?.result || response.data
      const nextAccessToken = payload?.accessToken || payload?.token
      const nextRefreshToken = payload?.refreshToken || refreshToken

      if (!nextAccessToken) {
        throw new Error('Refresh response did not include an access token')
      }

      useAuthStore.getState().setTokens({
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
      })

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      refreshPromise = null
      useAuthStore.getState().logout()
      return Promise.reject(refreshError)
    }
  },
)
