import { Outlet } from 'react-router-dom'
import AnalyticsTracker from '@/components/common/AnalyticsTracker'
import RouteMeta from '@/components/common/RouteMeta'

export default function RootLayout() {
  return (
    <>
      <RouteMeta />
      <AnalyticsTracker />
      <Outlet />
    </>
  )
}
