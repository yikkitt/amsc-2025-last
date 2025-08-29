'use client';

import { useState } from 'react'
import Image from 'next/image'
import KLCCMap from '@/components/maps/KLCCMap'

export default function KLCCMapTabs() {
  const [activeTab, setActiveTab] = useState('location');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'location'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('location')}
        >
          Location Map
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'floor-plan'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('floor-plan')}
        >
          Venue Floor Plan
        </button>
      </div>
      
      {/* Location Map Tab */}
      {activeTab === 'location' && (
        <>
          <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Location Map</h2>
          
          <p className="mb-4">
            The Sime Darby Convention Centre (KLCC) is located in the heart of Kuala Lumpur City Centre, adjacent to the iconic Petronas Twin Towers.
          </p>
          
          <div className="mb-6">
            <KLCCMap />
          </div>
          
          <div className="bg-sky-50 border-l-4 border-sky-400 p-4">
            <h3 className="font-bold text-sky-800 mb-2 flex items-center">
              <span className="bg-sky-400 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">i</span> 
              Getting to KLCC
            </h3>
            <ul className="ml-8 space-y-2">
              <li>By LRT: Take the Kelana Jaya Line to KLCC Station</li>
              <li>By MRT: Take the Kajang Line to MRT KLCC Station</li>
              <li>By Car: Parking is available at the KLCC underground parking</li>
            </ul>
          </div>
        </>
      )}
      
      {/* Venue Floor Plan Tab */}
      {activeTab === 'floor-plan' && (
        <>
          <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Venue Floor Plan</h2>
          
          <div className="mb-6">
            {/* Full-width image container with increased height */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-bold text-blue-800 mb-3">KLCC Convention Centre Floor Plan</h3>
              
              {/* Larger image container with auto-zoomed view */}
              <div className="relative w-full h-[463px] border border-gray-200 bg-white overflow-hidden">
                <Image
                  src="/images/klcc-floor-plan.png"
                  alt="KLCC Exhibition Hall Layout"
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                  unoptimized
                  quality={100}
                  className="object-contain"
                />
                {/* Test image to check path */}
                <div className="absolute bottom-0 right-0 w-16 h-16">
                  <img 
                    src="/images/klcc-floor-plan.png" 
                    alt="Test image" 
                    className="w-full h-full opacity-50"
                  />
                </div>
              </div>
              
            
            </div>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-lg mb-6">
            <h3 className="font-bold text-blue-800 mb-3">Venue Overview</h3>
            <p className="mb-4">
              The DDCON 2025 exhibition is held on Level 3 of the Sime Darby Convention Centre.
              The venue features multiple conference rooms, banquet hall and ballrooms.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white rounded p-3 shadow-sm">
                <h4 className="font-semibold text-sm mb-1">Exhibition Area</h4>
                <p className="text-xs text-gray-600">Conference Hall 1, 2 & 3, Level 3</p>
              </div>
              <div className="bg-white rounded p-3 shadow-sm">
                <h4 className="font-semibold text-sm mb-1">Registration</h4>
                <p className="text-xs text-gray-600">Ballroom 1 & 2, Level 3</p>
              </div>
              <div className="bg-white rounded p-3 shadow-sm">
                <h4 className="font-semibold text-sm mb-1">Conference Rooms</h4>
                <p className="text-xs text-gray-600">Hall 3, Level 3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center">
              <span className="bg-amber-400 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">!</span> 
              Important Notes
            </h3>
            <ul className="ml-8 space-y-2">
              <li>Exhibition halls are located on Level 3</li>
              <li>Registration counters are at the main entrance</li>
              <li>Follow directional signage throughout the venue</li>
              <li>Security checkpoints are located at all entrances</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
} 