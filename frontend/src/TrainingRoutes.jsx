import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stepper from "./layouts/Stepper/Stepper";
import StepperButton from "./layouts/StepperButton/StepperButton";

import SetUpPage from "./pages/TrainingPages/SetUpPage";
import TrainingProcessPage from "./pages/TrainingPages/TrainingProcessPage";
import ResultPage from "./pages/TrainingPages/ResultPage";
import MethodSelectPage from "./pages/TrainingPages/MethodSelectPage";

function TrainingRoutes() {
  const trainingPages = [
    "SetUpPage",
    "ChooseModelPage",
    "TrainingPage",
    "ResultPage",
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [allComplete, setAllComplete] = useState(false);
  const totalPages = 5; // 替换为你的总页数
  const navigate = useNavigate();

  const handleButtonClick = (nextStep) => {
    setCurrentStep(nextStep); // 更新 currentStep 的状态
    navigate(`/training/${trainingPages[currentStep]}`); // 导航到currentStep頁
  };

  return (
    <>
      <Stepper />
      <Routes>
        <Route index element={<SetUpPage />} />
        {/* index代表默認頁 */}
        <Route path="MethodSelect" element={<MethodSelectPage />} />
        <Route path="TrainingProcess" element={<TrainingProcessPage />} />
        <Route path="ResultPage" element={<ResultPage />} />
      </Routes>
      <StepperButton
        currentStep={currentStep}
        allComplete={allComplete}
        totalPages={totalPages}
        onClick={handleButtonClick} // 将回调函数传递给按钮组件
      />
    </>
  );
}

export default TrainingRoutes;
