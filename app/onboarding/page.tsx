'use client';

import { useRouter } from 'next/navigation';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { OnboardingData } from '@/types/shared';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = async (data: OnboardingData) => {
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}
