'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function SpecialDesignSamplePage() {
  const [activeTab, setActiveTab] = useState('section-a');

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
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('section-a')}
              className={`mr-2 py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'section-a'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Section A
            </button>
            <button
              onClick={() => setActiveTab('section-b')}
              className={`mr-2 py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'section-b'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Section B
            </button>
            <button
              onClick={() => setActiveTab('section-c')}
              className={`mr-2 py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'section-c'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Section C
            </button>
            <button
              onClick={() => setActiveTab('section-d')}
              className={`mr-2 py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'section-d'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Section D
            </button>
            <button
              onClick={() => setActiveTab('section-e')}
              className={`mr-2 py-2 px-3 border-b-2 font-medium text-sm ${
                activeTab === 'section-e'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Section E
            </button>
          </nav>
        </div>
        
        {/* Section A */}
        {activeTab === 'section-a' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">General Information</h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Section A
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      General information
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      REGIONAL CONFERENCE OF DERMATOLOGY 2024
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Date
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Oct 3 - 5, 2024
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contractor Company
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contractor Name
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Handphone
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booth Name/ Number
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booth Size
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Halls Name
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      Ballroom
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Booth Height
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      3.0m
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    <td className="px-6 py-3 text-sm text-red-600 font-medium">
                      Due to some variance in the heights in some areas within the different halls, all exhibitors/ stand builders must refer to the technical floor plans provided by show organizer.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Section B */}
        {activeTab === 'section-b' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Technical Floor Plan</h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full">
                <tbody className="bg-white">
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Section B
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-6 py-3 text-sm">
                      <p className="mb-4">Attach the technical floor plan showing the exact location of the stand location plan.</p>
                      <div className="border border-gray-200 p-4 rounded-lg">
                        <div className="relative w-full h-[500px]">
                          <Image
                            src="/images/sample-floor-plan.png"
                            alt="Technical Floor Plan"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Section C */}
        {activeTab === 'section-c' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Construction and Structural Details</h2>
            
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full">
                <tbody>
                  <tr className="bg-[#fdf3e7]">
                    <td className="w-12 px-4 py-3 text-center font-medium border-r border-gray-200">
                      1
                    </td>
                    <td className="px-4 py-3">
                      Only 3D stand design plans or photos are accepted
                    </td>
                  </tr>
                  <tr className="bg-[#fdf3e7]">
                    <td className="w-12 px-4 py-3 text-center font-medium border-r border-gray-200">
                      2
                    </td>
                    <td className="px-4 py-3">
                      The structural details of the stand should include Orthographic View (Elevations and Isometric) which cater all angles of the model.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mb-6">
              <p className="font-medium mb-3 text-gray-700">C.2 (1) - Example of Orthographic View-Top, Side, Front and Back grid/elevation drawing with measurements.</p>
              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <div className="relative w-full h-[600px]">
                  <Image
                    src="/images/elevation.png"
                    alt="Orthographic View Example"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="font-medium mb-3 text-gray-700">C.2 (2) - Top, Side, Front, and Back grid/elevation views</p>
              
              <div className="border border-gray-200 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="border border-gray-200 rounded-lg p-2">
                    <div className="relative w-full h-[180px] mb-1">
                      <Image
                        src="/images/front-view.png"
                        alt="Front Views"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center">Front perspective of the booth</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-2">
                    <div className="relative w-full h-[180px] mb-1">
                      <Image
                        src="/images/side-view.png"
                        alt="Side Views"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center">Side perspective of the booth</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-2">
                    <div className="relative w-full h-[180px] mb-1">
                      <Image
                        src="/images/back-view.png"
                        alt="Back Views"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center">Back perspective of the booth</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-2">
                    <div className="relative w-full h-[180px] mb-1">
                      <Image
                        src="/images/top-view.png"
                        alt="Top Views"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center">Top perspective of the booth</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">Sample 3D renderings showing different angles of the booth design</p>
              </div>
            </div>
            
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full">
                <tbody>
                  <tr className="bg-[#fdf3e7]">
                    <td className="w-12 px-4 py-3 text-center font-medium border-r border-gray-200">
                      3
                    </td>
                    <td className="px-4 py-3">
                      The construction and structural details of the stand should include the respective building methodology, materials used and other relevant details inclusive of specific suspension requirements if required.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mb-6">
              <div className="relative w-full h-[400px] border border-gray-200 rounded-lg mb-4">
                <Image
                  src="/images/front-view.png"
                  alt="Booth Perspective with Structure Labels"
                  fill
                  className="object-contain"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-medium">Structure A</span>
                </div>
                <div className="absolute top-1/3 right-1/3 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-medium">Structure B</span>
                </div>
                <div className="absolute bottom-1/3 left-1/2 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-medium">Structure C</span>
                </div>
              </div>
              
              <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
                <div className="bg-[#2563eb] text-white px-4 py-3">
                  <h3 className="font-medium">Material Used</h3>
                </div>
                <table className="min-w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-4 py-2 text-sm italic">
                        Eg: Timber/Plywood/Metal pole (including thickness/ sizes / diameter etc.)
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        1
                      </th>
                      <td className="px-4 py-3 text-sm">
                        Structure A:
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        2
                      </th>
                      <td className="px-4 py-3 text-sm">
                        Structure B:
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        3
                      </th>
                      <td className="px-4 py-3 text-sm">
                        Structure C:
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        4
                      </th>
                      <td className="px-4 py-3 text-sm">
                        Platform/Flooring:
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
                <div className="bg-[#2563eb] text-white px-4 py-3">
                  <h3 className="font-medium">Method to construct/support</h3>
                  <p className="text-sm italic text-blue-100">eg: method to construct the 3 sets of triangle share wooden arch</p>
                </div>
                <table className="min-w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-4 py-2 text-sm italic">
                        <p>To list down the steps in building up structures. Example:</p>
                        <ol className="list-decimal ml-6 mt-2 space-y-1">
                          <li>3 units of xx inch X xx inch attached to form triangular arch minimum with xx screw points.</li>
                          <li>Boxed up lighted supported by metal pole/beam attached to triangular arch.</li>
                          <li>Support Method for Backdrop – 'L' shape design backdrop (90 degrees) with xx inch width and counter xx kg as counter weight</li>
                          <li>etc</li>
                        </ol>
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        1
                      </th>
                      <td className="px-4 py-3 text-sm">
                        
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        2
                      </th>
                      <td className="px-4 py-3 text-sm">
                        
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        3
                      </th>
                      <td className="px-4 py-3 text-sm">
                        
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        4
                      </th>
                      <td className="px-4 py-3 text-sm">
                        
                      </td>
                    </tr>
                    <tr>
                      <th className="w-12 px-4 py-3 bg-blue-50 text-center text-sm font-medium text-blue-800 border-r border-gray-200">
                        5
                      </th>
                      <td className="px-4 py-3 text-sm">
                        
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full">
                <tbody>
                  <tr className="bg-[#fdf3e7]">
                    <td className="w-12 px-4 py-3 text-center font-medium border-r border-gray-200">
                      4
                    </td>
                    <td className="px-4 py-3">
                      A copy of the Structural Engineering Certification for Double deck and "complex" stand. (use additional or separate document where necessary)
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="px-6 py-4">
                      <p className="mb-3">PE endorsement is not required when:</p>
                      <ol className="list-decimal ml-8 space-y-1 text-sm">
                        <li>Platform less than 3 inch</li>
                        <li>Below 1 ton (vehicle/object/machine)</li>
                        <li>Ramp usage design for less than 200kg load</li>
                      </ol>
                      <p className="mt-3 text-sm italic">Ref: 3inch=7.62cm= 0.25 ft</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Section D */}
        {activeTab === 'section-d' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Preparation Information</h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Section D
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prepared by
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name of the stand builder
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Section E */}
        {activeTab === 'section-e' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Approval Information</h2>
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Section E
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accepted by
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name of organizer or the appointed stand plan competent contractor
                    </th>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
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