'use client';

import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormProgressStep {
  id: string;
  label: string;
  status: 'complete' | 'current' | 'upcoming' | 'error';
}

interface FormProgressIndicatorProps {
  steps: FormProgressStep[];
  currentStep: string;
  className?: string;
}

const FormProgressIndicator: React.FC<FormProgressIndicatorProps> = ({
  steps,
  currentStep,
  className
}) => {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Form Progress</span>
        <span className="text-sm text-gray-500">
          {steps.filter(step => step.status === 'complete').length} of {steps.length} completed
        </span>
      </div>
      
      {/* Mobile view - Vertical steps */}
      <div className="md:hidden space-y-3">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={cn(
              "flex items-center px-3 py-2 rounded-lg",
              step.status === 'complete' && "bg-green-50",
              step.status === 'current' && "bg-blue-50 border border-blue-200",
              step.status === 'upcoming' && "bg-gray-50",
              step.status === 'error' && "bg-red-50"
            )}
          >
            {step.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
            {step.status === 'current' && <Circle className="w-5 h-5 text-blue-600 fill-blue-100 mr-2" />}
            {step.status === 'upcoming' && <Circle className="w-5 h-5 text-gray-400 mr-2" />}
            {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
            
            <span className={cn(
              "text-sm font-medium",
              step.status === 'complete' && "text-green-800",
              step.status === 'current' && "text-blue-800",
              step.status === 'upcoming' && "text-gray-600",
              step.status === 'error' && "text-red-800"
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Desktop view - Horizontal steps with connecting lines */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200"></div>
          
          {/* Progress bar filled portion */}
          <div 
            className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-blue-600 transition-all duration-300"
            style={{ 
              width: `${(steps.filter(step => step.status === 'complete').length / (steps.length - 1)) * 100}%` 
            }}
          ></div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="flex items-center justify-center relative">
                  {step.status === 'complete' && (
                    <CheckCircle className="w-8 h-8 text-green-600 bg-white rounded-full z-10 p-0.5" />
                  )}
                  {step.status === 'current' && (
                    <Circle className="w-8 h-8 text-blue-600 fill-blue-100 bg-white rounded-full z-10 p-0.5" />
                  )}
                  {step.status === 'upcoming' && (
                    <Circle className="w-8 h-8 text-gray-400 bg-white rounded-full z-10 p-0.5" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="w-8 h-8 text-red-600 bg-white rounded-full z-10 p-0.5" />
                  )}
                </div>
                <span className={cn(
                  "mt-2 text-xs font-medium text-center",
                  step.status === 'complete' && "text-green-700",
                  step.status === 'current' && "text-blue-700",
                  step.status === 'upcoming' && "text-gray-500",
                  step.status === 'error' && "text-red-700"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProgressIndicator; 