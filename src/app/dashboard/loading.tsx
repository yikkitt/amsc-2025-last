'use client';

import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skeleton header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6">
        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="ml-auto w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
      
      <div className="flex flex-1">
        {/* Skeleton sidebar */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200">
          <div className="p-4">
            <div className="w-full h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Skeleton content */}
        <div className="flex-1 p-6 md:px-12">
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 