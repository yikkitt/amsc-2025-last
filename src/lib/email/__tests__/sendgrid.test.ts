import { describe, it, expect, vi, beforeEach } from 'vitest'
import sgMail from '@sendgrid/mail'
import { EmailService } from '../sendgrid'
import { EmailConfig, EMAIL_SENDER } from '../config'

// Mock SendGrid
vi.mock('@sendgrid/mail', () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn(),
  },
}))

describe('EmailService', () => {
  const mockConfig: EmailConfig = {
    to: 'test@example.com',
    templateId: 'd-test-template',
    dynamicTemplateData: {
      name: 'Test User',
    },
    from: EMAIL_SENDER,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends template email successfully', async () => {
    // Mock successful email sending
    vi.mocked(sgMail.send).mockResolvedValueOnce([
      {
        statusCode: 202,
        headers: {},
        body: {},
      },
      {},
    ])

    const result = await EmailService.sendTemplateEmail(mockConfig)
    expect(result).toBe(true)
    expect(sgMail.send).toHaveBeenCalledWith({
      to: mockConfig.to,
      from: mockConfig.from,
      templateId: mockConfig.templateId,
      dynamicTemplateData: mockConfig.dynamicTemplateData,
      attachments: undefined,
    })
  })

  it('handles email sending failure', async () => {
    // Mock email sending failure
    vi.mocked(sgMail.send).mockRejectedValueOnce(new Error('Failed to send'))

    const result = await EmailService.sendTemplateEmail(mockConfig)
    expect(result).toBe(false)
    expect(sgMail.send).toHaveBeenCalled()
  })

  it('sends form submission email successfully', async () => {
    // Mock successful email sending
    vi.mocked(sgMail.send).mockResolvedValueOnce([
      {
        statusCode: 202,
        headers: {},
        body: {},
      },
      {},
    ])

    const result = await EmailService.sendFormSubmissionEmail(mockConfig)
    expect(result).toBe(true)
    expect(sgMail.send).toHaveBeenCalled()
  })

  it('handles form submission email failure', async () => {
    // Mock email sending failure
    vi.mocked(sgMail.send).mockRejectedValueOnce(new Error('Failed to send'))

    const result = await EmailService.sendFormSubmissionEmail(mockConfig)
    expect(result).toBe(false)
    expect(sgMail.send).toHaveBeenCalled()
  })
}) 