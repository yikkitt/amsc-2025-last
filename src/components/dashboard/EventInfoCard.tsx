import React from 'react';
import { Calendar, MapPin, Info } from 'lucide-react';

export default function EventInfoCard() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center">
        <Info className="text-white mr-2" size={20} />
        <h3 className="text-lg font-semibold text-white">Event Information</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Event Dates</h4>
              <p className="text-sm text-gray-600">March 15-17, 2025</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Location</h4>
              <p className="text-sm text-gray-600">Singapore Expo Convention & Exhibition Centre</p>
              <p className="text-sm text-gray-600">1 Expo Drive, Singapore 486150</p>
            </div>
          </div>
          
          <div className="mt-4 text-sm border-t pt-4">
            <p className="mb-2">
              <span className="font-medium">Exhibitor Move-in:</span> March 13-14, 2025
            </p>
            <p className="mb-2">
              <span className="font-medium">Exhibition Hours:</span> 10:00 AM - 6:00 PM daily
            </p>
            <p>
              <span className="font-medium">Exhibitor Move-out:</span> March 17, 2025 (after 6:00 PM)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}