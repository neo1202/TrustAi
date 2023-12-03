import { createContext, useState } from "react";
import { useStatus } from "../hooks/useStatus";
import API_URL from "../api";
import popMessage from "../utils/popMessage";

const DQContext = createContext();

const DQProvider = ({ children }) => {
  const [imputedData, setImputedData] = useState([]);
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
  const [covHeatmapBefore, setCovHeatmapBefore] = useState('');
  const [covHeatmapAfter, setCovHeatmapAfter] = useState('');
  const [pairPlot, setPairPlot] = useState('');

  // simplification results
  const [jsDivergence, setJsDivergence] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [precision, setPrecision] = useState(0);
  const [recall, setRecall] = useState(0);
  const [f1, setF1] = useState(0);

  const { setIsLoading, setLoadingMsg, setLoadingTime } = useStatus();

  const getImputedDetails = async () => {
    setIsLoading(true); setLoadingMsg("Getting details of the imputation(might take long)..."); setLoadingTime(5);

    const response = await fetch(`${API_URL}/getImputedDetails/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("Get imputed details(tables)...", data);
    setJsDivergence(data.comparison.simplifiedStablilty)
    setMissingRateTable(data.comparison.missingRateTable)
    setMissingRateColumnName(data.comparison.missingRateColumnName)
    setEntropyTable(data.comparison.entropyTable)
    setEntropyColumnName(data.comparison.entropyColumnName)
    setJsDivergenceTable(data.comparison.jsDivergenceTable)
    setJsDivergenceColumnName(data.comparison.jsDivergenceColumnName)
    setBasicInfoBeforeTable(data.comparison.basicInfoBeforeTable)
    setBasicInfoBeforeColumnName(data.comparison.basicInfoBeforeColumnName)
    setBasicInfoAfterTable(data.comparison.basicInfoAfterTable)
    setBasicInfoAfterColumnName(data.comparison.basicInfoAfterColumnName)
    setVifBeforeTable(data.comparison.vifBeforeTable)
    setVifBeforeColumnName(data.comparison.vifBeforeColumnName)
    setVifAfterTable(data.comparison.vifAfterTable)
    setVifAfterColumnName(data.comparison.vifAfterColumnName)
    setCovHeatmapBefore(`${data.comparison.covHeatmapBefore}?timestamp=${Date.now()}`)
    setCovHeatmapAfter(`${data.comparison.covHeatmapAfter}?timestamp=${Date.now()}`)
    setPairPlot(`${data.comparison.pairPlot}?timestamp=${Date.now()}`)

    setIsLoading(false); setLoadingMsg(''); setLoadingTime(0);
    popMessage(data.msg);
  }

  const getMetricValues = async () => {
    setIsLoading(true); setLoadingMsg("Start evaluating the imputation..."); setLoadingTime(3);

    const response = await fetch(`${API_URL}/getMetricEvalValue/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("Get metric evaluation values...", data);
    setAccuracy(data.result.Accuracy)
    setPrecision(data.result.Precision)
    setRecall(data.result.Recall)
    setF1(data.result.F1)

    setIsLoading(false); setLoadingMsg(''); setLoadingTime(0);
    popMessage(data.msg);
  }


  const valueToShare = {
    imputedData, setImputedData,
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
    covHeatmapBefore, setCovHeatmapBefore,
    covHeatmapAfter, setCovHeatmapAfter,
    pairPlot, setPairPlot,

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
