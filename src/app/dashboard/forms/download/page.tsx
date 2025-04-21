import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function DownloadFormsIndex() {
  const forms = [
    {
      id: 1,
      name: 'Form 1 - Fascia Name Form',
      description: 'Required for all Shell Scheme exhibitors. Download only version - no submission required.',
      href: '/dashboard/forms/download/form1',
    },
    // Add more forms as needed
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Download Forms</h1>
      <p className="text-gray-700 mb-6">
        Download forms for your records. These forms are for download only and do not require submission.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Link
            key={form.id}
            href={form.href}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col"
          >
            <div className="flex items-center mb-3">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="font-semibold text-lg">{form.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{form.description}</p>
            <div className="mt-auto">
              <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                Download Form
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 