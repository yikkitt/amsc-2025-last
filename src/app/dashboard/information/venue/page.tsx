"use client"

import { useState } from 'react'

export default function VenueRulesPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Venue's Rules & Regulations</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-6 text-white bg-blue-800 -mx-6 px-6 py-3">Venue's Rules & Regulations</h2>
        
        <p className="mb-6">
          The Rules and Regulations listed below are designed for safety, security and to provide equal exposure for all exhibitors. Exhibitors and 
          their personnel / appointed agents must observe the Rules and Regulations stated in this Exhibitor Manual and those attached to the 
          Exhibit Space Contract.
        </p>
        
        <div className="mb-6">
          <div className="flex flex-wrap border-b border-gray-300 mb-4">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'general' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-600'}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'loading' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-600'}`}
              onClick={() => setActiveTab('loading')}
            >
              Loading & Unloading
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'technical' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-600'}`}
              onClick={() => setActiveTab('technical')}
            >
              Technical
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'conduct' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-600'}`}
              onClick={() => setActiveTab('conduct')}
            >
              Conduct & Promotion
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'services' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-600'}`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
          </div>
          
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Animals
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Live animals and pets are not permitted in the exhibition booths.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Air conditioning / Ventilation
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Air conditioning/ventilation is not provided in the venue during the build-up or tear down period.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Flying Objects
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Remote controlled and free flying objects are not permitted in the exhibition booths.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Food & Beverage (F&B) Policy
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>The Kuala Lumpur Convention Centre is the exclusive supplier of food and beverage. The Centre is the exclusive provider of food and beverage.</li>
                  <li>Distribution or sale of food and beverage by anyone other than the Centre is strictly prohibited. The Centre reserves the right to exclude exhibitors' service of food or beverage not supplied by the Centre to public or trade visitors with the exception of Food & Beverage or similar shows.</li>
                  <li>Retailers are prohibited from promoting popcorn machines, peanut roasters, cotton candy machines or similar items in their exhibition booths.</li>
                  <li>Sales and distribution of popcorn and cotton candy is also prohibited inside the exhibition booths.</li>
                  <li>Exhibitors can order on-site stand catering by completing the Stand Catering Menu and Beverage Order Form provided by the Kuala Lumpur Convention Centre.</li>
                  <li>Exhibitors who wish to use coffee machines would be charge corkage fee accordingly.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Building Care
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>No attachment, fitting, equipment or device is allowed to be affixed to or suspended from any structure of the building as this can damage the structural of the building.</li>
                  <li>No nails, screws or other devices shall be driven into any part of the building structure.</li>
                  <li>No paint, distemper, and other coloring substance shall be applied to the floors, walls, pillars or any part of the building structure.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Smoking Policy
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>The Kuala Lumpur Convention Centre is a non-smoking venue. Smoking is strictly prohibited within the venue.</li>
                  <li>Designated smoking areas are available outside the venue at street level.</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'loading' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Loading and Unloading Areas
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>All loading and unloading of exhibition materials must be done at designated loading bays.</li>
                  <li>Loading bay access is strictly for loading and unloading activities only. Parking is not permitted.</li>
                  <li>Vehicles must vacate the loading bay immediately after loading/unloading is completed.</li>
                  <li>All drivers must follow instructions from venue staff and security personnel.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Material Handling
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>The use of forklift trucks and other mechanical handling equipment by exhibitors is not permitted.</li>
                  <li>Only the official freight forwarder appointed by the organizer is permitted to operate such equipment within the venue.</li>
                  <li>All exhibitors must coordinate with the official freight forwarder for material handling requirements.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Storage
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>The venue does not provide storage facilities for packing cases, surplus materials or other property of the exhibitor.</li>
                  <li>All such materials must be removed from the exhibition hall prior to the opening of the exhibition.</li>
                  <li>Unauthorized storage of materials behind exhibition booths is strictly prohibited for fire safety reasons.</li>
                  <li>Exhibitors requiring storage facilities should contact the official freight forwarder for arrangements.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Delivery Time
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>All deliveries must be made during the official build-up period.</li>
                  <li>Deliveries during exhibition opening hours are not permitted.</li>
                  <li>The organizer and the venue reserve the right to refuse acceptance of deliveries made outside designated times.</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'technical' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Electrical Installation, Compliance and Fire Safety
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>For exhibitions, electrical equipment for the booth will be installed by the electrician wiring contractor appointed by the official show organizer.</li>
                  <li>Exhibitors must include sufficient electrical sockets to serve all of the equipment on the stand.</li>
                  <li>Only one extension lead per socket will be permitted. The use of block sockets for multiple plugs are not permitted.</li>
                  <li>The Centre reserves the right to withhold connection of power to a stand or to shut off power to a stand which it does not comply with the health and safety requirements of KLCC deemed to be unsafe.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Floor Loading Limits
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>The floor loading capacity in Exhibition Halls 1-5 is 500 kg/sqm.</li>
                  <li>For any exhibits exceeding this limit, please inform the organizer in advance for special arrangements.</li>
                  <li>The Organizer and venue management reserves the right to refuse any exhibit that exceeds the permitted floor loading limits.</li>
                  <li>Exhibitors must spread the weight of any heavy exhibits evenly across the floor to prevent point loading.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Machines / Equipment
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>All machinery and equipment exhibited must not cause any vibration or noise that may affect other stands or cause distress to visitors.</li>
                  <li>Safety guards must be placed around all moving machinery and equipment that are operational for demonstration purposes.</li>
                  <li>Exhibitors must provide proper fire safety precautions for any demonstration involving heat, gas pressure or other potential hazards.</li>
                  <li>Any machinery or equipment demonstration requires prior approval from the organizer.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Sound Levels
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Noise levels must not exceed 80 decibels at a distance of 3 meters from the sound source.</li>
                  <li>Exhibitors planning to use sound amplification equipment must inform the organizer in advance.</li>
                  <li>The organizer reserves the right to request exhibitors to reduce the volume or cease operations if the sound level disturbs other exhibitors or visitors.</li>
                  <li>Repeated violations of the noise level regulations may result in the power supply to the offending stand being terminated.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Ceiling Rigging
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Exhibitors are not permitted to hang or suspend any items from the ceiling without prior written approval.</li>
                  <li>All ceiling rigging must be carried out by the venue's appointed contractor.</li>
                  <li>Detailed technical plans must be submitted for approval at least 30 days before the exhibition setup date.</li>
                  <li>Maximum load capacity for ceiling rigging points is 100kg per point.</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'conduct' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Exhibitor Activities
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Exhibitors must provide full details of any potentially dangerous activities to be undertaken in the exhibition booth(s) to the Show Organizer.</li>
                  <li>No such activities may be conducted during an exhibition without the Show Organizer and the Centre's approval which must be obtained before venue booking confirmation.</li>
                  <li>Special attention is paid to activities involving children's safety, lasers and moving equipment etc.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Promotional Materials
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>All promotional materials such as leaflets, brochures or samples can only be distributed from the exhibitor's own booth.</li>
                  <li>Distribution of promotional material in public areas, walkways, entrances/exits or outside the exhibition halls is strictly prohibited.</li>
                  <li>The organizer reserves the right to remove any unauthorized promotional materials and may charge the exhibitor for cleaning costs.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Soliciting / Demonstrating
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Business solicitations and demonstrations must be conducted within the exhibitor's booth boundaries.</li>
                  <li>Exhibitors and their staff are not permitted to conduct business activities in the aisles or other public areas of the exhibition hall.</li>
                  <li>Any exhibitor found soliciting in the aisles or public areas may be removed from the exhibition.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Competitions and Giveaways
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Exhibitors planning to organize prize competitions, raffles or giveaways must obtain prior written approval from the organizer.</li>
                  <li>All activities must comply with local laws and regulations on gaming and prize competitions.</li>
                  <li>The organizer reserves the right to terminate any unauthorized competitions or activities.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Intellectual Property Rights
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Exhibitors must ensure that all exhibits, products, and materials on display do not infringe any trademarks, copyrights, patents, or other intellectual property rights.</li>
                  <li>The organizer reserves the right to remove any products suspected of infringing intellectual property rights from the exhibition.</li>
                  <li>Exhibitors are solely responsible for any legal consequences resulting from intellectual property infringements.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Photography and Filming
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Photography and filming of exhibition stands other than your own is prohibited without prior consent from the exhibitor concerned.</li>
                  <li>The organizer reserves the right to engage official photographers and videographers to record the exhibition.</li>
                  <li>By participating in the exhibition, exhibitors grant permission to the organizer to use photographs, videos, and other visual recordings of their stands for promotional and marketing purposes.</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Stand Cleaning
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>General cleaning of common areas is provided by the organizer.</li>
                  <li>Basic cleaning of stands will be carried out each evening after exhibition hours.</li>
                  <li>Special or additional cleaning requirements should be arranged with the appointed cleaning contractor.</li>
                  <li>Exhibitors are responsible for maintaining the cleanliness of their stands during exhibition hours.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Internet Services
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>Complimentary WiFi is available throughout the venue for basic internet browsing.</li>
                  <li>For dedicated high-speed internet connections, exhibitors must order in advance using the Internet Service Order Form.</li>
                  <li>Exhibitors requiring specific bandwidth or guaranteed connections should make arrangements at least 14 days before the event.</li>
                  <li>Unauthorized WiFi networks that interfere with the venue's network infrastructure are prohibited.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Security Services
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>General security of the exhibition hall is provided by the organizer.</li>
                  <li>Exhibitors are responsible for the security of their own exhibits and personal property.</li>
                  <li>Additional stand security can be arranged through the official security contractor.</li>
                  <li>The venue and organizer are not responsible for any loss or damage to exhibitor property.</li>
                  <li>Exhibitors are advised to take out appropriate insurance coverage for their exhibits.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Catering Services
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>The Centre is the exclusive provider of food and beverage services.</li>
                  <li>Exhibitors can order stand catering using the Stand Catering Menu and Beverage Order Form.</li>
                  <li>All catering orders must be placed at least 7 days before the exhibition.</li>
                  <li>Last-minute orders are subject to availability and may incur additional charges.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  First Aid Services
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>First aid facilities are available at the venue during show days.</li>
                  <li>The first aid room is located on Level 3 near the Registration Counter.</li>
                  <li>For medical emergencies, please contact the nearest security personnel or information counter.</li>
                  <li>All incidents requiring first aid should be reported to the organizer's office.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="flex items-center font-bold text-gray-900 mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Business Centre
                </h3>
                <ul className="list-disc ml-7 space-y-1">
                  <li>A business centre is available in the venue providing services such as photocopying, printing, and faxing.</li>
                  <li>The business centre is located on Level 3 near the Concourse area.</li>
                  <li>Services are charged according to the business centre's published rates.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm italic">
          For more detailed rules and regulations, please refer to your Exhibitor Manual or contact the Exhibition Management.
        </p>
      </div>
    </div>
  )
} 