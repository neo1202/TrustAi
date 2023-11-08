import React, { useState } from 'react';
import { Select, Button } from 'antd';

const { Option } = Select;

const QueryTheOracle = ({ queryIds, setQueryResults }) => {
  const [selections, setSelections] = useState({});

  const handleSelectionChange = (qid, value) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [qid]: value,
    }));
  };

  const handleSubmit = () => {
    const results = Object.entries(selections).map(([qid, selection]) => ({
      [qid]: selection,
    }));
    setQueryResults(results);
  };

  return (
    <div>
      {queryIds.map((qid, i) => {
        return (
          <div key={qid}>
            {qid}
            <Select
              style={{ width: 200 }}
              value={selections[qid]? selections[qid] : "Select an option"}
              onChange={(value) => handleSelectionChange(qid, value)}
            >
              <Option value="1">Class 1</Option>
              <Option value="2">Class 2</Option>
              <Option value="3">Class 3</Option>
              <Option value="4">Class 4</Option>
              <Option value="5">Class 5</Option>
              <Option value="6">Class 6</Option>
              <Option value="7">Class 7</Option>
            </Select>
          </div>
        );
      })}
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default QueryTheOracle;
