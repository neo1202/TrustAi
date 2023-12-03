import { createContext, useState } from "react";

const StatusContext = createContext();

const StatusProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading...');
  const [loadingTime, setLoadingTime] = useState(0);

  const valueToShare = {
    isLoading, setIsLoading,
    loadingMsg, setLoadingMsg,
    loadingTime, setLoadingTime,
  };

  return (
    <StatusContext.Provider value={valueToShare}>
      {children}
    </StatusContext.Provider>
  );
}

export { StatusProvider };
export default StatusContext;
