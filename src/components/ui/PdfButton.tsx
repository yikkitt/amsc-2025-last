import React, { useState } from 'react';
import { generateFormPDF } from '@/lib/pdf/pdfGenerator';

interface PdfButtonProps {
  formData: any;
  formType: number | string;
  containerRef: React.RefObject<HTMLElement>;
  className?: string;
  includeEmptyItems?: boolean;
}

export const PdfButton: React.FC<PdfButtonProps> = ({
  formData,
  formType,
  containerRef,
  className = '',
  includeEmptyItems = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');

  const handleDownload = async () => {
    if (!containerRef.current) {
      setErrorMessage('Form container element not found');
      setStatus('error');
      console.error('Form container element not found');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setStatus('generating');
      
      // Log what's being used for PDF generation
      console.log('Starting PDF generation for form type:', formType);
      console.log('Container element:', containerRef.current);
      console.log('Form data:', formData);
      
      // Verify form data
      if (!formData) {
        setErrorMessage('No form data available for generating PDF');
        setStatus('error');
        console.error('Form data is missing');
        setIsGenerating(false);
        return;
      }
      
      // Detect browser and platform for better error handling
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isIE = /*@cc_on!@*/false || !!(document as any).documentMode;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isIOS) {
        console.warn('iOS detected - PDF download might open in a new tab');
      }
      
      if (isIE) {
        console.warn('Internet Explorer detected - using compatibility mode');
      }
      
      // Convert formType to string if it's a number
      const formTypeString = typeof formType === 'number' ? `Form${formType}` : formType.toString();
      
      // Generate PDF using updated parameters
      try {
        // NOTE: generateFormPDF expects 3 parameters in this order:
        // 1. formElement: HTMLElement (containerRef.current)
        // 2. formType: string (formTypeString)
        // 3. formData: FormData (formData)
        await generateFormPDF(
          containerRef.current,
          formTypeString,
          formData
        );
        
        // Set success status
        setStatus('success');
        
        // Show success message
        showNotification('PDF generated successfully!', 'success');
      } catch (err) {
        console.error('PDF generation error:', err);
        setErrorMessage(`Error generating PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setStatus('error');
        
        // Show error notification
        showNotification('Error generating PDF. Please try again.', 'error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Error downloading PDF: ${message}`);
      setStatus('error');
      console.error('Error downloading PDF:', error);
      
      // Show error notification
      showNotification('Failed to download PDF. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function for notifications
  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0.9';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
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
  };

  // Custom button label based on status
  const getButtonLabel = () => {
    switch (status) {
      case 'generating':
        return 'Generating PDF...';
      case 'success':
        return 'Download Again';
      case 'error':
        return 'Try Again';
      default:
        return 'Download PDF';
    }
  };

  // Button color based on status
  const getButtonColor = () => {
    switch (status) {
      case 'generating':
        return 'bg-green-400';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-green-600 hover:bg-green-700';
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className={`inline-flex items-center justify-center rounded-md border border-transparent ${
          getButtonColor()
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
            {getButtonLabel()}
          </>
        )}
      </button>
      
      {errorMessage && (
        <div className="mt-2 text-sm text-red-600">
          <p className="font-bold">Error:</p>
          <p>{errorMessage}</p>
          <div className="mt-2 p-2 bg-gray-100 text-gray-800 rounded-md text-xs">
            <p className="font-semibold">Troubleshooting tips:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Try refreshing the page before attempting to download again</li>
              <li>Ensure all form fields are completed correctly</li>
              <li>Try using a different web browser (Chrome or Firefox recommended)</li>
              <li>Check your internet connection</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}; 