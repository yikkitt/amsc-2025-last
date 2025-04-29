import React from 'react'
import { PdfButton } from './PdfButton'

interface SubmissionNotificationProps {
  submittedData: any
  formType: number
  containerRef: React.RefObject<HTMLElement>
  onReturnToDashboard: () => void
  isAlreadySubmitted?: boolean
  submissionDate?: string
}

export default function SubmissionNotification({
  submittedData,
  formType,
  containerRef,
  onReturnToDashboard,
  isAlreadySubmitted = false,
  submissionDate
}: SubmissionNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl transform transition-all">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isAlreadySubmitted ? 'Form Already Submitted' : 'Form Successfully Submitted'}
          </h3>
          <p className="text-gray-600">
            {isAlreadySubmitted ? (
              <>
                This form was previously submitted on {submissionDate}. 
                You can download a PDF copy or return to the dashboard.
              </>
            ) : (
              'Your form has been submitted successfully. You can download a PDF copy or return to the dashboard.'
            )}
          </p>
        </div>
        
        <div className="space-y-4">
          <PdfButton
            formData={submittedData}
            formType={formType}
            containerRef={containerRef}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </PdfButton>
          
          <button
            onClick={onReturnToDashboard}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
} 