import React from "react";
import { usePage } from "../../hooks/usePage";
import { trainingStepsConfig, DQStepsConfig } from "../../config/config";


function StepperButton({ handlePageChange }) {
  const { currentPage, currentContextStep, setCurrentContextStep } = usePage();
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
  const handleButtonClick = () => {
    handlePageChange();
    setCurrentContextStep(prev => prev + 1);
  };

  return (
    <>
      {/* <p>Now step from Context:{currentContextStep}</p> */}
      <button className="bg-white btn" onClick={handleButtonClick}>
        {currentContextStep === steps.length
          ? "Finish"
          : `To ${steps[currentContextStep]}`}
      </button>
    </>
  );
}

export default StepperButton;
