import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useStatus } from "../hooks/useStatus";
import { usePage } from "../hooks/usePage";
import popMessage from "../utils/popMessage";
import homepic from "../assets/homepage_pic.jpg";
import Loading from "../components/Loading";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import { Button, Typography } from "@mui/material";

import API_URL from "../api";


const HomePage = () => {
  const titleStyle = {
    marginBottom: "16px",
    lineHeight: "1",
    fontWeight: "bold",
    color: "#007BFF",
    backgroundColor: "#cce5ff",
    borderRadius: "8px",
    padding: "10px",
    display: 'inline-block',
    fontSize: '20px',
  };

  const [labels, setLabels] = useState([]); // for y label selection
  const [selectedOption, setSelectedOption] = useState('Gas Class');
  const [customText, setCustomText] = useState('');
  const [desireY, setDesireY] = useState('Gas Class');
  const [selectedTrainData, setSelectedTrainData] = useState(null);
  const [selectedTestData, setSelectedTestData] = useState(null);
  const { setCurrentPage } = usePage();
  const { 
    isLoading, setIsLoading,
    loadingMsg, setLoadingMsg,
    loadingTime, setLoadingTime, 
  } = useStatus();

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
      popMessage(data.msg)
  };

  const handleDQButtonClick = async () => {
    setIsLoading(true); setLoadingMsg("Going to data quality process..."); setLoadingTime(0.5);

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
        `${API_URL}/readMissData/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        })

    const data3 = await response3.json()
    console.log(data3)

    setCurrentPage(`dataquality`);
    navigate(`/dataquality`);
    
    setIsLoading(false); setLoadingMsg(''); setLoadingTime(0);
    popMessage("Enter Data Quality Process!")
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
        `${API_URL}/readALData/`, 
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

  const handleTrainDataChange = (event) => {
    console.log("train data changed")
    setSelectedTrainData(event.target.files[0]);
  };

  const handleTestDataChange = (event) => {
    console.log("test data changed")
    setSelectedTestData(event.target.files[0]);
  };

  const uploadTrainData = async () => {
    const formData = new FormData();
    formData.append("file", selectedTrainData);
    console.log(formData)
  //   for (let pair of formData.entries()) {
  //     console.log(pair[0]+ ', ' + pair[1]); 
  // }

    const response = await fetch(
        `${API_URL}/upload/trainData/`, 
        {
            method: "POST",
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            body: formData
        })

    const data = await response.json()
    console.log(data.msg)
    popMessage(data.msg)
  };

  const uploadTestData = async () => {
    const formData = new FormData();
    formData.append("file", selectedTestData);
    console.log(formData)
  //   for (let pair of formData.entries()) {
  //     console.log(pair[0]+ ', ' + pair[1]); 
  // }

    const response = await fetch(
        `${API_URL}/upload/testData/`, 
        {
            method: "POST",
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            body: formData
        })

    const data = await response.json()
    console.log(data.msg)
    popMessage(data.msg)
  };

  {/*stepper */}
  const steps = [
    {
      label: 'Upload Data for Trust AI',
      description: ``,
    },
    {
      label: 'Select a Y Label',
      description:
        'An ad group contains one or more ads which target a shared set of keywords.',
    },
   
  ];
  

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
    <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {isLoading? <Loading action={loadingMsg} waitTime={loadingTime}/> : <></>} 
    
      <img src={homepic} alt="homepage pic" style={{ width: '50%', height: 'auto' }} />
      <div style={{ width: '35%', padding: '8px' }}>
        {/*stepper */}
        
        <h2 style={{ fontSize: '140px', textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 800, letterSpacing: '5px'  }}>
          <span style={{ color: 'black' }}>TAI</span>
          <span style={{ color: 'purple' }}>DQ</span>
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
          <Box sx={{ maxWidth: 800 }}>
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ fontSize: '30px', padding: '20px' }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? (
                        <Typography variant="caption">Last step</Typography>
                      ) : null
                    }
                    StepIconProps={{ style: { fontSize: '50px' } }}
                  >
                  <Typography variant="h5">{step.label}</Typography>
                  </StepLabel>
                  <StepContent>
                    {/*<Typography>{step.description}</Typography>*/}
                    {activeStep === 0 && (
                      <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom:'10px' }}>
                      
                          <input
                              type="file"
                              onChange={handleTrainDataChange}
                              className="border p-2"
                              style={{ width: '300px', height: '45px', fontSize: '16px' }}
                          />
                          <Button
                              variant="contained"
                              style={{ marginLeft: "10px" , backgroundColor: 'black' }}
                              onClick={uploadTrainData}
                          >
                              Upload Train Data
                          </Button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                              type="file"
                              onChange={handleTestDataChange}
                              className="border p-2"
                              style={{ width: '300px', height: '45px', fontSize: '16px' }}
                          />
                          <Button
                              variant="contained"
                              style={{ marginLeft: "10px" , backgroundColor: 'black' }}
                              onClick={uploadTestData}
                          >
                              Upload Test Data
                          </Button>

                        
                      </div>
                      
                      </>
                    )}
                    {activeStep === 1 && (
                      <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                      
                      <label className="block">
              
                      <select
                        value={selectedOption}
                        onChange={handleOptionChange}
                        className="mt-2 border p-2"
                        style={{ width: '300px', height: '45px', fontSize: '16px' }}
                      >
                      <option value="">-- Choose desire y label --</option>
                      <option value="Gas Class">Gas Class</option>
                      <option value="Gas Num">Gas Num</option>
                      <option value="Other">Other</option>
                    </select>
                    </label>
                    <Button
                      variant="contained"
                      style={{ margin: "10px", backgroundColor: 'black' }}
                      onClick={handleEnterClick}
                    >
                      Enter
                    </Button>
                    </div>
                    {selectedOption === 'Other' && (
                      <div>
                      {/*<label className="block" style={{  fontSize: '16px' }} >
                          Type your desired y label:*/}
                          <input
                            type="text"
                            value={customText}
                            onChange={handleTextChange}
                            className=" mt-2 border p-2"
                            style={{ width: '300px', height: '45px', fontSize: '16px' }}
                            placeholder="Type your desired y label" // Added placeholder
                          />
                        {/*</label>*/}
                      </div>
                    )}
                    
                        
                      
                      
                      </>
                    )}
                    <Box sx={{ mb: 2 }}>

                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
              
              <div style={titleStyle}>Data Upload Completed!</div>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1, ml: 2 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
              variant="contained"
              style={{ margin: "10px", backgroundColor: 'green' }}
              onClick={handleDQButtonClick}
          >
              Go to Data Quality
          </Button>
      </div>
      </div>
    </div>
        

        
      
        
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 mt-4"
          onClick={handleTrainingButtonClick}
        >
          Go to Training
        </button> */}
    </div>
    
  );
}
export default HomePage;
