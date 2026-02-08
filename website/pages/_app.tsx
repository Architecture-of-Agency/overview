import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check if user has given analytics consent
    const consent = localStorage.getItem('analytics_consent')
    setHasConsent(consent === 'accepted')
  }, [])

  return (
    <>
      <Component {...pageProps} />
      {hasConsent && <Analytics />}
    </>
  )
}
