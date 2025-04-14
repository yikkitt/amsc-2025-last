import { expect } from 'vitest'
import { BaseFormData } from '../BaseForm'

export const validBaseFormData: BaseFormData = {
  company_name: 'Test Company',
  contact_person: 'John Doe',
  booth_number: 'A123',
  telephone: '1234567890',
  email: 'test@example.com',
}

export const fillBaseFormFields = (screen: any, fireEvent: any) => {
  fireEvent.change(screen.getByLabelText(/company name/i), {
    target: { value: validBaseFormData.company_name },
  })
  fireEvent.change(screen.getByLabelText(/contact person/i), {
    target: { value: validBaseFormData.contact_person },
  })
  fireEvent.change(screen.getByLabelText(/booth number/i), {
    target: { value: validBaseFormData.booth_number },
  })
  fireEvent.change(screen.getByLabelText(/telephone/i), {
    target: { value: validBaseFormData.telephone },
  })
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: validBaseFormData.email },
  })
}

export const checkBaseFormValidation = async (screen: any, waitFor: any) => {
  await waitFor(() => {
    expect(screen.getByText(/company name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/contact person is required/i)).toBeInTheDocument()
    expect(screen.getByText(/booth number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/telephone is required/i)).toBeInTheDocument()
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
  })
} 