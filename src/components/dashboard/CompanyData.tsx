import React from 'react';
import { Building, User, Hash, Mail, AlertCircle } from 'lucide-react';

interface CompanyDataProps {
  companyName?: string;
  contactPerson?: string;
  boothNumber?: string;
  email?: string;
  isLoading?: boolean;
}

export default function CompanyData({
  companyName = 'Not Available',
  contactPerson = 'Not Available',
  boothNumber = 'Not Available',
  email = 'Not Available',
  isLoading = false
}: CompanyDataProps) {
  // Data cards for display - coming from Supabase
  const dataItems = [
    {
      id: 'company',
      label: 'Company Name',
      value: companyName,
      icon: <Building size={20} />
    },
    {
      id: 'contact',
      label: 'Contact Person',
      value: contactPerson,
      icon: <User size={20} />
    },
    {
      id: 'booth',
      label: 'Booth Number',
      value: boothNumber,
      icon: <Hash size={20} />
    },
    {
      id: 'email',
      label: 'Email',
      value: email,
      icon: <Mail size={20} />
    }
  ];
  
  // Check if all values are not available
  const isAllDataMissing = dataItems.every(item => item.value === 'Not Available');
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-between">
        <div className="flex items-center">
          <Building className="text-white mr-2" size={20} />
          <h3 className="text-lg font-semibold text-white">Company Data</h3>
        </div>
        
        {isAllDataMissing && (
          <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
            <AlertCircle size={14} className="mr-1" />
            <span>Profile incomplete</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {dataItems.map((item) => (
              <div 
                key={item.id}
                className="p-3 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-2">
                    {item.icon}
                  </div>
                  <h4 className="font-medium text-gray-700">{item.label}</h4>
                </div>
                
                <div className="mt-1">
                  <span className={`text-gray-900 font-medium block truncate ${item.value === 'Not Available' ? 'text-gray-400 italic' : ''}`}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isAllDataMissing && !isLoading && (
          <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700 flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Your company information is incomplete. Please update your profile to see your company details here.
                You can update your profile from the account settings.
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 