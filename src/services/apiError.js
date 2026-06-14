/**
 * @typedef {import('../types/api').NormalizedApiError} NormalizedApiError
 */

/**
 * Converts transport/backend errors into one predictable shape for UI and hooks.
 * @param {unknown} error
 * @returns {NormalizedApiError}
 */
export function normalizeApiError(error) {
  const response = error?.response
  const payload = response?.data
  const nestedError = payload?.error
  const message =
    payload?.message ||
    nestedError?.message ||
    (typeof nestedError === 'string' ? nestedError : null) ||
    error?.message ||
    'Unexpected API error'

  return {
    name: 'ApiError',
    message,
    status: response?.status,
    code: payload?.code || payload?.errorCode || nestedError?.code,
    details: payload,
    isAuthError: response?.status === 401,
  }
}

export function unwrapApiResponse(response) {
  return response.data?.result ?? response.data?.data ?? response.data
}
