import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exhibition Schedule - DDCON 2025',
  description: 'Exhibition schedule for DDCON 2025',
}

export default function ExhibitionSchedulePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Exhibition Schedule</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Exhibition Schedule</h2>
        
        <p className="mb-6">
          Please take note of the following schedule for the DDCON 2025 exhibition. All exhibitors must adhere to these timelines.
        </p>
        
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-100 py-2 px-4 rounded-lg">BUILD-UP</h3>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Activity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" rowSpan={2}>Monday, 4th August 2025</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">7:00AM – 9:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Open & Official Contractor build up</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">12:00PM onwards</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Non-Official Contractor build up</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">9:00PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Closed</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" rowSpan={2}>Tuesday, 5th August 2025</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">8:30AM – 9:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Open<br/>Official & Non-Official Contractor build up</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">12.00PM – 6:00PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Exhibitor Check-in / Move-In</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">9:00PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Closed</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" colSpan={3}>
                    <p className="font-medium text-amber-700 mb-1">All stand construction must be completed by 8:00 PM, 5th August 2025.</p>
                    <p className="font-medium text-amber-700 mb-1">Stand dressing and exhibitor set up should be completed by 6:00 PM, 5th August 2025.</p>
                    <p className="font-medium text-amber-700 mb-1">All construction debris, booth materials, packing waster, and all other leftover must be cleared away from the hall by 8:00 PM, 5th August 2025.</p>
                    <p className="font-medium text-amber-700">Automatic penalties including forfeiture of performance bond will be imposed for failure to comply.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-100 py-2 px-4 rounded-lg">SHOW DAY</h3>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Activity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Wednesday, 6th August 2025</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">08:30AM onwards</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Registration of Delegates</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Wednesday, 6th August 2025<br/>(Actual Day 1)</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">8:00 AM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Open for Exhibitors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">9:00 AM – 6:30PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Show hour</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">6:30 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Closed</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Thursday, 7th August 2025<br/>(Actual Day 2)</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">8:00 AM onwards</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Open for Exhibitors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">9:00 AM – 6:30PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Show hour</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm"></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">6:30 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Closed</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" colSpan={3}>
                    <p className="font-medium text-amber-700 mb-1">Only hand carry items are allowed to move out from the hall from 6:30 PM onwards, 7th August 2025. (Refer to Venue's Rules & Regulations)</p>
                    <p className="font-medium text-amber-700 mb-1">Dismantling of stand can commence on 7:00 PM, 7th August 2025.</p>
                    <p className="font-medium text-amber-700">Automatic penalties including forfeiture of performance bond will be imposed for failure to comply.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-100 py-2 px-4 rounded-lg">DISMANTLE</h3>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Activity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Thursday, 7th August 2025<br/>(Dismantle)</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">7:00 PM – 11:55 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Dismantle</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" colSpan={3}>
                    <p className="font-medium text-amber-700 mb-1">Exhibits items must be cleared from the stands by 8:00PM, 7th August 2025, the organizer/ Official Contractor cannot be held responsible for any items left on your stand in the aisle or in the loading bay after this time.</p>
                    <p className="font-medium text-amber-700 mb-1">Any debris left in the hall after 11:55 PM, 7th August 2025 will result in a penalty fee and a charge for disposal.</p>
                    <p className="font-medium text-amber-700">The organiser/ Official Contractor is not held responsible for any items left in the hall beyond 11:55 PM, 7th August 2025.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Note:</h3>
          <p className="text-gray-700">
            On exhibition days, exhibitors are permitted to enter the exhibition hall 1 hour before and stay 1 hour after official event hours. Exhibitors requiring to start earlier/stay later must obtain prior permission from the Organiser for security reasons. Only Exhibitors with valid exhibitors' passes are allowed entry to the Exhibition Hall before and during Exhibition hours.
          </p>
          <p className="mt-2 text-gray-700 font-medium">
            **The exhibition schedule shall be updated from time to time. Kindly check with Organiser shall there be any updates, or we'll keep you informed**
          </p>
        </div>
      </div>
    </div>
  )
} 