import React, { useEffect, useState } from "react";
import API_URL from "../../api";
import { useStatus } from "../../hooks/useStatus";
import popMessage from "../../utils/popMessage";
import Loading from "../../components/Loading";
import QueryTheOracle from "../../components/QueryTheOracle";
import DataTable from "../../components/DataTable";
import Dashboard from "../../components/Dashboard";
import { Button } from "@mui/material";
import { Typography } from "antd";
const { Title } = Typography;

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

  const [labeledToAllRatioPlot, setLabeledToAllRatioPlot] = useState('')
  const [labeledClassRatioPlot, setLabeledClassRatioPlot] = useState('')
  const [cumuNumDataPlot, setCumuNumDataPlot] = useState('') // plot path
  const [cumuTrainAccPlot, setCumuTrainAccPlot] = useState('')
  const [cumuTestAccPlot, setCumuTestAccPlot] = useState('')

  const [isDashboardVisible, setDashboardVisible] = useState(false);

  const { isLoading, setIsLoading, loadingMsg, setLoadingMsg, loadingTime, setLoadingTime } = useStatus();


  const showDashboard = () => {
    setDashboardVisible(true);
  };

  const hideDashboard = () => {
    setDashboardVisible(false);
  };

  useEffect(() => {
    getUncertaintyRank()
  }, [iterCount])

  useEffect(() => {
    plotCumulation()
    showDashboard()
  }, [finishTraining])

  const getUncertaintyRank = async () => {
    setIsLoading(true); setLoadingMsg(`Getting uncertainty ranking of prediction ${iterCount-1}...`); setLoadingTime(0.5);

    const response = await fetch(
        `${API_URL}/uncertaintyRank/${iterCount-1}/`, 
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await response.json()
    console.log("Getting uncertainty rank...", data.msg)
    setUncertaintyId(data.uncertainIdx)
    setUncertainData(data.uncertainData)
    setKeys(data.keys)

    setIsLoading(false); setLoadingMsg(''); setLoadingTime(0);
    popMessage(data.msg);
  }

  const modifyNumDataPerIter = () => {
    console.log("Modify the Number Data Per Iteration")
  }

  const plotCumulation  = async () => {
    const response = await fetch(
        `${API_URL}/plotCumulation/`, 
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await response.json()
    console.log("Plotting cumulated information...", data.msg)

    setLabeledToAllRatioPlot(`${data.labeledToAllRatioPlot}?timestamp=${Date.now()}`)
    setLabeledClassRatioPlot(`${data.labeledClassRatioPlot}?timestamp=${Date.now()}`)
    setCumuNumDataPlot(`${data.cumuNumDataPlot}?timestamp=${Date.now()}`)
    setCumuTrainAccPlot(`${data.cumuTrainAccPlot}?timestamp=${Date.now()}`)
    setCumuTestAccPlot(`${data.cumuTestAccPlot}?timestamp=${Date.now()}`)
  }

  const train = async () => {
    const result = { uncertaintyId: uncertaintyId, queryResults: queryResults}

    setIsLoading(true); setLoadingMsg(`Training model No.${iterCount}...`); setLoadingTime(0.5);

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

    setIsLoading(false); setLoadingMsg(''); setLoadingTime(0);
    popMessage(data.msg);
  }

  const trainNextIter = () => {
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
    <div className="flex flex-col place-items-center justify-center bg-white-400">
      {isLoading? <Loading action={loadingMsg} waitTime={loadingTime}/> : <></>} 
      
        <Title level={1} style={{ fontSize: '64px' }}>Active Learning Label</Title>
        <br />
        <br />
        
        <div className="p-10 rounded-lg mb-4" style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center' , backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', width: '90%'}}>
          <QueryTheOracle queryIds={uncertaintyId} setQueryResults={setQueryResults} />
        </div>
        

        <br />
        <DataTable data={uncertainData} keys={keys} />
        
        <br />
        {finishTraining ? (
          <div>
            <Dashboard
              visible={isDashboardVisible}
              onCancel={() => {
                hideDashboard();
                trainNextIter();
              }}
              imageUrls={[
                `${API_URL}/getPlotImages/dashboard/${labeledToAllRatioPlot}`,
                `${API_URL}/getPlotImages/dashboard/${labeledClassRatioPlot}`,
                `${API_URL}/getPlotImages/dashboard/${cumuNumDataPlot}`,
                `${API_URL}/getPlotImages/dashboard/${cumuTrainAccPlot}`,
              //   `${API_URL}/getPlotImages/dashboard/${cumuTestAccPlot}`,
              ]}
              iterCount={iterCount}
              cumulatedNumData={cumulatedNumData}
              currTrainAcc={currTrainAcc}
              currTestAcc={currTestAcc}
            />
          </div>
        ) : (
          <></>
        )}

        <br />
        <br />
        <Button variant="contained"  onClick={train}>
          Train
        </Button>
      
    </div>
  );
  
}

export default UserTypeLabelPage;
