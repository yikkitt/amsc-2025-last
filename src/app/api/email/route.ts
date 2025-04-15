import { NextResponse } from 'next/server'
import { getFormName } from '@/lib/email/config'

// Simple email logging function
async function logEmail(to: string, subject: string, text: string) {
  console.log('Would send email:', { to, subject, text });
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData, formType } = body

    // Validate required fields
    if (!formData || !formType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log email sending attempt
    console.log('Email request received for:', {
      formType,
      formName: getFormName(formType),
      company: formData.company_name || formData.company_data?.company_name,
      email: formData.email,
      date: new Date().toISOString()
    })

    // Simulate sending email (just logs it)
    await logEmail(
      formData.email || 'no-email-provided@example.com',
      `Form Submission: ${getFormName(formType)}`,
      `Thank you for your submission of the ${getFormName(formType)} form.`
    );

    return NextResponse.json({ 
      success: true,
      message: 'Form submission recorded successfully'
    })
  } catch (error) {
    console.error('Error in email API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 