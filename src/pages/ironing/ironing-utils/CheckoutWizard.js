import React from "react";
import { useTranslation } from "react-i18next";


export default function CheckoutWizard({ activeStep = 0 }) {
  const { t } = useTranslation();


  return (
    <div className="mb-5 flex flex-wrap">
      {[t('addedItems'), t('shippingAddress'), t('placeOrder')].map((step, index) => (
        <div
          key={step}
          className={`flex-1 border-b-2  
          text-center 
       ${
         index <= activeStep
           ? "border-indigo-500   text-indigo-500"
           : "border-gray-400 text-gray-400"
       }
          
       `}
        >
          {step}
        </div>
      ))}
    </div>
  );
}