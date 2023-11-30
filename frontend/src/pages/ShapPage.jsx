import React, { useState, useEffect } from "react";
import API_URL from "../api";
import Dropdown from "../components/Dropdown";
import Navbar from "../components/Navbar";
import "../layouts/ShapPage/ShapPage.css"; // Import the CSS file for styling
import DataTable from "../components/DataTable";

function ShapPage() {
  const [shapClass, setShapClass] = useState('');
  const [desired_y, setDesired_y] = useState(1);
  const [imagePath, setImagePath] = useState('');
  const [gBarImagePath, setGBarImagePath] = useState('');
  const [posX, setPosX] = useState([]);
  const [negX, setNegX] = useState([]);
  const [gPieImagePath, setGPieImagePath] = useState('');
  const [XLabels, setXLabels] = useState([]);
  const [yLabel, setYLabel] = useState('');
  const [inputX, setInputX] = useState(Array(XLabels.length).fill('20')); // Initialize with an empty value
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getXLabels()
  }, [])
  
  const getXLabels = async () => {
    const response = await fetch(
      `${API_URL}/getFeaturesAndLabel/complete`, 
      {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await response.json()
    setXLabels(data.featureNames)
    setYLabel(data.labelName)
    setInputX(Array(data.featureNames.length).fill('20'))
  }
  useEffect(() => {
    const fetchData = async () => {
            const response = await fetch(`${API_URL}/processShapAllClassPlot/`);
            setIsLoading(false);
    };
    fetchData();
  }, []);
  
  const [data, setData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false); //track cf data gerated or not
  
  const [depClass1, setDepClass1] = useState('feat_65');
  const [depClass2, setDepClass2] = useState('feat_9');
  const [depY, setDepY] = useState('');
  const [imagePathD1, setImagePathD1] = useState('');
  const [imagePathD2, setImagePathD2] = useState('');

  //先放著之後可用的dropdown
  const [dropdownSelection, setDropdownSelection] = useState(null);
  const dropdownOptions = [
    { label: "One", value: "one" },
    { label: "Two", value: "two" },
    { label: "Test", value: "test" },
  ];
  const handleDropdownSelection = (optionSelected) => {
    setDropdownSelection(optionSelected);
  };

  const handleInputXChange = (index, value) => {
    // Create a copy of the inputValues array and update the value at the specified index
    const updatedValues = [...inputX];
    updatedValues[index] = value;
    setInputX(updatedValues);
  };
  
  const handleInputXSubmit = async (e) => {
    e.preventDefault();

    const inputXAndDesiredY = { inputX:inputX, desired_y:desired_y, }

    const response = await fetch(
        `${API_URL}/processCF/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputXAndDesiredY)
    })
    const data = await response.json()
    const parsedData = JSON.parse(data.data)
    setData(parsedData); 
    setIsDataAvailable(true);
    
  };

  const handleShapSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
          `${API_URL}/processShapClassPlot/`, 
          {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(shapClass)
      })

      const data = await response.json();
      setImagePath(`${data.image_path}?timestamp=${Date.now()}`)
      setGBarImagePath(`${data.gBarImagePath}?timestamp=${Date.now()}`)
      setGPieImagePath(`${data.gPieImagePath}?timestamp=${Date.now()}`)
      setPosX(data.posX)
      setNegX(data.negX)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleShapDepSubmit = async (e) => {
    e.preventDefault();

    try {

      const deps = {depClass1:depClass1, depClass2:depClass2, depY:depY}

      const response = await fetch(
        `${API_URL}/processDepClassPlot/`, 
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deps)
    })

      const data = await response.json();
      setImagePathD1(`${data.image_pathD1}?timestamp=${Date.now()}`);
      setImagePathD2(`${data.image_pathD2}?timestamp=${Date.now()}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const pageStyle = {
    backgroundColor: "#ffffff", // Set your desired background color here
  };
  
  if (isLoading) {
    return <p>Loading All Class SHAP...</p>; // replace with your loading image
} 
  
  return (
    <div style={pageStyle}>
      <Navbar />
      <div id="home" className="section">
        {/* Content for the Home section */}
      </div>
      <div id="shap-page" className="section">
        
        <h1 id="global_shap" className="heading1">Global SHAP</h1>
        <p style={{ textAlign: 'center'}}>
        SHAP value means the contribution to a class, the larger the absoulute value the larger the contribution.  
        </p>
        <h2 id="ft_imp_class" className="cenheading2">SHAP Value of All Class </h2>
      
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="p-5 rounded-lg mb-4" style={{ backgroundColor: '#eeeeee', width: '60%'}}>
        <h2 style={{fontWeight: 'bold', fontSize: '18px'}}>Tips</h2>
          <p >
          - Each feature is represented by a horizontal bar, and the length of the bar indicates the magnitude of the SHAP values. <br />
        - Longer bars suggest a greater impact on the model's output. <br />
        - In a multi-class scenario, each class is typically represented by a different color. <br />
          </p>
        </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={`${API_URL}/getPlotImages/shap-images/all_class.png`} alt="Generated Plot" style={{ width: '600px', height: '600px' }} />
        </div>
        <h2 id="ft_imp_class" className="cenheading2">SHAP Value of One Class </h2>
        
        
        <form onSubmit={handleShapSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div >
            <label >
              Choose A Class: 
              <input type="text" className='whitebox' value={shapClass} onChange={(e) => setShapClass(e.target.value)} style={{ margin: '10px' }} />
            </label>
          </div>
          
          <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >Submit</button>
        
        </form>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="p-5 rounded-lg mb-4" style={{ backgroundColor: '#eeeeee', width: '60%'}}>
        <h2 style={{fontWeight: 'bold', fontSize: '18px'}}>Tips (for leftmost SHAP plot)</h2>
          <p >
          - Y-axis indicates the feature names in order of importance from top to bottom. <br />
          - X-axis represents the SHAP value, which indicates the degree of change in log odds. <br />
          - Each point represents a row of data from the original dataset. <br />
          - The color of each point on the graph represents the value of the corresponding feature, with red indicating high values and blue indicating low values. <br />
          - In conclusion, features with reder dots on the right side of vertical line (SHAP = 0) 
          indicates higher feature value tend to positively affect the output.
          </p>
        </div>
        </div>
        
        {imagePath && (
          <div>
            
            <div style={{ display: 'flex', flexDirection: 'row' , justifyContent: 'center', flexWrap: 'wrap'}}>
              
              <div className="image-container">
                <div style={{ border: '2px solid blue', display: 'inline-block' }}>
                  <img src={`${API_URL}/getPlotImages/shap-images/${imagePath}`} alt="Generated Plot" style={{ width: '500px', height: '500px' }}/>
                </div>
                <div style={{ border: '2px solid #38AC38', display: 'inline-block' , marginRight: '20px'}}>
                  <img src={`${API_URL}/getPlotImages/shap-images/${gBarImagePath}`} alt="Generated Plot" style={{ width: '500px', height: '500px' }}/>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}> 
                <div style={{ display: 'flex', flexDirection: 'row' }} >
                  <div style={{ border: '2px solid #38AC38', display: 'inline-block',  width: '200px', height: '180px', overflow: 'auto', marginRight: '20px'}}>
                    <h3 className='heading3'>Positive Effect:</h3>
                    
                    <ul>
                      {posX.map((value, index) => (
                        <li key={index}>{value}</li>
                      ))}
                    </ul>
                    
                  </div>
                  <div style={{ border: '2px solid #38AC38', display: 'inline-block' ,  width: '200px', height: '180px', overflow: 'auto' }}>
                    <h3 className='heading3'>Negative Effect:</h3>
                    <ul>
                    {negX.map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                    </ul>
                  </div>
                </div>
                  <div style={{ border: '2px solid #38AC38', display: 'inline-block' , marginTop: '20px'}}>
                    <img src={`${API_URL}/getPlotImages/shap-images/${gPieImagePath}`} alt="Generated Plot" style={{ width: '400px', height: '300px' }}/>
                  </div>
                {/* </div> */}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="p-5 rounded-lg mt-4 mb-4" style={{ backgroundColor: '#eeeeee', width: '60%'}}>
        <h2 style={{fontWeight: 'bold', fontSize: '18px'}}>Note</h2>
          <p >
          For users unfamiliar with SHAP, the leftmost figure may be challenging to intuitively grasp. <br /> 
        Therefore, we break down the information from that figure into the figures with gree border. <br /> 
        In this representation, the bar chart illustrates the impact magnitude of each feature on that specific class. <br />
        The text columns display features that have positive or negative effects on the target value. <br />
        The pie chart not only showcases the impact magnitude of each feature but also provides the percentage of 
        information covered by each feature, aiding in decision-making for predicting that class. <br />
          </p>
        </div>
        </div>
          </div>
        )}

        {/* 之後可能會做local shap的部分所以這段先留著 */}
        {/* <h1 id="local_shap">Local SHAP</h1>
        <h2 id="ft_imp">Feature Influence</h2>
        <p>
        shap value means the contribution to a class, the larger the absoulute value the larger the contribution.
positive value means positive effect and negative value means neagative effect ON a class.  
        </p>
        <h2 id="data">Data</h2> */}
        <h1 className="cenheading2">Dependent SHAP</h1>
        <form onSubmit={handleShapDepSubmit} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

          <div>
            <label>
              Choose Feature 1:
              <input type="text" className='whitebox' value={depClass1} onChange={(e) => setDepClass1(e.target.value) } style={{ margin: '10px' }} />
            </label>
          </div>
          <div>
            <label>
              Choose Feature 2:
              <input type="text" className='whitebox' value={depClass2} onChange={(e) => setDepClass2(e.target.value)} style={{ margin: '10px' }}/>
            </label>
          </div>
          <div>
            <label>
              Choose A Class:
              <input type="text" className='whitebox' value={depY} onChange={(e) => setDepY(e.target.value)} style={{ margin: '10px' }}/>
            </label>
          </div>
          
          <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >Submit</button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="p-5 rounded-lg mt-4 mb-1" style={{ backgroundColor: '#eeeeee', width: '60%'}}>
        <h2 style={{fontWeight: 'bold', fontSize: '18px'}}>Tips</h2>
          <p >
          - Each dot is a single prediction (row) from the dataset. <br />
          - The x-axis is the value of the feature. <br />
          - The y-axis is the SHAP value for that feature <br />
          - The color corresponds to a second feature that may have an interaction effect with the feature we are plotting. <br />
          - In conclusion, the plot show how SHAP value changes as the value of the two feature changes. <br /> 
          </p>
        </div>
        </div>
        {imagePathD1 && (
          <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="image-container">
            
              <img src={`${API_URL}/getPlotImages/shap-images/${imagePathD1}`} alt="Generated Plot" />
              <img src={`${API_URL}/getPlotImages/shap-images/${imagePathD2}`} alt="Generated Plot" />
            </div>
            </div>
          </div>
        )}
        
        <h1 id="cf_expl" className="heading1">Counterfactual Explanation</h1>
        
        {/*<div>ShapPage</div>*/}
        
        <div style={{ display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontFamily: 'Koulen' }}>Enter data value</h2>
          <div className="p-5 rounded-lg mb-4" style={{ border: '2px solid lightgrey', display: 'inline-block', height: '250px', width: '1400px', overflow: 'auto', marginRight: '20px'}}>
            <form onSubmit={handleInputXSubmit} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' }}>
            <div  style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '1px' }}>
                <label >
                  <span style={{ marginRight: '20px' }}>
                  Choose A Desired Class of {yLabel}:
                  </span>
                  <input type="text"  className='whitebox' value={desired_y} 
                  onChange={(e) => setDesired_y(e.target.value)} 
                  style={{ width: '20%' }}/>
                </label>
              </div>  
            {XLabels.map((label, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', width: '20%', padding: '1px' }}>
                  <label >{label}</label>
                  <input
                    type="text" className='whitebox'
                    value={inputX[index]}
                    onChange={(e) => handleInputXChange(index, e.target.value)}
                    style={{ width: '40%' }}
                  />
                </div>
              ))}
              
              
            </form>
            
          </div>
          <button type="submit" 
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          onClick={handleInputXSubmit}    
          >Submit</button>
        </div>
        {isDataAvailable && (
          <div className='wrap'  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'Koulen' }}>Results</h2>
            <DataTable data={data} keys={XLabels.concat(yLabel)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ShapPage;