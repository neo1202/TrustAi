import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import API_URL from "../api";

function HomePage() {
      
  const [selectedFile, setSelectedFile] = useState(null);

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


    navigate("/training");
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(
        `${API_URL}/upload/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': "multipart/form-data",
            },
            body: formData
        })

    console.log(response)



    // try {
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_API_URL}/upload`,
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   console.log("File uploaded successfully:", response.data);
    // } catch (error) {
    //   console.error("Error uploading file:", error);
    // }
  };

  const testUpload = async() => {
    console.log("test upload")
    const note = {'title':'t1', 'body':'b1'}

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/`, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
    
    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      <div>It's HomePage</div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={testUpload}>TEST UPLOAD FOR API ACCESS</button>
      <button onClick={uploadFile}>Upload File</button>
      <button onClick={handleTrainingButtonClick}>Go to Training</button>
    </>
  );
}
export default HomePage;
