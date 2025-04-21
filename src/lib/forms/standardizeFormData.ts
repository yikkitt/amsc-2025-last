import { FormData } from '@/types/forms';

/**
 * Standardizes form data before submission to ensure consistency
 * @param formData The original form data
 * @param formNumber The form number (1-8)
 * @returns Standardized form data
 */
export function standardizeFormData(formData: Record<string, any>, formNumber: number): Record<string, any> {
  // Clone the data to avoid mutations
  const standardized = { ...formData };

  // Common cleanup for all forms
  delete standardized.surcharge;
  delete standardized.id;
  delete standardized.inserted_at;
  delete standardized.updated_at;

  // Remove null or undefined values
  Object.keys(standardized).forEach((key) => {
    if (standardized[key] === null || standardized[key] === undefined) {
      delete standardized[key];
    }
  });

  // Ensure formType is consistently formatted
  standardized.form_type = `FORM ${formNumber}`;

  // Add company_name from companyName if it exists
  if (standardized.companyName && !standardized.company_name) {
    standardized.company_name = standardized.companyName;
  }

  // Add boothNumber from boothNo if it exists
  if (standardized.boothNo && !standardized.booth_number) {
    standardized.booth_number = standardized.boothNo;
  }

  // Form-specific standardization
  switch (formNumber) {
    case 1: // Fascia Name Form
      if (standardized.fasciaName) {
        standardized.fascia_name = standardized.fasciaName;
      }
      break;
      
    case 2: // Booth Equipment Form
      if (Array.isArray(standardized.items)) {
        standardized.booth_items = standardized.items.filter(item => 
          item && (item.quantity > 0 || item.description)
        );
      }
      break;
      
    case 3: // Electrical & Lighting Form
      if (Array.isArray(standardized.items)) {
        standardized.electrical_items = standardized.items.filter(item => 
          item && (item.quantity > 0 || item.description)
        );
      }
      break;
      
    case 4: // AV Equipment Form
      if (Array.isArray(standardized.items)) {
        standardized.av_items = standardized.items.filter(item => 
          item && (item.quantity > 0 || item.description)
        );
      }
      break;
      
    case 5: // Water Supply Form
      if (standardized.waterSupply !== undefined) {
        standardized.water_supply_requested = Boolean(standardized.waterSupply);
      }
      break;
      
    case 6: // Performance Bond Form
      if (standardized.bondAmount) {
        standardized.bond_amount = standardized.bondAmount;
      }
      if (standardized.paymentMethod) {
        standardized.payment_method = standardized.paymentMethod;
      }
      break;
      
    case 7: // Contractor Form
      if (Array.isArray(standardized.contractors)) {
        standardized.contractor_list = standardized.contractors.filter(c => 
          c && (c.name || c.companyName)
        );
      }
      break;
      
    case 8: // Exhibitor Badges Form
      if (Array.isArray(standardized.badges)) {
        standardized.badge_list = standardized.badges.filter(b => 
          b && (b.name || b.position)
        );
      }
      break;
  }

  // Ensure status is set
  standardized.status = standardized.status || "submitted";

  return standardized;
}

/**
 * Validates standardized form data
 * @param data The standardized form data
 * @returns Validation result with success status and any errors
 */
export function validateFormData(data: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic validation
  if (!data.form_type) {
    errors.push("Missing form type");
  }

  if (!data.company_name) {
    errors.push("Missing company name");
  }

  if (!data.booth_number) {
    errors.push("Missing booth number");
  }

  return {
    valid: errors.length === 0,
    errors
  };
} 