'use client'

import { useState } from 'react'

export default function TabSystem() {
  const [activeTab, setActiveTab] = useState('design');

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 font-medium ${
              activeTab === 'design'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('design')}
          >
            Design Restrictions
          </button>
          <button
            className={`py-4 px-6 font-medium ${
              activeTab === 'height'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('height')}
          >
            Height Limitations
          </button>
          <button
            className={`py-4 px-6 font-medium ${
              activeTab === 'regulations'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('regulations')}
          >
            Safety Regulations
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'design' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Design Restrictions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All designs must be self-supporting and stable</li>
              <li>No hanging elements from venue ceiling</li>
              <li>No structural attachments to venue floors or walls</li>
              <li>All materials must be flame retardant</li>
              <li>All electrical installations must comply with local regulations</li>
              <li>No flashing lights that may disturb neighboring booths</li>
              <li>Storage areas must be concealed from public view</li>
            </ul>
          </div>
        )}

        {activeTab === 'height' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Height Limitations</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Maximum height for all booth construction: 4.5 meters</li>
              <li>Maximum height for perimeter booths: 3.5 meters</li>
              <li>All elements over 2.5 meters must be set back 0.5 meters from aisle</li>
              <li>Signs and banners cannot exceed 5 meters from floor level</li>
              <li>Double-decker booth structures require special approval and inspection</li>
            </ul>
          </div>
        )}

        {activeTab === 'regulations' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Safety Regulations</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All booths must have at least two entry/exit points</li>
              <li>Fire extinguishers required for booths over 36 sq meters</li>
              <li>All electrical wiring must be properly insulated and grounded</li>
              <li>Emergency exit signs must be clearly visible</li>
              <li>No storage of flammable materials within booth area</li>
              <li>Structural engineer certification required for complex designs</li>
              <li>All glass panels must use safety glass and be properly marked</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 