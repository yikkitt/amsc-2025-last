'use client';

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/dashboard',
    label: 'Overview',
  },
  {
    href: '/dashboard/information',
    label: 'Information',
  },
  {
    href: '/dashboard/order-forms',
    label: 'Order Forms',
  },
  {
    href: '/dashboard/forms/download',
    label: 'Download Forms',
  },
  {
    href: '/dashboard/appendix',
    label: 'Appendix',
  },
  {
    href: '/dashboard/contact-us',
    label: 'Contact Us',
  },
]

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className={`block px-4 py-2 rounded-md ${
            pathname === '/dashboard'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/order-forms"
          className={`block px-4 py-2 rounded-md ${
            pathname.startsWith('/dashboard/order-forms')
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Order Forms
        </Link>
        <Link
          href="/dashboard/forms/download"
          className={`block px-4 py-2 rounded-md ${
            pathname.startsWith('/dashboard/forms/download')
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Download Forms
        </Link>
        <Link
          href="/dashboard/information"
          className={`block px-4 py-2 rounded-md ${
            pathname === '/dashboard/information'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Information
        </Link>
        <Link
          href="/dashboard/appendix"
          className={`block px-4 py-2 rounded-md ${
            pathname === '/dashboard/appendix'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Appendix
        </Link>
        <Link
          href="/dashboard/contact-us"
          className={`block px-4 py-2 rounded-md ${
            pathname === '/dashboard/contact-us'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Contact Us
        </Link>
      </div>
    </nav>
  )
} 