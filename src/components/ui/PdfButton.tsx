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
      return
    }

    try {
      // Create a new div to hold only the content we want to capture
      const contentDiv = document.createElement('div')
      contentDiv.style.position = 'absolute'
      contentDiv.style.left = '-9999px'
      contentDiv.style.top = '-9999px'
      contentDiv.style.width = '210mm' // A4 width
      contentDiv.style.padding = '20mm'
      contentDiv.style.backgroundColor = '#ffffff'
      document.body.appendChild(contentDiv)

      // Clone the form content
      const formContent = containerRef.current.cloneNode(true) as HTMLElement
      
      // Remove any elements we don't want in the PDF
      const elementsToRemove = formContent.querySelectorAll('.pdf-exclude')
      elementsToRemove.forEach(el => el.remove())
      
      // Add the cloned content to our hidden div
      contentDiv.appendChild(formContent)

      // Wait for images to load
      const images = contentDiv.getElementsByTagName('img')
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise(resolve => {
          img.onload = resolve
          img.onerror = resolve
        })
      }))

      // Capture the content with higher quality
      const canvas = await html2canvas(contentDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 210 * 8, // A4 width in pixels at 96 DPI
        windowHeight: 297 * 8, // A4 height in pixels at 96 DPI
      })

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Calculate dimensions to fit content properly
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Add the image to the PDF with better quality
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      )

      // Clean up
      document.body.removeChild(contentDiv)

      // Download the PDF
      pdf.save(`form-${formType}-submission.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
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