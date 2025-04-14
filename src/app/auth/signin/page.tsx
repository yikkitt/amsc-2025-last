'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SigninPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const reset = searchParams.get('reset');
  const [error, setError] = useState<string | null>(null);
  
  // Component to display on load to check environment
  useEffect(() => {
    // Log environment config for debugging
    console.log('SignIn Page Loaded', {
      mockAuth: process.env.NEXT_PUBLIC_USE_MOCK_AUTH,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'
    });
    
    // Check if Supabase configuration is missing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError('Missing Supabase configuration. Please check your environment variables.');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="relative w-full h-40 mb-6">
            <Image 
              src="/images/amsc-2025-banner.png" 
              alt="AMSC 2025 Banner"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your exhibitor portal for AMSC 2025
          </p>
        </div>
        
        {registered && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Registration successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your account has been created successfully. Please sign in to continue.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {reset && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Password reset successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your password has been reset successfully. Please sign in with your new password.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Configuration Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <LoginForm />
        
        <div className="text-sm text-center">
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Need an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 