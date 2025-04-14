import { EmailConfig, EMAIL_SENDER } from './config'

// Email address for form submissions
const ADMIN_EMAIL = 'daniel@bcpgroup.com.my'

// Create a dummy implementation for client-side
const isDummyMode = typeof window !== 'undefined';

export class EmailService {
  static async sendTemplateEmail(config: EmailConfig): Promise<boolean> {
    // In client-side browser environment, we'll use a placeholder function
    if (isDummyMode) {
      console.log('Email would be sent with:', config);
      return true;
    }
    
    try {
      // In server environment, we'd use the real SendGrid implementation
      // This code won't be executed in the browser
      const sgMail = require('@sendgrid/mail');
      
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      }
      
      const msg = {
        to: config.to,
        from: config.from || EMAIL_SENDER,
        templateId: config.templateId,
        dynamicTemplateData: config.dynamicTemplateData,
        attachments: config.attachments,
      }

      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  static async sendFormSubmissionEmail(config: EmailConfig): Promise<boolean> {
    try {
      // Add PDF generation and attachment here if needed
      return await this.sendTemplateEmail(config);
    } catch (error) {
      console.error('Error sending form submission email:', error);
      return false;
    }
  }
  
  /**
   * Sends a form submission notification to the admin email
   * @param formData The form data submitted
   * @param formType The type of form submitted
   * @returns Promise resolving to boolean indicating success
   */
  static async sendAdminNotification(formData: any, formType: number): Promise<boolean> {
    // In client-side browser environment, we'll use a placeholder function
    if (isDummyMode) {
      console.log('Admin notification would be sent for:', { formType, formData });
      return true;
    }
    
    try {
      // In server environment, we'd use the real SendGrid implementation
      const sgMail = require('@sendgrid/mail');
      
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return false;
    }
  }
} 