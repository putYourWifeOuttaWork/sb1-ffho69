import React, { useState, useEffect } from 'react';
import type { WizardData } from './index';
import InvoiceDraft from '../InvoiceDraft';

interface Step4Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

const Step4: React.FC<Step4Props> = ({ data, onNext, onBack }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    const wizardTop = document.querySelector('.booking-wizard')?.getBoundingClientRect().top;
    if (wizardTop) {
      window.scrollTo({ top: window.pageYOffset + wizardTop - 100, behavior: 'smooth' });
    }
  }, []);

  const handleSecureDate = () => {
    setShowPaymentForm(true);
    // When payment is successful:
    onNext({ paymentStatus: 'completed' });
  };

  const handleNotYet = () => {
    // Don't clear cache, just update payment status
    onNext({ paymentStatus: 'pending' });
  };

  const handleBack = () => {
    // Scroll to top of wizard before going back
    const wizardTop = document.querySelector('.booking-wizard')?.getBoundingClientRect().top;
    if (wizardTop) {
      window.scrollTo({ top: window.pageYOffset + wizardTop - 100, behavior: 'smooth' });
    }
    
    // Small delay to allow smooth scrolling before transition
    setTimeout(() => {
      onBack();
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Secure this date?</h3>
          
          <div className="space-y-4">
            <button
              onClick={handleSecureDate}
              className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-lg
                hover:from-sky-500 hover:to-blue-600 transition shadow-lg"
            >
              Yes!
            </button>
            
            <button
              onClick={handleNotYet}
              className="w-full border-2 border-gray-300 px-6 py-3 rounded-lg
                hover:bg-gray-50 transition text-gray-600"
            >
              Not Yet
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            We Will Never Share Your Information. OpenAir uses bank encrypted fields for your financial 
            data and high-fidelity encryption CRM and market software to contact you. If you wish to 
            unsubscribe, click <button className="text-sky-500 hover:underline">HERE</button> and we 
            will not call you and we will remove you from our database.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <InvoiceDraft bookingData={data} />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Step4;