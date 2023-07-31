import React from "react";

function StepperButton({ currentStep, allComplete, totalPages, onClick }) {
  const steps = [
    "Home Page",
    "Method Choose",
    "Training Process",
    "Shap Explanation",
  ];
  const handleButtonClick = () => {
    if (currentStep < totalPages) {
      onClick(currentStep + 1); // 调用传入的 onClick 回调函数，传递更新后的 currentStep
    } else {
      onClick(1); // 如果已经在最后一页，则回到第一页
    }
  };

  return (
    // {!allComplete && (
    //   <button
    //     className="bg-white btn"
    //     onClick={() => {
    //       currentStep === steps.length
    //         ? setAllComplete(true)
    //         : setCurrentStep((prev) => prev + 1);
    //     }}
    //   >
    //     {currentStep === steps.length ? "Finish" : `To ${steps[currentStep]}`}
    //   </button>
    // )}
    <button className="bg-white btn" onClick={handleButtonClick}>
      {currentStep === totalPages ? "Finish" : `To ${steps[currentStep]}`}
    </button>
  );
}

export default StepperButton;
