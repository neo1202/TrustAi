import React from "react";
import DataTable from "../../../components/DataTable"

const data = [
    { "C1":"V11", "C2":"V12", "C3":"V13", },
    { "C1":"V21", "C2":"V22", "C3":"V23", },
    { "C1":"V31", "C2":"V32", "C3":"V33", },
]

const keys = ["C1", "C2", "C3"]

const DataframePage = () => {
  return (
    <div>
      <h1>Dataframe Page</h1>
      <DataTable data={data} keys={keys}/>
    </div>
  )
}

export default DataframePage;
