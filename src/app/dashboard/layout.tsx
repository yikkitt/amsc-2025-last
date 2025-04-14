import { Metadata } from 'next'
import Sidebar from '@/components/layout/Sidebar'
import PageHeader from '@/components/dashboard/PageHeader'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dashboard - AMSC 2025',
  description: 'Exhibition management dashboard for AMSC 2025',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <PageHeader />
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
} 