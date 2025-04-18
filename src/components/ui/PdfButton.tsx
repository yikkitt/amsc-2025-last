import React, { useState } from 'react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!containerRef.current) {
      setErrorMessage('Form container element not found');
      console.error('Form container element not found');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      
      // Log what's being used for PDF generation
      console.log('Starting PDF generation for form type:', formType);
      console.log('Container element:', containerRef.current);
      
      await generateFormPDF(containerRef.current, formData, formType, includeEmptyItems);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Error generating PDF: ${message}`);
      console.error('Error downloading PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className={`inline-flex items-center justify-center rounded-md border border-transparent ${
          isGenerating ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
        } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
      >
        {isGenerating ? (
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
            Generating PDF...
          </>
        ) : (
          <>
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
          </>
        )}
      </button>
      
      {errorMessage && (
        <div className="mt-2 text-sm text-red-600">
          {errorMessage}
          <p className="mt-1">
            Try refreshing the page before attempting to download again.
          </p>
        </div>
      )}
    </div>
  );
}; 