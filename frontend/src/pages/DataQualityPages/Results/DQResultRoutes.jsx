import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { usePage } from "../../../hooks/usePage";
import { useStatus } from "../../../hooks/useStatus";
import popMessage from "../../../utils/popMessage";
import Loading from "../../../components/Loading";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import DQResultMainPage from "./DQResultMainPage";
import DataframePage from "./DataframePage";
import ImputedDetailPage from "./ImputedDetailPage";
import SimplificationPage from "./SimplificationPage";

import API_URL from "../../../api";

const DQResultRoutes = () => {
  const resultPages = [
    {
      label: "Dataframe",
      description: "View the imputed dataframes",
      onClick: () => handleResultClick("Dataframe"),
    },
    {
      label: "Detail",
      description: "View the mathematical results, including tables and graphs",
      onClick: () => handleResultClick("Detail"),
    },
    {
      label: "Simplification",
      description: "View the mathematical results, including some evaluation indexes",
      onClick: () => handleResultClick("Simplification"),
    },
    {
      label: "Go back",
      description: "View the mathematical results, including some evaluation indexes",
      onClick: () => handleResultClick(""),
    },
    {
      label: "Go to Trust AI",
      description: "Use the imputed datasets to do active learning and SHAP",
      onClick: () => handleResultClick("trustai"),
    },
  ]

  const navigate = useNavigate();
  const [isOnMainResultPage, setIsOnMainResultPage] = useState(true);
  const [currResultPage, setCurrResultPage] = useState("");
  const { setCurrentPage, setCurrentContextStep } = usePage();
  const { isLoading, setIsLoading, loadingMsg, setLoadingMsg, loadingTime, setLoadingTime } = useStatus();

  const handleResultClick = async (route) => {
    if (route === "trustai") {
      setIsLoading(true); setLoadingMsg("Going to active learning process..."); setLoadingTime(0.5);

      // read data(imputed data)
      const response = await fetch(
        `${API_URL}/readALData/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        })

      const data = await response.json()
      console.log(data)
      
      setCurrentPage(`training`);
      setCurrentContextStep(1);
      navigate(`/training`);

      setIsLoading(false); setLoadingMsg(''); setLoadingTime(0);
      popMessage(data.msg);
      return
    }
    route === ""? setIsOnMainResultPage(true) : setIsOnMainResultPage(false)
    navigate(`/dataquality/DQResult/${route}`);
  }

  return (
    <div>
      {isLoading? <Loading action={loadingMsg} waitTime={loadingTime}/> : <></>} 
      {isOnMainResultPage? <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
        Select One From Below
      </Typography> : <></>}
      <div style={{ display: "flex", justifyContent: "center" }}>
      {resultPages.map((page, index) => (
        <Tooltip key={index} title={page.description}>
        {isOnMainResultPage && page.label === 'Go back'?
          <></> : 
          <Button
            variant="contained"
            style={{
                margin: "10px",
                backgroundColor: currResultPage === page.label ? "#4CAF50" : "",
            }}
            onClick={() => {
                page.onClick(page.label);
                setCurrResultPage(page.label);
            }}
            >
            {page.label}
            </Button>
        }
        </Tooltip> 
      ))}
      </div>
      

      <Routes>
        <Route index element={<DQResultMainPage />} />
        <Route path="Dataframe" element={<DataframePage />} />
        <Route path="Detail" element={<ImputedDetailPage />} />
        <Route path="Simplification" element={<SimplificationPage />} />
      </Routes>
      <br />
      
    </div>
  )
}

export default DQResultRoutes;
