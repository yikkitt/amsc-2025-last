'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DebugRedirectPage() {
  const router = useRouter()
  const [history, setHistory] = useState<string[]>([])
  const [redirectAttempts, setRedirectAttempts] = useState(0)

  useEffect(() => {
    // Log when the page renders
    console.log('[DEBUG] Debug redirect page mounted')
    
    // Store current URL in history
    setHistory(prev => [...prev, window.location.href])

    // Intercept any navigation attempts
    const originalPush = router.push
    const originalReplace = router.replace
    const originalRefresh = router.refresh

    // Override router.push
    const newPush = (...args: Parameters<typeof router.push>) => {
      console.log('[DEBUG] Intercepted router.push call with args:', args)
      setRedirectAttempts(prev => prev + 1)
      setHistory(prev => [...prev, `Attempted push to: ${args[0]}`])
      // Don't actually navigate
      return
    }

    // Override router.replace
    const newReplace = (...args: Parameters<typeof router.replace>) => {
      console.log('[DEBUG] Intercepted router.replace call with args:', args)
      setRedirectAttempts(prev => prev + 1)
      setHistory(prev => [...prev, `Attempted replace to: ${args[0]}`])
      // Don't actually navigate
      return
    }

    // Override router.refresh
    const newRefresh = () => {
      console.log('[DEBUG] Intercepted router.refresh call')
      setRedirectAttempts(prev => prev + 1)
      setHistory(prev => [...prev, 'Attempted refresh'])
      // Don't actually refresh
      return
    }

    // Apply the overrides
    // @ts-ignore
    router.push = newPush
    // @ts-ignore
    router.replace = newReplace
    // @ts-ignore
    router.refresh = newRefresh

    // Also monitor window.location changes
    let lastHref = window.location.href
    const intervalId = setInterval(() => {
      if (window.location.href !== lastHref) {
        console.log('[DEBUG] Location changed from', lastHref, 'to', window.location.href)
        setHistory(prev => [...prev, `Location changed to: ${window.location.href}`])
        lastHref = window.location.href
      }
    }, 100)

    // Cleanup
    return () => {
      console.log('[DEBUG] Debug redirect page unmounted')
      // @ts-ignore
      router.push = originalPush
      // @ts-ignore
      router.replace = originalReplace
      // @ts-ignore
      router.refresh = originalRefresh
      clearInterval(intervalId)
    }
  }, [router])

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Redirect Debug Page</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <p className="font-medium">This page will help debug automatic redirects.</p>
        <p>If you see any redirect attempts logged below, check the browser console for more details.</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Redirect Attempts: {redirectAttempts}</h2>
        <p className="text-sm text-gray-500">This count increases if any component tries to navigate using Next.js router methods</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Navigation History:</h2>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          <ul className="space-y-2">
            {history.map((entry, i) => (
              <li key={i} className="border-b border-gray-100 pb-2">
                {entry}
              </li>
            ))}
            {history.length === 0 && <li className="text-gray-500">No navigation history yet</li>}
          </ul>
        </div>
      </div>

      <div className="flex space-x-4">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => {
            console.log('[DEBUG] Manual navigation back to dashboard')
            window.location.href = '/dashboard'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
} 