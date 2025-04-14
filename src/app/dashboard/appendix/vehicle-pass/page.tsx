import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Vehicle Pass - AMSC 2025",
  description: 'Download and complete the vehicle pass forms for exhibitor move-in and move-out.',
}

export default function VehiclePassPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Vehicle Pass</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="mb-8">Download and complete the vehicle pass forms for exhibitor move-in and move-out. These passes must be displayed in your vehicle during the designated periods.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-center mb-4">
                <div className="rounded-lg border border-gray-300 overflow-hidden w-56 h-72 relative">
                  <Image 
                    src="/images/vehicle-entry-pass.png"
                    alt="Vehicle Entry Pass (Exhibitor)"
                    width={224}
                    height={288}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-center font-bold mb-2">Vehicle Entry Pass (Exhibitor)</h3>
              <p className="text-center text-sm mb-4">For exhibitor move-in on 2 Oct 2024. Vehicle restrictions apply.</p>
              <div className="mt-auto">
                <button className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Pass
                </button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-center mb-4">
                <div className="rounded-lg border border-gray-300 overflow-hidden w-56 h-72 relative">
                  <Image 
                    src="/images/vehicle-exit-pass.png"
                    alt="Vehicle Entry Pass (Move-Out)"
                    width={224}
                    height={288}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-center font-bold mb-2">Vehicle Entry Pass (Move-Out)</h3>
              <p className="text-center text-sm mb-4">For exhibitor move-out on 5 Oct 2024. Maximum waiting time: 30 minutes.</p>
              <div className="mt-auto">
                <button className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Pass
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Important Vehicle Information</h2>
          
          <ul className="list-disc pl-5 space-y-3">
            <li>Vehicle entering the loading dock area must not exceed 20 feet in length and 12.5 feet in height.</li>
            <li>Permit must be shown to security before entering check-point.</li>
            <li>Each vehicle is limited to 30 minutes maximum waiting time in loading bay.</li>
            <li>Please retain the pass to security at exit point.</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 