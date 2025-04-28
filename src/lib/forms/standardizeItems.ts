/**
 * Helper function to standardize AV Equipment items (Form 9)
 * This can be imported and used by the standardizeFormData.ts file
 */
export function standardizeAVEquipmentItems(formData: Record<string, any>): void {
  console.log("Standardizing AV Equipment items:", formData);
  
  // Look for items in different possible field names
  let itemsArray = null;
  
  // Check these field names in order of priority
  const fieldNames = ['items', 'orderItems', 'formItems', 'avItems'];
  
  // Find the first non-empty array
  for (const field of fieldNames) {
    if (Array.isArray(formData[field]) && formData[field].length > 0) {
      console.log(`Found items in '${field}' field:`, formData[field]);
      itemsArray = formData[field];
      break;
    }
  }
  
  // If no items found, create an empty array
  if (!itemsArray) {
    formData.items = [];
    return;
  }
  
  // Process each item to ensure it has the correct structure
  const standardizedItems = itemsArray
    // Only include items with quantity > 0 or security deposit items
    .filter(item => 
      (Number(item.quantity) > 0) || 
      (item.description && item.description.toLowerCase().includes('security deposit'))
    )
    .map((item, index) => {
      const standardItem: Record<string, any> = {
        // Add id if missing
        id: item.id || `av-item-${index}`,
        
        // Standardize description
        description: item.description || '',
        
        // Standardize quantity
        quantity: Number(item.quantity) || (item.description?.toLowerCase().includes('security deposit') ? 1 : 0),
        
        // Standardize unit cost
        unitCost: Number(item.unitCost || item.unitPrice || item.unit_cost || item.unit_price || 0),
        
        // Standardize total
        total: Number(item.total || (item.quantity * item.unitCost) || 0)
      };
      
      // Return standardized item
      return standardItem;
    });
  
  // Save standardized items back to the form data
  formData.items = standardizedItems;
  
  console.log("Standardized items:", formData.items);
  
  // Ensure we have both fields populated for compatibility
  formData.orderItems = [...formData.items];
} 