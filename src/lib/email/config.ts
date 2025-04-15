// Simple email configuration without SendGrid dependencies

/**
 * Email notification settings
 */
export const EMAIL_CONFIG = {
  adminEmail: 'admin@example.com',
  supportEmail: 'support@example.com',
};

/**
 * Form types enum for easier reference
 */
export enum FormTypes {
  FASCIA_NAME = 1,
  FURNITURE = 2,
  ELECTRICAL = 3,
  SPECIAL_REQUEST = 4,
}

/**
 * Get form name from type
 */
export function getFormName(formType: number): string {
  switch (formType) {
    case FormTypes.FASCIA_NAME:
      return 'Fascia Name';
    case FormTypes.FURNITURE:
      return 'Furniture Order';
    case FormTypes.ELECTRICAL:
      return 'Electrical & Lighting Order';
    case FormTypes.SPECIAL_REQUEST:
      return 'Special Request';
    default:
      return 'Unknown Form';
  }
} 