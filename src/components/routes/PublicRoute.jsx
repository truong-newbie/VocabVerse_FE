import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../app/store/authStore'
import LoadingScreen from '../common/LoadingScreen'

export default function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return <LoadingScreen title="Checking your session..." description="Preparing authentication state." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
