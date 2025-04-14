import { FormData } from '@/types/forms'

export const useEmailNotification = () => {
  const sendFormSubmissionEmail = async (
    formData: FormData,
    formType: number,
    isPastDeadline: boolean
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          formType,
          isPastDeadline,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Error sending email:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  return {
    sendFormSubmissionEmail,
  }
} 