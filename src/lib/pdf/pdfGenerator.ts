import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param fileName The name of the output PDF file
 */
export const generatePDF = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
    // Create canvas from the DOM element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow images from other domains
      logging: false, // Disable logs
    });

    // Initialize PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Download PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Generates a PDF from form data
 * @param formData The form data
 * @param formType The type of form
 * @param includeEmptyItems Whether to include items with zero quantity
 */
export const generateFormPDF = async (
  element: HTMLElement, 
  formData: any, 
  formType: number, 
  includeEmptyItems: boolean = false
): Promise<void> => {
  // Clean form data to exclude items with zero quantity if specified
  if (!includeEmptyItems && formData.items) {
    formData.items = formData.items.filter((item: any) => 
      item.quantity > 0 || item.total > 0
    );
  }
  
  // Create filename based on company name, form type and date
  const companyName = formData.company_name || formData.company_data?.company_name || 'Company';
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${companyName.replace(/[^a-z0-9]/gi, '_')}_Form${formType}_${dateStr}.pdf`;
  
  await generatePDF(element, fileName);
  
  return;
}; 