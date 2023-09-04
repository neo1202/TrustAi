import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const handleTrainingButtonClick = () => {
    navigate("/training");
  };
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <>
      <div>It's HomePage</div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload File</button>
      <button onClick={handleTrainingButtonClick}>Go to Training</button>
    </>
  );
}
export default HomePage;
