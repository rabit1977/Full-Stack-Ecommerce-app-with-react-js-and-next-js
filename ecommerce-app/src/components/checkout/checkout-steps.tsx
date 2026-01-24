'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { memo } from 'react';

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
const CheckoutSteps = memo(
  ({ currentStep, onStepClick }: CheckoutStepsProps) => {
    const handleStepClick = (stepNumber: number) => {
      // Only allow clicking previous steps
      if (onStepClick && stepNumber < currentStep) {
        onStepClick(stepNumber);
      }
    };

    return (
      <nav aria-label='Checkout progress' className='mt-8 mb-12'>
        <ol className='flex items-center justify-between w-full relative z-10'>
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isClickable = onStepClick && step.number < currentStep;

            return (
              <li key={step.number} className='flex-1 relative last:flex-none'>
                <div className='flex items-center'>
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                     <div className="absolute left-10 top-5 w-[calc(100%-2.5rem)] h-0.5 bg-secondary -z-10">
                        <div 
                           className={cn(
                              "h-full bg-primary transition-all duration-500",
                              isCompleted ? "w-full" : "w-0"
                           )}
                        />
                     </div>
                  )}

                  {/* Step Content */}
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={!isClickable}
                    className={cn(
                      'flex items-center gap-4 group bg-transparent border-0 p-0',
                      isClickable && 'cursor-pointer',
                    )}
                  >
                     {/* Step Circle */}
                     <div
                        className={cn(
                           'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 relative',
                           isCompleted
                           ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                           : isCurrent
                              ? 'bg-background border-primary text-primary ring-4 ring-primary/10'
                              : 'bg-secondary border-transparent text-muted-foreground',
                        )}
                     >
                        {isCompleted ? (
                           <Check className='w-5 h-5' />
                        ) : (
                           <span className='text-sm font-bold'>
                           {step.number}
                           </span>
                        )}
                     </div>

                     {/* Step Label - Desktop */}
                     <div className='hidden sm:block text-left'>
                        <p
                           className={cn(
                           'text-sm font-bold transition-colors',
                           isCompleted || isCurrent
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                           )}
                        >
                           {step.label}
                        </p>
                        <p className='text-xs text-muted-foreground font-medium'>
                           {step.description}
                        </p>
                     </div>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

CheckoutSteps.displayName = 'CheckoutSteps';

export { CheckoutSteps };
