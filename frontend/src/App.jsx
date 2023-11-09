import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./layouts/Header/Header";
import ShapPage from "./pages/ShapPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import TrainingRoutes from "./pages/TrainingPages/TrainingRoutes"
import DataQualityRoutes from "./pages/DataQualityPages/DataQualityRoutes";

function App() {

  return (
    <div className="flex flex-col justify-start h-screen gap-4 bg-gray-400 item-center">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dataquality/*" element={<DataQualityRoutes />} />
        <Route path="/training/*" element={<TrainingRoutes />} />
        <Route path="/shap" element={<ShapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
    
  );
}
export default App;
