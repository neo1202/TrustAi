import React, { useState } from "react";
//import Table from "../../components/Table";
import SortableTable from "../../components/SortableTable";

function UserTypeLabelPage() {
  const data = [
    { id: 3, width: 300, color: "bg-red-500", score: 4, label: "橘子" },
    { id: 4, width: 2500, color: "bg-green-500", score: 0.2, label: "檸檬" },
  ];
  const tableConfig = [
    {
      columnName: "instance_id",
      render: (oneInstanceData) => oneInstanceData.id,
    },
    {
      columnName: "width",
      render: (oneInstanceData) => oneInstanceData.width,
    },
    {
      columnName: "color",
      render: (oneInstanceData) => (
        <div className={`p-3 m-2 ${oneInstanceData.color}`} />
      ),
    },
    {
      columnName: "score",
      render: (oneInstanceData) => oneInstanceData.score,
      sortValue: (oneInstanceData) => oneInstanceData.score,
    },
    {
      columnName: "label",
      render: (oneInstanceData) => oneInstanceData.label,
    },
  ];
  const keyFn = (oneInstanceData) => {
    return oneInstanceData.id;
  };
  return (
    <div className="relative">
      <div>UserTypeLabelPage</div>
      <SortableTable data={data} config={tableConfig} keyFn={keyFn} />
    </div>
  );
}

export default UserTypeLabelPage;
