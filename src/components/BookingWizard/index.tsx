import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

export interface WizardData {
  date?: Date;
  location?: string;
  locationDetails?: any;
  timeSlot?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  equipment?: {
    canonBooth: boolean;
    customFrame: boolean;
    extraLogos: number;
    customBackdrop: boolean;
    partySwag: boolean;
    printer: boolean;
    extraRolls: number;
    gifSetting: boolean;
    photographer: boolean;
    photographerHours: number;
    outdoorCovered: boolean;
    extraTime: boolean;
    extraTimeHours: number;
    isVeteran: boolean;
    isNonProfit: boolean;
  };
  totalCost?: number;
  paymentStatus?: 'pending' | 'completed';
}

const BookingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1]);
  const [wizardData, setWizardData] = useState<WizardData>(() => {
    const savedData = localStorage.getItem('bookingWizardData');
    return savedData ? JSON.parse(savedData) : {};
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookingWizardData', JSON.stringify(wizardData));
  }, [wizardData]);

  const handleNext = (stepData: Partial<WizardData>) => {
    const newData = { ...wizardData, ...stepData };
    setWizardData(newData);
    setCurrentStep(prev => prev + 1);
    setVisitedSteps(prev => [...new Set([...prev, currentStep + 1])]);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleStepClick = (step: number) => {
    if (visitedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    // Don't clear wizardData to maintain the cache
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            onNext={handleNext}
            initialData={wizardData}
          />
        );
      case 2:
        return (
          <Step2
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <Step5
            data={wizardData}
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="booking-wizard">
      <h2 className="text-4xl font-bold text-center mb-12">
        Book Your Photo Booth Experience
      </h2>
      
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              {step > 1 && (
                <div className={`w-8 h-0.5 ${
                  visitedSteps.includes(step) ? 'bg-sky-400' : 'bg-gray-300'
                }`} />
              )}
              <button
                onClick={() => handleStepClick(step)}
                disabled={!visitedSteps.includes(step)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${currentStep === step 
                    ? 'bg-sky-400 text-white'
                    : visitedSteps.includes(step)
                      ? 'bg-sky-100 text-sky-600 hover:bg-sky-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {step}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default BookingWizard;