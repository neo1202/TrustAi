import React, {useState, useEffect} from "react";
import API_URL from "../../api";
import SelectBlock from "../../components/SelectBlock";
import { Button} from "antd";

function ResultPage() {

  const [savedModels, setSavedModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('');
  const [finalTeacherTestAcc, setFinalTeacherTestAcc] = useState(0)

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

  const trainFinalTeacherModel = async () => {
    const response = await fetch(
        `${API_URL}/trainFinalTeacher/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(model)
    })
    const data = await response.json()
    console.log("Training final teacher model...", data)

    setFinalTeacherTestAcc(data.testAcc)
  }

  return <div>
    <h1>ResultPage</h1>
    
    <br/>
    {/* <p>Saved Model</p>
    {savedModels.map((model, i) => { // show model info when hover 
      return <SelectBlock key={i}
                          blockName={model}
                          selected={selectedModel === model}
                          onClick={handleSelectModel} />
    })} */}

    <p>{`Final Teacher Test Accuracy: ${finalTeacherTestAcc? finalTeacherTestAcc:'Not yet trained.'}`}</p>
    <br/>
    {/* <button className="bg-white btn" onClick={saveModel}>Save the Selected Model</button> */}
    <br/>
    <Button  onClick={trainFinalTeacherModel}>Train Final Teacher Model</Button>

  </div>;
}

export default ResultPage;
