'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from './AuthProvider';

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
      // Development convenience - pre-fill with test credentials
      ...(process.env.NODE_ENV === 'development' 
        ? { email: 'test@example.com', password: 'password123' } 
        : {})
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Trim input values to prevent whitespace issues
      const email = data.email.trim();
      const password = data.password.trim();
      
      try {
        await signIn(email, password);
        // The redirect should be handled in AuthProvider, but add fallback
        setTimeout(() => {
          // Direct access to URL is most reliable
          window.location.href = '/dashboard';
        }, 1000);
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
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        AMSC 2025 Exhibitor Manual
      </h2>
      
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
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
          Forgot your password?
        </a>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600">
        For account creation or password reset, please contact the administrator at{' '}
        <a href="mailto:info@bcpgroup.com" className="text-blue-600 hover:underline">
          info@bcpgroup.com
        </a>
      </p>
    </div>
  );
} 