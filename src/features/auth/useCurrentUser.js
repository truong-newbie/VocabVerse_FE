import { useQuery } from '@tanstack/react-query'
import { authService } from './auth.service'
import { useAuthStore } from '../../app/store/authStore'

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: async () => {
      const user = await authService.getCurrentUser()
      setUser(user)
      return user
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
