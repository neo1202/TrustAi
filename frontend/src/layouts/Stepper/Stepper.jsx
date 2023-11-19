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
                <TiTick size={24} /> // the checks in the number circles
              ) : (
                i + 1
              )}
            </div>
            <p className="text-gray-400">{step}</p>
          </div>
        ))}
      </div>
    </>
  );
}
export default Stepper;
