'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

declare global {
  interface Window {
    google: any;
  }
}

const KLCC_COORDINATES = { lat: 3.1579, lng: 101.7118 }
const KLCC_ADDRESS = "Kuala Lumpur Convention Centre, 50088 Kuala Lumpur, Malaysia"

export default function KLCCMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Get Google Maps API key from env variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    const mapElement = mapRef.current
    if (!mapElement) return
    
    // Log to help debug
    console.log(`Attempting to load Google Maps with API key: ${apiKey ? 'Available' : 'Not available'}`)

    const initMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          console.log('Google Maps already loaded, initializing map')
          const map = new window.google.maps.Map(mapElement, {
            center: KLCC_COORDINATES,
            zoom: 17,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          })

          // Add marker for KLCC
          const marker = new window.google.maps.Marker({
            position: KLCC_COORDINATES,
            map: map,
            title: 'Kuala Lumpur Convention Centre',
            animation: window.google.maps.Animation.DROP,
          })
          
          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>AMSC 2025</strong><br>${KLCC_ADDRESS}</div>`,
          })
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
          
          setMapLoaded(true)
          setIsLoading(false)
          return
        }

        // Check if API key is available
        if (!apiKey) {
          console.error('Google Maps API key is not available')
          setError('Google Maps API key is not available.')
          setIsLoading(false)
          return
        }

        // Load Google Maps script
        console.log('Loading Google Maps script')
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
        script.async = true
        script.defer = true
        
        script.onload = () => {
          console.log('Google Maps script loaded successfully')
          const map = new window.google.maps.Map(mapElement, {
            center: KLCC_COORDINATES,
            zoom: 17,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          })

          // Add marker for KLCC
          const marker = new window.google.maps.Marker({
            position: KLCC_COORDINATES,
            map: map,
            title: 'Kuala Lumpur Convention Centre',
            animation: window.google.maps.Animation.DROP,
          })
          
          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>AMSC 2025</strong><br>${KLCC_ADDRESS}</div>`,
          })
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
          
          setMapLoaded(true)
          setIsLoading(false)
        }
        
        script.onerror = (e) => {
          console.error('Failed to load Google Maps script', e)
          setError('Failed to load Google Maps. Please check your internet connection.')
          setIsLoading(false)
        }
        
        document.head.appendChild(script)
        
        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script)
          }
        }
      } catch (err) {
        console.error('Error initializing map:', err)
        setError('An error occurred while loading the map.')
        setIsLoading(false)
      }
    }

    initMap()
  }, [apiKey])

  // If there's an error, show a fallback static map or error message
  if (error) {
    return (
      <div className="relative w-full h-[400px] border border-gray-200 mb-4 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="text-center p-6 bg-white rounded shadow-sm max-w-md w-full">
            <p className="mb-4 text-red-600">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to Google Maps directly...
            </p>
            
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(KLCC_ADDRESS)}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              View on Google Maps
            </a>
          </div>
        </div>
        
        {/* Static fallback map image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${KLCC_COORDINATES.lat},${KLCC_COORDINATES.lng}&zoom=16&size=600x400&markers=color:red|${KLCC_COORDINATES.lat},${KLCC_COORDINATES.lng}&key=${apiKey || ''}`}
            alt="Static map of KLCC" 
            fill
            style={{ objectFit: 'cover' }}
            onError={() => console.error('Static map failed to load')}
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-[400px] border border-gray-200 mb-4">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-6 bg-white rounded shadow-sm">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
            <p className="mb-4">Loading map...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[400px] border border-gray-200 mb-4 rounded-lg overflow-hidden">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Link to directions */}
      {mapLoaded && (
        <div className="absolute bottom-4 right-4 z-10">
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(KLCC_ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-700 px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-blue-50 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12 2.75a.75.75 0 01.75.75v.75h3.75a.75.75 0 010 1.5H18a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V6H2.75A.75.75 0 012 5.25V3a.75.75 0 01.75-.75h3.75V1.5a.75.75 0 011.5 0v.75h3.75a.75.75 0 01.75.75v.75H16.5v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75h-3.75v.75a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-.75H2.75v.75a.75.75 0 01-.75.75H1.25a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75h3.75v-.75a.75.75 0 01.75-.75h4.5zM3.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zm4 0a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zm4 0a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z" clipRule="evenodd" />
            </svg>
            Get Directions
          </a>
        </div>
      )}
    </div>
  )
} 