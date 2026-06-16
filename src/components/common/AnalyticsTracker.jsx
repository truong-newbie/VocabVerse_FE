import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initializeAnalytics, trackPageView } from '@/lib/analytics'
import { getRouteMeta } from '@/lib/seo'

export default function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    initializeAnalytics()
  }, [])

  useEffect(() => {
    if (!initializeAnalytics()) return
    const meta = getRouteMeta(location.pathname)
    trackPageView(`${location.pathname}${location.search}`, meta.fullTitle)
  }, [location.pathname, location.search])

  return null
}
