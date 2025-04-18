import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param fileName The name of the output PDF file
 */
export const generatePDF = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
    console.log('Starting PDF generation for element:', element);
    
    // Wait for images to load completely
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(null);
            } else {
              img.onload = () => resolve(null);
              img.onerror = () => {
                console.warn(`Failed to load image: ${img.src}`);
                resolve(null);
              };
            }
          })
      )
    );

    // Create canvas from the DOM element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow images from other domains
      logging: true, // Enable logs for debugging
      allowTaint: true, // Allow tainted canvas
      imageTimeout: 5000, // Timeout for loading images
      onclone: (clonedDoc) => {
        // Fix any styles in the cloned document if needed
        const clonedElement = clonedDoc.body.querySelector('[data-pdf-container]');
        if (clonedElement) {
          (clonedElement as HTMLElement).style.width = '100%';
          (clonedElement as HTMLElement).style.margin = '0';
          (clonedElement as HTMLElement).style.padding = '10px';
        }
      }
    });

    console.log('Canvas created successfully, width:', canvas.width, 'height:', canvas.height);
    
    // Initialize PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add image to PDF - handle multi-page if needed
    const imgData = canvas.toDataURL('image/png');
    console.log('Image data created from canvas, length:', imgData.length);
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Generate PDF and trigger download
    const pdfOutput = pdf.output('bloburl');
    console.log('PDF blob URL created:', pdfOutput);
    
    // Open in new window/tab which forces download in most browsers
    window.open(pdfOutput, '_blank');
    
    console.log('PDF should now be downloading in a new tab');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
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
  try {
    // Add a data attribute to help with PDF generation
    element.setAttribute('data-pdf-container', 'true');
    
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
    
    console.log('Attempting to generate PDF with filename:', fileName);
    await generatePDF(element, fileName);
  } catch (error) {
    console.error('Failed to generate form PDF:', error);
    alert('There was an error generating the PDF. Please check your browser settings or try a different browser.');
    throw error;
  }
}; 