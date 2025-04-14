import { NextResponse } from 'next/server'
import { EmailService } from '@/lib/email/sendgrid'
import { getFormSubmissionEmailConfig } from '@/lib/email/config'
import { FormData } from '@/types/forms'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, formType, isPastDeadline } = body as {
      formData: FormData
      formType: number
      isPastDeadline: boolean
    }

    // Validate required fields
    if (!formData.email || !formData.company_name || !formType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get email configuration
    const emailConfig = getFormSubmissionEmailConfig(
      formData,
      formType,
      isPastDeadline
    )

    // Send email
    const success = await EmailService.sendFormSubmissionEmail(emailConfig)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in email API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 