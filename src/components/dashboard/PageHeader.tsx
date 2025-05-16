'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import Image from 'next/image'

export const PageHeader = () => {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect is handled in the AuthProvider
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile centered title with proper padding - hidden on desktop */}
          <div className="lg:hidden absolute left-0 right-0 mx-auto text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              AMSC 2025 Exhibitor Manual
            </h1>
          </div>
          
          {/* Desktop left-aligned title - hidden on mobile */}
          <div className="hidden lg:flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              AMSC 2025 Exhibitor Manual
            </h1>
          </div>
          
          <div className="flex items-center ml-auto">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PageHeader 