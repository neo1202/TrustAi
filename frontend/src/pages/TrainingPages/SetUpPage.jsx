import React, {useState, useEffect} from "react";
import API_URL from "../../api";
import { initialDatasetSelectMethod, models } from "../../config/config";
import SelectBlock from "../../components/SelectBlock";
import DataTable from "../../components/DataTable";

function SetUpPage() {

  const [rawData, setRawData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [numRows, setNumRows] = useState(54321);
  const [numCols, setNumCols] = useState(20);

  const [numShownData, setNumShownData] = useState('3');
  const [displayNumShownData, setDisplayNumShownData] = useState('');
  const [initNumData, setInitNumData] = useState('');
  const [displayInitNumData, setDisplayInitNumData] = useState('');
  const [selectedInitData, setSelectedInitData] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [initAcc, setInitAcc] = useState(100);

  useEffect(() => {
    getData()
  }, [])

  const deleteDataset = async () => {
    const response = await fetch(
        `${API_URL}/deleteTest/`, 
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(note)
        })
    
    const data = await response.json()
    console.log(data)
  }

  const getData = async () => { 
    const number = { 'num': numShownData }
    const response = await fetch(
        `${API_URL}/getData/train-raw`, 
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(number)
        })
    
    const data = await response.json()
    setRawData(data.rawData)
    setKeys(data.keys)
    setNumRows(data.numRows)
    setNumCols(data.numCols)
  }

  const handleNumShownDataChange = (e) => {
    setNumShownData(e.target.value);
  }

  const handleInitNumDataChange = (e) => {
    setInitNumData(e.target.value);
  };
  
  const handleNumShownDataKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNumShownDataEnter();
    }
  };

  const handleInitNumDataKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInitNumDataEnter();
    }
  };
  
  const handleNumShownDataEnter = async () => {
    setDisplayNumShownData(numShownData);
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
    setInitNumData('')
  }

  const handleSelectInitData = async (blockName) => {
    const setting = {
        'type': 'SelectInitData',
        'value': blockName,
    }

    if (selectedInitData === blockName) {
        setSelectedInitData(''); // remove border
        setting.value = ''
    } else {
        setSelectedInitData(blockName);
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
  };

  const handleSelectModel = async (blockName) => {
    const setting = {
        'type': 'SelectModel',
        'value': blockName,
    }

    if (selectedModel === blockName) {
        setSelectedModel(''); // remove border
        setting.value = ''
    } else {
        setSelectedModel(blockName);
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
  };

  const trainInitModel = async () => {
    // pop a modal or something to show training progress

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


  return <div>
    <h1>SetUpPage</h1>
    {/* <button className="bg-white btn" onClick={deleteDataset} >delete all in Dataset model(test btn)</button> */}
    <br/>
    <p>There are __{numRows? numRows:"__"}__ rows in total.</p>
    <p>There are __{numCols? numCols:"__"}__ features in total.</p>
    <DataTable data={rawData.slice(0,numShownData)}
               keys={keys} />
    {/* <p>How many data is desired to be shown?  __{displayNumShownData? displayNumShownData:"__"}__</p>
    <textarea
        value={numShownData}
        onChange={handleNumShownDataChange}
        onKeyDown={handleNumShownDataKeyPress}
        placeholder="Type a number and press Enter"
    />
    <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handleNumShownDataEnter}>Enter</button> */}
    <br/>
    <p>How many training data do you want to set in the beginning?  __{displayInitNumData? displayInitNumData:"__"}__</p>
    <textarea
        value={initNumData}
        onChange={handleInitNumDataChange}
        onKeyDown={handleInitNumDataKeyPress}
        placeholder="Type a number and press Enter"
    />
    <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handleInitNumDataEnter}>Enter</button>
    <br/>
    {/* <br/>
    <div style={{display: 'flex'}}>
        {initialDatasetSelectMethod.map((method, i) => {
            return <SelectBlock key={i}
                                blockName={method}
                                selected={selectedInitData === method}
                                onClick={handleSelectInitData} />
        })}
    </div> */}
    
    <br/>
    {/* <p>Choose Model(but currently not providing multiple model right?)</p>
    {models.map((model, i) => {
        return <SelectBlock key={i}
                            blockName={model}
                            selected={selectedModel === model}
                            onClick={handleSelectModel} />
    })} */}
    <br/>
    <button className="bg-white btn" onClick={trainInitModel}>Go to train initial model</button>
    {initAcc === 100? <></>:<p>{`Accuracy of initial model: ${initAcc}`}</p>}

    
  </div>
}

export default SetUpPage;
