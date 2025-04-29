import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

interface PdfButtonProps {
  formData: any
  formType: number
  containerRef: React.RefObject<HTMLElement>
  className?: string
  children?: React.ReactNode
}

export function PdfButton({ formData, formType, containerRef, className, children }: PdfButtonProps) {
  const handleDownload = async () => {
    if (!containerRef.current) {
      console.error('Form container element not found')
      alert('Error: Form container element not found. Please try again.')
      return
    }

    try {
      // Create a temporary container for PDF content
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = '210mm' // A4 width
      tempContainer.style.backgroundColor = 'white'
      document.body.appendChild(tempContainer)

      // Clone the form content
      const formContent = containerRef.current.cloneNode(true) as HTMLElement

      // Remove elements with pdf-exclude class and any buttons/interactive elements
      const excludeSelectors = [
        '.pdf-exclude',
        'button',
        'input[type="submit"]',
        'input[type="button"]',
        '.no-print',
        '[role="button"]'
      ]
      
      excludeSelectors.forEach(selector => {
        formContent.querySelectorAll(selector).forEach(el => el.remove())
      })

      // Add the cleaned content to temp container
      tempContainer.appendChild(formContent)

      // Wait for images to load
      const images = Array.from(tempContainer.getElementsByTagName('img'))
      await Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
        })
      )

      // Generate PDF with better quality
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 210 * 8, // A4 width in pixels at 96 DPI
        windowHeight: 297 * 8 // A4 height in pixels at 96 DPI
      })

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Calculate dimensions to fit content properly
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Split content into pages if needed
      let heightLeft = imgHeight
      let position = 0
      let pageCount = 0

      while (heightLeft > 0 && pageCount < 20) { // Limit to 20 pages as safety
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        )
        
        heightLeft -= pageHeight
        if (heightLeft > 0) {
          position -= pageHeight
          pdf.addPage()
        }
        pageCount++
      }

      // Clean up
      document.body.removeChild(tempContainer)

      // Generate filename with company name if available
      const companyName = formData?.company_data?.company_name || 
                         formData?.companyName || 
                         formData?.company_name || 
                         'form'
      const sanitizedCompanyName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const date = new Date().toISOString().split('T')[0]
      const filename = `${sanitizedCompanyName}_form${formType}_${date}.pdf`

      // Save the PDF
      pdf.save(filename)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again or contact support if the issue persists.')
    }
  }

  return (
    <button
      onClick={handleDownload}
      className={className || 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'}
    >
      {children || 'Download PDF'}
    </button>
  )
} 