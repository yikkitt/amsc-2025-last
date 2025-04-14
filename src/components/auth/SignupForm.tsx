import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from './AuthProvider';
import { ErrorMessage } from './ErrorMessage';

// Define the form validation schema
const signupSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  booth_number: z.string().min(1, 'Booth number is required'),
  contact_person: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  telephone: z.string().min(1, 'Telephone is required'),
  address: z.string().min(1, 'Address is required'),
  postcode: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  fax: z.string().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      company_name: '',
      booth_number: '',
      contact_person: '',
      email: '',
      telephone: '',
      address: '',
      postcode: '',
      state: '',
      country: '',
      fax: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      
      // Extract profile data from form
      const { password, confirmPassword, ...profile } = data;
      
      // Log the submission attempt for debugging
      console.log('Submitting signup form with data: ', {
        email: data.email,
        profile: {
          company_name: profile.company_name,
          booth_number: profile.booth_number,
          // Exclude sensitive data
        }
      });
      
      // Call the signUp function from the auth context
      await signUp(data.email, data.password, profile);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Extract and display the specific error message
      let errorMessage = 'An error occurred during registration.';
      
      if (error.message) {
        // Handle database errors
        if (error.message.includes('Database error saving new user')) {
          errorMessage = `Database error: ${error.message}. Please try again or contact support with this error message.`;
        } 
        // Handle authentication errors
        else if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try signing in.';
        } 
        // Handle password errors
        else if (error.message.toLowerCase().includes('password')) {
          errorMessage = 'Password error: ' + error.message;
        } 
        // General error fallback
        else {
          errorMessage = error.message;
        }
      }
      
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && <ErrorMessage message={serverError} />}
      
      <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
            Company Name *
          </label>
          <input
            id="company_name"
            type="text"
            {...register('company_name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="booth_number" className="block text-sm font-medium text-gray-700">
            Booth Number *
          </label>
          <input
            id="booth_number"
            type="text"
            {...register('booth_number')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.booth_number && (
            <p className="mt-1 text-sm text-red-600">{errors.booth_number.message}</p>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
            Contact Person *
          </label>
          <input
            id="contact_person"
            type="text"
            {...register('contact_person')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.contact_person && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_person.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Telephone *
          </label>
          <input
            id="telephone"
            type="tel"
            {...register('telephone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.telephone && (
            <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="fax" className="block text-sm font-medium text-gray-700">
            Fax
          </label>
          <input
            id="fax"
            type="text"
            {...register('fax')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900">Address</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <textarea
            id="address"
            {...register('address')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              id="postcode"
              type="text"
              {...register('postcode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              id="state"
              type="text"
              {...register('state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            id="country"
            type="text"
            {...register('country')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
} 