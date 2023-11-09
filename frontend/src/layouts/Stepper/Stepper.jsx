import React, { useState } from "react";
import "./stepper.css";
import { TiTick } from "react-icons/ti";
import { trainingStepsConfig, DQStepsConfig } from "../../config/config";
import { usePage } from "../../hooks/usePage";

function Stepper() {
  const { currentPage, currentContextStep, allComplete } = usePage();
  var steps = []; // the label under the stepper circles
  switch (currentPage) {
    case "training":
        steps = trainingStepsConfig
        break;
    case "dataquality":
        steps = DQStepsConfig
        break;
    default:
        break;
  }

  console.log("STEPPER")

  return (
    <>
      <div className="flex justify-between mx-auto w-6/6">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentContextStep === i + 1 && "active"} ${
              (i + 1 < currentContextStep || allComplete) && "complete"
            }`}
          >
            <div className="step">
              {i + 1 < currentContextStep || allComplete ? (
                <TiTick size={24} />
              ) : (
                i + 1
              )}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      {/* {!allComplete && (
        <button
          className="bg-white btn"
          onClick={() => {
            currentContextStep === steps.length
              ? setAllComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length ? "Finish" : `To ${steps[currentStep]}`}
        </button>
      )} */}
    </>
  );
}
export default Stepper;
