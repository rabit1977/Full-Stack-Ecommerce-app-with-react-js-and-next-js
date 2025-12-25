'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

interface Step {
  number: number;
  label: string;
  description: string;
}

const steps: Step[] = [
  { number: 1, label: 'Shipping', description: 'Delivery information' },
  { number: 2, label: 'Payment', description: 'Payment details' },
  { number: 3, label: 'Review', description: 'Confirm order' },
];

/**
 * Checkout progress steps component
 * Shows visual progress through the checkout flow
 */
const CheckoutSteps = memo(({ currentStep, onStepClick }: CheckoutStepsProps) => {
  const handleStepClick = (stepNumber: number) => {
    // Only allow clicking previous steps
    if (onStepClick && stepNumber < currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <nav aria-label="Checkout progress" className="mt-8 mb-8">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = onStepClick && step.number < currentStep;

          return (
            <li key={step.number} className="flex-1 relative">
              <div className="flex items-center">
                {/* Connector Line */}
                {index > 0 && (
                  <div
                    className={cn(
                      'absolute left-0 top-5 -ml-2 w-full h-0.5 -z-10',
                      isCompleted || isCurrent
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    )}
                    style={{ 
                      width: 'calc(100% - 2.5rem)',
                      transform: 'translateX(-100%)'
                    }}
                  />
                )}

                {/* Step Content */}
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isClickable}
                  className={cn(
                    'flex flex-col items-start w-full group',
                    isClickable && 'cursor-pointer hover:opacity-80'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {/* Step Circle */}
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                        isCompleted
                          ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                          : isCurrent
                          ? 'bg-white border-blue-600 dark:bg-slate-900 dark:border-blue-500'
                          : 'bg-white border-slate-300 dark:bg-slate-900 dark:border-slate-700'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            isCurrent
                              ? 'text-blue-600 dark:text-blue-500'
                              : 'text-slate-400 dark:text-slate-600'
                          )}
                        >
                          {step.number}
                        </span>
                      )}
                    </div>

                    {/* Step Label - Desktop */}
                    <div className="hidden sm:block text-left">
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isCompleted || isCurrent
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400'
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Step Label - Mobile */}
                  <p
                    className={cn(
                      'sm:hidden text-xs font-medium text-center w-full',
                      isCompleted || isCurrent
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {step.label}
                  </p>
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

CheckoutSteps.displayName = 'CheckoutSteps';

export { CheckoutSteps };