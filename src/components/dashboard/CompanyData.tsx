import React from 'react';
import { Building, User, Hash, Mail } from 'lucide-react';

interface CompanyDataProps {
  companyName?: string;
  contactPerson?: string;
  boothNumber?: string;
  email?: string;
}

export default function CompanyData({
  companyName = 'Not Available',
  contactPerson = 'Not Available',
  boothNumber = 'Not Available',
  email = 'Not Available'
}: CompanyDataProps) {
  // Data cards for display
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
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 flex items-center">
        <Building className="text-white mr-2" size={20} />
        <h3 className="text-lg font-semibold text-white">Company Data</h3>
      </div>
      
      <div className="p-4">
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
                <span className="text-gray-900 font-medium block truncate">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 