export type ApiResponse<T> = {
  code?: string | number
  success?: boolean
  message?: string
  result?: T
  data?: T
}

export type NormalizedApiError = {
  name: 'ApiError'
  message: string
  status?: number
  code?: string | number
  details?: unknown
  isAuthError: boolean
}
