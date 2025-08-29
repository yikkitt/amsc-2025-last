'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function VenueFloorPlan() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Venue Floor Plan</h3>
        
        {/* Floor plan layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Floor plan image container - takes 2/3 of the width on large screens */}
          <div 
            className="lg:col-span-2 border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="relative w-full h-[350px] md:h-[450px]">
              {/* Low-quality image placeholder while actual image loads */}
              <div 
                className={`absolute inset-0 bg-gray-200 transition-opacity duration-300 ${
                  isLoaded ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                  zIndex: isLoaded ? 0 : 1,
                  backgroundImage: "url('/images/klcc-floor-plan-low.png')",
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              
              <Image
                src="/images/klcc-floor-plan.png"
                alt="KLCC Exhibition Hall Layout"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
                quality={80}
                className="object-contain"
                onLoad={() => setIsLoaded(true)}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
          
          {/* Event Information - takes 1/3 of the width on large screens */}
          <div className="lg:col-span-1">
            {/* Event Information Box */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-blue-800 mb-3">Event Information</h4>
              <div className="space-y-3">
                <dl>
                  <div className="mb-2">
                    <dt className="text-sm font-medium text-gray-500">Event Name</dt>
                    <dd className="text-base font-medium">DDCON 2025</dd>
                  </div>
                  <div className="mb-2">
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="text-base font-medium">August 6-7, 2025</dd>
                  </div>
                  <div className="mb-2">
                    <dt className="text-sm font-medium text-gray-500">Venue</dt>
                    <dd className="text-base font-medium">Kuala Lumpur Convention Centre, Malaysia</dd>
                  </div>
                  <div className="mb-2">
                    <dt className="text-sm font-medium text-gray-500">Exhibition Hours</dt>
                    <dd className="text-base font-medium">9:00 AM - 6:00 PM</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Venue Details Box */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-blue-800 mb-3">Venue Details</h4>
              <div className="space-y-3">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">Exhibition Area</p>
                  <p className="text-sm text-gray-600">Ballroom 1 & 2, Level 3</p>
                  <p className="text-sm text-gray-600">Banquet Hall, Level 3</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Conference Room</p>
                  <p className="text-sm text-gray-600">Conference Hall 1, 2 & 3, Level 3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 