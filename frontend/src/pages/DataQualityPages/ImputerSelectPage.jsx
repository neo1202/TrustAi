import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import API_URL from "../../api";
import { useDQ } from "../../hooks/useDQ"

const ImputerSelectPage = () => {
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
    setImputedTrainData, setImputedTestData,
    getImputedDetails, getMetricValues, 
  } = useDQ();

  const handleImputerClick = async (imputerName) => {
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
  };

  const handleImpute = async () => {
    const response = await fetch(`${API_URL}/startImpute/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("finish imputing...", data);
    setImputedTrainData(data.imputedTrainData)
    setImputedTestData(data.imputedTestData)
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {imputers.map((imputer, index) => (
          <Tooltip key={index} title={imputer.description}>
            <Button
              variant="contained"
              style={{ margin: "10px" }}
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
