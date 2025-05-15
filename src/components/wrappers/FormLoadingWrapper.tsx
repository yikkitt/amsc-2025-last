'use client';

import React, { useState, useEffect } from 'react';
import FormSkeletonLoader from '@/components/ui/FormSkeletonLoader';

interface FormLoadingWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  fallbackMessage?: string;
}

const FormLoadingWrapper: React.FC<FormLoadingWrapperProps> = ({
  children,
  isLoading: externalLoading,
  fallbackMessage = 'Loading form data...'
}) => {
  const [internalLoading, setInternalLoading] = useState(true);
  const [hasRendered, setHasRendered] = useState(false);
  
  useEffect(() => {
    // Set a small delay to ensure smoother transitions
    const timer = setTimeout(() => {
      setInternalLoading(false);
      setHasRendered(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use either external loading prop or internal loading state
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;
  
  if (isLoading) {
    return <FormSkeletonLoader message={fallbackMessage} />;
  }
  
  return (
    <div className={`transition-opacity duration-300 ${hasRendered ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default FormLoadingWrapper; 