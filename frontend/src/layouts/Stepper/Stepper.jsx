import React, { useState } from "react";
import "./stepper.css";
import { TiTick } from "react-icons/ti";

function Stepper() {
  const steps = [
    "Home Page",
    "Method Choose",
    "Training Process",
    "Shap Explanation",
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [allComplete, setAllComplete] = useState(false);
  return (
    <>
      <div className="flex justify-between w-4/6 mx-auto mt-6">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || allComplete) && "complete"
            }`}
          >
            <div className="step">
              {i + 1 < currentStep || allComplete ? (
                <TiTick size={24} />
              ) : (
                i + 1
              )}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      {!allComplete && (
        <button
          className="bg-white btn"
          onClick={() => {
            currentStep === steps.length
              ? setAllComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length
            ? "Finish"
            : `Next ${steps[currentStep]}`}
        </button>
      )}
    </>
  );
}
export default Stepper;
