import { Fragment } from "react";
function Table({ data, config, keyFn }) {
  const renderedHeaders = config.map((oneColumn) => {
    if (oneColumn.header) {
      console.log(oneColumn.header);
      return (
        <Fragment key={oneColumn.columnName}>{oneColumn.header()}</Fragment>
      );
    }
    return <th key={oneColumn.columnName}>{oneColumn.columnName}</th>;
  });
  const renderedRows = data.map((oneInstanceData) => {
    const renderedCells = config.map((column) => {
      return (
        <td className="p-2" key={column.columnName}>
          {column.render(oneInstanceData)}
        </td>
      );
    });
    return (
      <tr className="border-b" key={keyFn(oneInstanceData)}>
        {renderedCells}
      </tr>
    );
  });
  return (
    <table className="tabel-auto border-spacing-2">
      <thead>
        <tr className="border-b-2">{renderedHeaders}</tr>
      </thead>
      <tbody>{renderedRows}</tbody>
    </table>
  );
}

export default Table;
