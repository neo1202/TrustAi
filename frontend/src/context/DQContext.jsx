import { createContext, useState } from "react";

const DQContext = createContext();

const DQProvider = ({ children }) => {
  const [imputedTrainData, setImputedTrainData] = useState([]);
  const [imputedTestData, setImputedTestData] = useState([]);

  const valueToShare = {
    imputedTrainData, setImputedTrainData,
    imputedTestData, setImputedTestData,
  };

  return (
    <DQContext.Provider value={valueToShare}>
      {children}
    </DQContext.Provider>
  );
}

export { DQProvider };
export default DQContext;
