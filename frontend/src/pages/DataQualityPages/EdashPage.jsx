import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { blueTitleStyle } from "../../config/colors";
import Typography from "@mui/material/Typography";
import API_URL from "../../api";


const EdashPage = () => {
  const [edaColumns, setEdaColumns] = useState([]);
  const [description, setDescription] = useState([]);
  const [missingValueTable, setMissingValueTable] = useState([]);
  const [missingValueTableColumns, setMissingValueTableColumns] = useState([]);
  const [missingValuePlot, setMissingValuePlot] = useState('');
  const [labelClassRatioPlot, setLabelClassRatioPlot] = useState('');
  
  useEffect(() => {
    doEDA();
    getEdaColumns();
  }, [])

  const getEdaColumns = async () => {
    const response = await fetch(`${API_URL}/getFeaturesAndLabel/miss`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("Get columns...", data);
    setEdaColumns(data.allColumns);
  }
  
  const doEDA = async () => {
    const response = await fetch(
        `${API_URL}/doEDA/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        })

    const data = await response.json()
    console.log("do EDA...", data)
    setDescription(data.all.description);
    setMissingValueTable(data.all.missingValueTable);
    setMissingValueTableColumns(data.all.missingValueTableColumns);
    setMissingValuePlot(`${data.all.missingValuePlot}?timestamp=${Date.now()}`);
    setLabelClassRatioPlot(`${data.all.labelClassRatioPlot}?timestamp=${Date.now()}`);
  }


  return (
    <div className="flex flex-col place-items-center justify-center bg-white-400">
      <Typography variant="h4" gutterBottom>
        Simple EDA Visualizaion
      </Typography>
      <div className="flex flex-row place-items-center justify-center" style={{ alignItems: 'flex-start', marginTop: '2%' }}>
        <div>{/* element 1 */}
            <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            Missing Value Percentage
            </Typography>
            <div style={{ marginBottom: '20%' }}></div>
            <DataTable data={missingValueTable} keys={missingValueTableColumns}/>
        </div>
        <div className="flex flex-col justify-center items-center" style={{ maxWidth: '50%' }}>{/* element 2 */}
            <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            Label Class Ratio
            </Typography>
            <img src={`${API_URL}/getPlotImages/edash/${labelClassRatioPlot}`} alt="" />
        </div>
      </div>

      <Typography variant="h4" gutterBottom style={blueTitleStyle}>
        Data Description of the Raw Data
      </Typography>
        <DataTable data={description} keys={edaColumns}/>
      <br />
      <br />
      <br />
    </div>
  );
};

export default EdashPage;
