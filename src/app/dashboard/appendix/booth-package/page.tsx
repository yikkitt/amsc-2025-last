import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Guide for Booth Package - AMSC 2025',
  description: 'Comprehensive guide for booth packages at AMSC 2025',
}

export default function BoothPackageGuidePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Guide for Booth Package</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="mb-4 text-sm text-gray-600">
          Standard booth specifications and other technical booth package information available for AMSC 2025.
        </p>

        <div className="mb-4">
          <div className="flex space-x-2 border-b border-gray-200">
            <button className="px-4 py-2 text-sm font-medium text-blue-800 border-b-2 border-blue-800">Standard Shell Scheme</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600">Premium Booth</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600">Raw Space</button>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-gray-800">Standard Shell Scheme</h2>
        
        <div className="mb-8">
          <div className="relative w-full h-[300px] border border-gray-200 mb-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
              <div className="w-3/4 h-3/4 border-2 border-gray-400 flex flex-col items-center justify-center">
                <div className="text-gray-500 font-bold mb-2">COMPANY'S NAME</div>
                <div className="flex-1 w-full flex">
                  <div className="w-2/3 border-r border-gray-400"></div>
                  <div className="w-1/3 flex items-end justify-center p-4">
                    <div className="w-16 h-16 border border-gray-400 mb-2"></div>
                  </div>
                </div>
                <div className="w-full text-center text-sm text-gray-400">Standard Shell Scheme (3m x 3m)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Package includes:</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>White wall panels (2.5m height)</li>
              <li>Fascia board with company name</li>
              <li>Carpet flooring (blue)</li>
              <li>2 x Spotlights</li>
              <li>1 x Information counter</li>
              <li>2 x Folding chairs</li>
              <li>1 x Waste paper basket</li>
              <li>1 x 13amp power socket</li>
              <li>1 x Company name on fascia board</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Specifications:</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Size: 3m x 3m (9sqm)</li>
              <li>Height: 2.5m</li>
              <li>Structure: Aluminum frame</li>
              <li>Panels: White infill panels</li>
              <li>Fascia: With company name and booth number</li>
            </ul>
          </div>
        </div>
        
        <hr className="my-6" />
        
        <h3 className="font-bold text-gray-800 mb-2">Additional Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="border border-gray-200 rounded p-3">
            <h4 className="font-bold mb-1">Furniture Rental</h4>
            <p className="text-sm">Additional furniture can be ordered through Form C. A comprehensive furniture catalog is available in the Appendix section.</p>
          </div>
          
          <div className="border border-gray-200 rounded p-3">
            <h4 className="font-bold mb-1">Electrical Services</h4>
            <p className="text-sm">Additional lighting, power sockets, and electrical services can be ordered through Form D. All electrical installations must comply with venue regulations.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded p-3">
            <h4 className="font-bold mb-1">Graphics & Printing</h4>
            <p className="text-sm">Custom graphics, backdrops, and printing services are available through Form E. High-resolution artwork must be provided at least 2 weeks before the event.</p>
          </div>
        </div>
        
        <hr className="my-6" />
        
        <h3 className="font-bold text-gray-800 mb-4">Booth Selection Tips</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-1">For First-Time Exhibitors</h4>
            <p className="text-sm">Standard shell scheme booths offer a cost-effective solution with all basic amenities included. Focus on your product display and marketing materials rather than booth construction.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-1">For Returning Exhibitors</h4>
            <p className="text-sm">Consider upgrading to a premium shell scheme or custom booth to enhance visibility with custom graphics and additional furniture to showcase your expanded product range.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-1">For Major Brands</h4>
            <p className="text-sm">Raw space allows complete customization to align with your brand identity and specific requirements. Ideal for larger spaces with custom booth designs and interactive displays.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 