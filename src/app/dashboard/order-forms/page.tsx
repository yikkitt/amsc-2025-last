import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Forms - DDCON 2025',
  description: 'Submit your exhibition order forms for DDCON 2025',
}

const forms = [
  {
    id: 'form1',
    title: 'Form 1: Fascia Name Form',
    description: 'Submit your company name as it should appear on the fascia board.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/form1'
  },
  {
    id: 'form2',
    title: 'Form 2: Contractor Pass Application Form',
    description: 'Apply for a contractor pass for the exhibition.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/form2'
  },
  {
    id: 'form3',
    title: 'Form 3: Electrical & Lighting Order Form',
    description: 'Order electrical points and additional lighting.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/form3'
  },
  {
    id: 'form4',
    title: 'Form 4: Furniture Order Form',
    description: 'Order furniture for your booth.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/form4'
  },
  {
    id: 'form5',
    title: 'Form 5: Printing Order Form',
    description: 'Order printing services for your booth.',
    deadline: '12th September 2025',
    href: '/dashboard/order-forms/form5'
  },
  {
    id: 'form6',
    title: 'Form 6: Non-Official Contractor Form (Performance Bond)',
    description: 'Apply for a non-official contractor (Performance Bond) for the exhibition.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/form6'
  },
  {
    id: 'form7',
    title: 'Form 7: Non-Official Contractor Form (Admin Fees)',
    description: 'Apply for a non-official contractor (Admin Fees) for the exhibition.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/form7'
  },
  {
    id: 'form8',
    title: 'Form 8: Letter Of Indemnity For Non-Official Contractor',
    description: 'Apply for a letter of Indemnity for a non-official contractor for the exhibition.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/indemnity-letter'
  },
  {
    id: 'form9',
    title: 'Form 9: Audio Visual Equipment',
    description: 'Order audio visual equipment like LED TVs and TV stands for your booth.',
    deadline: '9th September 2025',
    href: '/dashboard/order-forms/form9'
  }
]

export default function OrderFormsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Order Forms</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please complete and submit the following forms as required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Link
            key={form.id}
            href={form.href}
            className="group block p-6 bg-white rounded-lg shadow hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {form.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{form.description}</p>
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-yellow-50 rounded-full">
                  <span className="text-xs font-medium text-yellow-800">
                    Deadline: {form.deadline}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:transform group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 