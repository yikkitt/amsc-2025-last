'use client'

import { useState } from 'react'

export default function TabSystem() {
  const [activeTab, setActiveTab] = useState('design');
  
  return (
    <>
      <div className="flex border-b border-gray-200 mt-4 bg-gray-50">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'design' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('design')}
        >
          Design Rules
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'construction' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('construction')}
        >
          Construction
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'materials' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
      </div>
      
      {activeTab === 'design' && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Design Requirements</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Visual Impact</h3>
            <p>Custom booths should align with the aesthetic medicine theme of DDCON 2025. Designs should be professional, elegant, and project a premium medical image.</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Height Restrictions</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Standard maximum height: 4 meters</li>
              <li>Island booths (≥36 sqm): Up to 5 meters with approval</li>
              <li>Double-decker booths: Up to 6 meters with structural certification</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Booth Transparency</h3>
            <p>At least 50% of each open side must remain transparent or open to maintain visibility throughout the exhibition hall.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-1">Neighboring Booths</h3>
            <p>Solid walls adjacent to neighboring booths must not exceed 2.5m in height. All walls visible to neighboring booths must be properly finished in white.</p>
          </div>
        </div>
      )}
      
      {activeTab === 'construction' && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Construction Guidelines</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Build Schedule</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Build-up period: June 18-19, 2025</li>
              <li>Construction hours: 8:00 AM - 10:00 PM</li>
              <li>All major construction must be completed by June 19, 2:00 PM</li>
              <li>Only finishing touches allowed after this time</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Contractor Regulations</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>All contractors must be registered with the organizer</li>
              <li>Contractor badges are required for access</li>
              <li>Safety harnesses mandatory for work above 2m height</li>
              <li>Performance bond required: RM5,000 (refundable)</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Flooring</h3>
            <p>All raw space exhibitors must provide floor covering for their entire booth area. Raised platforms must have beveled edges and be wheelchair accessible.</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Electrical Work</h3>
            <p>All electrical installations must comply with local safety standards and be installed by qualified electricians. Main supply will be provided to a distribution board within your booth.</p>
          </div>
        </div>
      )}
      
      {activeTab === 'materials' && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Material Requirements</h2>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Approved Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fire-resistant or fire-retardant materials</li>
              <li>Non-flammable fabrics with fire certificates</li>
              <li>Metal framing systems</li>
              <li>Tempered or safety glass with visible markings</li>
              <li>Plywood, MDF, or particleboard that meets fire safety standards</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Prohibited Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Highly flammable materials like straw, hay, or crepe paper</li>
              <li>Untreated timber or bamboo</li>
              <li>Oil-based paints or solvents (use water-based alternatives)</li>
              <li>Compressed gases without proper certification</li>
              <li>PVC materials that release toxic fumes when heated</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Sustainability Guidelines</h3>
            <p>DDCON 2025 encourages sustainable booth design. Consider using:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reusable or recyclable materials</li>
              <li>LED lighting instead of halogen</li>
              <li>Water-based, non-toxic paints and finishes</li>
              <li>Modular systems that can be reused</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-1">Material Certification</h3>
            <p>Fire certificates for fabrics and materials must be available on-site during construction and throughout the exhibition. All custom booth exhibitors must submit material specifications along with their booth design submission.</p>
          </div>
        </div>
      )}
    </>
  );
} 