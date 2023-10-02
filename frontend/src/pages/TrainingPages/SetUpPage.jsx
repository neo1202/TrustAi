import React, {useState, useEffect} from "react";
import API_URL from "../../api";
import { initialDatasetSelectMethod, models } from "../../config/config";
import SelectBlock from "../../components/SelectBlock";

function SetUpPage() {

  const [numRows, setNumRows] = useState(54321);
  const [numCols, setNumCols] = useState(20);

  const [inputValue, setInputValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [selectedInitData, setSelectedInitData] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [initAcc, setInitAcc] = useState(100);

  useEffect(() => {
    getNumberOfData()
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

  const getNumberOfData = async () => {
    const response = await fetch(
        `${API_URL}/numData/train-raw`, 
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(note)
        })
    
    const data = await response.json()
    setNumRows(data.numRows)
    setNumCols(data.numCols)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnter();
    }
  };

  const handleEnter = async () => {
    const setting = {
        'type': 'SetInitNumData',
        'value': inputValue,
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

    setDisplayText(inputValue);
    setInputValue('')
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
    <br/>
    <button className="bg-white btn" onClick={deleteDataset} >delete all in Dataset model(test btn)</button>
    <br/>
    <br/>
    <p>There are __{numRows? numRows:"__"}__ rows in total.</p>
    <p>There are __{numCols? numCols:"__"}__ columns in total.</p>
    <br/>
    <p>How many do you want to set in the beginning?  __{displayText? displayText:"__"}__</p>
    <textarea
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Type a number and press Enter"
    />
    <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handleEnter}>Enter</button>
    <br/>
    <br/>
    {initialDatasetSelectMethod.map((method, i) => {
        return <SelectBlock key={i}
                            blockName={method}
                            selected={selectedInitData === method}
                            onClick={handleSelectInitData} />
    })}
    <br/>
    <p>Choose Model(but currently not providing multiple model right?)</p>
    {models.map((model, i) => {
        return <SelectBlock key={i}
                            blockName={model}
                            selected={selectedModel === model}
                            onClick={handleSelectModel} />
    })}
    <br/>
    <button className="bg-white btn" onClick={trainInitModel}>Go to train initial model</button>
    {initAcc === 100? <></>:<p>{`Accuracy of initial model: ${initAcc}`}</p>}

    
  </div>
}

export default SetUpPage;
