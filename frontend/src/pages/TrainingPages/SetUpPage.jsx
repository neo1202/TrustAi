import React, { useState, useEffect } from "react";
import { Button, Input, Select, Typography } from "antd";
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
    setNumShownData('');
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
    <div>
      <Title level={2}>Shape of Training Dataset</Title>
      <Paragraph>
        There are __{numRows ? numRows : "__"}__ rows in total.
      </Paragraph>
      <Paragraph>
        There are __{numCols ? numCols : "__"}__ features in total.
      </Paragraph>

      <Title level={2}>Initial Setup</Title>
      <Paragraph>
        How many data is desired to be shown? __{numShownData ? numShownData : "__"}__
      </Paragraph>
      <TextArea
        style={{ width: "150px" }}
        value={numShownData}
        onChange={(e) => setNumShownData(e.target.value)}
        onPressEnter={handleNumShownDataEnter}
        placeholder="Type a number and press Enter"
        autoSize={{ minRows: 2, maxRows: 6 }} // Adjust minRows and maxRows as needed
      />
      <Button style={{ marginLeft: "20px", width: "80px" }}  onClick={handleNumShownDataEnter}>
        Enter
      </Button>
      <br />
      <Paragraph>
        How many training data do you want to set in the beginning? __{initNumData ? initNumData : "__"}__
      </Paragraph>
      <TextArea
        style={{ width: "150px" }}
        value={initNumData}
        onChange={(e) => setInitNumData(e.target.value)}
        onPressEnter={handleInitNumDataEnter}
        placeholder="Type a number and press Enter"
        autoSize={{ minRows: 2, maxRows: 6 }} // Adjust minRows and maxRows as needed
      />
      <Button style={{ marginLeft: "20px", width: "80px" }}  onClick={handleInitNumDataEnter}>
        Enter
      </Button>
      <br />
      <br />
      <Button style={{ marginTop: "10px" }}  onClick={trainInitModel}>
        Go to train initial model
      </Button>
      {initAcc === 100 ? (
        <></>
      ) : (
        <Paragraph>{`Accuracy of the initial model: ${initAcc}`}</Paragraph>
      )}
      <br />

      <Title level={2}>Data</Title>
      <DataTable data={shownData} keys={keys} />

    </div>
  );
}

export default SetUpPage;
