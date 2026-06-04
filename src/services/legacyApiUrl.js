const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export function legacyApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}
