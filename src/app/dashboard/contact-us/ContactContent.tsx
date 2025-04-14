'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactContent() {
  const [activeTab, setActiveTab] = useState('google-map')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">KLCC Map and Location Guide</h1>
      <p className="mb-6 text-gray-700">Use the maps below to locate the Kuala Lumpur Convention Centre and navigate the venue.</p>
      
      <div className="flex mb-6 space-x-4">
        <button 
          onClick={() => setActiveTab('google-map')}
          className={`border border-gray-300 rounded py-2 px-4 font-medium ${
            activeTab === 'google-map' 
              ? 'bg-blue-50 text-blue-900 border-blue-300' 
              : 'bg-white text-gray-600'
          }`}
        >
          Google Map
        </button>
        <button 
          onClick={() => setActiveTab('floor-plan')}
          className={`border border-gray-300 rounded py-2 px-4 font-medium ${
            activeTab === 'floor-plan' 
              ? 'bg-blue-50 text-blue-900 border-blue-300' 
              : 'bg-white text-gray-600'
          }`}
        >
          Venue Floor Plan
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-2 text-blue-900">KLCC Location</h2>
        <p className="text-gray-700 mb-4">Kuala Lumpur Convention Centre, Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia</p>
        
        {activeTab === 'google-map' ? (
          <div className="relative mb-6 h-64 bg-slate-200 rounded-lg overflow-hidden">
            {/* Google Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-300 w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-500 h-8 w-8 rounded-full relative flex items-center justify-center">
                    <div className="bg-red-600 h-3 w-3 rounded-full"></div>
                    <div className="absolute -bottom-6 bg-white px-2 py-1 rounded shadow-md text-xs text-gray-800 font-medium">
                      KLCC
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-600">
                  Google Map will be displayed here
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative mb-6 h-64 bg-slate-100 rounded-lg overflow-hidden">
            {/* Floor Plan placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white w-full h-full relative border border-gray-200">
                <div className="grid grid-cols-4 h-full">
                  <div className="border-r border-gray-200 p-2 text-xs text-center text-gray-500">Hall A</div>
                  <div className="border-r border-gray-200 p-2 text-xs text-center text-gray-500">Hall B</div>
                  <div className="border-r border-gray-200 p-2 text-xs text-center text-gray-500 bg-blue-50">Hall C (AMSC 2025)</div>
                  <div className="p-2 text-xs text-center text-gray-500">Hall D</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-600 text-sm font-medium">
                    Venue Floor Plan will be displayed here
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="font-bold text-gray-800 mb-1">Address:</h3>
          <p className="text-gray-700 mb-4">
            Kuala Lumpur Convention Centre<br />
            Kuala Lumpur City Centre<br />
            50088 Kuala Lumpur<br />
            Malaysia
          </p>
          
          <h3 className="font-bold text-gray-800 mb-1">Contact:</h3>
          <p className="text-gray-700 mb-1">Tel: +603 2333 2888</p>
          <p className="text-gray-700">
            Email: <a href="mailto:info@klccconventioncentre.com" className="text-blue-600 hover:underline">info@klccconventioncentre.com</a>
          </p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4 text-blue-900">Transport Options</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-2 text-blue-900">By Train</h3>
          <p className="text-gray-700">
            KLCC is accessible via the LRT Kelana Jaya Line. Exit at KLCC Station and follow signs to the convention centre.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-2 text-blue-900">By Car</h3>
          <p className="text-gray-700">
            Underground parking is available at KLCC. Enter via Jalan Pinang or Jalan P. Ramlee entrances.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-2 text-blue-900">By Taxi</h3>
          <p className="text-gray-700">
            Drop-off points are available at the main entrance of the convention centre.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-2 text-blue-900">From Airport</h3>
          <p className="text-gray-700">
            KLIA Express to KL Sentral, then connect to LRT Kelana Jaya Line to KLCC Station.
          </p>
        </div>
      </div>
    </div>
  )
} 