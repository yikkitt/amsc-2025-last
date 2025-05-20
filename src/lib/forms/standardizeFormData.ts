import { FormData } from '@/types/forms';
import { standardizeAVEquipmentItems } from './standardizeItems';

/**
 * Standardizes form data before submission to ensure consistency
 * @param formData The original form data
 * @param formNumber The form number (1-8)
 * @returns Standardized form data
 */
export function standardizeFormData(formData: Record<string, any>, formNumber: number): Record<string, any> {
  // Clone the data to avoid mutations
  const standardized = { ...formData };

  console.log("Original form data:", JSON.stringify(standardized, null, 2));

  // Common cleanup for all forms
  delete standardized.surcharge; // Handled separately as late_charge
  delete standardized.id;
  delete standardized.inserted_at;
  delete standardized.updated_at;

  // Remove null or undefined values
  Object.keys(standardized).forEach((key) => {
    if (standardized[key] === null || standardized[key] === undefined) {
      delete standardized[key];
    }
  });

  // Ensure form_type is consistently formatted
  standardized.form_type = formNumber.toString();
  
  // Ensure submitted_at field is present
  if (!standardized.submitted_at) {
    standardized.submitted_at = new Date().toISOString();
  }

  // Standard company data normalization
  standardizeCompanyData(standardized);

  // Standardize auth details across all forms
  standardizeAuthDetails(standardized);

  // Standardize items regardless of what they're called
  standardizeItems(standardized);

  // Form-specific standardization
  switch (formNumber) {
    case 1: // Fascia Name Form
      if (standardized.fasciaName) {
        standardized.fascia_name = standardized.fasciaName;
      }
      break;
      
    case 2: // Contractor Pass Form
      if (Array.isArray(standardized.contractors)) {
        standardized.contractor_list = standardized.contractors.filter(c => 
          c && (c.name || c.companyName)
        );
      }
      break;
      
    case 3: // Electrical & Lighting Form
      // Already handled by standardizeItems
      // Ensure order items are included for the PDF and database
      if (Array.isArray(standardized.orderItems) && !standardized.items) {
        standardized.items = standardizeItems(standardized.orderItems);
      }
      break;
      
    case 4: // Furniture Order Form
      // Already handled by standardizeItems
      if (Array.isArray(standardized.orderItems) && !standardized.items) {
        standardized.items = standardizeItems(standardized.orderItems);
      }
      break;
      
    case 5: // Printing Order Form
      // Already handled by standardizeItems
      if (Array.isArray(standardized.orderItems) && !standardized.items) {
        standardized.items = standardizeItems(standardized.orderItems);
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
      
    case 7: // Admin Fees Form
      // Already handled by standardizeItems
      if (Array.isArray(standardized.orderItems) && !standardized.items) {
        standardized.items = standardizeItems(standardized.orderItems);
      }
      break;
      
    case 8: // Indemnity Letter Form
      if (Array.isArray(standardized.badges)) {
        standardized.badge_list = standardized.badges.filter(b => 
          b && (b.name || b.position)
        );
      }
      break;
      
    case 9: // AV Equipment Form
      console.log("Processing Form 9 (AV Equipment):", JSON.stringify(standardized, null, 2));
      
      // Use the specialized function for AV Equipment items
      standardizeAVEquipmentItems(standardized);
      
      // Ensure the security deposit is properly included
      if (standardized.securityDeposit) {
        standardized.security_deposit = standardized.securityDeposit;
      }
      
      // Ensure order items are included for the PDF and database
      if (Array.isArray(standardized.orderItems) && !standardized.items) {
        standardized.items = standardizeItems(standardized.orderItems);
      }
      
      // Log the result after standardization
      console.log("After AV Equipment standardization:", JSON.stringify(standardized, null, 2));
      break;
  }

  // Ensure monetary values are properly standardized
  standardizeTotals(standardized);

  // Ensure status is set
  standardized.status = standardized.status || "submitted";

  console.log("Standardized form data:", JSON.stringify(standardized, null, 2));
  
  return standardized;
}

/**
 * Standardizes company data across different naming conventions
 */
function standardizeCompanyData(data: Record<string, any>): void {
  // Create company_data object if it doesn't exist
  if (!data.company_data) {
    data.company_data = {};
  }

  // Handle company name variations
  if (data.companyName && !data.company_data.company_name) {
    data.company_data.company_name = data.companyName;
  } else if (data.company && !data.company_data.company_name) {
    data.company_data.company_name = data.company;
  }

  // Handle booth number variations
  if (data.boothNo && !data.company_data.booth_number) {
    data.company_data.booth_number = data.boothNo;
  } else if (data.booth_no && !data.company_data.booth_number) {
    data.company_data.booth_number = data.booth_no;
  } else if (data.booth_number && !data.company_data.booth_number) {
    data.company_data.booth_number = data.booth_number;
  }

  // Copy company name and booth number at root level
  if (data.company_data.company_name && !data.company_name) {
    data.company_name = data.company_data.company_name;
  }
  
  if (data.company_data.booth_number && !data.booth_number) {
    data.booth_number = data.company_data.booth_number;
  }

  // Contact info
  if (data.contact_person && !data.company_data.contact_person) {
    data.company_data.contact_person = data.contact_person;
  } else if (data.contactPerson && !data.company_data.contact_person) {
    data.company_data.contact_person = data.contactPerson;
  }

  // Email
  if (data.email && !data.company_data.email) {
    data.company_data.email = data.email;
  }

  // Phone/telephone
  if (data.tel && !data.company_data.tel) {
    data.company_data.tel = data.tel;
  } else if (data.telephone && !data.company_data.tel) {
    data.company_data.tel = data.telephone;
  } else if (data.phone && !data.company_data.tel) {
    data.company_data.tel = data.phone;
  }

  // Designation
  if (data.designation && !data.company_data.designation) {
    data.company_data.designation = data.designation;
  }
}

/**
 * Standardizes authorization details across different naming conventions
 */
function standardizeAuthDetails(data: Record<string, any>): void {
  // Create auth_details object if it doesn't exist
  if (!data.auth_details) {
    data.auth_details = {};
  }

  // Handle name variations
  if (data.name && !data.auth_details.name) {
    data.auth_details.name = data.name;
  } else if (data.auth_name && !data.auth_details.name) {
    data.auth_details.name = data.auth_name;
  } else if (data.authorizedBy && !data.auth_details.name) {
    data.auth_details.name = data.authorizedBy;
  }

  // Handle designation variations
  if (data.designation && !data.auth_details.designation) {
    data.auth_details.designation = data.designation;
  } else if (data.auth_designation && !data.auth_details.designation) {
    data.auth_details.designation = data.auth_designation;
  } else if (data.position && !data.auth_details.designation) {
    data.auth_details.designation = data.position;
  }

  // Handle date variations
  if (data.auth_date && !data.auth_details.date) {
    data.auth_details.date = data.auth_date;
  } else if (data.date && !data.auth_details.date) {
    data.auth_details.date = data.date;
  } else if (!data.auth_details.date) {
    data.auth_details.date = new Date().toISOString().split('T')[0]; // Default to today in YYYY-MM-DD format
  }
}

/**
 * Standardizes item data across different naming conventions
 */
function standardizeItems(data: Record<string, any>): void {
  // Find items array regardless of what it's called
  let itemsArray = null;

  // Check common item field names
  const itemFields = ['items', 'orderItems', 'formItems', 'electricalItems', 'furnitureItems', 
                      'printingItems', 'particular', 'particulars'];
                      
  // Find the first non-empty array
  for (const field of itemFields) {
    if (Array.isArray(data[field]) && data[field].length > 0) {
      itemsArray = data[field];
      break;
    }
  }

  // If no items found, return
  if (!itemsArray) {
    return;
  }

  // Standardize each item to have consistent field names
  const standardizedItems = itemsArray
    .filter(item => item && (
      Number(item.quantity) > 0 || 
      item.description || 
      item.particular || 
      item.item ||
      item.name
    ))
    .map(item => {
      const standardItem: Record<string, any> = {
        // Standardize description field
        description: item.description || item.particular || item.item || item.name || '',
        
        // Standardize quantity field
        quantity: Number(item.quantity) || 0,
        
        // Standardize unit cost/price field (check all variations)
        unitCost: Number(item.unitCost || item.unitPrice || item.unit_cost || 
                item.unit_price || item.price || item.cost || 0),
        
        // Standardize total field
        total: Number(item.total || item.amount || item.totalPrice || item.totalCost || 
               item.sum || item.value || 0)
      };

      // Calculate total if not present
      if (!standardItem.total && standardItem.quantity && standardItem.unitCost) {
        standardItem.total = standardItem.quantity * standardItem.unitCost;
      }

      // Add additional fields if present
      if (item.dimension) standardItem.dimension = item.dimension;
      if (item.printableSize) standardItem.printableSize = item.printableSize;
      if (item.unit) standardItem.unit = item.unit;
      if (item.image) standardItem.image = item.image;
      if (item.id) standardItem.id = item.id;
      if (item.section) standardItem.section = item.section;

      return standardItem;
    });

  // Save standardized items
  data.items = standardizedItems;
}

/**
 * Standardizes total amounts across different naming conventions
 */
function standardizeTotals(data: Record<string, any>): void {
  // Calculate subtotal from items if not present
  if (!data.subtotal && Array.isArray(data.items)) {
    data.subtotal = data.items.reduce(
      (sum: number, item: any) => sum + (Number(item.total) || 0), 
      0
    );
  }

  // Standardize subtotal
  data.subtotal = Number(data.subtotal || 0);

  // Handle late charge or surcharge
  if (data.surcharge && !data.late_charge) {
    data.late_charge = Number(data.surcharge);
  } else if (!data.late_charge) {
    data.late_charge = 0;
  } else {
    data.late_charge = Number(data.late_charge || 0);
  }

  // Calculate grand total
  data.grand_total = Number(data.subtotal) + Number(data.late_charge);

  // Ensure all monetary values are finite numbers
  if (!isFinite(data.subtotal)) data.subtotal = 0;
  if (!isFinite(data.late_charge)) data.late_charge = 0;
  if (!isFinite(data.grand_total)) data.grand_total = 0;
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
  } else {
    // Check if form type is valid (1-9)
    const formType = parseInt(data.form_type, 10);
    if (isNaN(formType) || formType < 1 || formType > 9) {
      errors.push(`Invalid form type: ${data.form_type}. Must be between 1 and 9.`);
    }
  }

  if (!data.company_name) {
    errors.push("Missing company name");
  }

  if (!data.booth_number) {
    errors.push("Missing booth number");
  }

  // Validate items if present
  if (Array.isArray(data.items) && data.items.length > 0) {
    data.items.forEach((item, index) => {
      if (!item.description) {
        errors.push(`Item #${index + 1} missing description`);
      }
      if (isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
        errors.push(`Item #${index + 1} has invalid quantity`);
      }
      if (isNaN(Number(item.unitCost))) {
        errors.push(`Item #${index + 1} has invalid unit cost`);
      }
      if (isNaN(Number(item.total))) {
        errors.push(`Item #${index + 1} has invalid total`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
} 