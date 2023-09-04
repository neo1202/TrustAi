import { useState } from "react";
import Table from "./Table";
import { BsChevronExpand, BsChevronDown, BsChevronUp } from "react-icons/bs";
import useSort from "../hooks/use-sort";
//得到一串props並且傳給table
function SortableTable(props) {
  const { data, config } = props;
  const { sortOrder, sortedData, setNewSortOrder } = useSort(data, config);

  const updatedConfig = config.map((column) => {
    if (!column.sortValue) {
      return column;
    }
    return {
      ...column,
      header: () => (
        <th
          className="cursor-pointer hover:bg-gray-100"
          onClick={setNewSortOrder}
        >
          <div className="flex items-center">
            {getIcons(sortOrder)}
            {column.columnName}
          </div>
        </th>
      ),
    };
  });

  return (
    <>
      <div>SortableTable</div>
      <Table {...props} data={sortedData} config={updatedConfig} />
    </>
  );
}
function getIcons(sortOrder) {
  if (sortOrder === null) {
    return (
      <div>
        <BsChevronExpand />
      </div>
    );
  } else if (sortOrder === "asc") {
    return (
      <div>
        <BsChevronUp />
      </div>
    );
  } else if (sortOrder === "desc") {
    return (
      <div>
        <BsChevronDown />
      </div>
    );
  }
}

export default SortableTable;
