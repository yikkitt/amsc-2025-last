import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { formData, formType } = await request.json();
    
    if (!formData || !formType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Log notification details to server console (for development)
    console.log('Form submission received:', {
      formType,
      company: formData.company_name || formData.company_data?.company_name,
      boothNumber: formData.booth_number || formData.company_data?.booth_number,
      date: new Date().toISOString()
    });
    
    // In a real implementation, we would send an email here
    // For now, we're just returning success
    
    return NextResponse.json({ 
      success: true,
      message: 'Email sending is disabled. Form submission recorded.'
    });
  } catch (error: any) {
    console.error('Error handling notification:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process notification' },
      { status: 500 }
    );
  }
} 