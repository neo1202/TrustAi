import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { usePage } from "../hooks/usePage";
import API_URL from "../api";

function HomePage() {
      
  const [selectedFile, setSelectedFile] = useState(null);
  const { currentPage, setCurrentPage } = usePage();

  const navigate = useNavigate();

  const handleTrainingButtonClick = async () => {
    // clear the previous process, i.e., the process id is always 1
    const response = await fetch(
        `${API_URL}/clearProcess/`, 
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            // body: formData
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
            // body: formData
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
            // body: formData
        })

    const data3 = await response3.json()
    console.log(data3)

    setCurrentPage("training");

    navigate("/training");
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
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            body: formData
        })

    const data = await response.json()
    console.log(data.msg)
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
