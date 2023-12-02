import React, { useEffect } from "react";
import DataTable from "../../../components/DataTable";
import { useDQ } from "../../../hooks/useDQ";
import Typography from "@mui/material/Typography";

const ImputedDetailPage = () => {
  const {
    jsDivergence,
    missingRateTable, missingRateColumnName,
    entropyTable, entropyColumnName,
    jsDivergenceTable, jsDivergenceColumnName,
    basicInfoBeforeTable, basicInfoBeforeColumnName,
    basicInfoAfterTable, basicInfoAfterColumnName,
    vifBeforeTable, vifBeforeColumnName,
    vifAfterTable, vifAfterColumnName,
    getImputedDetails,
  } = useDQ();

  // useEffect(() => {
  //   getImputedDetails();
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-8">
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontWeight: "bold",
            color: "#007BFF", 
            backgroundColor: "#cce5ff", 
            borderRadius: "8px", 
            padding: "8px", 
          }}
        >
          {`JS Divergence: ${jsDivergence}`}
        </Typography>
      </div>

      <div className="flex">
        <div className="mr-4">
          <Typography variant="h4" gutterBottom>
            Missing Rate
          </Typography>
          <DataTable data={missingRateTable} keys={missingRateColumnName} />
        </div>

        <div className="mr-4">
          <Typography variant="h4" gutterBottom>
            VIF Before
          </Typography>
          <DataTable data={vifBeforeTable} keys={vifBeforeColumnName} />
        </div>

        <div>
          <Typography variant="h4" gutterBottom>
            VIF After
          </Typography>
          <DataTable data={vifAfterTable} keys={vifAfterColumnName} />
        </div>
      </div>

      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom>
        Entropy
      </Typography>
      <DataTable data={entropyTable} keys={entropyColumnName} />
      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom>
        JS-Divergence
      </Typography>
      <DataTable data={jsDivergenceTable} keys={jsDivergenceColumnName} />
      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom>
        Basic Info Before
      </Typography>
      <DataTable
        data={basicInfoBeforeTable}
        keys={basicInfoBeforeColumnName}
      />
      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom>
        Basic Info After
      </Typography>
      <DataTable data={basicInfoAfterTable} keys={basicInfoAfterColumnName} />
    </div>
  );
};

export default ImputedDetailPage;
