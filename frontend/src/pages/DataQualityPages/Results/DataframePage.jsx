import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import DataTable from "../../../components/DataTable"
import { useDQ } from "../../../hooks/useDQ";
import API_URL from "../../../api";


const DataframePage = () => {
  const [keys, setKeys] = useState([]);
  const { imputedTrainData, imputedTestData } = useDQ();

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
    <div className="flex flex-col place-items-center justify-center h-screen bg-white-400">


      <Typography variant="h4" gutterBottom>
        Imputed Training Data
      </Typography>
      <DataTable data={imputedTrainData} keys={keys}/>

      <br />

      <Typography variant="h4" gutterBottom>
        Imputed Testing Data
      </Typography>
      <DataTable data={imputedTestData} keys={keys}/>
    </div>
  )
}

export default DataframePage;
