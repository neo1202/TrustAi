import { createContext, useState } from "react";
import API_URL from "../api";

const DQContext = createContext();

const DQProvider = ({ children }) => {
  const [imputedTrainData, setImputedTrainData] = useState([]);
  const [imputedTestData, setImputedTestData] = useState([]);

  // detailed results(many tables)
  const [missingRateTable, setMissingRateTable] = useState([]);
  const [missingRateColumnName, setMissingRateColumnName] = useState([]);
  const [entropyTable, setEntropyTable] = useState([]);
  const [entropyColumnName, setEntropyColumnName] = useState([]);
  const [jsDivergenceTable, setJsDivergenceTable] = useState([]);
  const [jsDivergenceColumnName, setJsDivergenceColumnName] = useState([]);
  const [basicInfoBeforeTable, setBasicInfoBeforeTable] = useState([]);
  const [basicInfoBeforeColumnName, setBasicInfoBeforeColumnName] = useState([]);
  const [basicInfoAfterTable, setBasicInfoAfterTable] = useState([]);
  const [basicInfoAfterColumnName, setBasicInfoAfterColumnName] = useState([]);
  const [vifBeforeTable, setVifBeforeTable] = useState([]);
  const [vifBeforeColumnName, setVifBeforeColumnName] = useState([]);
  const [vifAfterTable, setVifAfterTable] = useState([]);
  const [vifAfterColumnName, setVifAfterColumnName] = useState([]);

  // simplification results
  const [jsDivergence, setJsDivergence] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [precision, setPrecision] = useState(0);
  const [recall, setRecall] = useState(0);
  const [f1, setF1] = useState(0);

  const getImputedDetails = async () => {
    const response = await fetch(`${API_URL}/getImputedDetails/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("Get imputed details(tables)...", data);
    setJsDivergence(data.simplifiedStablilty)
    setMissingRateTable(data.missingRateTable)
    setMissingRateColumnName(data.missingRateColumnName)
    setEntropyTable(data.entropyTable)
    setEntropyColumnName(data.entropyColumnName)
    setJsDivergenceTable(data.jsDivergenceTable)
    setJsDivergenceColumnName(data.jsDivergenceColumnName)
    setBasicInfoBeforeTable(data.basicInfoBeforeTable)
    setBasicInfoBeforeColumnName(data.basicInfoBeforeColumnName)
    setBasicInfoAfterTable(data.basicInfoAfterTable)
    setBasicInfoAfterColumnName(data.basicInfoAfterColumnName)
    setVifBeforeTable(data.vifBeforeTable)
    setVifBeforeColumnName(data.vifBeforeColumnName)
    setVifAfterTable(data.vifAfterTable)
    setVifAfterColumnName(data.vifAfterColumnName)
  }

  const getMetricValues = async () => {
    const response = await fetch(`${API_URL}/getMetricEvalValue/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("Get metric evaluation values...", data);
    setAccuracy(data.Accuracy)
    setPrecision(data.Precision)
    setRecall(data.Recall)
    setF1(data.F1)
  }


  const valueToShare = {
    imputedTrainData, setImputedTrainData,
    imputedTestData, setImputedTestData,

    missingRateTable, setMissingRateTable,
    missingRateColumnName, setMissingRateColumnName,
    entropyTable, setEntropyTable,
    entropyColumnName, setEntropyColumnName,
    jsDivergenceTable, setJsDivergenceTable,
    jsDivergenceColumnName, setJsDivergenceColumnName,
    basicInfoBeforeTable, setBasicInfoBeforeTable,
    basicInfoBeforeColumnName, setBasicInfoBeforeColumnName,
    basicInfoAfterTable, setBasicInfoAfterTable,
    basicInfoAfterColumnName, setBasicInfoAfterColumnName,
    vifBeforeTable, setVifBeforeTable,
    vifBeforeColumnName, setVifBeforeColumnName,
    vifAfterTable, setVifAfterTable,
    vifAfterColumnName, setVifAfterColumnName,

    jsDivergence, setJsDivergence,
    accuracy, setAccuracy,
    precision, setPrecision,
    recall, setRecall,
    f1, setF1,

    getImputedDetails, getMetricValues,
  };

  return (
    <DQContext.Provider value={valueToShare}>
      {children}
    </DQContext.Provider>
  );
}

export { DQProvider };
export default DQContext;
