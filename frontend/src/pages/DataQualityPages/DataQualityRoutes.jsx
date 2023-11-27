import React, { useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { usePage } from "../../hooks/usePage";
import Stepper from "../../layouts/Stepper/Stepper";
import StepperButton from "../../layouts/StepperButton/StepperButton";

import EdashPage from "./EdashPage";
import ImputerSelectPage from "./ImputerSelectPage";
import DQResultRoutes from "./Results/DQResultRoutes";

const DataQualityRoutes = () => {
  const DQPages = [
    "Edash",
    "ImputerSelect",
    "DQResult",
  ]

  const { currentContextStep } = usePage();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/dataquality/${DQPages[currentContextStep]}`); 
  };

  return (<>
    <Stepper />
    <Routes>
      <Route index element={<EdashPage />} />
      <Route path="ImputerSelect" element={<ImputerSelectPage />} />
      <Route path="DQResult/*" element={<DQResultRoutes />} />
    </Routes>
    <StepperButton handlePageChange={handleButtonClick} />
  </>)
}

export default DataQualityRoutes;
