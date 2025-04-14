import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Working Conditions - AMSC 2025",
  description: 'Safety regulations and working conditions for all contractors and exhibitors during build-up and tear-down.',
}

export default function WorkingConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Working Conditions</h1>
        <Link 
          href="/dashboard/appendix" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to Appendix
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <p className="text-base">Safety regulations and working conditions for all contractors and exhibitors during build-up and tear-down.</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold text-red-800 mb-2">Safety First</h2>
          <p className="text-red-700">Safety is our highest priority. All contractors and exhibitors must comply with these regulations. Non-compliance may result in work stoppage and financial penalties.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-bold">Working Hours</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Build-Up Period:</h4>
              <p className="mb-2">June 18-19, 2025</p>
              <p className="mb-3">8:00 AM - 10:00 PM</p>
              
              <h4 className="font-medium mb-1">Tear-down Period:</h4>
              <p className="mb-2">June 24, 2025</p>
              <p className="mb-3">6:00 PM - 12:00 AM</p>
              
              <h4 className="font-medium mb-1">Extended Hours:</h4>
              <p>Additional hours require prior application.</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-bold">Personal Protective Equipment (PPE)</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Required PPE:</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p>Safety helmets in all construction areas</p>
                </div>
                <div>
                  <p className="italic">When: All build-up and tear-down periods</p>
                </div>
                <div>
                  <p>High-visibility vests or clothing</p>
                </div>
                <div>
                  <p className="italic">When: Loading/unloading and material handling</p>
                </div>
                <div>
                  <p>Safety harnesses for work above 2m height</p>
                </div>
                <div>
                  <p className="italic">When: Operating lifting equipment</p>
                </div>
                <div>
                  <p>Ear protection in noisy environments</p>
                </div>
                <div>
                  <p className="italic">When: handling hazardous materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Safety Regulations</h2>
          
          <div className="space-y-5">
            <div>
              <h3 className="font-bold mb-2">Height Work</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Safety harnesses must be worn and secured for all work above 2m height</li>
                <li>Ladders must be secured and held by a second person</li>
                <li>Scaffolding must have guardrails and toe boards</li>
                <li>Only certified workers may perform height work</li>
                <li>No work permitted directly above other workers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Electrical Safety</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>All electrical work must be performed by qualified electricians</li>
                <li>All electrical equipment must be properly grounded</li>
                <li>Circuit breakers must be accessible at all times</li>
                <li>Cables must be properly secured and not present trip hazards</li>
                <li>No daisy-chaining of power strips or extension cords</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Material Handling</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Proper lifting techniques must be used</li>
                <li>Hand trucks and dollies available for heavy items</li>
                <li>Forklifts may only be operated by certified operators</li>
                <li>Clear pathways must be maintained at all times</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Fire Safety</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>No smoking anywhere in the venue</li>
                <li>Fire extinguishers must remain accessible</li>
                <li>Hot work requires special permits</li>
                <li>Emergency exits must remain clear at all times</li>
                <li>Flammable materials must be properly stored</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-bold">Contractor Requirements</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="p-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Must be registered with the organizer</li>
                <li>ID badges must be worn at all times</li>
                <li>Performance bond must be paid before work begins</li>
                <li>Insurance certificates must be submitted</li>
                <li>Supervisors must be on-site at all times</li>
                <li>Risk assessment must be submitted for approval</li>
                <li>Compliance with all local health and safety regulations</li>
              </ul>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-gray-50 p-3 border-b border-gray-200">
              <h3 className="font-bold">General Conduct</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="p-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>No alcohol or drugs permitted on site</li>
                <li>Appropriate clothing must be worn at all times</li>
                <li>Respect venue property and other exhibitors' spaces</li>
                <li>Maintain cleanliness of work areas</li>
                <li>Dispose of waste properly in designated areas</li>
                <li>Keep noise to a minimum during exhibition hours</li>
                <li>Follow all instructions from security and safety personnel</li>
                <li>Report all accidents and incidents immediately</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-blue-900">Emergency Procedures</h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <h3 className="font-bold p-3 bg-gray-50 border-b border-gray-200">In Case of Emergency</h3>
            <div className="p-4 space-y-1">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Remain calm and assess the situation</li>
                <li>Contact venue security or call emergency hotline: 03-2333-2888</li>
                <li>Alert the nearest security personnel or organizer staff</li>
                <li>Follow instructions from authorized personnel</li>
                <li>Evacuate if instructed, using marked emergency exits</li>
              </ol>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">First Aid</h3>
            <p>First aid stations are located at the main entrance and in Hall 5. All accidents, regardless of severity, must be reported to the organizer.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 