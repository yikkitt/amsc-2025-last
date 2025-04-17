'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function VenueFloorPlan() {
  const [isZoomed, setIsZoomed] = useState(false);
  const imageContainerRef = useRef(null);
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Venue Floor Plan</h3>
        
        {/* Two-column layout for floor plan and event info */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Floor plan image container - takes 3/5 of the width on medium screens */}
          <div 
            className={`md:col-span-3 border border-gray-200 rounded-lg ${isZoomed ? 'overflow-visible z-30' : 'overflow-hidden'} cursor-pointer`}
            onClick={toggleZoom}
            ref={imageContainerRef}
          >
            <div className="relative w-full h-[450px] md:h-[450px]">
              <Image
                src="/images/floor-plan.jpg"
                alt="KLCC Exhibition Hall Layout"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
                quality={100}
                className={`object-contain transition-all duration-300 origin-center ${isZoomed ? 'scale-225' : 'scale-100'}`}
                style={{ transformOrigin: 'center center' }}
              />
              {!isZoomed && (
                <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md opacity-80">
                  Click to zoom
                </div>
              )}
              {isZoomed && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md opacity-80">
                  Click to reset
                </div>
              )}
            </div>
          </div>
          
          {/* Event Information - takes 2/5 of the width on medium screens */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="bg-blue-50 rounded-lg p-4 mb-4 h-full">
              <h4 className="font-bold text-blue-800 mb-3">Event Information</h4>
              <div className="space-y-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Event Name</dt>
                    <dd className="text-base font-medium">AMSC 2025</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="text-base font-medium">August 6-7, 2025</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Venue</dt>
                    <dd className="text-base font-medium">Kuala Lumpur Convention Centre, Malaysia</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Exhibition Hours</dt>
                    <dd className="text-base font-medium">9:00 AM - 6:00 PM</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Setup Date</dt>
                    <dd className="text-base font-medium">August 5, 2025 (7:00 pm - 10:00 PM)</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Teardown Date</dt>
                    <dd className="text-base font-medium">August 7, 2025 (After 6:00 PM)</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Venue Information */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 rounded p-4 shadow-sm border border-gray-100 h-auto flex flex-col justify-between">
                <h4 className="font-semibold text-md mb-2 text-blue-700">Exhibition Area</h4>
                <p className="text-sm text-gray-600">Ballroom 1 & 2, Level 3</p>
                <p className="text-sm text-gray-600">Banquet Hall, Level 3</p>
              </div>
              <div className="bg-gray-50 rounded p-4 shadow-sm border border-gray-100 h-auto flex flex-col justify-between">
                <h4 className="font-semibold text-md mb-2 text-blue-700">Conference Room</h4>
                <p className="text-sm text-gray-600">Conference Hall 1, 2 & 3, Level 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 