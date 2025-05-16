import { Metadata } from 'next'
import Link from 'next/link'
import TabSystem from './TabSystem'

export const metadata: Metadata = {
  title: "Customized Booth Design Guidelines - AMSC 2025",
  description: 'Guidelines for exhibitors planning to build custom booths at AMSC 2025.',
}

export default function CustomizedBoothDesignPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Customized Booth Design Guidelines</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
        <p className="px-6 pt-6">Guidelines for exhibitors planning to build custom booths at AMSC 2025.</p>
        
        <TabSystem />
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Approval Process</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center mr-3">
              <span className="font-bold">1</span>
            </div>
            <div>
              <h3 className="font-bold">Design Submission</h3>
              <p>Submit all design drawings by May 15, 2025</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center mr-3">
              <span className="font-bold">2</span>
            </div>
            <div>
              <h3 className="font-bold">Technical Review</h3>
              <p>Organizer reviews designs for compliance</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center mr-3">
              <span className="font-bold">3</span>
            </div>
            <div>
              <h3 className="font-bold">Modification Requests</h3>
              <p>If needed, address any compliance issues</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center mr-3">
              <span className="font-bold">4</span>
            </div>
            <div>
              <h3 className="font-bold">Final Approval</h3>
              <p>Receive approval email for build-up access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 