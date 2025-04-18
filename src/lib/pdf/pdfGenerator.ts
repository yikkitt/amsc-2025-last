import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { FormData } from '@/types/forms';

// Cache for loaded images to prevent repeated fetching
const imageCache = new Map<string, Promise<HTMLImageElement>>();

// Cache for generated PDFs to avoid regenerating the same PDF multiple times
const pdfCache = new Map<string, Blob>();

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
 * Optimized function to generate a PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param filename The name of the PDF file
 */
export const generatePDF = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    console.log('PDF generation started');
    
    // Check if we have this PDF cached
    const cacheKey = `${filename}-${Date.now()}`;
    if (pdfCache.has(cacheKey)) {
      console.log('Using cached PDF');
      const cachedBlob = pdfCache.get(cacheKey);
      if (cachedBlob) {
        downloadPDF(cachedBlob, filename);
        return;
      }
    }
    
    // Wait for images to load to ensure they appear in the PDF
    await waitForImagesToLoad(element);
    
    // Create PDF with A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Capture the HTML content with optimized settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable cross-origin resource sharing
      logging: false, // Disable logging for performance
      allowTaint: true, // Allow tainted canvas
      backgroundColor: '#ffffff', // Set background color to white
      imageTimeout: 15000, // Increase timeout for image loading
      onclone: (clonedDoc) => {
        // Ensure all images in the cloned document are visible
        const images = clonedDoc.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
          images[i].style.display = 'block';
          // Ensure images aren't cut off
          images[i].style.maxWidth = '100%';
          images[i].style.height = 'auto';
        }
        return clonedDoc;
      }
    });
    
    // Calculate dimensions to fit content on A4 page
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    // Split content into multiple pages if needed
    let heightLeft = imgHeight;
    let position = 0;
    let page = 1;
    
    // Add first page
    const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG with 95% quality for smaller size
    pdf.addImage(imgData, 'JPEG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pdfHeight;
    
    // Add additional pages if content overflows
    while (heightLeft > 0) {
      position = -pdfHeight * page;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;
      page++;
    }
    
    // Generate the PDF data
    const pdfBlob = pdf.output('blob');
    
    // Cache the generated PDF
    if (pdfCache.size > 10) {
      // Limit cache size by removing oldest entry
      const oldestKey = pdfCache.keys().next().value;
      pdfCache.delete(oldestKey);
    }
    pdfCache.set(cacheKey, pdfBlob);
    
    // Download the PDF
    downloadPDF(pdfBlob, filename);
    console.log('PDF generation completed successfully');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again or contact support.');
  }
};

/**
 * Helper function to download the PDF blob
 */
const downloadPDF = (blob: Blob, filename: string): void => {
  try {
    // Method 1: Using iframe (best browser compatibility)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    try {
      // Create object URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Try direct download first (modern browsers)
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (e) {
      console.warn('Direct download failed, trying iframe method:', e);
      
      // Fallback to iframe method for older browsers
      if (iframe.contentWindow) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(`
          <html>
            <body style="margin:0">
              <embed width="100%" height="100%" src="${URL.createObjectURL(blob)}" type="application/pdf">
            </body>
          </html>
        `);
        iframe.contentWindow.document.close();
      }
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF. Please try again later.');
  }
};

/**
 * Helper function to ensure all images are loaded before generating PDF
 */
const waitForImagesToLoad = (element: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    const images = element.getElementsByTagName('img');
    if (images.length === 0) {
      resolve();
      return;
    }
    
    let loadedImages = 0;
    const totalImages = images.length;
    
    // Set a timeout in case some images fail to load
    const timeout = setTimeout(() => {
      console.warn(`Some images didn't load within timeout, proceeding with PDF generation`);
      resolve();
    }, 5000);
    
    // Check each image
    for (let i = 0; i < totalImages; i++) {
      if (images[i].complete) {
        loadedImages++;
        if (loadedImages === totalImages) {
          clearTimeout(timeout);
          resolve();
        }
      } else {
        images[i].onload = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            clearTimeout(timeout);
            resolve();
          }
        };
        images[i].onerror = () => {
          loadedImages++;
          console.warn(`Image failed to load: ${images[i].src}`);
          if (loadedImages === totalImages) {
            clearTimeout(timeout);
            resolve();
          }
        };
      }
    }
  });
};

/**
 * Generate a PDF from form data
 * @param formData The form data to include in the PDF
 * @param formElement The form element to convert to PDF
 * @param formType The type of form
 */
export const generateFormPDF = async (
  formData: any, 
  formElement: HTMLElement, 
  formType: string
): Promise<void> => {
  try {
    // Clean empty items for better PDF generation
    const cleanFormData = Object.entries(formData).reduce((acc: any, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    // Create filename based on company name and form type
    const companyName = cleanFormData.companyName || 
                        cleanFormData.company || 
                        'form';
    const sanitizedCompanyName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    const filename = `${sanitizedCompanyName}_${formType}_${date}.pdf`;
    
    // Generate the PDF
    await generatePDF(formElement, filename);
  } catch (error) {
    console.error('Error generating form PDF:', error);
    alert('Failed to generate PDF from form data. Please try again.');
  }
}; 