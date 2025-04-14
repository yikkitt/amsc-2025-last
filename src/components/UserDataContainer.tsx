'use client';

import React from 'react';

interface UserDataProps {
  userData?: {
    company_name?: string;
    booth_number?: string;
    contact_person?: string;
    address?: string;
    postcode?: string;
    state?: string;
    country?: string;
    tel?: string;
    telephone?: string;
    fax?: string;
    email?: string;
  } | null;
}

export default function UserDataContainer({ userData }: UserDataProps) {
  if (!userData) {
    console.log('No user data provided to UserDataContainer');
    return null;
  }
  
  console.log('UserDataContainer received data:', userData);
  
  // If no data is available, show a message
  const hasData = userData.company_name || userData.booth_number || userData.contact_person || 
    userData.email || userData.tel || userData.telephone || userData.address;
  
  if (!hasData) {
    console.log('UserDataContainer: No meaningful data to display');
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-2">COMPANY DATA</h2>
        <p className="text-sm text-gray-600 mb-4">
          No company data available. Please update your profile information.
        </p>
      </div>
    );
  }
  
  // Use telephone as a fallback for tel and vice versa
  const phoneNumber = userData.tel || userData.telephone || '-';
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-bold mb-2">COMPANY DATA</h2>
      <p className="text-sm text-gray-600 mb-4">
        Note: The company data section is only for Exhibitor & Organiser's reference. If you would like to update your company's information, kindly contact the organiser as indicated at the end of the form.
      </p>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        <div>
          <div className="mb-4">
            <span className="font-medium block">Company Name</span>
            <span className="text-blue-700">{userData.company_name || '-'}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">Contact Person</span>
            <span className="text-blue-700">{userData.contact_person || '-'}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">Address</span>
            <span className="text-blue-700">{userData.address || '-'}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">Postcode</span>
            <span className="text-blue-700">{userData.postcode || '-'}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">State</span>
            <span className="text-blue-700">{userData.state || '-'}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">Country</span>
            <span className="text-blue-700">{userData.country || '-'}</span>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <span className="font-medium block">Booth Number</span>
            <span className="text-blue-700">{userData.booth_number || '-'}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">Tel</span>
            <span className="text-blue-700">{phoneNumber}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">Fax</span>
            <span className="text-blue-700">{userData.fax || '-'}</span>
          </div>
          
          <div className="mb-4">
            <span className="font-medium block">Email</span>
            <span className="text-blue-700">{userData.email || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 