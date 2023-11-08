import React, { useState } from "react";
import axios from 'axios';
import API_URL from "../api";
import Dropdown from "../components/Dropdown";
import Navbar from "../components/Navbar";
import "../layouts/ShapPage/ShapPage.css"; // Import the CSS file for styling

function ShapPage() {
  const [shapClass, setShapClass] = useState('');
  const [desired_y, setDesired_y] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [gBarImagePath, setGBarImagePath] = useState('');
  const [posX, setPosX] = useState([]);
  const [negX, setNegX] = useState([]);
  const [gPieImagePath, setGPieImagePath] = useState('');
  

  const XLabels = ['Area', 'Perimeter', 'MajorAxisLength', 'MinorAxisLength',
  'AspectRation', 'Eccentricity', 'ConvexArea', 'EquivDiameter',
  'Extent', 'Solidity', 'roundness', 'Compactness', 
  'ShapeFactor1','ShapeFactor2', 'ShapeFactor3', 'ShapeFactor4'];
  const [data, setData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false); //track cf data gerated or not
  
  const [inputX, setInputX] = useState(Array(XLabels.length).fill('0.5')); // Initialize with an empty value
  
  const [depClass1, setDepClass1] = useState('Area');
  const [depClass2, setDepClass2] = useState('MajorAxisLength');
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

  //
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

  
  return (
    <div style={pageStyle}>
      <Navbar />
      <div id="home" className="section">
        {/* Content for the Home section */}
      </div>
      <div id="shap-page" className="section">
        <>a component to be used in future i.e.現在沒用</>
        <Dropdown
          options={dropdownOptions}
          selection={dropdownSelection}
          onSelect={handleDropdownSelection}
        />
        <h1 id="global_shap" className="heading1">Global SHAP</h1>
        <img src={`${API_URL}/getShapPlotImage/all_class.png`} alt="Generated Plot" />
        
        <h2 id="ft_imp_class" className="heading2">Feature Influence on A Class </h2>
        <p2>
        shap value means the contribution to a class, the larger the absoulute value the larger the contribution.
positive value means positive effect and negative value means neagative effect ON a class.
          
        </p2>
        <form onSubmit={handleShapSubmit}>
          <div>
            <label >
              Choose A Class:
              <input type="text" className='whitebox' value={shapClass} onChange={(e) => setShapClass(e.target.value)} />
            </label>
          </div>
          
          <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >Submit</button>
        </form>
        {imagePath && (
          <div>
            <h2>Generated Plot:</h2>
            <div className="image-container">
              <img src={`${API_URL}/getShapPlotImage/${imagePath}`} alt="Generated Plot" />
              <img src={`${API_URL}/getShapPlotImage/${gBarImagePath}`} alt="Generated Plot" />

            </div>
            <div className="image-container">
              <h3 className='heading3'>Positive Effect:</h3>
              <ul>
              {posX.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
              </ul>
            
              <h3 className='heading3'>Negative Effect:</h3>
              <ul>
              {negX.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
              </ul>
              <img src={`${API_URL}/getShapPlotImage/${gPieImagePath}`} alt="Generated Plot" />
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
        <h1 className="heading1">Dependent SHAP</h1>
        <form onSubmit={handleShapDepSubmit}>
          <div>
            <label>
              Choose Feature 1:
              <input type="text" className='whitebox' value={depClass1} onChange={(e) => setDepClass1(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Choose Feature 2:
              <input type="text" className='whitebox' value={depClass2} onChange={(e) => setDepClass2(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Choose A Class:
              <input type="text" className='whitebox' value={depY} onChange={(e) => setDepY(e.target.value)} />
            </label>
          </div>
          
          <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >Submit</button>
        </form>
        {imagePathD1 && (
          <div>
            <h3 className='heading3'>Generated Plot:</h3>
            <div className="image-container">
              <img src={`${API_URL}/getShapPlotImage/${imagePathD1}`} alt="Generated Plot" />
              <img src={`${API_URL}/getShapPlotImage/${imagePathD2}`} alt="Generated Plot" />
            </div>
          </div>
        )}
        
        <h1 id="cf_expl" className="heading1">Counterfactual Explanation</h1>
        
        {/*<div>ShapPage</div>*/}
        <h3 className="heading3">
        Enter data by value 
        </h3>
        <form onSubmit={handleInputXSubmit}>
          {XLabels.map((label, index) => (
            <div key={index}>
              <label>{label}</label>
              <input
                type="text" className='whitebox'
                value={inputX[index]}
                onChange={(e) => handleInputXChange(index, e.target.value)}
              />
            </div>
          ))}
          <div>
            <label>
              Choose A Desired Class:
              <input type="text"  className='whitebox' value={desired_y} onChange={(e) => setDesired_y(e.target.value)} />
            </label>
          </div>
          <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >Submit</button>
        </form>
        {isDataAvailable && (
          <div className='wrap'>
            <h2>DataFrame Display</h2>
            <table >
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Perimeter</th>
                  <th>MajorAxisLength</th>
                  <th>MinorAxisLength</th>
                  <th>AspectRation</th>   {/* 5*/}
                  <th>Eccentricity</th>
                  <th>ConvexArea</th>
                  <th>EquivDiameter</th>
                  <th>Extent</th>
                  <th>Solidity</th> {/* 10*/}
                  <th>roundness</th>
                  <th>Compactness</th>
                  <th>ShapeFactor1</th>
                  <th>ShapeFactor2</th>
                  <th>ShapeFactor3</th> {/* 15*/}
                  <th>ShapeFactor4</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Area}</td>
                    <td>{item.Perimeter}</td>
                    <td>{item.MajorAxisLength}</td>
                    <td>{item.MinorAxisLength}</td>
                    <td>{item.AspectRation}</td>
                    <td>{item.Eccentricity}</td>
                    <td>{item.ConvexArea}</td>
                    <td>{item.EquivDiameter}</td>
                    <td>{item.Extent}</td>
                    <td>{item.Solidity}</td>
                    <td>{item.roundness}</td>
                    <td>{item.Compactness}</td>
                    <td>{item.ShapeFactor1}</td>
                    <td>{item.ShapeFactor2}</td>
                    <td>{item.ShapeFactor3}</td>
                    <td>{item.ShapeFactor4}</td>
                    <td>{item.Class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShapPage;