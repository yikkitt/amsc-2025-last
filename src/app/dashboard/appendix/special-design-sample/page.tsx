import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Sample of Special Design Stand Submission - AMSC 2025',
  description: 'Sample plans and layouts for special design stand submissions',
}

export default function SpecialDesignSamplePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Sample of Special Design Stand Submission</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="mb-6">
          Below are sample documents to guide you in preparing your special design stand submission. These examples 
          illustrate the level of detail and format required for approval.
        </p>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Sample Perspective View</h2>
          <div className="border border-gray-200 p-4 bg-gray-50 rounded-lg text-center">
            <div className="relative w-full h-[300px] mb-2">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">3D Perspective View Sample</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Sample 3D rendering showing different angles of the booth design</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Sample Floor Plan</h2>
            <div className="border border-gray-200 p-4 bg-gray-50 rounded-lg text-center">
              <div className="relative w-full h-[200px] mb-2">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Floor Plan Sample</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Top view drawing showing dimensions and layout</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Sample Elevation</h2>
            <div className="border border-gray-200 p-4 bg-gray-50 rounded-lg text-center">
              <div className="relative w-full h-[200px] mb-2">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Elevation View Sample</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Front and side views showing heights and dimensions</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Sample Technical Specifications</h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-bold">Materials Specification</h3>
            </div>
            <div className="p-4">
              <ul className="list-disc ml-5 space-y-2 text-sm">
                <li><strong>Main Structure:</strong> Aluminum extrusion system with MDF cladding</li>
                <li><strong>Flooring:</strong> Raised platform with vinyl finish</li>
                <li><strong>Wall Panels:</strong> Fire-retardant MDF panels (6mm thickness)</li>
                <li><strong>Graphics:</strong> Fabric prints with aluminum frame systems</li>
                <li><strong>Lighting:</strong> LED spotlights and strip lighting</li>
                <li><strong>Furniture:</strong> Glass display counters, reception desk, bar stools</li>
              </ul>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-bold">Electrical Details</h3>
            </div>
            <div className="p-4">
              <ul className="list-disc ml-5 space-y-2 text-sm">
                <li><strong>Power Requirements:</strong> Total load of 5KW</li>
                <li><strong>Main Distribution Board:</strong> Located at the back storage area</li>
                <li><strong>Lighting:</strong> 10 x LED spotlights (5W each), 3 x LED strip lights (15W each)</li>
                <li><strong>Sockets:</strong> 4 x 13A power sockets for equipment</li>
                <li><strong>Special Equipment:</strong> 1 x 65" LED screen (120W)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-bold">Important Note:</span> These are sample documents only. Please refer to the Design Submission Guidelines for complete requirements. All submitted designs must comply with the venue's technical specifications and safety regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 