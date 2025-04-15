import { NextRequest, NextResponse } from 'next/server';
import { getFormName } from '@/lib/email/config';

export async function POST(request: NextRequest) {
  try {
    const { formData, formType } = await request.json();
    
    if (!formData || !formType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Log form submission details
    console.log('Form submission received:', {
      formType,
      formName: getFormName(formType),
      company: formData.company_name || formData.company_data?.company_name,
      boothNumber: formData.booth_number || formData.company_data?.booth_number,
      date: new Date().toISOString()
    });
    
    // Success response - no email is actually sent
    return NextResponse.json({ 
      success: true,
      message: 'Form submission recorded successfully'
    });
  } catch (error: any) {
    console.error('Error handling form submission:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process form submission' },
      { status: 500 }
    );
  }
} 