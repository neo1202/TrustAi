import React, { useState, useEffect } from 'react';
import { Button, Table, Checkbox, Dropdown, Menu } from 'antd';

const DataTable = ({ data, keys }) => {
    const [selectedColumns, setSelectedColumns] = useState(keys);
  
    useEffect(() => {
      setSelectedColumns(keys);
    }, [keys]);
  
    const handleColumnChange = (checkedValues) => {
      setSelectedColumns(checkedValues);
    };
  
    const headCells = keys.map((key) => ({
      title: key,
      dataIndex: key,
      align: 'center', // Center the text in the head cells
    }));
  
    const dataSource = data.map((d, i) => {
      const dict = { id: i + 1 };
      keys.forEach((col) => {
        dict[col] = d[col];
      });
      return dict;
    });
  
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
      <div style={{ maxWidth: '90%' }}>
        <div>
          <Dropdown overlay={menu} placement="bottomLeft">
            <Button>Column Selection</Button>
          </Dropdown>
        </div>
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
          <Table
            rowSelection={null}
            columns={headCells.filter((column) => selectedColumns.includes(column.dataIndex))}
            dataSource={dataSource}
            scroll={{ x: true }}
          />
        </div>
      </div>
    );
  };
  
  export default DataTable;
  