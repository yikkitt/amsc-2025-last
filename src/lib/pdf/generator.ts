import React from 'react'
import { FormData } from '@/types/forms'

// Basic styles
const styles = {
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
}

// Simplified version to fix build issues
export const generateFormPDF = (formData: FormData, formType: number) => {
  const filename = `${formData.company_name}_${new Date().toISOString().split('T')[0]}_Form${formType}.pdf`;
  
  // Return a mock object that doesn't use JSX
  return {
    filename,
    document: "PDF functionality temporarily disabled for debugging"
  };
} 