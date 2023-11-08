import React, { useState, useEffect } from 'react';
import { Button, Table, Checkbox, Dropdown, Menu } from 'antd';

const DataTable = ({ data, keys }) => {
  const [selectedColumns, setSelectedColumns] = useState(keys);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedColumns(keys); // Set selectedColumns to all keys when the component mounts
  }, [keys]);

  const handleColumnChange = (checkedValues) => {
    setSelectedColumns(checkedValues);
  };

  const headCells = keys.map((key) => ({
    title: key,
    dataIndex: key,
  }));

  const dataSource = data.map((d, i) => {
    const dict = { id: i + 1 };
    keys.forEach((col) => {
      dict[col] = d[col];
    });
    return dict;
  });

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const hasSelectedColumns = selectedColumns.length > 0;

  const menu = (
    <Menu>
      <Menu.Item key="column-selection">
        <Checkbox.Group
          options={keys}
          value={selectedColumns}
          onChange={handleColumnChange}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      {/* <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={start} loading={loading}>
          Reload
        </Button>
      </div> */}
      <div>
        <Dropdown overlay={menu} placement="bottomLeft">
          <Button>Column Selection</Button>
        </Dropdown>
      </div>
      <Table
        rowSelection={null} // Remove the leftmost column of checkboxes
        columns={headCells.filter((column) => selectedColumns.includes(column.dataIndex))}
        dataSource={dataSource}
      />
    </div>
  );
};

export default DataTable;
