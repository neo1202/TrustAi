import React, { useState } from "react";
import { Input, Button, Select, Tooltip, Typography } from "antd";
import API_URL from "../../api";
import { uncertaintyQueryMethod } from "../../config/config";

const { Option } = Select;
const { Title } = Typography;

const MethodSelectPage = () => {
  const [selectedUncertaintyMethod, setSelectedUncertaintyMethod] = useState("");

  const [inputIterValue, setInputIterValue] = useState("");
  const [inputLRValue, setInputLRValue] = useState("");
  const [inputPoolSizeValue, setInputPoolSizeValue] = useState("");
  const [inputNumEpochValue, setInputNumEpochValue] = useState("");
  const [inputBatchSizeValue, setInputBatchSizeValue] = useState("");

  const [displayIter, setDisplayIter] = useState("20");
  const [displayLR, setDisplayLR] = useState("0.001");
  const [displayPoolSize, setDisplayPoolSize] = useState("300");
  const [displayNumEpoch, setDisplayNumEpoch] = useState("100");
  const [displayBatchSize, setDisplayBatchSize] = useState("16");

  const handleSelectUncertaintyMethod = async (blockName) => {
    const setting = {
      type: "SelectUncertaintyMethod",
      value: blockName,
    };

    if (selectedUncertaintyMethod === blockName) {
      setSelectedUncertaintyMethod("");
      setting.value = "";
    } else {
      setSelectedUncertaintyMethod(blockName);
    }

    const response = await fetch(`${API_URL}/settings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setting),
    });
    const data = await response.json();
    console.log("Settings...", data);
  };

  const handleInputChange = (stateUpdater, e) => {
    stateUpdater(e.target.value);
  };

  const handleEnter = async (type, value, stateUpdater, displayUpdater) => {
    const setting = {
      type,
      value,
    };

    const response = await fetch(`${API_URL}/settings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setting),
    });

    const data = await response.json();
    console.log("Settings...", data);

    displayUpdater(value);
    stateUpdater("");
  };

  const renderSelectOptions = () => {
    return uncertaintyQueryMethod.map((method, i) => (
      <Option key={i} value={method}>
        {method}
      </Option>
    ));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 bg-white-400">

      <div className="flex flex-row justify-between items-start gap-32 relative">

        {/* Left Part */}
        <div className="flex flex-col items-start">
          <Title level={2}>Basic Settings</Title>

          <div className="flex flex-col items-start">
            <Tooltip title="Number of data added per loop">
              <p>Number of data added per loop: __{displayIter ? displayIter : "__"}__</p>
            </Tooltip>
            <div className="flex flex-row items-center" style={{ marginBottom: '16px' }}>
              <Input
                style={{ width: 250 }}
                value={inputIterValue}
                onChange={(e) => handleInputChange(setInputIterValue, e)}
                onPressEnter={() => handleEnter("SetNumDataPerIter", inputIterValue, setInputIterValue, setDisplayIter)}
                placeholder="Type a number"
              />
              <Button type="primary" onClick={() => handleEnter("SetNumDataPerIter", inputIterValue, setInputIterValue, setDisplayIter)}>
                Enter
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <Tooltip title="Uncertainty query method">
              <p>Uncertainty query method</p>
            </Tooltip>
            <Select
              style={{ width: 250 }}
              value={selectedUncertaintyMethod}
              onChange={handleSelectUncertaintyMethod}
              placeholder="Select a method"
            >
              {renderSelectOptions()}
            </Select>
          </div>
        </div>

        {/* Right Part */}
        <div className="flex flex-col items-start">
          <Title level={2}>Parameter Adjustments</Title>

          {/* Learning Rate */}
          <div className="flex flex-col items-start">
            <Tooltip title="Learning rate">
              <p>Learning rate __{displayLR ? displayLR : "__"}__</p>
            </Tooltip>
            <div className="flex flex-row items-center" style={{ marginBottom: '16px' }}>
              <Input
                style={{ width: 250 }}
                value={inputLRValue}
                onChange={(e) => handleInputChange(setInputLRValue, e)}
                onPressEnter={() => handleEnter("SetLearningRate", inputLRValue, setInputLRValue, setDisplayLR)}
                placeholder="Type a number"
              />
              <Button type="primary" onClick={() => handleEnter("SetLearningRate", inputLRValue, setInputLRValue, setDisplayLR)}>
                Enter
              </Button>
            </div>
          </div>

          {/* Pooling Size */}
          <div className="flex flex-col items-start">
            <Tooltip title="Pooling Size">
              <p>Pooling Size __{displayPoolSize ? displayPoolSize : "__"}__</p>
            </Tooltip>
            <div className="flex flex-row items-center" style={{ marginBottom: '16px' }}>
              <Input
                style={{ width: 250 }}
                value={inputPoolSizeValue}
                onChange={(e) => handleInputChange(setInputPoolSizeValue, e)}
                onPressEnter={() => handleEnter("SetPoolingSize", inputPoolSizeValue, setInputPoolSizeValue, setDisplayPoolSize)}
                placeholder="Type a number"
              />
              <Button type="primary" onClick={() => handleEnter("SetPoolingSize", inputPoolSizeValue, setInputPoolSizeValue, setDisplayPoolSize)}>
                Enter
              </Button>
            </div>
          </div>

          {/* Number of Epoch */}
          <div className="flex flex-col items-start">
            <Tooltip title="Number of Epoch">
              <p>Number of Epoch __{displayNumEpoch ? displayNumEpoch : "__"}__</p>
            </Tooltip>
            <div className="flex flex-row items-center" style={{ marginBottom: '16px' }}>
              <Input
                style={{ width: 250 }}
                value={inputNumEpochValue}
                onChange={(e) => handleInputChange(setInputNumEpochValue, e)}
                onPressEnter={() => handleEnter("SetNumEpoch", inputNumEpochValue, setInputNumEpochValue, setDisplayNumEpoch)}
                placeholder="Type a number"
              />
              <Button type="primary" onClick={() => handleEnter("SetNumEpoch", inputNumEpochValue, setInputNumEpochValue, setDisplayNumEpoch)}>
                Enter
              </Button>
            </div>
          </div>

          {/* Batch Size */}
          <div className="flex flex-col items-start">
            <Tooltip title="Batch Size">
              <p>Batch Size __{displayBatchSize ? displayBatchSize : "__"}__</p>
            </Tooltip>
            <div className="flex flex-row items-center" style={{ marginBottom: '16px' }}>
              <Input
                style={{ width: 250 }}
                value={inputBatchSizeValue}
                onChange={(e) => handleInputChange(setInputBatchSizeValue, e)}
                onPressEnter={() => handleEnter("SetBatchingSize", inputBatchSizeValue, setInputBatchSizeValue, setDisplayBatchSize)}
                placeholder="Type a number"
              />
              <Button type="primary" onClick={() => handleEnter("SetBatchingSize", inputBatchSizeValue, setInputBatchSizeValue, setDisplayBatchSize)}>
                Enter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MethodSelectPage;
