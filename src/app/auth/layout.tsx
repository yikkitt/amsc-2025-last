import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'AMSC 2025 | Authentication',
  description: 'Authentication for AMSC 2025 Exhibitor Portal',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
} 