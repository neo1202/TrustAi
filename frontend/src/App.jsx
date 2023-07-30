import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Stepper from "./layouts/Stepper/Stepper";
import Header from "./layouts/Header/Header";
import ShapPage from "./pages/ShapPage";
import HomePage from "./pages/HomePage";
import SetUpPage from "./pages/SetUpPage";
import TrainingPage from "./pages/TrainingPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <div className="flex flex-col justify-start h-screen gap-4 bg-gray-400 item-center">
        <Stepper />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/training" element={<Header />}>
            <Route index element={<SetUpPage />} />
            {/* index代表默認頁 */}
            <Route path="TrainingPage" element={<TrainingPage />} />
          </Route>
          <Route path="/shap" element={<ShapPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}
export default App;
