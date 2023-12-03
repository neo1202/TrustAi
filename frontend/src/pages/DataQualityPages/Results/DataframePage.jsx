import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import DataTable from "../../../components/DataTable"
import { useDQ } from "../../../hooks/useDQ";
import { blueTitleStyle } from "../../../config/colors";
import API_URL from "../../../api";


const DataframePage = () => {
  const [keys, setKeys] = useState([]);
  const { imputedData, imputedTrainData, imputedTestData } = useDQ();

  const getKeys = async () => {
    const response = await fetch(`${API_URL}/getFeaturesAndLabel/complete`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Get columns...", data);
      setKeys(data.allColumns);
  }

  useEffect(() => {
    getKeys();
  }, [])

  return (
    <div className="flex flex-col place-items-center justify-center bg-white-400 mt-8">

      <Typography variant="h4" gutterBottom style={blueTitleStyle}>
        Imputed Data
      </Typography>
      <DataTable data={imputedData} keys={keys}/>
    </div>
  )
}

export default DataframePage;
