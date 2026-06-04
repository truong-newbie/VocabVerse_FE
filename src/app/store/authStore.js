import { create } from 'zustand'

const ACCESS_TOKEN_KEY = 'vocabverse.accessToken'
const REFRESH_TOKEN_KEY = 'vocabverse.refreshToken'
const LEGACY_TOKEN_KEY = 'token'

function readInitialAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY)
}

export const authStorage = {
  getAccessToken: () => readInitialAccessToken(),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken }) => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(LEGACY_TOKEN_KEY, accessToken)
    }

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(LEGACY_TOKEN_KEY)
  },
}

export const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  hydrate: () => {
    const accessToken = authStorage.getAccessToken()
    const refreshToken = authStorage.getRefreshToken()

    set({
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isHydrated: true,
    })
  },
  setTokens: ({ accessToken, refreshToken }) => {
    authStorage.setTokens({ accessToken, refreshToken })
    set({
      accessToken: accessToken || null,
      refreshToken: refreshToken || authStorage.getRefreshToken(),
      isAuthenticated: Boolean(accessToken),
      isHydrated: true,
    })
  },
  setUser: (user) => set({ user }),
  logout: () => {
    authStorage.clear()
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false, isHydrated: true })
  },
}))
