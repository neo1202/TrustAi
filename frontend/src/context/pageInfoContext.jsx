import { createContext, useState } from "react";

const PageInfoContext = createContext();

const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('') // the route of the page `/${route}`, so '' represents home page
  const [currentContextStep, setCurrentContextStep] = useState(1);
  const [allComplete, setAllComplete] = useState(false);

  const valueToShare = {
    currentPage, setCurrentPage, 
    currentContextStep, setCurrentContextStep, 
    allComplete, setAllComplete,
  };

  return (
    <PageInfoContext.Provider value={valueToShare}>
      {children}
    </PageInfoContext.Provider>
  );
}

export { PageProvider };
export default PageInfoContext;
