import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import Edashboard from "../../components/Edashboard";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import API_URL from "../../api";

const getImageString = plotName => `${API_URL}/getPlotImages/edash/${plotName}`

const EdashPage = () => {
    const figures = [
        {
          label: "Data Description",
          description: "View brief descriptions of training and testing data",
          onClick: () => handleFigureClick("Data Description"),
        },
        {
          label: "Missing Values",
          description: "View the missing values of the features",
          onClick: () => handleFigureClick("Missing Values"),
        },
        {
          label: "Label Class Ratio",
          description: "View the pie chart of class ratio of the target label",
          onClick: () => handleFigureClick("Label Class Ratio"),
        },
        {
          label: "Training Data EDA",
          description: "View the EDA of the training data",
          onClick: () => handleFigureClick("Training Data EDA"),
        },
        {
          label: "Testing Data EDA",
          description: "View the EDA of the testing data",
          onClick: () => handleFigureClick("Testing Data EDA"),
        },
    ]

  const handleFigureClick = (figure) => {
    setCurrDashboard(figure)

    switch (figure) {
      case 'Data Description':
        setDashboardDfUrls([
          { 'name': 'Training data', 'item': descriptionTrain },
          { 'name': 'Testing data', 'item': descriptionTest },
        ]);
        setDashboardFigUrls([]);
        break;
      case 'Missing Values':
        setDashboardDfUrls([]);
        setDashboardFigUrls([
          { 'name': 'Training data', 'item': getImageString(missingValuePlotTrain) },
          { 'name': 'Testing data', 'item': getImageString(missingValuePlotTest) },
        ]);
        break;
      case 'Label Class Ratio':
        setDashboardDfUrls([]);
        setDashboardFigUrls([
          { 'name': 'Training data', 'item': getImageString(labelClassRatioPlotTrain) },
          { 'name': 'Testing data', 'item': getImageString(labelClassRatioPlotTest) },
        ]);
        break;
      case 'Training Data EDA':
        setDashboardDfUrls([
          { 'name': 'Description', 'item': descriptionTrain },
        ]);
        setDashboardFigUrls([
          { 'name': 'Missing Values', 'item': getImageString(missingValuePlotTrain) },
          { 'name': 'Label Class Ratio', 'item': getImageString(labelClassRatioPlotTrain) },
        ]);
        break;
      case 'Testing Data EDA':
        setDashboardDfUrls([
          { 'name': 'Description', 'item': descriptionTest },
        ]);
          setDashboardFigUrls([
          { 'name': 'Missing Values', 'item': getImageString(missingValuePlotTest) },
          { 'name': 'Label Class Ratio', 'item': getImageString(labelClassRatioPlotTest) },
        ]);
        break;
      default: break;
    }

    setDashboardOpen(true)
  }

  const [edaColumns, setEdaColumns] = useState([]);
  const [descriptionTrain, setDescriptionTrain] = useState([]);
  const [descriptionTest, setDescriptionTest] = useState([]);
  const [missingValuePlotTrain, setMissingValuePlotTrain] = useState('');
  const [missingValuePlotTest, setMissingValuePlotTest] = useState('');
  const [labelClassRatioPlotTrain, setLabelClassRatioPlotTrain] = useState('');
  const [labelClassRatioPlotTest, setLabelClassRatioPlotTest] = useState('');

  const [currDashboard, setCurrDashboard] = useState('');
  const [isDashboardOpen, setDashboardOpen] = useState(false);
  const [dashboardDfUrls, setDashboardDfUrls] = useState([]);
  const [dashboardFigUrls, setDashboardFigUrls] = useState([]);

  
  useEffect(() => {
    doEDA();
    getEdaColumns();
  }, [])

  const getEdaColumns = async () => {
    const response = await fetch(`${API_URL}/getFeaturesAndLabel/miss`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("Get columns...", data);
    setEdaColumns(data.allColumns);
  }
  
  const doEDA = async () => {
    const response = await fetch(
        `${API_URL}/doEDA/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        })

    const data = await response.json()
    console.log("do EDA...", data)
    setDescriptionTrain(data.train.description);
    setDescriptionTest(data.test.description);
    setMissingValuePlotTrain(`${data.train.missingValuePlot}?timestamp=${Date.now()}`);
    setMissingValuePlotTest(`${data.test.missingValuePlot}?timestamp=${Date.now()}`);
    setLabelClassRatioPlotTrain(`${data.train.labelClassRatioPlot}?timestamp=${Date.now()}`);
    setLabelClassRatioPlotTest(`${data.test.labelClassRatioPlot}?timestamp=${Date.now()}`);
  }


  return (
    <div className="flex flex-col place-items-center justify-center bg-white-400">{/*h-screen*/}
      <div style={{ display: "flex", justifyContent: "center" }}>
      {figures.map((fig, index) => (
        <Tooltip key={index} title={fig.description}>
          <Button
            variant="contained"
            style={{ margin: "10px" }}
            onClick={fig.onClick}
          >
            {fig.label}
          </Button>
        </Tooltip>
      ))}
      </div>

      <div>
        <Edashboard
          open={isDashboardOpen}
          onCancel={() => {
            setDashboardOpen(false)
          }}
          title={currDashboard}
          dfUrls={dashboardDfUrls}
          dfKeys={edaColumns}
          figUrls={dashboardFigUrls}
        />
      </div>

      {/* <Typography variant="h4" gutterBottom>
        Data Description of Training Data
      </Typography>
      <DataTable data={descriptionTrain} keys={edaColumns}/>

      <br />

      <Typography variant="h4" gutterBottom>
        Data Description of Testing Data
      </Typography>
      <DataTable data={descriptionTest} keys={edaColumns}/>

      <br />

      <img src={`${API_URL}/getPlotImages/edash/${missingValuePlotTrain}`} alt="" />
      <img src={`${API_URL}/getPlotImages/edash/${missingValuePlotTest}`} alt="" />
      <img src={`${API_URL}/getPlotImages/edash/${labelClassRatioPlotTrain}`} alt="" />
      <img src={`${API_URL}/getPlotImages/edash/${labelClassRatioPlotTest}`} alt="" /> */}

    </div>
  );
};

export default EdashPage;
