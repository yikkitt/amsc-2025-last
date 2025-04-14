'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Info,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Phone
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const orderForms = [
  { id: 'form1', name: 'Form 1: Fascia Name Form', href: '/dashboard/order-forms/form1' },
  { id: 'form2', name: 'Form 2: Contractor Pass Application', href: '/dashboard/order-forms/form2' },
  { id: 'form3', name: 'Form 3: Electrical & Lighting Order', href: '/dashboard/order-forms/form3' },
  { id: 'form4', name: 'Form 4: Furniture Order', href: '/dashboard/order-forms/form4' },
  { id: 'form5', name: 'Form 5: Printing Order', href: '/dashboard/order-forms/form5' },
  { id: 'form6', name: 'Form 6: Performance Bond', href: '/dashboard/order-forms/form6' },
  { id: 'form7', name: 'Form 7: Admin Fees', href: '/dashboard/order-forms/form7' },
  { id: 'form8', name: 'Form 8: Letter of Indemnity', href: '/dashboard/order-forms/indemnity-letter' },
]

const informationSections = [
  { id: 'general', name: 'General Information', href: '/dashboard/information/general' },
  { id: 'emergency', name: 'Emergency Evacuation', href: '/dashboard/information/emergency' },
  { id: 'special-design', name: 'Special Design Rules', href: '/dashboard/information/special-design' },
  { id: 'electrical', name: 'Electrical Rules', href: '/dashboard/information/electrical' },
  { id: 'venue', name: 'Venue Rules', href: '/dashboard/information/venue' },
  { id: 'schedule', name: 'Exhibition Schedule', href: '/dashboard/information/schedule' },
]

const appendixItems = [
  { id: 'booth-package', name: 'Guide for Booth Package', href: '/dashboard/appendix/booth-package' },
  { id: 'klcc-map', name: 'KLCC Map', href: '/dashboard/appendix/klcc-map' },
  { id: 'shell-scheme', name: 'Do & Don\'t of Shell Scheme', href: '/dashboard/appendix/shell-scheme' },
  { id: 'design-submission', name: 'Design Submission Guidelines', href: '/dashboard/appendix/design-submission' },
  { id: 'special-design', name: 'Sample of Special Design Stand Submission', href: '/dashboard/appendix/special-design-sample' },
  { id: 'custom-booth', name: 'Customized Booth Design Guidelines', href: '/dashboard/appendix/custom-booth' },
  { id: 'working-condition', name: 'Working Condition', href: '/dashboard/appendix/working-condition' },
  { id: 'catalogues', name: 'Catalogues', href: '/dashboard/appendix/catalogues' },
  { id: 'emergency-plan', name: 'KLCC\'s Emergency Response Plan', href: '/dashboard/appendix/emergency-plan' },
  { id: 'vehicle-pass', name: 'Vehicle Pass', href: '/dashboard/appendix/vehicle-pass' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [orderFormsOpen, setOrderFormsOpen] = useState(true)
  const [informationOpen, setInformationOpen] = useState(true)
  const [appendixOpen, setAppendixOpen] = useState(false)

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="flex justify-center mb-6">
        <Link href="/dashboard">
          <Image 
            src="/images/amsc-logo.png" 
            alt="AMSC Logo" 
            width={120} 
            height={60} 
            className="h-16 w-auto" 
            priority
          />
        </Link>
      </div>
      <div className="space-y-4">
        <Link 
          href="/dashboard" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            pathname === '/dashboard' 
              ? "bg-blue-50 text-blue-700" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Order Forms Section */}
        <div>
          <button
            onClick={() => setOrderFormsOpen(!orderFormsOpen)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors",
              pathname.includes('/order-forms') 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Order Forms</span>
            </div>
            {orderFormsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {orderFormsOpen && (
            <div className="mt-2 ml-4 space-y-1">
              {orderForms.map((form) => (
                <Link
                  key={form.id}
                  href={form.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === form.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {form.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Information Section */}
        <div>
          <button
            onClick={() => setInformationOpen(!informationOpen)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors",
              pathname.includes('/information')
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5" />
              <span className="font-medium">Information</span>
            </div>
            {informationOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {informationOpen && (
            <div className="mt-2 ml-4 space-y-1">
              {informationSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === section.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {section.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Appendix Section */}
        <div>
          <button
            onClick={() => setAppendixOpen(!appendixOpen)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors",
              pathname.includes('/appendix')
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <div className="flex items-center space-x-3">
              <Bookmark className="w-5 h-5" />
              <span className="font-medium">Appendix</span>
            </div>
            {appendixOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {appendixOpen && (
            <div className="mt-2 ml-4 space-y-1">
              {appendixItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Contact Us */}
        <Link 
          href="/dashboard/contact-us" 
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
            pathname === '/dashboard/contact-us' 
              ? "bg-blue-50 text-blue-700" 
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <Phone className="w-5 h-5" />
          <span className="font-medium">Contact Us</span>
        </Link>
      </div>
    </div>
  )
} 