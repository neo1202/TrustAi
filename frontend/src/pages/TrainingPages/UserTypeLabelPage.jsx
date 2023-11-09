import React, { useEffect, useState } from "react";
// import { useData } from "../../hooks/useData";
import API_URL from "../../api";
import QueryTheOracle from "../../components/QueryTheOracle";
import DataTable from "../../components/DataTable";

function UserTypeLabelPage() {

  const [iterCount, setIterCount] = useState(1);  
  const [uncertaintyId, setUncertaintyId] = useState([]) 
  const [cumulatedNumData, setCumulatedNumData] = useState(0)
  const [currTrainAcc, setCurrTrainAcc] = useState(0.1)
  const [currTestAcc, setCurrTestAcc] = useState(0.1)
  const [finishTraining, setFinishTraining] = useState(false)
  const [queryResults, setQueryResults] = useState([]) // after asking the oracle, set the answers as result, [{str(id): answer}]
  const [uncertainData, setUncertainData] = useState([])
  const [keys, setKeys] = useState([])

  const [cumuNumDataPlot, setCumuNumDataPlot] = useState('') // plot path
  const [cumuTrainAccPlot, setCumuTrainAccPlot] = useState('')
  const [cumuTestAccPlot, setCumuTestAccPlot] = useState('')


  useEffect(() => {
    getUncertaintyRank()
  }, [iterCount])

  useEffect(() => {
    plotCumulation()
  }, [finishTraining])

  const getUncertaintyRank = async () => {
    // 要拿「前一個」模型預測出的計算結果
    // 一進頁面時會去拿初始模型（第 0 個模型）的預測結果
    const response = await fetch(
        `${API_URL}/uncertaintyRank/${iterCount-1}/`, 
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Getting uncertainty rank...", data.msg)
    setUncertaintyId(data.uncertainIdx)
    setUncertainData(data.uncertainData)
    setKeys(data.keys)

    console.log(data.uncertainData)
  }

  const modifyNumDataPerIter = () => {
    console.log("Modify the Number Data Per Iteration")
  }

  const plotCumulation  = async () => {
    const response = await fetch(
        `${API_URL}/plotCumulation/`, // ${iterCount}/
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(uncertaintyRank)
    })
    const data = await response.json()
    console.log("Plotting cumulated information...", data.msg)

    setCumuNumDataPlot(`${data.cumuNumDataPlot}?timestamp=${Date.now()}`)
    setCumuTrainAccPlot(`${data.cumuTrainAccPlot}?timestamp=${Date.now()}`)
    setCumuTestAccPlot(`${data.cumuTestAccPlot}?timestamp=${Date.now()}`)
  }

  const train = async () => {
    const result = { uncertaintyId: uncertaintyId, queryResults: queryResults}
    const response = await fetch(
        `${API_URL}/trainALModel/${iterCount}/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    })
    const data = await response.json()
    console.log("Training AL model...", data.msg)

    setIterCount(data.iteration)
    setCumulatedNumData(data.cumuNumData)
    setCurrTrainAcc(data.trainAcc)
    setCurrTestAcc(data.testAcc)

    setFinishTraining(true)
  }

  const trainNextIter = () => {
    // to be done
    // 用上次的 model 去 predict unlabeled 的資料（後端的事），前端拿到排名
    if (finishTraining) {
        setIterCount(iter => iter + 1);
        setFinishTraining(false)
    } else {
        console.log("Current iteration not finished, go to train it first!")
    }
  }

  const saveModel = async () => {
    const model = {
        'model': `AL Model ${iterCount}`
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

  return (
    <div className="relative">
      <h1>UserTypeLabelPage</h1>
      <h2>Iteratively do AL on this page until the model is good</h2>
      <h2>This page should include, uncertainty ranking, query actions, set new training set, training session, for each iteration</h2>
      <button className="bg-white btn" onClick={modifyNumDataPerIter}>Modify the Number Data Per Iteration(should directly modify `querySize` in DB)</button>
      <br/>
      <br/>

      <p>Query the Oracle</p>
      <QueryTheOracle queryIds={uncertaintyId} setQueryResults={setQueryResults}/>
      <br />
      <DataTable data={uncertainData}
                 keys={keys} />

      
      <button className="bg-white btn" onClick={train}>Manually Add Data</button>
      <button className="bg-white btn" style={{marginLeft:'30px'}} onClick={train}>Train</button>

      <br/>
      {finishTraining? <div>
        <p>Iteration Result</p>
        <ul>
            <li>{`Iteration ${iterCount}`}</li>
            {/* <li>{`Teacher model selected: 17`}</li> */}
            <li>{`Cumulated training data: ${cumulatedNumData}`}</li>
            <li>{`Train accuracy: ${currTrainAcc}`}</li>
            {/* <li>{`Train loss: 0.0129`}</li> */}
            <li>{`Test accuracy: ${currTestAcc}`}</li>
        </ul>
        <button className="bg-white btn" onClick={saveModel}>Save the Model of This Iteration</button>
        <img src={`${API_URL}/getPlotImages/dashboard/${cumuNumDataPlot}`} alt="cumuNumDataPlot" />{/* /${iterCount} */}
        <img src={`${API_URL}/getPlotImages/dashboard/${cumuTrainAccPlot}`} alt="cumuTrainAccPlot" />{/* /${iterCount} */}
        <img src={`${API_URL}/getPlotImages/dashboard/${cumuTestAccPlot}`} alt="cumuTestAccPlot" />{/* /${iterCount} */}
      </div> : <></>}
      
      <br/>
      <br/>
      <button className="bg-white btn" onClick={trainNextIter}>Go on to Next AL Training</button>
      <button className="bg-white btn" style={{marginLeft:'30px'}}>Stop Here(Go on to KD)</button>

    </div>
  );
}

export default UserTypeLabelPage;
