import { useState } from "react";
function useSort(data, config) {
  const [sortOrder, setSortOrder] = useState(null);

  const setNewSortOrder = () => {
    //無順序->遞增->遞減->無順序循環
    // console.log("進入了handleClick");
    if (sortOrder === null) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder(null);
    }
  };
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
  return { sortOrder, sortedData, setNewSortOrder };
}

export default useSort;
