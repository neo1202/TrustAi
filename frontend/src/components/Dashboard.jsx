import React from "react";
import { Modal, Button } from "antd";

const Dashboard = ({ visible, onCancel, imageUrls, iterCount, cumulatedNumData, currTrainAcc, currTestAcc }) => {
  const n = imageUrls.length
  const imagesInFirstRow = imageUrls.slice(0, n/2);
  const imagesInSecondRow = imageUrls.slice(n/2, n);

  return (
    <Modal
      title="Iteration Result"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Go to next iteration
        </Button>,
      ]}
      style={{ minWidth: "60%", maxWidth: "80%", minHeight: "60%", maxHeight: "80%" }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', margin: '10px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>Iteration: <span style={{ fontWeight: 'bold' }}>{iterCount}</span></div>
        <div style={{ flex: 1, textAlign: 'center' }}>Cumulated training data: <span style={{ fontWeight: 'bold' }}>{cumulatedNumData}</span></div>
        <div style={{ flex: 1, textAlign: 'center' }}>Train accuracy: <span style={{ fontWeight: 'bold', color: 'green' }}>{currTrainAcc}</span></div>
        {/* <div style={{ flex: 1, textAlign: 'center' }}>Test accuracy: <span style={{ fontWeight: 'bold', color: 'blue' }}>{currTestAcc}</span></div> */}
      </div>
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {imagesInFirstRow.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} style={{ width: `${80 / imagesInFirstRow.length}%` }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {imagesInSecondRow.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index + imagesInFirstRow.length}`} style={{ width: `${80 / imagesInSecondRow.length}%` }} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default Dashboard;
