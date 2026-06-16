const GA_SCRIPT_ID = 'vocabverse-ga-script'

export function getGaMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
}

export function isAnalyticsEnabled() {
  return Boolean(getGaMeasurementId())
}

export function initializeAnalytics() {
  const measurementId = getGaMeasurementId()

  if (!measurementId || typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments)
    }

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement('script')
    script.id = GA_SCRIPT_ID
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    document.head.appendChild(script)
    window.gtag('js', new Date())
    window.gtag('config', measurementId, { send_page_view: false })
  }

  return true
}

export function trackPageView(pathname, title) {
  const measurementId = getGaMeasurementId()

  if (!measurementId || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: pathname,
    page_location: window.location.href,
    send_to: measurementId,
  })
}
