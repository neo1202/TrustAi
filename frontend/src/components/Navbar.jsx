import React from "react";
import "../layouts/Navbar/Navbar.css"; // Import a CSS file for styling

function Navbar() {
    const scrollToHome = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    // const scrollToSamples = () => {
    //     const samplesElement = document.getElementById("samples"); // Replace with the actual ID of your ShapPage section
    //     if (samplesElement) {
    //         samplesElement.scrollIntoView({ behavior: "smooth" });
    //     }
    // };
    const scrollToGlobalShap = () => {
        const globalShapElement = document.getElementById("global_shap"); // Replace with the actual ID of your ShapPage section
        if (globalShapElement) {
            globalShapElement.scrollIntoView({ behavior: "smooth" });
        }
    };
    // const scrollToLocalShap = () => {
    //     const localShapElement = document.getElementById("local_shap"); // Replace with the actual ID of your ShapPage section
    //     if (localShapElement) {
    //         localShapElement.scrollIntoView({ behavior: "smooth" });
    //     }
    // };
    const scrollToCF = () => {
        const cfElement = document.getElementById("cf_expl"); // Replace with the actual ID of your ShapPage section
        if (cfElement) {
            cfElement.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
      <nav className="sticky-navbar">
        <ul>
          <li>
            <button className="nav-link" onClick={scrollToHome}>Home</button>
          </li>
          {/* <li>
            <button className="nav-link" onClick={scrollToSamples}>Samples</button>
          </li> */}
          <li>
            <button className="nav-link" onClick={scrollToGlobalShap}>Global Shap</button>
          </li>
          {/* <li>
            <button className="nav-link" onClick={scrollToLocalShap}>Local Shap</button>
          </li> */}
          <li>
            <button className="nav-link" onClick={scrollToCF}>Counterfactual Explanation</button>
          </li>
        </ul>
      </nav>
    );
  }
  
  export default Navbar;