import React, {useState, useEffect} from "react";
import API_URL from "../../api";
import SelectBlock from "../../components/SelectBlock";
import { Button } from "@mui/material";
import Confetti from "react-confetti";



function ResultPage() {
  const { width, height } = {width: 1500, height: 1000} // useWindowSize()};
  const [showConfetti, setShowConfetti] = useState(false);

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
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);  // stop confetti after 5 seconds
    }, 5000);
  }

  return <div>
  
    {(finalTeacherTestAcc != 0 && showConfetti) ? (
      <Confetti tweenDuration= {0.5} width={width} height={height}/>
    ) : (
      <></>
      
    )}  
    <br/>
    {/* <p>Saved Model</p>
    {savedModels.map((model, i) => { // show model info when hover 
      return <SelectBlock key={i}
                          blockName={model}
                          selected={selectedModel === model}
                          onClick={handleSelectModel} />
    })} */}
    <h2 style={{ fontSize: '40px', textAlign: 'center', fontWeight: 'bold' }}>Final Teacher Test Accuracy: </h2>
    <p style={{ fontSize: '64px', textAlign: 'center' }}>{`${finalTeacherTestAcc? parseFloat(finalTeacherTestAcc.toFixed(3)):'Not yet trained.'}`}</p>
    <br/>
    {/* <button className="bg-white btn" onClick={saveModel}>Save the Selected Model</button> */}
    <br/>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Button variant="contained" onClick={trainFinalTeacherModel}>Train Final Teacher Model</Button>
  </div>

  </div>;
}

export default ResultPage;
