import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stepper from "./layouts/Stepper/Stepper";
import StepperButton from "./layouts/StepperButton/StepperButton";
import PageInfoContext, { StepProvider } from "./context/pageInfo";
import Header from "./layouts/Header/Header";

import SetUpPage from "./pages/TrainingPages/SetUpPage";
import TrainingProcessPage from "./pages/TrainingPages/TrainingProcessPage";
import ResultPage from "./pages/TrainingPages/ResultPage";
import MethodSelectPage from "./pages/TrainingPages/MethodSelectPage";
import UserTypeLabelPage from "./pages/TrainingPages/UserTypeLabelPage";

function TrainingRoutes() {
  const trainingPages = [
    "SetUpPage",
    "MethodSelect",
    "UserTypeLabel",
    "TrainingProcess",
    "Result",
  ];
  const { currentContextStep } = useContext(PageInfoContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/training/${trainingPages[currentContextStep]}`); // 导航到currentStep頁
  };

  return (
    <>
      <Header />
      <Stepper />
      <Routes>
        <Route index element={<SetUpPage />} />
        {/* index代表默認頁 */}
        <Route path="MethodSelect" element={<MethodSelectPage />} />
        <Route path="UserTypeLabel" element={<UserTypeLabelPage />} />
        <Route path="TrainingProcess" element={<TrainingProcessPage />} />
        <Route path="Result" element={<ResultPage />} />
      </Routes>
      <StepperButton handlePageChange={handleButtonClick} />
    </>
  );
}

export default TrainingRoutes;
