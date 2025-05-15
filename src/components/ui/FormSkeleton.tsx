import React from 'react';

const FormSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-pulse">
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Form Header Skeleton */}
        <div className="text-center mb-8 border-b border-gray-200 pb-6">
          <div className="h-8 bg-gray-200 rounded mb-2 mx-auto w-40"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 mx-auto w-64"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-48"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 mx-auto w-80"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-60"></div>
        </div>

        {/* User Data Container Skeleton */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-full"></div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={`left-${i}`} className="mb-4">
                <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-40"></div>
              </div>
            ))}
            
            {[...Array(4)].map((_, i) => (
              <div key={`right-${i}`} className="mb-4">
                <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                <div className="h-5 bg-gray-200 rounded w-40"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={`field-${i}`} className="mb-4">
              <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
          
          {/* Table Skeleton */}
          <div className="mt-6 mb-8 overflow-x-auto">
            <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
          
          {/* Buttons Skeleton */}
          <div className="flex justify-end space-x-4 mt-8">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton; 