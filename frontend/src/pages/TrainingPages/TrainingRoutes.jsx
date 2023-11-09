import React, { useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { usePage } from "../../hooks/usePage";
import Stepper from "../../layouts/Stepper/Stepper";
import StepperButton from "../../layouts/StepperButton/StepperButton";

import SetUpPage from "./SetUpPage";
import ResultPage from "./ResultPage";
import MethodSelectPage from "./MethodSelectPage";
import UserTypeLabelPage from "./UserTypeLabelPage";
import KDPage from "./KDPage";
import ShapExpPage from "./ShapExpPage";

function TrainingRoutes() {
  const trainingPages = [
    "SetUp",
    "MethodSelect",
    "UserTypeLabel",
    "Result",
    "KD",
    "ShapExp",
  ];
  const { currentContextStep } = usePage();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/training/${trainingPages[currentContextStep]}`);
  };

  return (
    <>
      <Stepper />
      <Routes>
        <Route index element={<SetUpPage />} />
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
