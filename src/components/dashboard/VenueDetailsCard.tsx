import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function VenueDetailsCard() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 flex items-center">
        <Building2 className="text-white mr-2" size={20} />
        <h3 className="text-lg font-semibold text-white">Venue Details</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <path d="M15 9h1"/>
                <path d="M9 15h1"/>
                <path d="M15 15h1"/>
                <path d="M9 9h1"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Booth Dimensions</h4>
              <p className="text-sm text-gray-600">Standard booth: 3m x 3m (9 sqm)</p>
              <p className="text-sm text-gray-600">Premium booth: 6m x 3m (18 sqm)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <Building2 size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Facilities</h4>
              <p className="text-sm text-gray-600">Free Wi-Fi throughout exhibition halls</p>
              <p className="text-sm text-gray-600">Loading bays for efficient move-in/out</p>
              <p className="text-sm text-gray-600">Food court and refreshment areas</p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <Link 
              href="https://www.singaporeexpo.com.sg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              Visit venue website
              <ExternalLink className="ml-1" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 