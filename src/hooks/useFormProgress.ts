'use client';

import { useState, useEffect } from 'react';

export type FormStepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface FormStep {
  id: string;
  label: string;
  status: FormStepStatus;
  validator?: () => boolean;
}

interface UseFormProgressProps {
  steps: Omit<FormStep, 'status'>[];
  initialStep?: string;
  onStepChange?: (currentStep: string, nextStep: string) => void;
}

interface UseFormProgressReturn {
  currentStepId: string;
  steps: FormStep[];
  goToStep: (stepId: string) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  updateStepStatus: (stepId: string, status: FormStepStatus) => void;
  getCompletionPercentage: () => number;
}

const useFormProgress = ({
  steps: initialSteps,
  initialStep,
  onStepChange
}: UseFormProgressProps): UseFormProgressReturn => {
  // Initialize steps with status
  const [steps, setSteps] = useState<FormStep[]>(() => {
    const firstStepId = initialStep || initialSteps[0]?.id;
    return initialSteps.map((step, index) => ({
      ...step,
      status: step.id === firstStepId 
        ? 'current' as FormStepStatus
        : index < initialSteps.findIndex(s => s.id === firstStepId) 
          ? 'complete' as FormStepStatus
          : 'upcoming' as FormStepStatus
    }));
  });
  
  // Track current step
  const [currentStepId, setCurrentStepId] = useState<string>(
    initialStep || initialSteps[0]?.id
  );
  
  // Check if we're on first or last step
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  
  // Navigate to a specific step
  const goToStep = (stepId: string) => {
    const targetStep = steps.find(step => step.id === stepId);
    if (!targetStep) return;
    
    const prevStepId = currentStepId;
    
    // Update current step status
    const updatedSteps = steps.map(step => {
      if (step.id === currentStepId) {
        return { ...step, status: 'complete' as FormStepStatus };
      }
      if (step.id === stepId) {
        return { ...step, status: 'current' as FormStepStatus };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    setCurrentStepId(stepId);
    
    if (onStepChange) {
      onStepChange(prevStepId, stepId);
    }
  };
  
  // Go to next step
  const goToNextStep = (): boolean => {
    if (isLastStep) return false;
    
    // Get current step
    const currentStep = steps.find(step => step.id === currentStepId);
    
    // Validate current step if validator exists
    if (currentStep?.validator && !currentStep.validator()) {
      // Update current step to error state if validation fails
      updateStepStatus(currentStepId, 'error');
      return false;
    }
    
    // Get next step
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      goToStep(nextStep.id);
      return true;
    }
    
    return false;
  };
  
  // Go to previous step
  const goToPreviousStep = (): boolean => {
    if (isFirstStep) return false;
    
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) {
      goToStep(prevStep.id);
      return true;
    }
    
    return false;
  };
  
  // Update a step's status
  const updateStepStatus = (stepId: string, status: FormStepStatus) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId 
          ? { ...step, status } 
          : step
      )
    );
  };
  
  // Calculate completion percentage
  const getCompletionPercentage = (): number => {
    const completedSteps = steps.filter(step => step.status === 'complete').length;
    return Math.round((completedSteps / steps.length) * 100);
  };
  
  return {
    currentStepId,
    steps,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    updateStepStatus,
    getCompletionPercentage
  };
};

export default useFormProgress; 