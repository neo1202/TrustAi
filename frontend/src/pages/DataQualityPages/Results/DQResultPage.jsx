import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import DataframePage from "./DataframePage";
import ImputedDetailPage from "./ImputedDetailPage";
import SimplificationPage from "./SimplificationPage";

const DQResultPage = () => {
  const navigate = useNavigate();

  const handleDF = () => {
    navigate(`/dataquality/DQResult/`)
  }

  const handleDetail = () => {
    navigate(`/dataquality/DQResult/ImputedDetail`)
  }
  
  const handleSimp = () => {
    navigate(`/dataquality/DQResult/Simplification`)
  }

  return (
    <div>
      <h1>DQ Result Page</h1>
      <Routes>
        <Route index element={<DataframePage />} />
        <Route path="ImputedDetail" element={<ImputedDetailPage />} />
        <Route path="Simplification" element={<SimplificationPage />} />
      </Routes>
      <br />
      <button className="bg-white btn" onClick={handleDF}>Dataframe</button>
      <br />
      <br />
      <button className="bg-white btn" onClick={handleDetail}>Detail</button>
      <br />
      <br />
      <button className="bg-white btn" onClick={handleSimp}>Simplification</button>
    </div>
  )
}

export default DQResultPage;
