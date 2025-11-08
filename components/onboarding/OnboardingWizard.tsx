'use client';

import { useState } from 'react';
import { OnboardingData } from '@/types/shared';
import { StepOccupation } from './StepOccupation';
import { StepRoutine } from './StepRoutine';
import { StepHabits } from './StepHabits';
import { StepFocus } from './StepFocus';
import { StepPeakHours } from './StepPeakHours';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    habits: [],
    peakHours: [],
    focusScale: 5
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(formData as OnboardingData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.occupation && formData.occupation.length > 0;
      case 2:
        return !!formData.wakeTime && !!formData.sleepTime;
      case 3:
        return formData.habits && formData.habits.length > 0;
      case 4:
        return typeof formData.focusScale === 'number';
      case 5:
        return formData.peakHours && formData.peakHours.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to FlowMate</h1>
        <p className="text-muted-foreground">
          Let's personalize your productivity experience (Step {currentStep} of {totalSteps})
        </p>
        <Progress value={progress} className="mt-4" />
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <StepOccupation
            value={formData.occupation || ''}
            onChange={(occupation) => updateFormData({ occupation })}
          />
        )}
        {currentStep === 2 && (
          <StepRoutine
            wakeTime={formData.wakeTime || ''}
            sleepTime={formData.sleepTime || ''}
            onChange={(wakeTime, sleepTime) => updateFormData({ wakeTime, sleepTime })}
          />
        )}
        {currentStep === 3 && (
          <StepHabits
            selected={formData.habits || []}
            onChange={(habits) => updateFormData({ habits })}
          />
        )}
        {currentStep === 4 && (
          <StepFocus
            value={formData.focusScale}
            onChange={(focusScale) => updateFormData({ focusScale })}
          />
        )}
        {currentStep === 5 && (
          <StepPeakHours
            selected={formData.peakHours || []}
            onChange={(peakHours) => updateFormData({ peakHours })}
          />
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          onClick={handleBack}
          disabled={currentStep === 1}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
