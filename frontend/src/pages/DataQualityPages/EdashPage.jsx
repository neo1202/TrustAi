import React from "react";
import { Row, Col } from "antd";
import { Table, Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EdashPage = () => {
  // Sample data for tables
  const tableData = [
    { key: '1', name: 'Statistic 1', value: 100 },
    { key: '2', name: 'Statistic 2', value: 150 },
    // Add more data as needed
  ];

  // Sample data for graphs
  const graphData = [
    { name: 'Jan', value: 200 },
    { name: 'Feb', value: 300 },
    // Add more data as needed
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <div>
      <h1>EDA(edash return) Page</h1>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Statistical Tables">
            <Table columns={columns} dataSource={tableData} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Statistical Graphs">
            <ResponsiveContainer width="100%" height={300} autoHideDuration={1000}>
              <LineChart
                data={graphData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EdashPage;
