import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from './auth.service'
import { extractAuthTokens, extractAuthUser, useAuthStore } from '@/app/store/authStore'

export function useLogin() {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (credentials) => {
      const payload = await authService.login(credentials)
      const tokens = extractAuthTokens(payload)

      if (!tokens.accessToken) {
        throw new Error('Login response did not include an access token')
      }

      setTokens(tokens)

      const currentUser = extractAuthUser(payload) || (await authService.getCurrentUser())
      setUser(currentUser)
      queryClient.setQueryData(['auth', 'current-user'], currentUser)

      return currentUser
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (payload) => {
      const responsePayload = await authService.register(payload)
      const tokens = extractAuthTokens(responsePayload)

      if (!tokens.accessToken) {
        return null
      }

      setTokens(tokens)

      const currentUser = extractAuthUser(responsePayload) || (await authService.getCurrentUser())
      setUser(currentUser)
      queryClient.setQueryData(['auth', 'current-user'], currentUser)

      return currentUser
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const clearAuth = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    },
    onSettled: () => {
      clearAuth()
      queryClient.removeQueries({ queryKey: ['auth'] })
    },
  })
}
