import React from "react";
import { Modal, Button } from "antd";
import Typography from "@mui/material/Typography";
import DataTable from "./DataTable";

const Edashboard = ({ open, onCancel, title, dfUrls, dfKeys, figUrls }) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
      style={{ minWidth: "60%", maxWidth: "80%", minHeight: "60%", maxHeight: "80%" }}
    >
    <br />
    <div style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {dfUrls.map((dfUrl, index) => (
          <div style={{ maxWidth: '100%' }}>
            <Typography variant="h6" gutterBottom>
                {dfUrl.name}
            </Typography>
            <DataTable key={index} data={dfUrl.item} keys={dfKeys} />
            <br />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly", flexDirection: title === "Label Class Ratio"? "row":"column"  }}>
        {figUrls.map((figUrl, index) => (
          <div>
            <Typography variant="h6" gutterBottom>
                {figUrl.name}
            </Typography>
            <img key={index} src={figUrl.item} alt={`Image ${index + dfUrls.length}`}  /> { /* style={{ width: `${80 / figUrls.length}%` }} */}
            <br />
          </div>
        ))}
      </div>
    </div>
    </Modal>
  )
}

export default Edashboard;
