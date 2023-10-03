import React, { useState } from "react";
import Dropdown from "../components/Dropdown";
import Navbar from "../components/Navbar";
import "../layouts/ShapPage/ShapPage.css"; // Import the CSS file for styling

function ShapPage() {
  const [dropdownSelection, setDropdownSelection] = useState(null);
  const dropdownOptions = [
    { label: "One", value: "one" },
    { label: "Two", value: "two" },
    { label: "Test", value: "test" },
  ];
  const handleDropdownSelection = (optionSelected) => {
    setDropdownSelection(optionSelected);
  };
  const pageStyle = {
    backgroundColor: "#ffffff", // Set your desired background color here
    // Add any other styles you want
  };
  const [textInput, setTextInput] = useState(""); // State for the input value

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  
  return (
    <div style={pageStyle}>
      <Navbar />
      <div id="home" className="section">
        {/* Content for the Home section */}
      </div>
      <div id="shap-page" className="section">
        <h1 id="samples">Samples</h1> {/* Add an ID to the title "Samples" */}
        <p>
    
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          <br></br>
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          <br></br>
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          <br></br>
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          <br></br>
          This is a passage or additional content that you can include on
          your page. You can add text, images, or any other HTML elements as
          needed.
          
        </p>
        
        <h1 id="global_shap">Global SHAP</h1>
        <h2 id="ft_imp_class">Feature Influence on Each Class </h2>
        <p2>
        shap value means the contribution to a class, the larger the absoulute value the larger the contribution.
positive value means positive effect and negative value means neagative effect ON a class.
          
        </p2>
        <Dropdown
          options={dropdownOptions}
          selection={dropdownSelection}
          onSelect={handleDropdownSelection}
        />
        <h1 id="local_shap">Local SHAP</h1>
        <h2 id="ft_imp">Feature Influence</h2>
        <p>
        shap value means the contribution to a class, the larger the absoulute value the larger the contribution.
positive value means positive effect and negative value means neagative effect ON a class.
          
        </p>
        <h2 id="data">Data</h2>
        <h2 id="cf_expl">Counterfactual Explanation</h2>
        
        <h1 id="cf_expl">Counterfactual Explanation</h1>
        
        {/*<div>ShapPage</div>*/}
        <h4>
        Enter data by value or index in the dataset
        </h4>
        {/* Input box */}
        <input
          type="text"
          id="ft1"
          placeholder="Enter value here"
          value={textInput}
          onChange={handleTextInputChange}
        />
        <input
          type="text"
          id="ft2"
          placeholder="Enter value here"
          value={textInput}
          onChange={handleTextInputChange}
        />
        <input
          type="text"
          id="ft3"
          placeholder="Enter value here"
          value={textInput}
          onChange={handleTextInputChange}
        />
        <input
          type="text"
          id="ft4"
          placeholder="Enter value here"
          value={textInput}
          onChange={handleTextInputChange}
        />
        <input
          type="text"
          id="ft5"
          placeholder="Enter value here"
          value={textInput}
          onChange={handleTextInputChange}
        />
        <button>提交</button>
        <Dropdown
          options={dropdownOptions}
          selection={dropdownSelection}
          onSelect={handleDropdownSelection}
        />
        
      </div>
    </div>
  );
}

export default ShapPage;
