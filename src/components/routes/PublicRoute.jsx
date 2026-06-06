import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../app/store/authStore'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import LoadingScreen from '../common/LoadingScreen'

export default function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const userFromStore = useAuthStore((state) => state.user)
  const currentUserQuery = useCurrentUser()
  const user = currentUserQuery.data || userFromStore
  const role = String(user?.role || '').toUpperCase()

  if (!isHydrated || (isAuthenticated && !user && currentUserQuery.isLoading)) {
    return <LoadingScreen title="Checking your session..." description="Preparing authentication state." />
  }

  if (isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />
  }

  return <Outlet />
}
