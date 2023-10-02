import React, { useEffect, useState } from "react";
import API_URL from "../../api";
import Modal from "../../components/Modal";
import SelectBlock from "../../components/SelectBlock";
import { uncertaintyQueryMethod } from "../../config/config"

function MethodSelectPage() {

  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [selectedUncertaintyMethod, setSelectedUncertaintyMethod] = useState('');

  const [inputIterValue, setInputIterValue] = useState('');
  const [inputLRValue, setInputLRValue] = useState('');
  const [inputPoolSizeValue, setInputPoolSizeValue] = useState('');
  const [inputNumEpochValue, setInputNumEpochValue] = useState('');
  const [inputBatchSizeValue, setInputBatchSizeValue] = useState('');

  const [displayIterText, setDisplayIterText] = useState('');
  const [displayLRText, setDisplayLRText] = useState('');
  const [displayPoolSizeText, setDisplayPoolSizeText] = useState('');
  const [displayNumEpochText, setDisplayNumEpochText] = useState('');
  const [displayBatchSizeText, setDisplayBatchSizeText] = useState('');

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, []);
//   console.log(count);
//   console.log("進入MethodSelectPage!!wc");
//   console.log("對就是MethodSelect");

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const actionBar = (
    <div>
      <button onClick={handleCloseModal}>I got it</button>
    </div>
  );

  const modal = (
    <Modal onClose={handleCloseModal} actionBar={actionBar}>
      <p>這個Model是CNN架構, 可以處理中等複雜的數據</p>
    </Modal>
  );

  // ================================= //

  const handleSelectUncertaintyMethod = async (blockName) => {
    const setting = {
        'type': 'SelectUncertaintyMethod',
        'value': blockName,
    }

    if (selectedUncertaintyMethod === blockName) {
        setSelectedUncertaintyMethod(''); // remove border
        setting.value = ''
    } else {
        setSelectedUncertaintyMethod(blockName);
    }

    const response = await fetch(
        `${API_URL}/settings/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Settings...", data)
  }

  // ================================= //

  const handleInputIterChange = (e) => {
    setInputIterValue(e.target.value);
  };

  const handleInputLRChange = (e) => {
    setInputLRValue(e.target.value);
  };

  const handleInputPoolSizeChange = (e) => {
    setInputPoolSizeValue(e.target.value);
  };

  const handleInputNumEpochChange = (e) => {
    setInputNumEpochValue(e.target.value);
  };

  const handleInputBatchSizeChange = (e) => {
    setInputBatchSizeValue(e.target.value);
  };

  // ================================= //

  const handleIterEnter = async () => {
    const setting = {
        'type': 'SetNumDataPerIter',
        'value': inputIterValue,
    }

    const response = await fetch(
        `${API_URL}/settings/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Settings...", data)

    setDisplayIterText(inputIterValue);
    setInputIterValue('');
  }

  const handleLREnter = async () => {
    const setting = {
        'type': 'SetLearningRate',
        'value': inputLRValue,
    }

    const response = await fetch(
        `${API_URL}/settings/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Settings...", data)

    setDisplayLRText(inputLRValue);
    setInputLRValue('');
  }

  const handlePoolSizeEnter = async () => {
    const setting = {
        'type': 'SetPoolingSize',
        'value': inputPoolSizeValue,
    }

    const response = await fetch(
        `${API_URL}/settings/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Settings...", data)

    setDisplayPoolSizeText(inputPoolSizeValue);
    setInputPoolSizeValue('');
  }

  const handleNumEpochEnter = async () => {
    const setting = {
        'type': 'SetNumEpoch',
        'value': inputNumEpochValue,
    }

    const response = await fetch(
        `${API_URL}/settings/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Settings...", data)

    setDisplayNumEpochText(inputNumEpochValue);
    setInputNumEpochValue('');
  }

  const handleBatchSizeEnter = async () => {
    const setting = {
        'type': 'SetBatchingSize',
        'value': inputBatchSizeValue,
    }

    const response = await fetch(
        `${API_URL}/settings/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setting)
    })
    const data = await response.json()
    console.log("Settings...", data)

    setDisplayBatchSizeText(inputBatchSizeValue);
    setInputBatchSizeValue('');
  }

  // ================================= //

  const handleIterKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleIterEnter()
    }
  };

  const handleLRKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleLREnter()
    }
  };

  const handlePoolSizeKeyPress = (e) => {
    if (e.key === 'Enter') {
        handlePoolSizeEnter()
    }
  };

  const handleNumEpochKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleNumEpochEnter()
    }
  };

  const handleBatchSizeKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleBatchSizeEnter()
    }
  };

  // ================================= //

  return (
    <div className="relative">
      <h1>ChooseModelPage</h1>
      <h2>If the initial model is not good enough(quite normal), then do settings on this AL page</h2>
      <h2>this page should include: 1. num per AL iter 2. query method 3. params, hyperparams, ...</h2>
      <br/>
      

      <button onClick={handleClick}>openModal</button>
      {showModal && modal}
      <br/>
      

      <p>How many do you want to add in one iteration?  __{displayIterText? displayIterText:"__"}__</p>
      <textarea
        value={inputIterValue}
        onChange={handleInputIterChange}
        onKeyDown={handleIterKeyPress}
        placeholder="Type a number and press Enter"
      />
      <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handleIterEnter}>Enter</button>

      <br/>
      
      
      <p>Uncertainty query method</p>
      {uncertaintyQueryMethod.map((method, i) => {
        return <SelectBlock key={i}
                            blockName={method}
                            selected={selectedUncertaintyMethod === method}
                            onClick={handleSelectUncertaintyMethod} />
      })}
      <br/>
      
      <h2>Params/hyperparams adjustments </h2>
      <p>Learning rate __{displayLRText? displayLRText:"__"}__</p>
      <textarea
        value={inputLRValue}
        onChange={handleInputLRChange}
        onKeyDown={handleLRKeyPress}
        placeholder="Type a number and press Enter"
      />
      <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handleLREnter}>Enter</button>

      <p>Pooling Size __{displayPoolSizeText? displayPoolSizeText:"__"}__</p>
      <textarea
        value={inputPoolSizeValue}
        onChange={handleInputPoolSizeChange}
        onKeyDown={handlePoolSizeKeyPress}
        placeholder="Type a number and press Enter"
      />
      <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handlePoolSizeEnter}>Enter</button>

      <p>Number of Epoch __{displayNumEpochText? displayNumEpochText:"__"}__</p>
      <textarea
        value={inputNumEpochValue}
        onChange={handleInputNumEpochChange}
        onKeyDown={handleNumEpochKeyPress}
        placeholder="Type a number and press Enter"
      />
      <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handleNumEpochEnter}>Enter</button>

      <p>Batch Size __{displayBatchSizeText? displayBatchSizeText:"__"}__</p>
      <textarea
        value={inputBatchSizeValue}
        onChange={handleInputBatchSizeChange}
        onKeyDown={handleBatchSizeKeyPress}
        placeholder="Type a number and press Enter"
      />
      <button style={{marginLeft: '20px'}} className="bg-white btn" onClick={handleBatchSizeEnter}>Enter</button>
      

    </div>
  );
}

export default MethodSelectPage;
