import React, { useState } from "react";
import { useDQ } from "../../../hooks/useDQ";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "@mui/material"; 

const SimplificationPage = () => {
  const circleSize = 280;
  const circleMargin = 20; 
  const titleStyle = {
    marginBottom: "16px",
    lineHeight: "1",
    fontWeight: "bold",
    color: "#007BFF",
    backgroundColor: "#cce5ff",
    borderRadius: "8px",
    padding: "8px",
  };
  const metrics = ["Accuracy", "Precision", "Recall", "F1"];

  const {
    jsDivergence,
    accuracy,
    precision,
    recall,
    f1,
    getMetricValues,
  } = useDQ();

  const metricValues = {
    Accuracy: accuracy,
    Precision: precision,
    Recall: recall,
    F1: f1,
  };

  const [selectedOption, setSelectedOption] = useState(metrics[0]);

  //   useEffect(() => {
  //     getMetricValues();
  //   }, [])

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="flex items-center">
        {/* Left Circle */}
        <div className="text-black text-2xl font-bold mr-4 flex flex-col items-center">
          <div style={titleStyle}>JS-Divergence</div>
          <div
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
            }}
            className="bg-blue-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-2xl font-bold">
              {jsDivergence}
            </span>
          </div>
        </div>

        {/* Increase margin between circles */}
        <div style={{ margin: `0 ${circleMargin}px` }} />

        {/* Right Circle */}
        <div className="text-black text-2xl font-bold flex flex-col items-center">
          <div style={titleStyle}>Metrics</div>
          <div
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
            }}
            className="bg-blue-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-2xl font-bold">
              {metricValues[selectedOption]}
            </span>
          </div>
        </div>

        {/* Material-UI Dropdown with larger margin */}
        <FormControl variant="outlined" className="ml-12">
          <InputLabel id="metrics-dropdown-label">Metrics</InputLabel>
          <Select
            labelId="metrics-dropdown-label"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            label="Metrics"
          >
            {metrics.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default SimplificationPage;
