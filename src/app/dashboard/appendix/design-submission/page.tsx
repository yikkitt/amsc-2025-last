import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Design Submission Guidelines - AMSC 2025',
  description: 'Guidelines for submitting booth designs for AMSC 2025',
}

export default function DesignSubmissionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Design Submission Guidelines</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="mb-6">
          All exhibitors with raw space booths must submit their designs for approval before construction.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-bold">Submission Deadline</span>
              </p>
              <p className="text-sm text-yellow-700">
                All booth designs must be submitted by May 15, 2025. Late submissions may incur additional fees.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Required Documents</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-1">Perspective Drawing</h3>
              <p className="text-sm">3D rendered image of the proposed booth design</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-1">Floor Plan</h3>
              <p className="text-sm">Top view drawing with dimensions and booth number</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-1">Elevation Plans</h3>
              <p className="text-sm">Front, side, and rear view drawings with dimensions</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-1">Technical Details</h3>
              <p className="text-sm">Details of materials, structural calculations for booths over 4m height</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-1">Electrical Plans</h3>
              <p className="text-sm">Layout of electrical installations, lighting, and power points</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-blue-900">Submission Process</h2>
        
        <div className="space-y-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
              1
            </div>
            <div>
              <h3 className="font-bold">Prepare Your Design Files</h3>
              <p className="text-sm">Create all required drawings according to specifications. All drawings must be to scale and include dimensions.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
              2
            </div>
            <div>
              <h3 className="font-bold">Submit for Review</h3>
              <p className="text-sm">Email all files in PDF format to info@bcpgroup.com.my with your booth number in the subject line.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
              3
            </div>
            <div>
              <h3 className="font-bold">Review Process</h3>
              <p className="text-sm">The organizer will review your submission and respond within 7 working days.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
              4
            </div>
            <div>
              <h3 className="font-bold">Revisions (If Required)</h3>
              <p className="text-sm">If requested, revise your designs and resubmit within 5 working days.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
              5
            </div>
            <div>
              <h3 className="font-bold">Final Approval</h3>
              <p className="text-sm">Once approved, you will receive an approval certificate that must be presented to security during the construction period.</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-blue-900">Technical Specifications</h2>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Maximum Height Limitations</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Standard booth height limit: 4 meters</li>
            <li>Booths over 4 meters (subject to approval)</li>
            <li>Height exceptions require special approval</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Setbacks</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Elements above 2.5m must be set back 0.5m from side</li>
            <li>Neighboring booth walls must be properly finished</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-2">Structural Requirements</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>All structures must be self-supporting and stable</li>
            <li>Structural calculations required for booths over 4m height</li>
            <li>Fire resistant materials must be used</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 