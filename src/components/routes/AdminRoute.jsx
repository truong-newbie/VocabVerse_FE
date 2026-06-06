import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/app/store/authStore'
import { useCurrentUser } from '@/features/auth/useCurrentUser'
import LoadingScreen from '@/components/common/LoadingScreen'

function isAdmin(user) {
  return String(user?.role || '').toUpperCase() === 'ADMIN'
}

export default function AdminRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const userFromStore = useAuthStore((state) => state.user)
  const location = useLocation()
  const currentUserQuery = useCurrentUser()
  const user = currentUserQuery.data || userFromStore

  if (!isHydrated || (isAuthenticated && currentUserQuery.isLoading && !userFromStore)) {
    return <LoadingScreen title="Checking admin access..." description="Verifying account permissions." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin(user)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
