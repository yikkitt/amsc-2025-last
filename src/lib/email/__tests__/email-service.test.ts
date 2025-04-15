import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EmailService, EmailConfig } from '../email-service'

// Mock console.log
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('EmailService', () => {
  const mockConfig: EmailConfig = {
    to: 'test@example.com',
    subject: 'Test Subject',
    html: '<p>Test content</p>',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs email sending attempt', async () => {
    const result = await EmailService.sendEmail(mockConfig)
    expect(result).toBe(true)
    expect(console.log).toHaveBeenCalledWith('Would send email:', mockConfig)
  })

  it('logs admin notification', async () => {
    const mockFormData = { 
      company_name: 'Test Company',
      booth_number: 'A123'
    }
    const formType = 1

    const result = await EmailService.sendAdminNotification(mockFormData, formType)
    expect(result).toBe(true)
    expect(console.log).toHaveBeenCalledWith('Admin notification for form submission:', { 
      formType, 
      formData: mockFormData 
    })
  })
}) 