import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

const ADMIN_EMAIL = 'daniel@bcpgroup.com.my';
const EMAIL_SENDER = process.env.EMAIL_FROM || 'noreply@example.com';

// Initialize SendGrid with API key on server side
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { formData, formType } = await request.json();
    
    if (!formData || !formType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Prepare email data for admin notification
    const companyName = formData.company_name || formData.company_data?.company_name || 'Unknown Company';
    const boothNumber = formData.booth_number || formData.company_data?.booth_number || 'Unknown Booth';
    
    const msg = {
      to: ADMIN_EMAIL,
      from: EMAIL_SENDER,
      subject: `AMSC 2025: Form ${formType} Submission - ${companyName} (${boothNumber})`,
      html: `
        <h2>New Form Submission</h2>
        <p><strong>Form:</strong> Form ${formType}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Booth Number:</strong> ${boothNumber}</p>
        <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
        ${formData.items ? `
          <h3>Items Ordered:</h3>
          <ul>
            ${formData.items
              .filter((item: any) => item.quantity > 0)
              .map((item: any) => `<li>${item.name || item.description}: ${item.quantity} x ${item.unitPrice || item.unitCost} = ${item.total || (item.quantity * (item.unitPrice || item.unitCost))}</li>`)
              .join('')}
          </ul>
          ${formData.subtotal ? `<p><strong>Subtotal:</strong> ${formData.subtotal}</p>` : ''}
          ${formData.late_charge ? `<p><strong>Late Charge:</strong> ${formData.late_charge}</p>` : ''}
          ${formData.grand_total ? `<p><strong>Grand Total:</strong> ${formData.grand_total}</p>` : ''}
        ` : ''}
      `,
    };

    await sgMail.send(msg);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email notification:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
} 