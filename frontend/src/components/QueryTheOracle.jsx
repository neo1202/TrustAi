import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { Button } from "@mui/material";
import popMessage from '../utils/popMessage';
import API_URL from "../api";

const { Option } = Select;

const QueryTheOracle = ({ queryIds, setQueryResults }) => {
    const [selections, setSelections] = useState({});
    const [labelsValue, setLabelsValue] = useState([])
  
    const qidWidth = '40px'; // Adjust the width based on your preference
  
    const handleSelectionChange = (qid, value) => {
      setSelections((prevSelections) => ({
        ...prevSelections,
        [qid]: value,
      }));
    };
  
    const handleSubmit = () => {
      const results = queryIds.map((qid) => ({
        [qid]: selections[qid] || "1", // Set default value to "1" if not selected
      }));
      setQueryResults(results);
      popMessage("Submit query results!");
    };

    const getLabelsName = async () => {
      const response = await fetch(
        `${API_URL}/getFeaturesAndLabel/complete`, 
        {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json()
      setLabelsValue(data.labelValue)
    }

    useEffect(() => {
      getLabelsName();
    }, []);
  
    return (
      <div style={{ maxWidth: '95%', display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap',  }}>
          {queryIds.map((qid, i) => (
            <div key={qid} style={{ display: 'flex', alignItems: 'center' , marginRight: '20px', marginBottom: '10px' }}>
              <div style={{ width: qidWidth, marginRight: '10px', marginBottom: '10px' }}>{qid}</div>
              <Select
                style={{ width: 200 }}
                value={selections[qid] || "1"}  // Set default value to "1" if not already selected
                onChange={(value) => handleSelectionChange(qid, value)}
              >
                {labelsValue.map((label, index) => (
                    <Option key={index} value={label}>{label}</Option> // Generate Option components from labelsValue
                ))}
                
              </Select>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
          <Button variant="contained"
                  onClick={handleSubmit} 
                  /*{style={{ position: 'absolute', bottom: '-60px', right: 0, margin: '20px', width: '120px' }} } */ >
            Submit
          </Button>
        </div>
      </div>
    );
  };
  
  export default QueryTheOracle;
  