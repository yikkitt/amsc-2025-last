import React from 'react';

interface SuccessMessageProps {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  title = 'Form Successfully Submitted',
  message = 'You have already submitted this form. You can download a PDF copy or return to the dashboard.',
  children 
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="bg-green-100 rounded-full p-3 mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="text-green-600 font-semibold text-lg mb-2">
          {title}
        </div>
        <p className="text-gray-600">
          {message}
        </p>
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage; 