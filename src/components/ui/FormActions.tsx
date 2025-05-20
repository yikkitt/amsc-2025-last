import React, { RefObject } from 'react';
import { PdfButton } from './PdfButton';

interface FormActionsProps {
  isSubmitting: boolean;
  submittedData: any | null;
  formType: number;
  containerRef: RefObject<HTMLElement>;
  onCancel: () => void;
  includeEmptyItems?: boolean;
}

/**
 * Reusable component for form action buttons
 * Displays either Submit button or Download PDF button based on submission state
 */
export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  submittedData,
  formType,
  containerRef,
  onCancel,
  includeEmptyItems = false,
}) => {
  return (
    <div className="flex justify-center space-x-6 mt-8 print:hidden">
      <button
        type="button"
        onClick={onCancel}
        className="px-8 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      
      {submittedData ? (
        <PdfButton
          formData={submittedData}
          formType={formType}
          containerRef={containerRef}
          className="px-8 py-3"
        />
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Form'}
        </button>
      )}
    </div>
  );
}; 