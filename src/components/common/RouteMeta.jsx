import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getAppUrl, getRouteMeta } from '@/lib/seo'

function setMetaByName(name, content) {
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setMetaByProperty(property, content) {
  let element = document.querySelector(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export default function RouteMeta() {
  const location = useLocation()

  useEffect(() => {
    if (typeof document === 'undefined') return

    const meta = getRouteMeta(location.pathname)
    const url = getAppUrl(`${location.pathname}${location.search}`)
    const imageUrl = getAppUrl('/logo.svg')

    document.title = meta.fullTitle
    setMetaByName('description', meta.description)
    setMetaByProperty('og:title', meta.fullTitle)
    setMetaByProperty('og:description', meta.description)
    setMetaByProperty('og:url', url)
    setMetaByProperty('og:image', imageUrl)
    setMetaByName('twitter:title', meta.fullTitle)
    setMetaByName('twitter:description', meta.description)
    setMetaByName('twitter:image', imageUrl)
  }, [location.pathname, location.search])

  return null
}
