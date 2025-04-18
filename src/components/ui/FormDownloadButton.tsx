import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { generateFormPDF } from '@/lib/pdf/pdfGenerator';
import { FormData } from '@/types/forms';

interface FormDownloadButtonProps {
  formData: FormData;
  formType: string | number;
  containerRef: React.RefObject<HTMLElement>;
  className?: string;
}

export default function FormDownloadButton({
  formData,
  formType,
  containerRef,
  className = '',
}: FormDownloadButtonProps) {
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
      console.log('Starting PDF generation for form:', formType);
      console.log('Container element:', containerRef.current);
      console.log('Form data:', formData);
      
      // Verify form data
      if (!formData) {
        setErrorMessage('No form data available for generating PDF');
        console.error('Form data is missing');
        setIsGenerating(false);
        return;
      }
      
      // Convert formType to string if it's a number
      const formTypeString = typeof formType === 'number' ? `Form${formType}` : formType.toString();
      
      // Generate PDF
      try {
        await generateFormPDF(
          containerRef.current,
          formTypeString,
          formData
        );
        
        // Show success message
        const notification = document.createElement('div');
        notification.textContent = 'PDF downloaded successfully!';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0.9';
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.5s';
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 500);
        }, 3000);
      } catch (err) {
        console.error('PDF generation error:', err);
        setErrorMessage(`Error generating PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Error downloading PDF: ${message}`);
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
          isGenerating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
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
            Generating...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
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
} 