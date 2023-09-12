import React, { useEffect, useState } from "react";
import axios from "axios";
//import Table from "../../components/Table";
import SortableTable from "../../components/SortableTable";
import API_URL from "../../api";
import QueryTheOracle from "../../components/QueryTheOracle";

function UserTypeLabelPage() {

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get("/api/getTestData");
//         console.log(response);
//         setData(response.data); // 将响应数据存储在 state 中
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }
//     fetchData();
//   }, []);
//   const data = [
//     { id: 3, width: 300, color: "bg-red-500", score: 4, label: "橘子" },
//     { id: 4, width: 2500, color: "bg-green-500", score: 0.2, label: "檸檬" },
//   ];
//   const tableConfig = [
//     {
//       columnName: "instance_id",
//       render: (oneInstanceData) => oneInstanceData.id,
//     },
//     {
//       columnName: "width",
//       render: (oneInstanceData) => oneInstanceData.width,
//     },
//     {
//       columnName: "color",
//       render: (oneInstanceData) => (
//         <div className={`p-3 m-2 ${oneInstanceData.color}`} />
//       ),
//     },
//     {
//       columnName: "score",
//       render: (oneInstanceData) => oneInstanceData.score,
//       sortValue: (oneInstanceData) => oneInstanceData.score,
//     },
//     {
//       columnName: "label",
//       render: (oneInstanceData) => oneInstanceData.label,
//     },
//   ];

//   const keyFn = (oneInstanceData) => {
//     return oneInstanceData.id;
//   };


  const [iterCount, setIterCount] = useState(1);  
  const [uncertaintyRank, setUncertaintyRank] = useState([])
  const [finishTraining, setFinishTraining] = useState(false)

  useEffect(() => {
    getUncertaintyRank()
  }, [iterCount])

  const getUncertaintyRank = async () => {
    const response = await fetch(
        `${API_URL}/uncertaintyRank/${iterCount-1}/`, // 要拿前一個模型預測出的計算結果
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Getting uncertainty rank...", data)

    setUncertaintyRank([iterCount, iterCount, iterCount])
  }

  const train = async () => {
    const response = await fetch(
        `${API_URL}/trainALModel/${iterCount}/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Training AL model...", data)

    setFinishTraining(true)
  }

  const trainNextIter = () => {
    // to be done
    // 用上次的 model 去 predict unlabeled 的資料（後端的事），前端拿到排名
    setIterCount(iter => iter + 1);
    setFinishTraining(false)
  }

  const saveModel = async () => {
    const model = {
        'model': `Model ${iterCount}`
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

      <br/>
      <br/>
      <p>Uncertainty Ranking</p>
      <p>{`Uncertainty rank, iter ${iterCount}: ${uncertaintyRank}`}</p>

      <br/>
      <br/>
      <p>Query the Oracle</p>
      {uncertaintyRank.map((data, i) => {
        const key = `${iterCount}-${i}`
        return <QueryTheOracle key={key}
                               data={data}/>
      })}

      <br/>
      <button className="bg-white btn" onClick={train}>Manually Add Data</button>
      <button className="bg-white btn" style={{marginLeft:'30px'}} onClick={train}>Train</button>

      <br/>
      <br/>
      {finishTraining? <div>
        <p>Iteration Result</p>
        <ul>
            <li>{`Iteration ${iterCount}`}</li>
            <li>{`Teacher model selected: 17`}</li>
            <li>{`How many train data: 880`}</li>
            <li>{`Train accuracy: 0.6532`}</li>
            <li>{`Train loss: 0.0129`}</li>
            <li>{`Test accuracy: 0.8953`}</li>
        </ul>
        <button className="bg-white btn" onClick={saveModel}>Save the Model of This Iteration</button>
      </div> : <></>}
      

      <br/>
      <br/>
      <button className="bg-white btn" onClick={trainNextIter}>Go on to Next AL Training</button>
      <button className="bg-white btn" style={{marginLeft:'30px'}}>Stop Here(Go on to KD)</button>


      {/* <SortableTable data={data} config={tableConfig} keyFn={keyFn} /> */}
    </div>
  );
}

export default UserTypeLabelPage;
