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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800">AMSC 2025</h1>
          <p className="text-gray-600">Exhibitor Manual Portal</p>
        </div>
        {children}
      </div>
    </div>
  )
} 