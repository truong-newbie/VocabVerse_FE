import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../app/store/authStore'
import LoadingScreen from '../common/LoadingScreen'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const location = useLocation()

  if (!isHydrated) {
    return <LoadingScreen title="Checking your session..." description="Restoring your learning workspace." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
