import React from "react";
import { useContext } from "react";
import PageInfoContext from "../../context/pageInfo";
import { stepsConfig } from "../../config/config";

function StepperButton({ handlePageChange }) {
  const { currentContextStep, incrementCurrentContextStep } =
    useContext(PageInfoContext);
  const steps = stepsConfig;
  const handleButtonClick = () => {
    handlePageChange();
    incrementCurrentContextStep();
  };

  return (
    <>
      <p>Now step from Context:{currentContextStep}</p>
      <button className="bg-white btn" onClick={handleButtonClick}>
        {currentContextStep === steps.length
          ? "Finish"
          : `To ${steps[currentContextStep]}`}
      </button>
    </>
  );
}

export default StepperButton;
