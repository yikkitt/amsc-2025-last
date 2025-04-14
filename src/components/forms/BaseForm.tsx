import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Base schema that all forms will extend
export const baseFormSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  contact_person: z.string().min(1, 'Contact person is required'),
  booth_number: z.string().min(1, 'Booth number is required'),
  telephone: z.string().min(1, 'Telephone is required'),
  email: z.string().email('Invalid email format'),
})

export type BaseFormData = z.infer<typeof baseFormSchema>

interface BaseFormProps {
  onSubmit: (data: BaseFormData) => Promise<void>
  defaultValues?: Partial<BaseFormData>
  formType: number
  isSubmitting?: boolean
}

export const BaseForm: React.FC<BaseFormProps> = ({
  onSubmit,
  defaultValues,
  formType,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BaseFormData>({
    resolver: zodResolver(baseFormSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          type="text"
          id="company_name"
          {...register('company_name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
          Contact Person
        </label>
        <input
          type="text"
          id="contact_person"
          {...register('contact_person')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.contact_person && (
          <p className="mt-1 text-sm text-red-600">{errors.contact_person.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="booth_number" className="block text-sm font-medium text-gray-700">
          Booth Number
        </label>
        <input
          type="text"
          id="booth_number"
          {...register('booth_number')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.booth_number && (
          <p className="mt-1 text-sm text-red-600">{errors.booth_number.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
          Telephone
        </label>
        <input
          type="tel"
          id="telephone"
          {...register('telephone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.telephone && (
          <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  )
} 