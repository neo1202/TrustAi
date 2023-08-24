import { useState } from "react";
import Table from "./Table";
import { BsChevronExpand, BsChevronDown, BsChevronUp } from "react-icons/bs";
//得到一串props並且傳給table
function SortableTable(props) {
  const [sortOrder, setSortOrder] = useState(null);
  const { data, config } = props;
  const handleClick = () => {
    //無順序->遞增->遞減->無順序循環
    console.log("進入了handleClick");
    if (sortOrder === null) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder(null);
    }
  };

  const updatedConfig = config.map((column) => {
    if (!column.sortValue) {
      return column;
    }
    return {
      ...column,
      header: () => (
        <th className="cursor-pointer hover:bg-gray-100" onClick={handleClick}>
          <div className="flex items-center">
            {getIcons(sortOrder)}
            {column.columnName}
          </div>
        </th>
      ),
    };
  });
  let sortedData = data; //先做一份副本，因為data是prop傳遞時最好不要直接動到
  if (sortOrder) {
    const { sortValue } = config.find(
      (column) => column.columnName === "score"
    );
    console.log("sortOrder:", sortOrder);
    console.log(sortValue);
    console.log("找到sort使用score了(sortableTable)");
    sortedData = [...data].sort((a, b) => {
      const valueA = sortValue(a);
      const valueB = sortValue(b);
      const reverseOrder = sortOrder === "asc" ? 1 : -1;
      return (valueA - valueB) * reverseOrder;
    });
  }

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
