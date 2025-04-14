import { FormData } from '@/types/forms'

export const EMAIL_TEMPLATES = {
  FORM_SUBMISSION: process.env.NEXT_PUBLIC_SENDGRID_FORM_SUBMISSION_TEMPLATE || 'd-default-template',
  LATE_SUBMISSION: process.env.NEXT_PUBLIC_SENDGRID_LATE_SUBMISSION_TEMPLATE || 'd-default-template',
  REGISTRATION_CONFIRMATION: process.env.NEXT_PUBLIC_SENDGRID_REGISTRATION_TEMPLATE || 'd-default-template',
} as const

// Validate template IDs
Object.entries(EMAIL_TEMPLATES).forEach(([key, value]) => {
  if (value === 'd-default-template') {
    console.warn(`Warning: ${key} template ID not configured in environment variables`)
  }
})

export const EMAIL_SENDER = {
  email: 'noreply@amsc2025.com',
  name: process.env.NEXT_PUBLIC_APP_NAME || 'AMSC 2025 Exhibitor Manual',
}

export interface EmailConfig {
  to: string
  templateId: string
  dynamicTemplateData: Record<string, any>
  from?: typeof EMAIL_SENDER
  attachments?: Array<{
    content: string
    filename: string
    type: string
    disposition: 'attachment'
  }>
}

export const getFormSubmissionEmailConfig = (
  formData: FormData,
  formType: number,
  isPastDeadline: boolean
): EmailConfig => {
  const templateId = isPastDeadline ? EMAIL_TEMPLATES.LATE_SUBMISSION : EMAIL_TEMPLATES.FORM_SUBMISSION

  return {
    to: formData.email,
    templateId,
    from: EMAIL_SENDER,
    dynamicTemplateData: {
      company_name: formData.company_name,
      contact_person: formData.contact_person,
      booth_number: formData.booth_number,
      form_type: formType,
      submission_date: new Date().toISOString(),
      is_late_submission: isPastDeadline,
      late_charge: formData.late_charge || 0,
      total_amount: formData.grand_total || 0,
    },
  }
} 