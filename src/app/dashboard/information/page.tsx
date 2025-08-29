import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Information - DDCON 2025',
  description: 'Important information and guidelines for DDCON 2025',
}

const sections = [
  {
    id: 'section1',
    title: 'Section 1 - General Information',
    description: 'General information about the exhibition and venue.',
    href: '/dashboard/information/general'
  },
  {
    id: 'section2',
    title: 'Section 2 - Emergency Evacuation Procedures',
    description: 'Emergency procedures and evacuation guidelines.',
    href: '/dashboard/information/emergency'
  },
  {
    id: 'section3',
    title: 'Section 3 - Special Design\'s Rules & Regulations',
    description: 'Rules and regulations for special booth designs.',
    href: '/dashboard/information/special-design'
  },
  {
    id: 'section4',
    title: 'Section 4 - Electrical Rules & Regulations',
    description: 'Guidelines for electrical installations and usage.',
    href: '/dashboard/information/electrical'
  },
  {
    id: 'section5',
    title: 'Section 5 - Venue\'s Rules & Regulations',
    description: 'Venue-specific rules and regulations.',
    href: '/dashboard/information/venue'
  },
  {
    id: 'section6',
    title: 'Section 6 - Exhibition Schedule',
    description: 'Detailed schedule of the exhibition.',
    href: '/dashboard/information/schedule'
  }
]

export default function InformationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please review the following important information sections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="group block p-6 bg-white rounded-lg shadow hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{section.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:transform group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 