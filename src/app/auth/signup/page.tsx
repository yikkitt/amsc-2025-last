'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { SignupForm } from '@/components/auth/SignupForm';

const signupSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  booth_number: z.string().min(1, 'Booth number is required'),
  contact_person: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  telephone: z.string().min(8, 'Valid telephone number is required'),
  address: z.string().min(5, 'Address is required'),
  postcode: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  tax_identification_number: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register as an exhibitor for DDCON 2025
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
} 