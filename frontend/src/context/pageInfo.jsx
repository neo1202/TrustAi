import { createContext, useState } from "react";

const PageInfoContext = createContext();

function StepProvider({ children }) {
  const [currentContextStep, setCurrentContextStep] = useState(1);
  const [allComplete, setAllComplete] = useState(false);
  const valueToShare = {
    currentContextStep: currentContextStep,
    incrementCurrentContextStep: () => {
      setCurrentContextStep((prev) => prev + 1);
    },
    allComplete: allComplete,
  };
  return (
    <PageInfoContext.Provider value={valueToShare}>
      {children}
    </PageInfoContext.Provider>
  );
}

export { StepProvider };
export default PageInfoContext;

// import PageInfoContext, {StepProvider} from pageInfo.jsx
