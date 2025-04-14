import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Special Design Rules & Regulations - AMSC 2025',
  description: 'Special design rules and regulations for custom booths at AMSC 2025',
}

export default function SpecialDesignRulesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Special Design's Rules & Regulations</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Special Design's Rules & Regulations</h2>
        
        <p className="mb-6">
          Please ensure to read and complete Form 6 - Form 8 and Appendix A if you intend to have special design on your stand and return to 
          Official Contractor. These forms need to be submitted with your stand design otherwise your stand design will be rejected.
        </p>
        
        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 mb-6">
          <h3 className="text-yellow-800 font-bold mb-3 uppercase text-center">
            Ceiling material information must be submitted for full-enclosed, covered booth (with solid ceiling and roofed structure)
          </h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Detailed scale drawing with proposed 3D design, detailed dimensions and height including the plan views and elevation.</li>
            <li>Roof loading and structure calculation.</li>
            <li>Specification of materials used.</li>
            <li>Method statement to include fire hazards and method statement.</li>
            <li>Structural engineer's certificate to the venue management no later than 21 days prior to the event build-up.</li>
            <li>Ensure that a roof or ceiling material is required to provide additional fire protection like water sprinkle; CO2, chemical fire prevention.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center bg-blue-100 p-3 mb-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-blue-800">DESIGN APPROVAL & RULES</h3>
          </div>
          
          <ol className="list-decimal ml-6 space-y-3">
            <li>Height limit for special design booth is 6m. (Highest point of rigging is 6m including structural rigging).</li>
            <li>The maximum height of display wall must not exceed 3m height.</li>
            <li>When its achieved that branding wall can be to the edge of the neighboring stand.</li>
            <li>Please note the following is required for approval, these must be submitted to the Official Contractor, according to the booth 
               submission format of Appendix A no later than <strong>2 September 2024</strong>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>3D view with full Stand Dimension</li>
                <li>Please make sure you attach as one PDF document showing all 4 sides of the stand;</li>
                <li>Working drawings, Structure Material Detail and Support Details of the stand (the construction material shall be non-flammable or fire-retardant);</li>
                <li>Plan views;</li>
                <li>Elevation Drawings (Front, back and side);</li>
                <li>Electrical detail (PE document);</li>
                <li>All drawings must include details of the construction material and the methods to be used for assembly.</li>
                <li>These plans will be vetoed by the organizers and the venue's Safety Management Plan and Fire, only approved if the design is acceptable.</li>
              </ul>
            </li>
            <li>Any devices are not permitted, talking to others in this rule will incur costs to contractors as stand alterations will have to be made to fulfill the rule. Therefore make sure that your consent are modified off or splayed or otherwise protected to ensure it does not damage.</li>
            <li>Any partition of stands must not extend above or over that of the stand adjoining to the next or side partition walls. Any submitted or straight, also shall be masked with white paint or equal when those at the exhibitor's expense.</li>
            <li>Any section of walls facing gangways and which does not provide an alternative means of access, must have a "NO ENTRY" sign affixed. 
                Doors installed on the sides, must NOT open towards the aisle causing an obstruction to others.</li>
            <li>The Organizer have the right to reject any stand plan deemed to be:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Structurally unsafe;</li>
                <li>Does not conform to the specifications listed in the manual;</li>
                <li>Causing obstruction to neighboring booths.</li>
              </ul>
            </li>
            <li>Stand structures or designs which are not approved, or do not conform to the technical regulations or the laws governing such items, 
                must be altered or removed where necessary. When the exhibitor or stand constructor fails to comply with the regulations, the 
                necessary alterations.</li>
            <li>Stands should not be fabricated without the Official Contractor approval.</li>
            <li>Documentation required for stands with double decker stands, please refer to the below:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>These must be submitted to Official Contractor no later than <strong>2 September 2024</strong></li>
                <li>3D view with full Stand Dimension</li>
                <li>Include double stand proof the 3D view showing the all 4 sides of the ground floor / first floor along with the staircase;</li>
                <li>Working drawings, Structure Material Detail and Support Details of the stand (the construction material shall be non-flammable or fire-retardant);</li>
                <li>Plan Layout Drawing;</li>
                <li>Architectural Plan;</li>
                <li>Elevation Drawings (Front, back and side);</li>
                <li>Electrical detail;</li>
                <li>Structural Design Calculations stamped by professional Engineer / Company registered under Board of Engineer Malaysia (BEM);</li>
                <li>Load per square meter on the ground;</li>
                <li>Structural Drawings;</li>
                <li>The width and position of any emergency exit escape routes within the stand;</li>
                <li>Electrical & Material Detail;</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
} 