import { useMutation } from '@tanstack/react-query'
import { authService } from './auth.service'
import { useAuthStore } from '../../app/store/authStore'

function readTokens(payload) {
  return {
    accessToken: payload?.accessToken || payload?.token,
    refreshToken: payload?.refreshToken,
  }
}

export function useLogin() {
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (payload) => {
      const tokens = readTokens(payload)

      if (!tokens.accessToken) {
        throw new Error('Login response did not include an access token')
      }

      setTokens(tokens)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
  })
}
