'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    google: any;
  }
}

export default function KLCCMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const mapElement = mapRef.current
    if (!mapElement) return

    const initMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          const map = new window.google.maps.Map(mapElement, {
            center: { lat: 3.1579, lng: 101.7118 },
            zoom: 17,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          })

          new window.google.maps.Marker({
            position: { lat: 3.1579, lng: 101.7118 },
            map: map,
            title: 'Kuala Lumpur Convention Centre',
          })
          setIsLoading(false)
          return
        }

        // Load Google Maps script
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        script.async = true
        script.defer = true
        script.onload = () => {
          const map = new window.google.maps.Map(mapElement, {
            center: { lat: 3.1579, lng: 101.7118 },
            zoom: 17,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          })

          new window.google.maps.Marker({
            position: { lat: 3.1579, lng: 101.7118 },
            map: map,
            title: 'Kuala Lumpur Convention Centre',
          })
          setIsLoading(false)
        }
        script.onerror = () => {
          setError('Failed to load Google Maps. Please check your API key and internet connection.')
          setIsLoading(false)
        }
        document.head.appendChild(script)

        return () => {
          document.head.removeChild(script)
        }
      } catch (err) {
        setError('An error occurred while loading the map.')
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  if (error) {
    return (
      <div className="relative w-full h-[400px] border border-gray-200 mb-4">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-6 bg-white rounded shadow-sm">
            <p className="mb-4 text-red-600">{error}</p>
            <p className="text-sm text-gray-500 mb-4">Please check your API key configuration.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-[400px] border border-gray-200 mb-4">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-6 bg-white rounded shadow-sm">
            <p className="mb-4">Loading map...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[400px] border border-gray-200 mb-4">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
} 