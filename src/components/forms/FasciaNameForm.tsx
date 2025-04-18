import { useRef, useState, useEffect } from 'react'
import FormSubmitActions from './FormSubmitActions';

const FasciaNameForm = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    company_data: {
      company_name: userData?.company_name || '',
      booth_number: userData?.booth_number || '',
      contact_person: userData?.contact_person || '',
      email: userData?.email || '',
    },
    fascia_name: fasciaText,
    // Include any other form fields here
  });

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      fascia_name: fasciaText,
      // Update other fields as needed
    }));
  }, [fasciaText, userData]);

  return (
    <div ref={formRef} className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* form content */}
      <FormSubmitActions
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        formData={formData}
        formType={1}
        containerRef={formRef}
        onSuccess={() => {
          console.log('Form submitted successfully');
        }}
        className="mt-6"
      />
    </div>
  );
};

export default FasciaNameForm; 