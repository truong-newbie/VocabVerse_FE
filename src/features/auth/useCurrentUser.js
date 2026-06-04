import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from './auth.service'
import { useAuthStore } from '@/app/store/authStore'

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  const query = useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: async () => {
      const user = await authService.getCurrentUser()
      setUser(user)
      return user
    },
    enabled: isHydrated && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  useEffect(() => {
    if (query.error?.isAuthError) {
      logout()
    }
  }, [logout, query.error])

  return query
}
