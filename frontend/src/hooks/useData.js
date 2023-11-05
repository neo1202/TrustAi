// import { createContext, useContext, useEffect, useState } from "react";

// const DataContext = createContext({
//     rawData: [], // an array of dict, representing a row of data
//     currData: [], 
//     features: [],
//     labelName: "", // suppose only one label
//     uncertaintyData: [], // uncertainty query results, including the label

//     setRawData: () => {},
//     setCurrData: () => {},
//     setFeatures: () => {},
//     setLabelName: () => {},
//     setUncertaintyData: () => {},

// });

// const DataProvider = (props) => {
    
//     const [rawData, setRawData] = useState([]);
//     const [currData, setCurrData] = useState([]);
//     const [features, setFeatures] = useState([]);
//     const [labelName, setLabelName] = useState("");
//     const [uncertaintyData, setUncertaintyData] = useState([]);

//     return (
//         <DataContext.Provider value={{
//             rawData, setRawData,
//             currData, setCurrData,
//             features, setFeatures,
//             labelName, setLabelName,
//             uncertaintyData, setUncertaintyData,
//         }}>
//         {...props}
//         </DataContext.Provider>
//     )
// }

// const useData = () => useContext(DataContext);

// export { DataProvider, useData};
