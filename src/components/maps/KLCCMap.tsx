'use client'

import { useState } from 'react'

export default function KLCCMap() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <div className="relative w-full h-full border border-gray-200 rounded-lg overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-6 bg-white rounded shadow-sm">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
            <p className="mb-4">Loading map...</p>
          </div>
        </div>
      )}
      
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7675808675684!2d101.70928765!3d3.1578249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d4c476636f%3A0x77a4dcc0cd4c4cac!2sKuala%20Lumpur%20Convention%20Centre!5e0!3m2!1sen!2sus!4v1649252565452!5m2!1sen!2sus"
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="KLCC Location Map"
        onLoad={() => setIsLoaded(true)}
      />
      
      <div className="absolute bottom-4 right-4 z-20">
        <a 
          href="https://www.google.com/maps/dir/?api=1&destination=Kuala+Lumpur+Convention+Centre"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-blue-700 px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-blue-50 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 13a3 3 0 100-6 3 3 0 000 6zm7-9a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1zM2 13a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H3a1 1 0 00-1 1v8z" />
          </svg>
          Get Directions
        </a>
      </div>
    </div>
  )
} 