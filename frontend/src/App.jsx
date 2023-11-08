import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./layouts/Header/Header";
import DataQualityPage from "./pages/DataQualityPages/DataQualityPage";
import ShapPage from "./pages/ShapPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import TrainingRoutes from "./pages/TrainingPages/TrainingRoutes"
import PageInfoContext, { PageProvider } from "./context/pageInfo";
// import { DataProvider } from "./hooks/useData";

function App() {
  return (
    // <DataProvider>
        <PageProvider>
        <div className="flex flex-col justify-start h-screen gap-4 bg-gray-400 item-center">
            {/* <Routes>
            <Route path="/training/*" element={<Header />} />
            </Routes> */}
            <Header />
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dataquality" element={<DataQualityPage />} />
            <Route path="/training/*" element={<TrainingRoutes />} />
            <Route path="/shap" element={<ShapPage />} />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
        </PageProvider>
    // </DataProvider>
    
  );
}
export default App;
