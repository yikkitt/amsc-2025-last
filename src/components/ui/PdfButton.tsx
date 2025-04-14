import React, { useRef } from 'react';
import { generateFormPDF } from '@/lib/pdf/pdfGenerator';

interface PdfButtonProps {
  formData: any;
  formType: number;
  includeEmptyItems?: boolean;
  containerRef: React.RefObject<HTMLElement>;
  className?: string;
}

export const PdfButton: React.FC<PdfButtonProps> = ({
  formData,
  formType,
  includeEmptyItems = false,
  containerRef,
  className = '',
}) => {
  const handleDownload = async () => {
    if (!containerRef.current) {
      console.error('Form container element not found');
      return;
    }

    try {
      await generateFormPDF(containerRef.current, formData, formType, includeEmptyItems);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      Download PDF
    </button>
  );
}; 