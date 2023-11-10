import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Select } from "antd";
import API_URL from "../../api";
import { uncertaintyQueryMethod } from "../../config/config";

const { Option } = Select;

function MethodSelectPage() {
  const [showModal, setShowModal] = useState(false);

  const [selectedUncertaintyMethod, setSelectedUncertaintyMethod] = useState("");

  const [inputIterValue, setInputIterValue] = useState("");
  const [inputLRValue, setInputLRValue] = useState("");
  const [inputPoolSizeValue, setInputPoolSizeValue] = useState("");
  const [inputNumEpochValue, setInputNumEpochValue] = useState("");
  const [inputBatchSizeValue, setInputBatchSizeValue] = useState("");

  const [displayIter, setDisplayIter] = useState("");
  const [displayLR, setDisplayLR] = useState("");
  const [displayPoolSize, setDisplayPoolSize] = useState("");
  const [displayNumEpoch, setDisplayNumEpoch] = useState("");
  const [displayBatchSize, setDisplayBatchSize] = useState("");

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
    <div className="relative">
      <h1>ChooseModelPage</h1>
      <br />

      <Button onClick={handleClick}>Open Modal</Button>
      <Modal visible={showModal} onCancel={handleCloseModal} footer={null}>
        <p>這個Model是CNN架構, 可以處理中等複雜的數據</p>
      </Modal>
      <br />

      <p>How many do you want to add in one iteration? __{displayIter ? displayIter : "__"}__</p>
      <Input
        style={{ width: 250 }}
        value={inputIterValue}
        onChange={(e) => handleInputChange(setInputIterValue, e)}
        onPressEnter={() => handleEnter("SetNumDataPerIter", inputIterValue, setInputIterValue, setDisplayIter)}
        placeholder="Type a number and press Enter"
      />

      <br />

      <p>Uncertainty query method</p>
      <Select
        style={{ width: 250 }}
        value={selectedUncertaintyMethod}
        onChange={handleSelectUncertaintyMethod}
        placeholder="Select a method"
      >
        {renderSelectOptions()}
      </Select>
      <br />

      <h2>Params/hyperparams adjustments </h2>
    <p>Learning rate __{displayLR ? displayLR : "__"}__</p>
    <Input
      style={{ width: 250 }}
      value={inputLRValue}
      onChange={(e) => handleInputChange(setInputLRValue, e)}
      onPressEnter={() => handleEnter("SetLearningRate", inputLRValue, setInputLRValue, setDisplayLR)}
      placeholder="Type a number and press Enter"
    />
    <Button type="primary" onClick={() => handleEnter("SetLearningRate", inputLRValue, setInputLRValue, setDisplayLR)}>
      Enter
    </Button>

    <p>Pooling Size __{displayPoolSize ? displayPoolSize : "__"}__</p>
    <Input
      style={{ width: 250 }}
      value={inputPoolSizeValue}
      onChange={(e) => handleInputChange(setInputPoolSizeValue, e)}
      onPressEnter={() => handleEnter("SetPoolingSize", inputPoolSizeValue, setInputPoolSizeValue, setDisplayPoolSize)}
      placeholder="Type a number and press Enter"
    />
    <Button type="primary" onClick={() => handleEnter("SetPoolingSize", inputPoolSizeValue, setInputPoolSizeValue, setDisplayPoolSize)}>
      Enter
    </Button>

    <p>Number of Epoch __{displayNumEpoch ? displayNumEpoch : "__"}__</p>
    <Input
      style={{ width: 250 }}
      value={inputNumEpochValue}
      onChange={(e) => handleInputChange(setInputNumEpochValue, e)}
      onPressEnter={() => handleEnter("SetNumEpoch", inputNumEpochValue, setInputNumEpochValue, setDisplayNumEpoch)}
      placeholder="Type a number and press Enter"
    />
    <Button type="primary" onClick={() => handleEnter("SetNumEpoch", inputNumEpochValue, setInputNumEpochValue, setDisplayNumEpoch)}>
      Enter
    </Button>

    <p>Batch Size __{displayBatchSize ? displayBatchSize : "__"}__</p>
    <Input
      style={{ width: 250 }}
      value={inputBatchSizeValue}
      onChange={(e) => handleInputChange(setInputBatchSizeValue, e)}
      onPressEnter={() => handleEnter("SetBatchingSize", inputBatchSizeValue, setInputBatchSizeValue, setDisplayBatchSize)}
      placeholder="Type a number and press Enter"
    />
    <Button type="primary" onClick={() => handleEnter("SetBatchingSize", inputBatchSizeValue, setInputBatchSizeValue, setDisplayBatchSize)}>
      Enter
    </Button>

      {/* Additional Input components for other parameters */}

    </div>
  );
}

export default MethodSelectPage;
