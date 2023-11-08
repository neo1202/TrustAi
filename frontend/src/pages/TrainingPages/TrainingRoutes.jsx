import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Stepper from "../../layouts/Stepper/Stepper";
import StepperButton from "../../layouts/StepperButton/StepperButton";
import PageInfoContext, { PageProvider } from "../../context/pageInfo";

import SetUpPage from "./SetUpPage";
import ResultPage from "./ResultPage";
import MethodSelectPage from "./MethodSelectPage";
import UserTypeLabelPage from "./UserTypeLabelPage";
import KDPage from "./KDPage";
import ShapExpPage from "./ShapExpPage";

function TrainingRoutes() {
  const trainingPages = [
    "SetUpPage",
    "MethodSelect",
    "UserTypeLabel",
    "Result",
    "KD",
    "ShapExp",
  ];
  const { currentContextStep } = useContext(PageInfoContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/training/${trainingPages[currentContextStep]}`); // 导航到currentStep頁
  };

  return (
    <>
      <Stepper />
      <Routes>
        <Route index element={<SetUpPage />} />
        {/* index代表默認頁 */}
        <Route path="MethodSelect" element={<MethodSelectPage />} />
        <Route path="UserTypeLabel" element={<UserTypeLabelPage />} />
        <Route path="Result" element={<ResultPage />} />
        <Route path="KD" element={<KDPage />} />
        <Route path="ShapExp" element={<ShapExpPage />} />
      </Routes>
      <StepperButton handlePageChange={handleButtonClick} />
    </>
  );
}

export default TrainingRoutes;
