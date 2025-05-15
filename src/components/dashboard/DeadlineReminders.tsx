'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Add CSS to hide scrollbar but maintain functionality
const ScrollbarHider = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);
  
  return null;
};

interface FormDeadline {
  id: string;
  title: string;
  description: string;
  date: string;
  formType: string;
  href: string;
  isSubmitted?: boolean;
}

export default function DeadlineReminders() {
  const [forms, setForms] = useState<FormDeadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchFormSubmissions() {
      setIsLoading(true);
      
      // Define all forms with their details
      const allForms: FormDeadline[] = [
        {
          id: 'form1',
          title: 'Form 1: Fascia Name Form',
          description: 'Submit your company name as it should appear on the fascia board.',
          date: '30th June 2025',
          formType: '1',
          href: '/dashboard/order-forms/form1',
          isSubmitted: false
        },
        {
          id: 'form2',
          title: 'Form 2: Contractor Pass Application Form',
          description: 'Apply for a contractor pass for the exhibition.',
          date: '30th June 2025',
          formType: '2',
          href: '/dashboard/order-forms/form2',
          isSubmitted: false
        },
        {
          id: 'form3',
          title: 'Form 3: Electrical & Lighting Order Form',
          description: 'Order electrical points and additional lighting.',
          date: '30th June 2025',
          formType: '3',
          href: '/dashboard/order-forms/form3',
          isSubmitted: false
        },
        {
          id: 'form4',
          title: 'Form 4: Furniture Order Form',
          description: 'Order furniture for your booth.',
          date: '30th June 2025',
          formType: '4',
          href: '/dashboard/order-forms/form4',
          isSubmitted: false
        },
        {
          id: 'form5',
          title: 'Form 5: Printing Order Form',
          description: 'Order printing services for your booth.',
          date: '30th June 2025',
          formType: '5',
          href: '/dashboard/order-forms/form5',
          isSubmitted: false
        },
        {
          id: 'form6',
          title: 'Form 6: Non-Official Contractor Form (Performance Bond)',
          description: 'Apply for a non-official contractor (Performance Bond) for the exhibition.',
          date: '30th June 2025',
          formType: '6',
          href: '/dashboard/order-forms/form6',
          isSubmitted: false
        },
        {
          id: 'form7',
          title: 'Form 7: Non-Official Contractor Form (Admin Fees)',
          description: 'Apply for a non-official contractor (Admin Fees) for the exhibition.',
          date: '30th June 2025',
          formType: '7',
          href: '/dashboard/order-forms/form7',
          isSubmitted: false
        },
        {
          id: 'form8',
          title: 'Form 8: Letter Of Indemnity For Non-Official Contractor',
          description: 'Apply for a letter of Indemnity for a non-official contractor.',
          date: '30th June 2025',
          formType: '8',
          href: '/dashboard/order-forms/indemnity-letter',
          isSubmitted: false
        },
        {
          id: 'form9',
          title: 'Form 9: Audio Visual Equipment',
          description: 'Order audio visual equipment like LED TVs and stands.',
          date: '30th June 2025',
          formType: '9',
          href: '/dashboard/order-forms/form9',
          isSubmitted: false
        }
      ];
      
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch all form submissions for the current user
          const { data: submissions } = await supabase
            .from('forms')
            .select('form_type')
            .eq('user_id', user.id);
          
          if (submissions && submissions.length > 0) {
            // Create a set of submitted form types for quick lookup
            const submittedFormTypes = new Set(
              submissions.map(submission => submission.form_type)
            );
            
            // Update forms with submission status
            setForms(allForms.map(form => ({
              ...form,
              isSubmitted: submittedFormTypes.has(form.formType)
            })));
          } else {
            setForms(allForms);
          }
        } else {
          setForms(allForms);
        }
      } catch (error) {
        console.error('Error fetching form submissions:', error);
        setForms(allForms);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFormSubmissions();
  }, [supabase]);
  
  // Function to calculate days left until deadline
  const calculateDaysLeft = (deadlineDate: string): number => {
    const deadline = new Date('2025-06-30'); // Hardcoded for all forms with deadline 30th June 2025
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  
  // Function to determine status color based on days left
  const getStatusColor = (daysLeft: number, isSubmitted: boolean, element: 'bg' | 'text' | 'border') => {
    // If form is submitted, use a different color scheme (blue)
    if (isSubmitted) {
      const colors = {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200'
      };
      return colors[element];
    }
    
    // Color based on days remaining
    if (daysLeft === 0) {
      // Passed deadline - Red
      const colors = {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200'
      };
      return colors[element];
    } else if (daysLeft <= 30) {
      // Less than 30 days - Yellow
      const colors = {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200'
      };
      return colors[element];
    } else {
      // More than 30 days - Green
      const colors = {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200'
      };
      return colors[element];
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ScrollbarHider />
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="text-white mr-2" size={20} />
          <h3 className="text-lg font-semibold text-white">Form Deadlines & Status</h3>
        </div>
        <Link 
          href="/dashboard/order-forms" 
          className="text-xs text-white hover:text-blue-200 underline"
        >
          View all forms
        </Link>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading form status...</span>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex space-x-4 snap-x snap-mandatory w-fit">
              {forms.map((form) => {
                const daysLeft = calculateDaysLeft(form.date);
                
                return (
                  <Link
                    key={form.id}
                    href={form.href}
                    className="snap-start shrink-0 w-72 sm:w-80 group"
                  >
                    <div 
                      className={`p-4 rounded-lg border ${getStatusColor(daysLeft, !!form.isSubmitted, 'border')} ${getStatusColor(daysLeft, !!form.isSubmitted, 'bg')} transition-all hover:shadow-md h-full`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-medium ${getStatusColor(daysLeft, !!form.isSubmitted, 'text')} text-sm sm:text-base w-3/5`}>
                          {form.title}
                        </h4>
                        {form.isSubmitted ? (
                          <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs whitespace-nowrap">
                            <CheckCircle size={14} className="mr-1 flex-shrink-0" />
                            <span className="font-semibold">Submitted</span>
                          </div>
                        ) : (
                          <div className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs whitespace-nowrap">
                            <XCircle size={14} className="mr-1 flex-shrink-0" />
                            <span className="font-semibold">Not Submitted</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock size={14} className="text-gray-500 mr-1 flex-shrink-0" />
                          <span className="text-xs text-gray-600">
                            {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline has passed'}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-500 ml-1">
                          {form.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 