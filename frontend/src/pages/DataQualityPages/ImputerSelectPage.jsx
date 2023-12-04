import React, { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import API_URL from "../../api";
import { useDQ } from "../../hooks/useDQ"
import { useStatus } from "../../hooks/useStatus";
import popMessage from "../../utils/popMessage";
import Loading from "../../components/Loading";

const ImputerSelectPage = () => {
  const [selectedImputer, setSelectedImputer] = useState(null);

  const imputers = [
    {
      label: "Genetic-enhanced fuzzy c-means",
      description: "Genetic-enhanced fuzzy c-means imputer description goes here.",
      onClick: () => handleImputerClick("Genetic-enhanced fuzzy c-means"),
    },
    {
      label: "Expectation-Maximization",
      description: "Expectation-Maximization (EM) imputer description goes here.",
      onClick: () => handleImputerClick("EM"),
    },
    {
      label: "Miss-forest",
      description: "Miss-forest imputer description goes here.",
      onClick: () => handleImputerClick("Miss-forest"),
    },
  ];

  const {
    setImputedData,
    getImputedDetails, getMetricValues, 
  } = useDQ();

  const { isLoading, setIsLoading, loadingMsg, setLoadingMsg, loadingTime, setLoadingTime } = useStatus();

  const handleImputerClick = async (imputerName) => {
    setSelectedImputer(imputerName);
    const setting = {
      type: "SelectImputer",
      value: imputerName,
    };
    const response = await fetch(`${API_URL}/settings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setting),
    });
    const data = await response.json();
    console.log("Settings...", data);
    popMessage(data.msg)
  };

  const handleImpute = async () => {
    setIsLoading(true); setLoadingMsg("Start imputing the missing data(might take long)..."); setLoadingTime(20);

    const response = await fetch(`${API_URL}/startImpute/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("finish imputing...", data);
    setImputedData(data.imputedData);

    setIsLoading(false); setLoadingMsg(''); setLoadingTime(0);
    popMessage(data.msg)
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {isLoading? <Loading action={loadingMsg} waitTime={loadingTime}/> : <></>} 
      <Typography variant="h4" gutterBottom>
        Select an Imputer
      </Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {imputers.map((imputer, index) => (
          <Tooltip key={index} title={imputer.description}>
            <Button
              variant="contained"
              style={{ margin: "10px", backgroundColor: selectedImputer === imputer.label ? "#4CAF50" : null }}
              onClick={imputer.onClick}
            >
              {imputer.label}
            </Button>
          </Tooltip>
        ))}
      </div>
      <Button
        variant="contained"
        color="primary"
        style={{ backgroundColor: "#4CAF50", margin: "10px" }}
        onClick={async () => {
          await handleImpute();
          await getImputedDetails();
          await getMetricValues();
        }}
      >
        IMPUTE
      </Button>
    </div>
  );
};

export default ImputerSelectPage;
