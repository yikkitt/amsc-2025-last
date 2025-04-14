import sgMail from '@sendgrid/mail'
import { EmailConfig, EMAIL_SENDER } from './config'

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Email address for form submissions
const ADMIN_EMAIL = 'daniel@bcpgroup.com.my'

export class EmailService {
  static async sendTemplateEmail(config: EmailConfig): Promise<boolean> {
    try {
      const msg = {
        to: config.to,
        from: config.from || EMAIL_SENDER,
        templateId: config.templateId,
        dynamicTemplateData: config.dynamicTemplateData,
        attachments: config.attachments,
      }

      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  static async sendFormSubmissionEmail(config: EmailConfig): Promise<boolean> {
    try {
      // Add PDF generation and attachment here if needed
      return await this.sendTemplateEmail(config)
    } catch (error) {
      console.error('Error sending form submission email:', error)
      return false
    }
  }
  
  /**
   * Sends a form submission notification to the admin email
   * @param formData The form data submitted
   * @param formType The type of form submitted
   * @returns Promise resolving to boolean indicating success
   */
  static async sendAdminNotification(formData: any, formType: number): Promise<boolean> {
    try {
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
                .map((item: any) => `<li>${item.name}: ${item.quantity} x ${item.unitPrice || item.unitCost} = ${item.total || (item.quantity * (item.unitPrice || item.unitCost))}</li>`)
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