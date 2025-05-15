'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import FormSkeleton from './FormSkeleton';

interface FormSkeletonLoaderProps {
  message?: string;
}

const FormSkeletonLoader: React.FC<FormSkeletonLoaderProps> = ({ 
  message = 'Loading form data...' 
}) => {
  return (
    <div className="relative">
      <FormSkeleton />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-2" />
        <p className="text-blue-800 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default FormSkeletonLoader; 