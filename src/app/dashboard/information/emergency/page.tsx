import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Emergency Evacuation - DDCON 2025',
  description: 'Emergency evacuation procedures for DDCON 2025',
}

export default function EmergencyEvacuationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Emergency Evacuation Procedures</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Emergency Evacuation Procedures</h2>
        
        <p className="mb-3">
          The Centre has an Emergency Evacuation Plan to enable the successful evacuation of staff, exhibitors and visitors in the case of a fire or other emergencies.
        </p>
        
        <p className="mb-3">
          All Centre staff will assist in the evacuation if the need arises.
        </p>
        
        <p className="mb-6">
          Contractors and Exhibitors and their employees must be familiar with the emergency exits and it is crucial that all occupants of the Centre must be aware of the Kuala Lumpur Convention Centre Emergency Procedures Plans.
        </p>
        
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center">
            <span className="bg-amber-400 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">!</span> 
            Action upon Hearing the Fire Alarm
          </h3>
          <ul className="ml-8 space-y-2 list-disc">
            <li>Upon the sounding of the emergency tone, immediately stop any ongoing activities.</li>
            <li>Stay in your location and wait for instructions from the Floor Warden or the PA system.</li>
            <li>Switch off all electrical equipment being used if necessary.</li>
            <li>After receiving the evacuation order, evacuate the building in an orderly manner to the assembly area which is located at the KLCC Park.</li>
            <li>Use nearest and safest exit.</li>
            <li>Proceed to the predetermined emergency assembly area and report to the Floor Warden / designated staff for roll call.</li>
            <li>Wait for further instructions.</li>
          </ul>
        </div>
        
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center">
            <span className="bg-amber-400 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">!</span> 
            Evacuation Assembly Area
          </h3>
          <ul className="ml-8 space-y-2">
            <li>During an evacuation, Contractors, Exhibitors and Visitors in any hall or any part of the Centre must be assembled at the nearest Assembly Area.</li>
            <li>The Evacuation Router and Assembly Areas are outlined on the maps below.</li>
            <li>These maps should be studied by all Exhibitors and Contractors and all their staff or agents as part of their familiarisation with the Centre's physical infrastructure.</li>
          </ul>
          <div className="mt-4 p-4 border border-gray-300 rounded bg-white text-center relative h-[400px]">
            <Image 
              src="/images/evacuation-area.png"
              alt="Evacuation Area Map"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center">
            <span className="bg-amber-400 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">!</span> 
            Action in the Event of Fire
          </h3>
          <ul className="ml-8 space-y-2 list-disc">
            <li>Raise the alarm by activating the nearest fire break alarm.</li>
            <li>Report the incident to the nearest Supervisor who has a radio or any type of communication system.</li>
            <li>Attempt to put out the fire if it is safe to do so using the firefighting equipment. Do not put yourself at risk.</li>
            <li>If the smoke or fire threatens to endanger others, close all the doors and evacuate the occupants to the assembly area which is located at the KLCC Park.</li>
          </ul>
        </div>
        
        <div className="mb-6 bg-sky-50 border-l-4 border-sky-400 p-4">
          <h3 className="font-bold text-sky-800 mb-2 flex items-center">
            <span className="bg-sky-400 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">i</span> 
            Calling for Security/Safety Manager
          </h3>
          <ul className="ml-8 space-y-2">
            <li>Call Kuala Lumpur Convention Centre's Fire Control Room – Extension 555.</li>
            <li>Make the communication clear and brief. "This is ... (state your location). We have a fire at ..."</li>
            <li>Wait for further instructions.</li>
          </ul>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Phone No. One</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Phone No. Two</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-sm">Chief Warden</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  <div>Security Manager</div>
                  <div>Safety Manager</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  <div>+60 12 347 7986</div>
                  <div>+60 12 2940 753</div>
                </td>  
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  <div>+603 2333 2957</div>
                  <div>+602 2333 2905</div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-sm">Communication Officer</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">Fire Control Operator</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">Ext. 555</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">+602 2333 2900</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 