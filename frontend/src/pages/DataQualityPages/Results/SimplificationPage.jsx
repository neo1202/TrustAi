import React, { useEffect, useState } from "react";
import { useDQ } from "../../../hooks/useDQ";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { greenTitleStyle } from "../../../config/colors";
import "@mui/material";

const circleSize = 280;
const circleMargin = 20;

const blockClass = "text-black text-2xl font-bold flex flex-col items-center rounded-lg p-8 mr-4";
const blockStyle = { backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)' };

const SimplificationPage = () => {
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

//   useEffect(() => {
//     getMetricValues();
//   }, []);

  const [selectedOption, setSelectedOption] = useState(metrics[0]);

  const calculatePieAngle = (type) => {
    const angle = type === 'stability' ? (jsDivergence / 10) * 360 : metricValues[selectedOption] * 360;
    return `${angle}deg, #ccc ${angle}deg 360deg`;
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="flex items-center">
        {/* Left Circle */}
        <div className={blockClass} style={blockStyle}>
          <div style={greenTitleStyle}>Stability</div>
          <div
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              background: `conic-gradient(#2196f3 0deg ${calculatePieAngle('stability')})`,
            }}
            className="rounded-full flex items-center justify-center"
          >
            <span className="text-white text-2xl font-bold">
              {`${jsDivergence} / 10`}
            </span>
          </div>
        </div>

        {/* Increase margin between circles */}
        <div style={{ margin: `0 ${circleMargin}px` }} />

        {/* Right Circle */}
        <div className={blockClass} style={blockStyle}>
          <div style={greenTitleStyle}>Accuracy</div>
          <div
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              background: `conic-gradient(#2196f3 0deg ${calculatePieAngle('accuracy')})`,
            }}
            className="rounded-full flex items-center justify-center"
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
