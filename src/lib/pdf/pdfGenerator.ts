import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { FormData } from '@/types/forms';

// Cache for loaded images to prevent repeated fetching
const imageCache = new Map<string, Promise<HTMLImageElement>>();

// Image preloading function with caching
const preloadImage = (src: string): Promise<HTMLImageElement> => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }
  
  const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS issues
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
  
  imageCache.set(src, imagePromise);
  return imagePromise;
};

/**
 * Generates a PDF from a DOM element with optimized handling of images and page breaks
 */
export const generatePDF = async (
  elementId: string,
  fileName: string,
  options = {
    quality: 1,
    scale: 2,
    usePDF: true,
    format: 'a4',
    orientation: 'portrait' as const,
  }
): Promise<boolean> => {
  try {
    console.log('Starting PDF generation...');
    
    // Get the DOM element to convert
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      alert('Error: Could not find the form element.');
      return false;
    }
    
    // Disable background-blend-mode for PDF generation
    const originalStyles = new Map();
    const elementsWithBlendMode = element.querySelectorAll('*');
    elementsWithBlendMode.forEach((el: Element) => {
      if (el instanceof HTMLElement) {
        const bgBlendMode = window.getComputedStyle(el).backgroundBlendMode;
        if (bgBlendMode !== 'normal') {
          originalStyles.set(el, { backgroundBlendMode: bgBlendMode });
          el.style.backgroundBlendMode = 'normal';
        }
      }
    });
    
    // Load all images before rendering to ensure they appear in the PDF
    const imageElements = Array.from(element.querySelectorAll('img'));
    console.log(`Preloading ${imageElements.length} images...`);
    
    // Batch preload images to improve performance
    const batchSize = 5;
    const imageBatches = [];
    
    for (let i = 0; i < imageElements.length; i += batchSize) {
      const batch = imageElements.slice(i, i + batchSize);
      imageBatches.push(batch);
    }
    
    for (const batch of imageBatches) {
      await Promise.all(
        batch.map(img => {
          if (img.complete && img.naturalHeight !== 0) {
            return Promise.resolve();
          }
          return preloadImage(img.src);
        })
      );
    }
    
    console.log('All images preloaded successfully.');
    
    // Calculate dimensions for A4 format
    const PDF_WIDTH = options.orientation === 'portrait' ? 210 : 297;
    const PDF_HEIGHT = options.orientation === 'portrait' ? 297 : 210;
    
    // Create canvas with optimized settings
    const canvas = await html2canvas(element, {
      scale: options.scale,
      useCORS: true,
      allowTaint: true,
      logging: false, // Disable logging to improve performance
      imageTimeout: 10000, // 10 second timeout for images
      foreignObjectRendering: false, // Disable foreign object rendering for better compatibility
      removeContainer: true, // Clean up the cloned DOM element
      backgroundColor: '#ffffff', // Set white background
      onclone: (clonedDoc) => {
        // Remove any iframe or video elements that might cause issues
        const iframes = clonedDoc.querySelectorAll('iframe, video');
        iframes.forEach(el => el.remove());
        
        // Remove any buttons or inputs that might cause issues
        const interactiveElements = clonedDoc.querySelectorAll('button, input[type="submit"], select');
        interactiveElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = 'none';
          }
        });
        
        return clonedDoc;
      }
    });
    
    console.log('Canvas created successfully.');
    
    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.format,
      compress: true, // Enable compression for smaller file size
      putOnlyUsedFonts: true, // Optimize font usage
      floatPrecision: 16, // Higher precision
    });
    
    // Add metadata to the PDF
    pdf.setProperties({
      title: fileName.replace('.pdf', ''),
      subject: 'AMSC 2025 Form',
      creator: 'AMSC 2025 Exhibitor Portal',
      author: 'AMSC 2025',
    });
    
    // Calculate the aspect ratio and positioning
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const pdfWidth = PDF_WIDTH;
    const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
    
    // Handle content that spans multiple pages
    if (pdfHeight > PDF_HEIGHT) {
      console.log('Content spans multiple pages, splitting...');
      
      const pageCount = Math.ceil(pdfHeight / PDF_HEIGHT);
      console.log(`Generating ${pageCount} pages...`);
      
      for (let i = 0; i < pageCount; i++) {
        // Calculate the portion of canvas to use for this page
        const srcY = (i * canvasHeight * PDF_HEIGHT) / pdfHeight;
        const srcHeight = (canvasHeight * PDF_HEIGHT) / pdfHeight;
        
        // Convert to base64 image to improve memory usage
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = srcHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, srcY, canvasWidth, srcHeight,
            0, 0, canvasWidth, srcHeight
          );
          
          const imgData = pageCanvas.toDataURL('image/jpeg', options.quality);
          
          // Add a new page for pages after the first one
          if (i > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, PDF_HEIGHT);
        }
      }
    } else {
      // Single page content
      console.log('Content fits on a single page.');
      const imgData = canvas.toDataURL('image/jpeg', options.quality);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    
    console.log('PDF generated, preparing to download...');
    
    try {
      // Modern browsers method - most reliable approach
      console.log('Using direct save method for maximum compatibility...');
      
      // First attempt with direct save method - works in all modern browsers
      pdf.save(fileName);
      console.log('PDF saved using direct save method.');
      
      // Restore original styles
      elementsWithBlendMode.forEach((el: Element) => {
        if (el instanceof HTMLElement && originalStyles.has(el)) {
          const { backgroundBlendMode } = originalStyles.get(el);
          el.style.backgroundBlendMode = backgroundBlendMode;
        }
      });
      
      return true;
    } catch (e) {
      console.error('Error in primary download method:', e);
      
      // Fallback method - use blob and createObjectURL
      try {
        console.log('Attempting fallback download method...');
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        
        // Force click event with a slight delay to ensure browser processes it
        downloadLink.click();
        
        // Clean up
        setTimeout(() => {
          if (document.body.contains(downloadLink)) {
            document.body.removeChild(downloadLink);
          }
          URL.revokeObjectURL(pdfUrl);
          console.log('PDF download completed via fallback and resources cleaned up.');
        }, 1000);
        
        // Restore original styles
        elementsWithBlendMode.forEach((el: Element) => {
          if (el instanceof HTMLElement && originalStyles.has(el)) {
            const { backgroundBlendMode } = originalStyles.get(el);
            el.style.backgroundBlendMode = backgroundBlendMode;
          }
        });
        
        return true;
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
        
        // Last resort - open in new window
        try {
          console.log('Attempting to open PDF in new window...');
          const pdfData = pdf.output('datauristring');
          window.open(pdfData, '_blank');
          
          // Restore original styles
          elementsWithBlendMode.forEach((el: Element) => {
            if (el instanceof HTMLElement && originalStyles.has(el)) {
              const { backgroundBlendMode } = originalStyles.get(el);
              el.style.backgroundBlendMode = backgroundBlendMode;
            }
          });
          
          return true;
        } catch (lastError) {
          console.error('All download methods failed:', lastError);
          alert('Unable to download PDF. Please try again or use a different browser.');
          
          // Restore original styles
          elementsWithBlendMode.forEach((el: Element) => {
            if (el instanceof HTMLElement && originalStyles.has(el)) {
              const { backgroundBlendMode } = originalStyles.get(el);
              el.style.backgroundBlendMode = backgroundBlendMode;
            }
          });
          
          return false;
        }
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again or contact support.');
    return false;
  }
};

/**
 * Generates a PDF for a specific form with data
 */
export const generateFormPDF = async (
  element: HTMLElement,
  formData: FormData,
  formType: string | number,
  includeEmptyItems: boolean = false
): Promise<boolean> => {
  try {
    // Validate required parameters
    if (!element) {
      console.error('Element not provided to generateFormPDF');
      return false;
    }
    
    if (!formData) {
      console.error('Form data not provided to generateFormPDF');
      return false;
    }
    
    // Get company name from form data or use generic name
    const companyName = formData.companyName || 'AMSC_Form';
    // Create a clean filename by removing special characters
    const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    // Get current date in YYYY-MM-DD format
    const date = new Date().toISOString().split('T')[0];
    // Create the filename
    const fileName = `${cleanCompanyName}_${formType}_${date}.pdf`;
    
    console.log(`Generating ${formType} PDF for ${companyName}`);
    
    // Create a unique ID for the element if it doesn't have one
    if (!element.id) {
      element.id = `pdf-container-${Date.now()}`;
    }
    
    // Apply temporary styles to optimize for PDF generation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'visible'; // Prevent unexpected clipping
    
    try {
      // Now we can pass the element's ID to the generatePDF function
      return await generatePDF(element.id, fileName);
    } finally {
      // Restore original styles regardless of success or failure
      document.body.style.overflow = originalOverflow;
    }
  } catch (error) {
    console.error('Error in generateFormPDF:', error);
    return false;
  }
}; 