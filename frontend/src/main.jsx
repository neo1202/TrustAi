import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PageProvider } from "./context/pageInfoContext.jsx";
import { DQProvider } from "./context/DQContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
//  <React.StrictMode>
  <PageProvider>
    <DQProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DQProvider>
  </PageProvider>
//  </React.StrictMode>
);
