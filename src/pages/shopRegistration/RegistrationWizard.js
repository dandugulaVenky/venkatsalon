import React, { useState, useEffect } from "react";

const RegistrationWizard = ({ activeStep = 0 }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const steps =
    windowWidth <= 768
      ? ["1", "2", "3"]
      : ["Registration Form", "Shop Details", "Final Registration"];

  return (
    <div className="mb-5 flex flex-wrap">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 border-b-2  
            text-center 
            ${
              index <= activeStep
                ? "border-[#00ccbb] text-[#00ccbb]"
                : "border-gray-400 text-gray-400"
            }`}
        >
          <span
            className={
              windowWidth <= 768 &&
              index <= activeStep &&
              "bg-[#00ccbb] px-2.5  py-1 rounded-full text-white font-bold"
            }
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RegistrationWizard;
