'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

function sendEvent(event: 'heartbeat' | 'pageview', pathname: string) {
  void fetch('/api/analytics/visit', {
    body: JSON.stringify({ event, pathname }),
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    method: 'POST',
  }).catch(() => undefined)
}

export function VisitorTracker() {
  const pathname = usePathname()
  const currentPath = useRef(pathname)

  useEffect(() => {
    currentPath.current = pathname
    if (document.visibilityState === 'visible') sendEvent('pageview', pathname)
  }, [pathname])

  useEffect(() => {
    const heartbeat = () => {
      if (document.visibilityState === 'visible') sendEvent('heartbeat', currentPath.current)
    }

    const timer = window.setInterval(heartbeat, 60_000)
    document.addEventListener('visibilitychange', heartbeat)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', heartbeat)
    }
  }, [])

  return null
}
