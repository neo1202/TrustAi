import React from "react";
// import { usePage } from "../../context/pageInfo";
import { usePage } from "../../hooks/usePage";
import { stepsConfig } from "../../config/config";

function StepperButton({ handlePageChange }) {
  const { currentContextStep, setCurrentContextStep } = usePage();
  const steps = stepsConfig;
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
