import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

interface PdfButtonProps {
  formData: any
  formType: number
  containerRef: React.RefObject<HTMLElement>
  className?: string
}

export const PdfButton: React.FC<PdfButtonProps> = ({
  formData,
  formType,
  containerRef,
  className = ''
}) => {
  const generatePDF = async () => {
    if (!containerRef.current) return

    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123, // A4 height in pixels at 96 DPI
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      // A4 dimensions in mm
      const a4Width = 210
      const a4Height = 297

      // Calculate margins (20mm on each side)
      const margin = 20
      const contentWidth = a4Width - (margin * 2)
      const contentHeight = a4Height - (margin * 2)

      // Calculate scaling to fit content within margins
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight)

      // Calculate dimensions to maintain aspect ratio
      const finalWidth = imgWidth * ratio
      const finalHeight = imgHeight * ratio

      // Center the content on the page
      const x = (a4Width - finalWidth) / 2
      const y = (a4Height - finalHeight) / 2

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
      pdf.save(`form-${formType}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again or contact support if the issue persists.')
    }
  }

  return (
    <button
      onClick={generatePDF}
      className={`${className} flex items-center justify-center`}
    >
      Download PDF
    </button>
  )
} 