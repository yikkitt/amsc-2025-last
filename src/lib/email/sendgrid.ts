// This is a dummy implementation that doesn't use SendGrid
// to avoid build issues with Node.js-specific modules

import { EmailConfig, EMAIL_SENDER } from './config'

// Email address for form submissions - not used in this implementation
const ADMIN_EMAIL = 'daniel@bcpgroup.com.my'

export class EmailService {
  static async sendTemplateEmail(config: EmailConfig): Promise<boolean> {
    console.log('Email would be sent with:', config);
    return true;
  }

  static async sendFormSubmissionEmail(config: EmailConfig): Promise<boolean> {
    console.log('Form submission email would be sent with:', config);
    return true;
  }
  
  /**
   * Sends a form submission notification to the admin email
   * @param formData The form data submitted
   * @param formType The type of form submitted
   * @returns Promise resolving to boolean indicating success
   */
  static async sendAdminNotification(formData: any, formType: number): Promise<boolean> {
    console.log('Admin notification would be sent for:', { formType, formData });
    return true;
  }
} 