import React, { useState } from 'react';
import { Save, Download } from 'lucide-react';
import FormDownloadButton from '../ui/FormDownloadButton';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { FormData } from '@/types/forms';
import { syncFormWithSupabase } from '@/lib/forms/submitHandler';

interface FormSubmitActionsProps {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  formData: FormData;
  formType: string | number;
  containerRef: React.RefObject<HTMLElement>;
  onSuccess?: () => void;
  className?: string;
}

export default function FormSubmitActions({
  isSubmitting,
  setIsSubmitting,
  formData,
  formType,
  containerRef,
  onSuccess,
  className = ''
}: FormSubmitActionsProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission to Supabase form_submissions table
   * Using the centralized syncFormWithSupabase function for consistency
   */
  const handleSubmit = async () => {
    if (!formData) {
      setError('No form data available for submission');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the new syncFormWithSupabase function for consistent form submission
      const result = await syncFormWithSupabase(formData, formType);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      console.log('Form submitted successfully:', result.data);
      setFormSubmitted(true);
      
      // Use the enhanced form data returned from the function
      setSubmittedData(result.submittedData || formData);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Show success notification
      const notification = document.createElement('div');
      notification.textContent = 'Form submitted successfully!';
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
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Unknown error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {!formSubmitted ? (
          <button
            type="button" // Changed from submit to button to prevent automatic form submission
            onClick={handleSubmit}
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
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Form Submitted Successfully</h3>
                <p className="mt-2 text-sm text-green-700">Your form has been submitted successfully. You can now download it as a PDF.</p>
              </div>
            </div>
          </div>
        )}
        
        <FormDownloadButton
          formData={submittedData || formData}
          formType={formType}
          containerRef={containerRef}
          className="flex-1"
        />
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Submitting Form</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 