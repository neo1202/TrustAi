import React, { useState } from 'react';
import { Button, Table } from 'antd';


const DataTable = ({ data, keys }) => {

  const headCells = keys.map((key, i) => {
    return { title: key, dataIndex: key }
  })

  const dataSource = data.map((d, i) => {
    const dict = {}
    dict['id'] = i + 1
    keys.forEach((col, i) => {
      dict[col] = d[col]
    })
    return dict
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        {/* <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button> */}
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={headCells} dataSource={dataSource} />
    </div>
  );
};
export default DataTable;