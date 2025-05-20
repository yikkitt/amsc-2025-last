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
      // Show a loading indicator
      const loadingEl = document.createElement('div')
      loadingEl.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
      loadingEl.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-gray-700">Generating PDF...</p>
        </div>
      `
      document.body.appendChild(loadingEl)

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
      
      // Remove loading indicator
      document.body.removeChild(loadingEl)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again or contact support if the issue persists.')
    }
  }

  return (
    <button
      onClick={generatePDF}
      className={`${className} flex items-center justify-center transition-colors duration-200 print:hidden`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-5 h-5 mr-2"
      >
        <path d="M7.25 6a.75.75 0 00-.75.75v10.5c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.22-.53l-5.25-5.25A.75.75 0 0011.5 6.5v4.75h4.75V18h-9v-9.5H12V8.25a.75.75 0 00-.75-.75H7.25z" />
        <path d="M12.75 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 00.75.75h5.5a.75.75 0 000-1.5h-3.69l4.72-4.72a.75.75 0 00-1.06-1.06l-4.72 4.72V2.75z" />
      </svg>
      Download PDF
    </button>
  )
} 