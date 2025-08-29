import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Do's & Don'ts of Shell Scheme - DDCON 2025",
  description: 'Guidelines for shell scheme booth setup and regulations',
}

export default function ShellSchemePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Do's & Don'ts of Shell Scheme</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="mb-6">
          Follow these guidelines to ensure your shell scheme booth complies with exhibition regulations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <h2 className="text-xl font-bold mb-4 text-green-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Do's
            </h2>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Ensure all display materials are confined within your booth area</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Use lightweight, non-flammable materials for booth decorations</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Adhere to height restrictions (maximum 2.5m for standard shell scheme)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Seek approval for any structural changes to the standard shell scheme</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Use removable adhesives (e.g. double-sided tape) that won't damage panels</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Ensure all electrical installations comply with safety regulations</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Keep emergency exits and aisles clear at all times</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Remove all booth materials after the exhibition closes</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-red-50 rounded-lg p-6 border border-red-100">
            <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Don'ts
            </h2>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not paint, drill, nail, or screw into any part of the shell scheme</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not exceed the weight limit for shelves and displays (5kg per shelf)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not block neighboring booths with tall displays or bright lighting</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not use flammable materials like straw, hay, or crepe paper</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not affix anything to the ceiling or overhead structures</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not remove fascia boards or structural elements of the booth</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not obstruct fire safety equipment, emergency exits, or aisles</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Do not play music or create noise that disturbs other exhibitors</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Shell Scheme Specifications</h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <h3 className="text-lg font-bold p-4 bg-gray-50 border-b border-gray-200">Standard Shell Scheme Booth</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-4">
                <h4 className="font-bold mb-2">Dimensions</h4>
                <p className="mb-1">Standard size: 3m x 3m (9 sqm)</p>
                <p>Height: 2.5m</p>
              </div>
              
              <div className="p-4">
                <h4 className="font-bold mb-2">Structure</h4>
                <p className="mb-1">Aluminum framework with white infill panels</p>
                <p>Fascia with company name and booth number</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200">
              <h4 className="font-bold p-4 bg-gray-50 border-b border-gray-200">Standard Inclusions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-y-2">
                <div>• Carpet flooring</div>
                <div>• 2 spotlights</div>
                <div>• 1 information counter</div>
                <div>• 2 folding chairs</div>
                <div>• 1 waste paper basket</div>
                <div>• 1 power socket (13 amp)</div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="text-lg font-bold p-4 bg-gray-50 border-b border-gray-200">Technical Guidelines</h3>
            
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-bold mb-2">Weight Restrictions</h4>
              <p className="mb-1">Maximum 5kg per shelf</p>
              <p>Heavy exhibits must be placed on the floor</p>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-bold mb-2">Display Limitations</h4>
              <p className="mb-1">Display materials must not extend beyond booth boundaries</p>
              <p>Maximum height for displays: 2.5m</p>
            </div>
            
            <div className="p-4">
              <h4 className="font-bold mb-2">Special Requirements</h4>
              <p>Any special requirements or modifications to the standard shell scheme must be submitted to the organizer for approval by May 15, 2025.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 