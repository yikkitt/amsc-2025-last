import React from 'react';
import Link from 'next/link';

interface FormCardProps {
  id: number;
  title: string;
  description: string;
  deadline: string;
  isMandatory?: boolean;
  isSubmitted?: boolean;
  status?: 'not_started' | 'in_progress' | 'completed' | 'late';
}

const FormCard: React.FC<FormCardProps> = ({
  id,
  title,
  description,
  deadline,
  isMandatory = false,
  isSubmitted = false,
  status = 'not_started'
}) => {
  // Status label and colors
  const statusConfig = {
    not_started: {
      label: 'Not Started',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200'
    },
    in_progress: {
      label: 'In Progress',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    completed: {
      label: 'Completed',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    late: {
      label: 'Late',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    }
  };
  
  const { label, bgColor, textColor, borderColor } = statusConfig[status];
  
  // Calculate days remaining
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className={`p-6 rounded-lg border ${isSubmitted ? 'border-green-200' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          FORM {id}: {title}
        </h3>
        {isMandatory && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Mandatory
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm font-medium text-gray-500">Deadline:</span>
          <span className={`ml-1 ${daysRemaining < 0 ? 'text-red-600' : daysRemaining <= 7 ? 'text-yellow-600' : 'text-gray-600'}`}>
            {deadline}
          </span>
        </div>
        
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} border ${borderColor}`}>
          {label}
        </span>
      </div>
      
      <div className="flex justify-between pt-3 border-t border-gray-100">
        {isSubmitted ? (
          <Link 
            href={`/dashboard/forms/download/form${id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Download PDF
          </Link>
        ) : (
          <Link 
            href={`/dashboard/order-forms/form${id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" 
                clipRule="evenodd" 
              />
            </svg>
            Fill Form
          </Link>
        )}
        
        <div className="text-xs text-gray-500">
          {daysRemaining > 0 
            ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining` 
            : 'Deadline passed'}
        </div>
      </div>
    </div>
  );
};

export default FormCard; 