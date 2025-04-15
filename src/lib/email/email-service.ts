// Simple email service without any dependencies
// Simply logs email operations without actually sending emails

// Email configuration type
export interface EmailConfig {
  to: string;
  subject?: string;
  html?: string;
  text?: string;
}

// Default sender information
export const EMAIL_SENDER = {
  email: 'noreply@example.com',
  name: 'AMSC 2025 Exhibitor Manual',
};

export class EmailService {
  /**
   * Logs email sending attempts without actually sending
   */
  static async sendEmail(config: EmailConfig): Promise<boolean> {
    console.log('Would send email:', config);
    return true;
  }

  /**
   * Logs form submission notifications
   */
  static async sendAdminNotification(formData: any, formType: number): Promise<boolean> {
    console.log('Admin notification for form submission:', { formType, formData });
    return true;
  }
} 