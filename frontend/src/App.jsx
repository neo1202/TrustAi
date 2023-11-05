import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./layouts/Header/Header";
import ShapPage from "./pages/ShapPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import TrainingRoutes from "./TrainingRoutes";
import PageInfoContext, { StepProvider } from "./context/pageInfo";
// import { DataProvider } from "./hooks/useData";

function App() {
  return (
    // <DataProvider>
        <StepProvider>
        <div className="flex flex-col justify-start h-screen gap-4 bg-gray-400 item-center">
            {/* <Routes>
            <Route path="/training/*" element={<Header />} />
            </Routes> */}
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/training/*" element={<TrainingRoutes />} />
            <Route path="/shap" element={<ShapPage />} />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
        </StepProvider>
    // </DataProvider>
    
  );
}
export default App;
