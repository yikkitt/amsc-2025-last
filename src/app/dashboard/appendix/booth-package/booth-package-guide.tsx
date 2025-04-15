'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function BoothPackageGuide() {
  const [activeTab, setActiveTab] = useState("standard");

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
            <button 
              onClick={() => setActiveTab("standard")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "standard" ? "text-blue-800 border-b-2 border-blue-800" : "text-gray-600"}`}>
              Standard Shell Scheme
            </button>
            <button 
              onClick={() => setActiveTab("raw")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "raw" ? "text-blue-800 border-b-2 border-blue-800" : "text-gray-600"}`}>
              Raw Space
            </button>
          </div>
        </div>
        
        {activeTab === "standard" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Standard Shell Scheme</h2>
            
            <div className="mb-8">
              <div className="relative w-full h-[300px] border border-gray-200 mb-4">
                <Image 
                  src="/images/shell-shceme-booth-example.png"
                  alt="Standard Shell Scheme Booth Example"
                  fill
                  className="object-contain"
                />
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
            
            <h3 className="font-bold text-gray-800 mb-4">Additional Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-bold mb-1">Furniture Rental</h4>
                <p className="text-sm">
                  Additional furniture can be ordered through{' '}
                  <Link href="/dashboard/order-forms/form4" className="text-blue-600 hover:text-blue-800">
                    Form 4
                  </Link>
                  . A comprehensive catalogue is available in the Appendix section.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-bold mb-1">Electrical Services</h4>
                <p className="text-sm">
                  Additional power points, lighting, and electrical services can be ordered through{' '}
                  <Link href="/dashboard/order-forms/form3" className="text-blue-600 hover:text-blue-800">
                    Form 3
                  </Link>
                  .
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-bold mb-1">Graphics & Printing</h4>
                <p className="text-sm">
                  Custom graphics, signage, and printing services are available through{' '}
                  <Link href="/dashboard/order-forms/form5" className="text-blue-600 hover:text-blue-800">
                    Form 5
                  </Link>
                  .
                </p>
              </div>
              
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-bold mb-1">Fascia Name Form</h4>
                <p className="text-sm">
                  Submit your company name for the fascia board through{' '}
                  <Link href="/dashboard/order-forms/form1" className="text-blue-600 hover:text-blue-800">
                    Form 1
                  </Link>
                  .
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === "raw" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Raw Space Option</h2>
            
            <p className="mb-6 text-sm">
              Raw space provides only the floor area for exhibitors who wish to design and build their own custom booths. No structures, carpet, furniture, or electrical connections are provided.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-center border-b pb-2">Package Includes</h3>
                <ul className="list-disc ml-5 space-y-2 text-sm">
                  <li>Exhibition floor space only</li>
                  <li>No structures or walls</li>
                  <li>No carpet</li>
                  <li>No furniture</li>
                  <li>No electrical connections</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-center border-b pb-2">Specifications</h3>
                <ul className="list-disc ml-5 space-y-2 text-sm">
                  <li>Minimum size: 18 sqm</li>
                  <li>Maximum height: 4-6m (location dependent)</li>
                  <li>Design approval required</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 text-center border-b pb-2">Requirements</h3>
                <ul className="list-disc ml-5 space-y-2 text-sm">
                  <li>Exhibitor must appoint a contractor</li>
                  <li>All designs must be submitted for approval</li>
                  <li>Performance bond is required</li>
                  <li>Contractor must be registered with organizer</li>
                  <li>All services must be ordered separately</li>
                  <li>Space must be returned in original condition</li>
                </ul>
              </div>
            </div>
          </>
        )}
        
        <hr className="my-6" />
        
        <h3 className="font-bold text-gray-800 mb-4">Booth Selection Tips</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-1">For First-Time Exhibitors</h4>
            <p className="text-sm">Shell scheme booths offer a cost-effective, hassle-free solution with all basic necessities included. Focus on your product display and marketing materials rather than booth construction.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-1">For Major Brands</h4>
            <p className="text-sm">Raw space allows complete customization to align with your brand identity and marketing objectives. Ideal for larger spaces and unique brand experiences.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 