import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Electrical Rules & Regulations - DDCON 2025',
  description: 'Electrical rules and regulations for exhibitors at DDCON 2025',
}

export default function ElectricalRulesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Electrical Rules & Regulations</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Electrical Rules & Regulations</h2>
        
        <div className="mb-6 flex">
          <div className="mr-3 text-blue-600 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-gray-800">
            Electricity will be supplied by Official Contractor to carry out all electrical work (wiring, connection, lighting and etc.) on all booths at 
            the exhibition. For safety reasons, no other electrical contractor will be permitted to carry out electrical installation.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Electrical power supply is:</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Single-phase: 230V / 50Hz μ ± 5%</li>
            <li>Three-phase: 415V / 50Hz μ ± 5%</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Lighting Connection</h3>
          <p className="mb-3">
            All lighting connection work must be done by Official Contractor. Without any exception, exhibitors including those who provide their 
            own lighting fixtures will be charged the lighting connection. Lighting connections are charged according to the number of tubes and 
            bulbs lighted on the stand.
          </p>
          
          <p className="mb-3">
            Light boxes are charged according to the number of tubes in each light box, using the lighting hook-up or connection rate, whichever 
            is applicable. For LED connection fee is charged based on per meter run at different rate, please refer to the connection charges.
          </p>
          
          <p className="mb-3 text-amber-600 font-medium">
            Exhibitors where lighting fixtures are found to have been the cause of trips / overload in power supply will be responsible for all re-energisation cost.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Power Points & Equipment</h3>
          <p className="mb-3">
            Each individual power point or isolator is to be restricted for the use for only (one) piece of equipment and it cannot be used for 
            lighting purpose. The use of double adaptors is prohibited; contractors are required to order additional power socket from official 
            contractor if necessary.
          </p>
          
          <p className="mb-3">
            Plans and location of electrical points have to be submitted one month before the show opening to the Official Contractor. Official 
            Contractor reserves the right to request Exhibitors to change any wiring installation, connection etc. contained in lighting fixtures for 
            safety reasons.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Safety Compliance</h3>
          <p className="mb-3">
            Cables must be routed away from pedestrian traffic and taped down to minimize a trip hazard. Sime Darby Convention Centre SHE 
            charge-man may check electrical equipment on site for compliance at any time.
          </p>
          
          <p className="mb-3">
            Exhibitors will be required to unplug electrical equipment found to be unsafe or that is not tested or tagged electrical equipment 
            includes light fittings, computers, projectors, office equipment and any electrical appliances etc.
          </p>
          
          <p className="mb-3">
            All personnel working at the stand must be informed of the requirements for electrical equipment.
          </p>
        </div>
      </div>
    </div>
  )
} 