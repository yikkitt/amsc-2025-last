import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Appendix - AMSC 2025',
  description: 'Appendix documents for AMSC 2025 exhibition',
}

const appendixItems = [
  { id: 'booth-package', name: 'Guide for Booth Package', href: '/dashboard/appendix/booth-package' },
  { id: 'klcc-map', name: 'KLCC Map and Location Guide', href: '/dashboard/appendix/klcc-map' },
  { id: 'shell-scheme-rules', name: "Do's & Don'ts of Shell Scheme", href: '/dashboard/appendix/shell-scheme' },
  { id: 'design-submission', name: 'Design Submission Guidelines', href: '/dashboard/appendix/design-submission' },
  { id: 'special-design-sample', name: 'Sample of Special Design Stand Submission', href: '/dashboard/appendix/special-design-sample' },
  { id: 'custom-booth', name: 'Customized Booth Design Guidelines', href: '/dashboard/appendix/custom-booth' },
  { id: 'working-condition', name: 'Working Conditions', href: '/dashboard/appendix/working-condition' },
  { id: 'emergency-plan', name: "KLCC's Emergency Response Plan", href: '/dashboard/appendix/emergency-plan' },
  { id: 'vehicle-pass', name: 'Vehicle Pass', href: '/dashboard/appendix/vehicle-pass' },
]

export default function AppendixPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Appendix Documents</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appendixItems.map((item) => (
            <Link 
              key={item.id}
              href={item.href}
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-blue-700">{item.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 