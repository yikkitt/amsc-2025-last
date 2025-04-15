'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from './AuthProvider';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('LoginForm onSubmit handler called');
    try {
      setError(null);
      setLoading(true);
      
      // Trim input values to prevent whitespace issues
      const email = data.email.trim();
      const password = data.password.trim();
      
      try {
        await signIn(email, password);
        // The redirect should be handled in AuthProvider
      } catch (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }
    } catch (err: any) {
      console.error('Login form error:', err);
      
      // Use a more generic error message to avoid confusion
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-1 text-center">
        AMSC 2025 Exhibitor Manual Portal
      </h2>
      <p className="text-center text-[#002059] text-xs mb-6">
        <a 
          href="https://bcpgroup.com.my" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#002059] hover:text-[#002059] hover:underline"
        >
          Powered by Blue Circle Plus
        </a>
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            className="w-full px-3 py-2 border rounded-md placeholder-gray-400 text-sm"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            autoComplete="current-password"
            className="w-full px-3 py-2 border rounded-md placeholder-gray-400 text-sm"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          <Link
            href="/auth/signup"
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 text-sm font-medium text-center"
          >
            Sign up
          </Link>
        </div>
      </form>

      <div className="mt-4 text-sm text-center">
        <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
          Forgot your password?
        </a>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600">
        If unable to create an account or reset your password, please contact the administrator at{' '}
        <a href="mailto:info@bcpgroup.com" className="text-blue-600 hover:underline">
          info@bcpgroup.com
        </a>
      </p>
    </div>
  );
} 