import axios from 'axios'
import { authStorage, useAuthStore } from '@/app/store/authStore'
import { normalizeApiError, unwrapApiResponse } from './apiError'

const REFRESH_ENDPOINT = '/auth/refresh'

function normalizeApiBaseUrl(value) {
  const rawBaseUrl = value || '/api/v1'
  const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, '')
  return trimmedBaseUrl.endsWith('/api/v1') ? trimmedBaseUrl : `${trimmedBaseUrl}/api/v1`
}

export const apiClient = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
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

function isRefreshRequest(config) {
  return config?.url?.includes(REFRESH_ENDPOINT)
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const refreshToken = authStorage.getRefreshToken()

    if (status !== 401 || !refreshToken || originalRequest?._retry || isRefreshRequest(originalRequest)) {
      return Promise.reject(normalizeApiError(error))
    }

    originalRequest._retry = true

    try {
      refreshPromise = refreshPromise || apiClient.post(REFRESH_ENDPOINT, { refreshToken })
      const response = await refreshPromise
      refreshPromise = null

      const payload = unwrapApiResponse(response)
      const nextAccessToken = payload?.accessToken || payload?.token || payload?.access_token
      const nextRefreshToken = payload?.refreshToken || payload?.refresh_token || refreshToken

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
      return Promise.reject(normalizeApiError(refreshError))
    }
  },
)
