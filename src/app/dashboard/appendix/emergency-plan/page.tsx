import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "KLCC's Emergency Response Plan - AMSC 2025",
  description: 'Emergency procedures for all exhibitors and attendees at AMSC 2025.',
}

export default function EmergencyResponsePlanPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">KLCC's Emergency Response Plan</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <p className="text-base">Important procedures for all exhibitors and attendees to follow during emergency situations at AMSC 2025.</p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-amber-800">Familiarize yourself with these emergency procedures before arriving at the exhibition. This information is distributed throughout the exhibition area.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
            <h3 className="font-bold p-3 bg-red-100 border-b border-red-200 text-red-800">Emergency Contact Numbers</h3>
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <div className="font-medium">KLCC Emergency Hotline:</div>
                <div className="font-bold">03-2333-2888</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Security Control Room:</div>
                <div className="font-bold">03-2333-2999</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Fire Brigade:</div>
                <div className="font-bold">03-2033-2777</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="font-medium">Medical Emergency Services:</div>
                <div className="font-bold">03-2223-9999</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">Exhibition Operations Office:</div>
                <div className="font-bold">03-2333-2898</div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="font-bold p-3 bg-gray-50 border-b border-gray-200">Fire Emergency</h3>
            <div className="p-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Remain calm</li>
                <li>Activate the nearest fire alarm</li>
                <li>Call KLCC Emergency Hotline: 03-2333-2888</li>
                <li>Use fire extinguishers only if safe to do so</li>
                <li>Only attempt to extinguish small fires (e.g. size of waste basket)</li>
                <li>Do not use the lifts</li>
                <li>Evacuate via the nearest emergency exit</li>
                <li>Proceed to the nearest emergency exit</li>
                <li>Follow instructions from security personnel</li>
                <li>Go to the designated assembly point</li>
              </ul>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="font-bold p-3 bg-gray-50 border-b border-gray-200">Medical Emergency</h3>
            <div className="p-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Remain calm</li>
                <li>Call KLCC Emergency Hotline: 03-2333-2888</li>
                <li>Provide exact location and details of emergency</li>
                <li>If trained, provide first aid until help arrives</li>
                <li>Do not move injured person unless in danger</li>
                <li>Keep a clear area around the person</li>
                <li>Comfort and reassure the individual</li>
                <li>Contact Exhibition Operations Office</li>
              </ul>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="font-bold p-3 bg-gray-50 border-b border-gray-200">Evacuation Procedure</h3>
            <div className="p-4">
              <h4 className="font-medium mb-2 text-blue-800">When to Evacuate:</h4>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>When instructed to do so by security personnel</li>
                <li>When an evacuation announcement is made</li>
                <li>When continuous alarm sounds</li>
                <li>When in immediate danger</li>
              </ul>
              
              <h4 className="font-medium mb-2 text-blue-800">Evacuation Steps:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Stop all activities (e.g. turn off all equipment)</li>
                <li>Secure valuable items if time permits</li>
                <li>Follow exit signs and keep to the left</li>
                <li>Do not use elevators or escalators</li>
                <li>Do not run, push or overtake others</li>
                <li>Assist those needing special assistance if safe to do so</li>
                <li>Go to your designated assembly point</li>
                <li>Remain at assembly point for headcount</li>
                <li>Report to your company representative</li>
                <li>Do not re-enter until instructed by the authorities</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg overflow-hidden">
            <h3 className="font-bold p-3 bg-blue-100 border-b border-blue-100">Assembly Points</h3>
            <div className="p-4">
              <p className="mb-3">Assembly Point A: KLCC Garden area (near fountain)</p>
              <p>Secondary Assembly Point: KLCC Esplanade (near Tucker Street)</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="font-bold p-3 bg-gray-50 border-b border-gray-200">Lockdown Procedure</h3>
            <div className="p-4">
              <p className="mb-3">If there is an armed intruder or other serious security incident:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Listen for lockdown announcement or alert</li>
                <li>Find a secure location to hide</li>
                <li>Lock and barricade all doors and close blinds</li>
                <li>Stay away from windows and doors</li>
                <li>Remain silent and switch phones to silent mode</li>
                <li>Wait for official "all clear" before leaving secured area</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Weather and Natural Disasters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Earthquake</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Drop, take cover under sturdy table, cover and hold on</li>
                <li>Stay away from windows, glass, and exterior walls</li>
                <li>Do not use elevators, stairs, or escalators</li>
                <li>Wait for instructions from security management</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Severe Weather</h3>
              <p>KLCC will monitor severe weather conditions. In case of extreme weather warnings, follow venue management instructions regarding evacuation or emergency procedures.</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">For the safety of all Building tenants, KLCC Management reserves the right to initiate emergency procedures as deemed necessary to protect life and property.</p>
        </div>
      </div>
    </div>
  )
} 