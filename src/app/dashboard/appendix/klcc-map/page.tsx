import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'KLCC Map and Location Guide - AMSC 2025',
  description: 'Map and location information for the Kuala Lumpur Convention Centre',
}

export default function KLCCMapPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">KLCC Map and Location Guide</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="mb-6">
          Use the maps below to locate the Kuala Lumpur Convention Centre and navigate the venue.
        </p>
        
        <div className="mb-6">
          <div className="flex border-b border-gray-300 mb-4">
            <button className="px-4 py-2 font-medium text-blue-800 border-b-2 border-blue-800">Google Map</button>
            <button className="px-4 py-2 font-medium text-gray-600">Venue Floor Plan</button>
          </div>
          
          <div>
            <h2 className="text-lg font-bold mb-2 text-blue-900">KLCC Location</h2>
            <p className="mb-2 text-gray-700">Kuala Lumpur Convention Centre, Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia</p>
            
            <div className="relative w-full h-[400px] border border-gray-200 mb-4">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-6 bg-white rounded shadow-sm">
                  <p className="mb-4">This page can't load Google Maps correctly.</p>
                  <p className="text-sm text-gray-500 mb-4">Do you own this website?</p>
                  <button className="px-4 py-1 bg-blue-500 text-white rounded">OK</button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Address:</h3>
              <p className="mb-1">Kuala Lumpur Convention Centre</p>
              <p className="mb-1">Kuala Lumpur City Centre</p>
              <p className="mb-1">50088 Kuala Lumpur</p>
              <p className="mb-1">Malaysia</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-2">Contact:</h3>
              <p className="mb-1">Tel: +603 2333 2888</p>
              <p className="mb-1">Email: <a href="mailto:info@klccconventioncentre.com" className="text-blue-600 hover:underline">info@klccconventioncentre.com</a></p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-blue-900">Transport Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-bold mb-2">By Train</h3>
            <p className="text-sm">KLCC is accessible via the LRT Kelana Jaya Line. Exit at KLCC Station and follow signs to the convention centre.</p>
          </div>
          
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-bold mb-2">By Car</h3>
            <p className="text-sm">Underground parking is available at KLCC. Enter via Jalan Pinang or Jalan P. Ramlee entrances.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-bold mb-2">By Taxi</h3>
            <p className="text-sm">Drop-off points are available at the main entrance of the convention centre.</p>
          </div>
          
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-bold mb-2">From Airport</h3>
            <p className="text-sm">KLIA Express to KL Sentral, then connect to LRT Kelana Jaya Line to KLCC Station.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 