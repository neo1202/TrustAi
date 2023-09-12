import React, {useState, useEffect} from "react";
import API_URL from "../../api";
import SelectBlock from "../../components/SelectBlock";

function ResultPage() {

  const [savedModels, setSavedModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    getSavedModels()
  }, [])

  const getSavedModels = () => {
    // this should call api
    const models = ['M1', 'M2', 'M3', 'M4']
    setSavedModels(models)
  }

  const handleSelectModel = async (blockName) => {
    const setting = {
        'type': 'SelectModelToKD',
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
  }

  const saveModel = async () => {
    const model = {
        'model': selectedModel
    }
    const response = await fetch(
        `${API_URL}/saveModel/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model)
    })
    const data = await response.json()
    console.log("Saving model...", data)
    
  }

  return <div>
    <h1>ResultPage</h1>
    <h2>This page should include history of saved models. After the user selects one, the model is carried on to KD process</h2>
    
    <br/>
    <p>Saved Model</p>
    {savedModels.map((model, i) => { // show model info when hover 
      return <SelectBlock key={i}
                          blockName={model}
                          selected={selectedModel === model}
                          onClick={handleSelectModel} />
    })}

    <br/>
    <br/>
    <button className="bg-white btn" onClick={saveModel}>Save the Selected Model</button>

  </div>;
}

export default ResultPage;
