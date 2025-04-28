import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { FormData, FormItem } from '@/types/forms';

// Polyfill URL if needed for older browsers
if (typeof window !== 'undefined' && !window.URL && (window as any).webkitURL) {
  (window as any).URL = (window as any).webkitURL;
}

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
 * Check if the current browser supports Blob URLs and downloading
 */
const checkBrowserSupport = (): { 
  hasBlob: boolean; 
  hasURL: boolean; 
  isIOS: boolean;
  isIE: boolean;
  isSafari: boolean;
  isMobile: boolean;
} => {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /android/i.test(ua);
  const isIE = /*@cc_on!@*/false || !!(document as any).documentMode;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isMobile = isIOS || isAndroid || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  return {
    hasBlob: typeof Blob !== 'undefined',
    hasURL: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
    isIOS,
    isIE,
    isSafari,
    isMobile
  };
};

/**
 * Create a polyfill for the Blob object if it's not available
 */
const createBlobPolyfill = (data: string, contentType: string): Blob => {
  try {
    // Try to use the native Blob constructor
    return new Blob([data], { type: contentType });
  } catch (e) {
    // If we're in an older browser, try to use BlobBuilder
    try {
      const BlobBuilder = (window as any).BlobBuilder || 
                         (window as any).WebKitBlobBuilder || 
                         (window as any).MozBlobBuilder || 
                         (window as any).MSBlobBuilder;
      const builder = new BlobBuilder();
      builder.append(data);
      return builder.getBlob(contentType);
    } catch (e2) {
      console.error('Could not create Blob:', e2);
      throw new Error('Browser does not support creating Blob objects');
    }
  }
};

/**
 * Optimized function to generate a PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param filename The name of the PDF file
 */
export const generatePDF = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    console.log('PDF generation started');
    
    // Check browser capabilities
    const support = checkBrowserSupport();
    console.log('Browser support:', support);
    
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
    
    // If on mobile, show a message that download might open in a new tab
    if (support.isMobile) {
      console.log('Mobile device detected - PDF might open in a new tab');
      showNotification('PDF will open in a new tab. You may need to save it manually.', 'info');
    }
    
    // Wait for images to load to ensure they appear in the PDF
    await waitForImagesToLoad(element);
    
    // Create PDF with A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Create a clone of the element to manipulate without affecting the original
    const elementClone = element.cloneNode(true) as HTMLElement;
    
    // Remove any unnecessary content or elements that cause blank pages
    elementClone.querySelectorAll('.space-y-8, .space-y-6').forEach(el => {
      (el as HTMLElement).style.marginBottom = '10px';
      (el as HTMLElement).style.marginTop = '10px';
    });
    
    // Reduce padding and margins that might cause extra pages
    elementClone.querySelectorAll('.p-8, .p-6, .p-4').forEach(el => {
      (el as HTMLElement).style.padding = '8px';
    });
    
    // Adjust large margins
    elementClone.querySelectorAll('.mb-8, .my-8, .mt-8').forEach(el => {
      (el as HTMLElement).style.marginTop = '10px';
      (el as HTMLElement).style.marginBottom = '10px';
    });
    
    // Add a temporary container to hold the clone for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(elementClone);
    
    // Capture the HTML content with optimized settings
    const canvas = await html2canvas(elementClone, {
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
        
        // Adjust font sizes to make content more compact
        const textElements = clonedDoc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, td, th');
        textElements.forEach((el: Element) => {
          const element = el as HTMLElement;
          const currentSize = window.getComputedStyle(element).fontSize;
          // Slightly reduce font size to fit more content per page
          const newSize = parseInt(currentSize) * 0.95;
          element.style.fontSize = `${newSize}px`;
        });
        
        return clonedDoc;
      }
    });
    
    // Clean up temporary container
    document.body.removeChild(tempContainer);
    
    // Calculate dimensions to fit content on A4 page
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    // Check if content fits on a single page
    if (imgHeight * ratio <= pdfHeight) {
      // Content fits on a single page - simply add it centered
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    } else {
      // Content needs multiple pages - calculate more precisely
      const pageHeight = pdfHeight;
      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 0;
      
      while (heightLeft > 0) {
        // Calculate how much of the image to put on this page
        const heightOnThisPage = Math.min(imgHeight - position / ratio, pageHeight / ratio);
        
        // Convert only the portion needed for this page
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Add image to the PDF page
        pdf.addImage(
          imgData, 
          'JPEG', 
          imgX, 
          0, 
          imgWidth * ratio, 
          imgHeight * ratio, 
          '', 
          'FAST',
          pageCount === 0 ? 0 : -position  // Offset for subsequent pages
        );
        
        // Reduce height left and increase position
        heightLeft -= pageHeight / ratio;
        position += pageHeight;
        pageCount++;
        
        // Add a new page if there's still content
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    }
    
    // Generate the PDF data as blob for modern browsers
    try {
      const pdfBlob = pdf.output('blob');
      
      // Cache the generated PDF
      if (pdfCache.size > 10) {
        // Limit cache size by removing oldest entry
        const iterator = pdfCache.keys();
        const firstKey = iterator.next().value;
        if (firstKey) {
          pdfCache.delete(firstKey);
        }
      }
      pdfCache.set(cacheKey, pdfBlob);
      
      // Download the PDF
      downloadPDF(pdfBlob, filename);
      console.log('PDF generation completed successfully');
    } catch (blobError) {
      console.warn('Blob output failed, trying data URI instead:', blobError);
      
      // Fallback to data URI for older browsers
      const pdfDataUri = pdf.output('datauristring');
      downloadPDFViaDataURI(pdfDataUri, filename);
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    showNotification('Failed to generate PDF. Please try again or contact support.', 'error');
    throw error;
  }
};

/**
 * Helper function to download the PDF blob
 */
const downloadPDF = (blob: Blob, filename: string): void => {
  try {
    const support = checkBrowserSupport();
    
    // For iOS devices, open in new tab since downloads don't work well
    if (support.isIOS) {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
      return;
    }
    
    // Method 1: Using modern download API with Blob URL
    if (support.hasURL && !support.isIE) {
      try {
        // Create object URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Try direct download with anchor element
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
        
        return;
      } catch (e) {
        console.warn('Direct download failed, trying alternative methods:', e);
      }
    }
    
    // Method 2: Using iframe for older browsers or IE
    try {
      const reader = new FileReader();
      reader.onload = function() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = reader.result as string;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
      reader.readAsDataURL(blob);
    } catch (iframeError) {
      console.warn('Iframe method failed:', iframeError);
      
      // Method 3: Last resort - open in new window
      try {
        const dataUrl = URL.createObjectURL(blob);
        window.open(dataUrl, '_blank');
        
        setTimeout(() => {
          URL.revokeObjectURL(dataUrl);
        }, 100);
      } catch (windowError) {
        console.error('All download methods failed:', windowError);
        showNotification('Unable to download PDF. Please try a different browser or contact support.', 'error');
      }
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    showNotification('Failed to download PDF. Please try again later.', 'error');
  }
};

/**
 * Helper function to download PDF via data URI for older browsers
 */
const downloadPDFViaDataURI = (dataURI: string, filename: string): void => {
  try {
    const support = checkBrowserSupport();
    
    // For iOS devices, just open in new tab
    if (support.isIOS) {
      window.open(dataURI, '_blank');
      return;
    }
    
    // Create an invisible link
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = dataURI;
    link.download = filename;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error('Data URI download failed:', error);
    
    // Fallback to window.open
    try {
      window.open(dataURI, '_blank');
    } catch (openError) {
      console.error('Window open failed:', openError);
      showNotification('Unable to download PDF. Please save the PDF manually by right-clicking on it and selecting "Save As".', 'error');
    }
  }
};

/**
 * Helper function to display notifications to the user
 */
const showNotification = (message: string, type: 'success' | 'error' | 'info'): void => {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 
    type === 'success' ? '#4CAF50' : 
    type === 'error' ? '#f44336' : 
    '#2196F3'; // info color
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '9999';
  notification.style.opacity = '0.9';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 3000);
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
 * @param formElement The form element to convert to PDF
 * @param formType The type of form (e.g. "Form1", "Form2")
 * @param formData The form data to include in the PDF
 */
export const generateFormPDF = async (
  formElement: HTMLElement,
  formType: string,
  formData: FormData
): Promise<void> => {
  try {
    console.log('Generating PDF for form type:', formType, 'with data:', formData);
    
    // Create filename based on company name and form type
    let companyName = '';
    
    // Try to extract company name from various possible data structures
    if (formData.company_data && formData.company_data.company_name) {
      companyName = formData.company_data.company_name;
    } else if (formData.companyName) {
      companyName = formData.companyName;
    } else if (formData.company) {
      companyName = formData.company;
    } else if (formData.company_name) {
      companyName = String(formData.company_name);
    }
    
    // Default if no company name found
    if (!companyName) {
      companyName = 'form';
    }
    
    const sanitizedCompanyName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    const filename = `${sanitizedCompanyName}_${formType}_${date}.pdf`;
    
    // Generate the PDF
    await generatePDF(formElement, filename);
    
    return;
  } catch (error) {
    console.error('Error generating form PDF:', error);
    showNotification('Failed to generate PDF from form data. Please try again.', 'error');
    throw error;
  }
}; 