import React, { useState } from "react";
import "./stepper.css";
import { TiTick } from "react-icons/ti";

function Stepper() {
  const steps = [
    "Initial Setup",
    "Method Select",
    "Training Process",
    "Result",
    "Knowledge Distill",
    "KD Result",
    "Shap Explanation",
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [allComplete, setAllComplete] = useState(false);
  return (
    <>
      <div className="flex justify-between mx-auto mt-6 w-6/6">
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
          {currentStep === steps.length ? "Finish" : `To ${steps[currentStep]}`}
        </button>
      )}
    </>
  );
}
export default Stepper;
