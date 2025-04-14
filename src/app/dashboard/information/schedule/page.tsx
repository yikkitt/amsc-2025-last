import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Exhibition Schedule - AMSC 2025',
  description: 'Exhibition schedule for AMSC 2025',
}

export default function ExhibitionSchedulePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Exhibition Schedule</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Exhibition Schedule</h2>
        
        <p className="mb-6">
          Please take note of the following schedule for the AMSC 2025 exhibition. All exhibitors must adhere to these timelines.
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
                  <td className="border border-gray-300 px-4 py-2 text-sm" rowSpan={2}>Wed 5th Jul 2023<br/>(Build-up Day 1)</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">0900:00 - 12:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Move-in/Floor Possession by Official Contractor</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">12:00 PM - 5:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Exhibitors Move-in</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" colSpan={3}>
                    <p className="font-medium text-amber-700 mb-1">All construction details must be completed by 08:00 PM, 5th October 2024.</p>
                    <p className="font-medium text-amber-700 mb-1">Stand dressing and stocking up to should be completed by 08:00 PM, 5th October 2024.</p>
                    <p className="font-medium text-amber-700">All contractor debris, booth coveralls, packing cases, and all other leftovers must be cleared away from the facility by 08:00 PM, 5th October 2024.</p>
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
                  <td className="border border-gray-300 px-4 py-2 text-sm">Thu, 6th Oct 2024<br/>(Show Day 1)</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">08:00 AM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Registration / Exhibitors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" rowSpan={2}></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">09:00 AM - 5:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Open to Exhibitors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">10:00 AM - 5:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Show Open</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Fri, 7th Oct 2024<br/>(Show Day 2)</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">08:00 AM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Open to Exhibitors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" rowSpan={2}></td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">09:00 AM - 4:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Show Open</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm">04:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Hall Closes for Exhibitors</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" colSpan={3}>
                    <p className="font-medium text-amber-700 mb-1">Only hand-carry items are allowed to move out from the hall from 05:00 PM onwards, 7th October 2024. Refer to time/date listed in the Regulations/Requirements.</p>
                    <p className="font-medium text-amber-700">Exhibits must be removed and vacated by 08:00 PM, 7th October 2024.</p>
                    <p className="font-medium text-amber-700">Automatic penalties (including forfeiture of performance bond) will be imposed for failure to comply.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-100 py-2 px-4 rounded-lg">TEAR DOWN</h3>
          
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
                  <td className="border border-gray-300 px-4 py-2 text-sm">Sat, 7th Oct 2024<br/>(Dismantling)</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">5:00 PM - 11:00 PM</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">Tear down</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-sm" colSpan={3}>
                    <p className="font-medium text-amber-700 mb-1">Exhibits items must be cleared from the stands by 7:00 PM, 7th Oct 2024 (the organiser/Official Contractor cannot be held responsible for any items left on your stands after this time).</p>
                    <p className="font-medium text-amber-700 mb-1">Any leftover items will be disposed of by the organizer at your expense.</p>
                    <p className="font-medium text-amber-700">The organiser/Official Contractor is not held responsible for any items left in the hall beyond 10:00 PM, Sat 7th Oct 2024.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Notes:</h3>
          <ul className="list-disc ml-6 space-y-1 text-gray-700">
            <li>On exhibition days, exhibitors are permitted to enter the exhibition hall 1 hour before and 1 hour after official open hours.</li>
            <li>Exhibitors reporting to their contractor must be at their stand prior to exhibition doors opening for security reasons. Only Exhibition authorized personnel with proper identification are permitted to enter.</li>
            <li>Stand manning is a must. Unattended stands deny equal opportunity for meeting your targets and may deplete visitor experience.</li>
            <li>This schedule is subject to any changes. Amendments to any changes will inform all concerned once it is available.</li>
          </ul>
        </div>
        
        <p className="mt-6 text-gray-600 text-sm italic">
          For more detailed information, please refer to your Exhibitor Manual or contact the Exhibition Management.
        </p>
      </div>
    </div>
  )
} 