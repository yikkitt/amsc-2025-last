/**
 * Mock SendGrid implementation that doesn't use Node.js modules
 * This is a placeholder to fix webpack build issues
 */

// Mock email configuration type
export interface SendGridEmailConfig {
  to: string;
  from?: string;
  subject?: string;
  html?: string;
  text?: string;
  attachments?: any[];
}

// Default sender information
export const EMAIL_SENDER = {
  email: 'noreply@example.com',
        name: 'DDCON 2025 Exhibitor Manual',
};

/**
 * Mock SendGrid mail service that doesn't require Node.js modules
 */
export class SendGridMailService {
  /**
   * Logs email sending attempts without actually sending
   */
  static async sendEmail(config: SendGridEmailConfig): Promise<boolean> {
    console.log('Mock SendGrid would send email:', config);
    return true;
  }

  /**
   * Logs form submission notifications
   */
  static async sendAdminNotification(formData: any, formType: number): Promise<boolean> {
    console.log('Mock SendGrid admin notification for form submission:', { formType, formData });
    return true;
  }
} 