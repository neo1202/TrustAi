import React, {useState, useEffect} from "react";
import API_URL from "../../api";
import { initialDatasetSelectMethod, models } from "../../config/config";
import SelectBlock from "../../components/SelectBlock";

function SetUpPage() {

  const [numRawData, setNumRawData] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [selectedInitData, setSelectedInitData] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    getNumberOfData()
  }, [])

  const getNumberOfData = async() => {
    const response = await fetch(
        `${API_URL}/numData/`, 
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(note)
    })
    
    const data = await response.json()
    setNumRawData(data.num)
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
    const data = await response.json()
    console.log("training initial model...", data)
  }


  return <div>
    <h1>SetUpPage</h1>
    <br/>
    <br/>
    <p>There are __{numRawData? numRawData:"__"}__ data in total.</p>
    <br/>
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
    <br/>
    <p>Choose Model</p>
    {models.map((model, i) => {
        return <SelectBlock key={i}
                            blockName={model}
                            selected={selectedModel === model}
                            onClick={handleSelectModel} />
    })}
    <br/>
    <button className="bg-white btn" onClick={trainInitModel}>Go to train initial model</button>

    
  </div>
}

export default SetUpPage;
