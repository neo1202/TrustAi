import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { usePage } from "../hooks/usePage";
import {
  Button,
  Input,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import API_URL from "../api";

const HomePage = () => {
  const [selectedOption, setSelectedOption] = useState('Gas Class');
  const [customText, setCustomText] = useState('');
  const [desireY, setDesireY] = useState('Gas Class');
  const [selectedFile, setSelectedFile] = useState(null);
  const { setCurrentPage } = usePage();
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setDesireY(selectedValue);

    // If "Other" is selected, clear customText
    if (selectedValue !== 'Other') {
      setCustomText('');
    }
  };

  const handleTextChange = (event) => {
    setCustomText(event.target.value);
    setDesireY(event.target.value);
  };

  const handleEnterClick = async () => {
    const setting = {
      type: "SetYLabel",
      value: desireY,
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
  };

  const handleDQButtonClick = () => {
    setCurrentPage(`dataquality`);
    navigate(`/dataquality`);
  }

  const handleTrainingButtonClick = async () => {
    // clear the previous process, i.e., the process id is always 1
    const response = await fetch(
        `${API_URL}/clearProcess/`, 
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        })

    const data = await response.json()
    console.log(data)

    // initialize the process variables
    const response2 = await fetch(
        `${API_URL}/initProcess/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        })

    const data2 = await response2.json()
    console.log(data2)

    // read data(the very first time)
    const response3 = await fetch(
        `${API_URL}/readData/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        })

    const data3 = await response3.json()
    console.log(data3)

    setCurrentPage(`training`);
    navigate(`/training`);
  };

  const handleFileChange = (event) => {
    console.log("file changed")
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData)

    const response = await fetch(
        `${API_URL}/upload/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        })

    const data = await response.json()
    console.log(data.msg)
  };

  return (
    <div className="text-center p-8">
      <h4 className="text-2xl mb-4">HomePage</h4>
      <div className="flex flex-col md:flex-row">
        <div className="mb-4 md:mr-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2"
            onClick={uploadFile}
          >
            Upload File
          </button>
        </div>
        <div className="md:flex md:items-center">
          <label className="block">
            Select an option:
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              className="mt-2 border p-2"
            >
              <option value="">-- Choose desire y label --</option>
              <option value="Gas Class">Gas Class</option>
              <option value="Gas Num">Gas Num</option>
              <option value="Other">Other</option>
            </select>
          </label>
          {selectedOption === 'Other' && (
            <div className="mt-4 md:mt-0 md:ml-4">
              <label className="block">
                Type your desired y label:
                <input
                  type="text"
                  value={customText}
                  onChange={handleTextChange}
                  className="mt-2 border p-2"
                />
              </label>
            </div>
          )}
          <button
            className="bg-green-500 text-white px-4 py-2 mt-4 md:mt-0 md:ml-4"
            onClick={handleEnterClick}
          >
            Enter
          </button>
        </div>
      </div>

      <br />

      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 mr-4"
        onClick={handleDQButtonClick}
      >
        Go to Data Quality
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        onClick={handleTrainingButtonClick}
      >
        Go to Training
      </button>
    </div>
  );
}
export default HomePage;
