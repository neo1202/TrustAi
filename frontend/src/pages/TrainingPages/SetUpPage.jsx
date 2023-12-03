import React, { useState, useEffect } from "react";
import { Input, Select, Tooltip, Typography, Steps } from "antd";
import {
  Button
} from "@mui/material";
import API_URL from "../../api";
import { initialDatasetSelectMethod, models } from "../../config/config";
import SelectBlock from "../../components/SelectBlock";
import DataTable from "../../components/DataTable";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

function SetUpPage() {

  const [rawData, setRawData] = useState([]);
  const [shownData, setShownData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [numRows, setNumRows] = useState(54321);
  const [numCols, setNumCols] = useState(20);

  const [numShownData, setNumShownData] = useState('');
  const [displayNumShownData, setDisplayNumShownData] = useState('');
  const [initNumData, setInitNumData] = useState('');
  const [displayInitNumData, setDisplayInitNumData] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [initAcc, setInitAcc] = useState(100);

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => { 
    const response = await fetch(
        `${API_URL}/getData/train-raw`, 
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
    
    const data = await response.json()
    setRawData(data.rawData)
    setKeys(data.keys)
    setNumRows(data.numRows)
    setNumCols(data.numCols)
  }
  
  const handleNumShownDataEnter = () => {
    setDisplayNumShownData(numShownData);
    setShownData(rawData.slice(0, numShownData));
    setNumShownData('')
  }

  const handleInitNumDataEnter = async () => {
    const setting = {
        'type': 'SetInitNumData',
        'value': initNumData,
    }

    const response = await fetch(
        `${API_URL}/settings/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Settings...", data)

    setDisplayInitNumData(initNumData);
    setInitNumData('');
  }

  const trainInitModel = async () => {
    const model = {'model': selectedModel}

    const response = await fetch(
        `${API_URL}/trainInitModel/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json' // to be confirmed
            },
            body: JSON.stringify(model)
        })
    const data = await response.json() // accuracy
    console.log("training initial model...", data)

    setInitAcc(data.acc)
  }


  return (
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Title level={1} style={{ fontSize: '64px' }}>Initial Setup</Title>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '90%'}}>
        <div className="p-8 rounded-lg mb-4 mr-4" style={{ backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', width: '20%', height: '90%' }}>
          <Title level={2}>Total rows: </Title>
          <div style={{ display: 'flex',flexDirection: 'row', alignItems: 'center' }}>
            <Title level={1} style={{ fontSize: '50px', marginRight: '15px' }}> {numRows} </Title>
            <Title level={4}>rows </Title>
          </div>
          
        </div>  
        <div className="p-8 rounded-lg mb-4 mr-4" style={{ backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', width: '20%', height: '90%' }}>
          <Title level={2}>Total Columns: </Title>
          <div style={{ display: 'flex',flexDirection: 'row', alignItems: 'center' }}>
            <Title level={1} style={{ fontSize: '50px', marginRight: '15px' }}> {numCols} </Title>
            <Title level={4}>columns </Title>
          </div>
          
        </div>  
        <div className="p-8 rounded-lg mb-4 mr-4 " style={{ backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', width: '35%', height: '90%' }}>
          <Title level={2}>Setup</Title>
          
          
          <div className="mb-1" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            
              
              
              <p>
                Initial Training Amount:  
              </p>
              <Input
                style={{ width: "150px", marginLeft: "20px" }}
                value={initNumData}
                onChange={(e) => setInitNumData(e.target.value)}
                onPressEnter={handleInitNumDataEnter}
                placeholder="Type a number "
                
              />
              <Button variant="contained" style={{ marginLeft: "20px", width: "80px" }}  onClick={handleInitNumDataEnter}>
                Enter
              </Button>
              
            
          </div>
          
          <div style={{display: 'flex', flexDirection: 'row'}}>
          <Button variant="contained" style={{ marginTop: "15px", backgroundColor: 'green' }}  onClick={trainInitModel}>
            Go to train initial model
          </Button>
          
          </div>
        </div>
        <div className="p-8 rounded-lg mb-4 " style={{ backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', width: '25%', height: '90%' }}>
        
        <Title level={2}>Initial Accuracy: </Title>
          <div style={{ display: 'flex',flexDirection: 'row', alignItems: 'center' }}>
            {initAcc === 100 ? (
              <></>
            ) : (
              
              <Title level={1} style={{ fontSize: '50px', marginRight: '15px' }}> {parseFloat(initAcc.toFixed(3))} </Title>
            )}  
            
            
          </div>
          
        </div> 
        
      </div>
      <div className="p-8 rounded-lg mb-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', width: '90%'}}>
        <Title level={2}>Data</Title>
        
        
          
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <p>
              Show Data Amount:  
            </p>
            
            <Input
              style={{ width: "150px", marginBottom: "10px", marginTop: "10px", marginRight: "15px", marginLeft: "15px"}}
              value={numShownData}
              onChange={(e) => setNumShownData(e.target.value)}
              onPressEnter={handleNumShownDataEnter}
              placeholder="Type a number"
              
            />
            
            <Button variant="contained" style={{ marginLeft: "20px", width: "80px" }}  onClick={handleNumShownDataEnter}>
              Enter
            </Button>
          </div>
          <DataTable data={shownData} keys={keys} />
          
        </div>
      </div>
    </div>
  );
}

export default SetUpPage;
