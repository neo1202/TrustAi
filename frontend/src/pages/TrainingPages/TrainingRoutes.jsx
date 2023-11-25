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
import ShapPage from "../ShapPage";

function TrainingRoutes() {
  const trainingPages = [
    "SetUp",
    "MethodSelect",
    "UserTypeLabel",
    "Result",
    "KD",
    "ShapExp",
    "SHAP"
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
        <Route path="SHAP" element={<ShapPage />} />
      </Routes>
      <StepperButton handlePageChange={handleButtonClick} />
    </>
  );
}

export default TrainingRoutes;
