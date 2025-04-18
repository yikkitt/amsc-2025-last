import React from 'react';
import { Save } from 'lucide-react';
import FormDownloadButton from '../ui/FormDownloadButton';

interface FormSubmitActionsProps {
  isSubmitting: boolean;
  formData: any;
  formType: string;
  containerRef: React.RefObject<HTMLElement>;
  className?: string;
}

export default function FormSubmitActions({
  isSubmitting,
  formData,
  formType,
  containerRef,
  className = ''
}: FormSubmitActionsProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`inline-flex items-center justify-center rounded-md border border-transparent ${
          isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
        } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex-1`}
      >
        {isSubmitting ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Submitting...
          </>
        ) : (
          <>
            <Save className="h-5 w-5 mr-2" />
            Submit Form
          </>
        )}
      </button>
      
      <FormDownloadButton
        formData={formData}
        formType={formType}
        containerRef={containerRef}
        className="flex-1"
      />
    </div>
  );
} 