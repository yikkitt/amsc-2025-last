import React from 'react';

const FormDisclaimer: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-yellow-800">
          If you wish to make any changes, please email us at info@bcpgroup.com.my
        </p>
      </div>
      
      <div className="text-center text-sm text-gray-600 mt-8 pt-4 border-t border-gray-200">
        <p>All data collected will be used solely for this event and marketing purposes.</p>
      </div>
    </div>
  );
};

export default FormDisclaimer; 