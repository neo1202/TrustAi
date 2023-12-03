import React, { useEffect } from "react";
import DataTable from "../../../components/DataTable";
import { useDQ } from "../../../hooks/useDQ";
import { blueTitleStyle, greenTitleStyle } from "../../../config/colors";
import Typography from "@mui/material/Typography";
import API_URL from "../../../api";

const ImputedDetailPage = () => {
  const {
    jsDivergence,
    covHeatmapBefore,
    covHeatmapAfter,
    pairPlot,
    getImputedDetails,
    missingRateTable,
    missingRateColumnName,
    entropyTable,
    entropyColumnName,
    jsDivergenceTable,
    jsDivergenceColumnName,
    basicInfoBeforeTable,
    basicInfoBeforeColumnName,
    basicInfoAfterTable,
    basicInfoAfterColumnName,
    vifBeforeTable,
    vifBeforeColumnName,
    vifAfterTable,
    vifAfterColumnName,
  } = useDQ();

  // useEffect(() => {
  //   getImputedDetails();
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-8">
        <Typography variant="h4" gutterBottom style={greenTitleStyle}>
          {`Stability: ${jsDivergence} / 10`}
        </Typography>
      </div>

      {/* Figures */}
      <div className="flex">
        <div className="mr-4">
          <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            Correlation Matrix Before
          </Typography>
          <img src={`${API_URL}/getPlotImages/edash/${covHeatmapBefore}`} alt="" />
        </div>
        <div className="mr-4">
          <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            Correlation Matrix After
          </Typography>
          <img src={`${API_URL}/getPlotImages/edash/${covHeatmapAfter}`} alt="" />
        </div>
        <div>
          <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            Pair Plot
          </Typography>
          <img src={`${API_URL}/getPlotImages/edash/${pairPlot}`} alt="" />
        </div>
      </div>

      <div className="flex">
        <div className="mr-4">
          <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            Missing Rate
          </Typography>
          <DataTable data={missingRateTable} keys={missingRateColumnName} />
        </div>

        <div className="mr-4">
          <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            VIF Before
          </Typography>
          <DataTable data={vifBeforeTable} keys={vifBeforeColumnName} />
        </div>

        <div>
          <Typography variant="h4" gutterBottom style={blueTitleStyle}>
            VIF After
          </Typography>
          <DataTable data={vifAfterTable} keys={vifAfterColumnName} />
        </div>
      </div>

      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom style={blueTitleStyle}>
        Entropy
      </Typography>
      <DataTable data={entropyTable} keys={entropyColumnName} />
      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom style={blueTitleStyle}>
        JS-Divergence
      </Typography>
      <DataTable data={jsDivergenceTable} keys={jsDivergenceColumnName} />
      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom style={blueTitleStyle}>
        Basic Info Before
      </Typography>
      <DataTable data={basicInfoBeforeTable} keys={basicInfoBeforeColumnName} />
      <div className="my-4"></div>

      <Typography variant="h4" gutterBottom style={blueTitleStyle}>
        Basic Info After
      </Typography>
      <DataTable data={basicInfoAfterTable} keys={basicInfoAfterColumnName} />
    </div>
  );
};

export default ImputedDetailPage;
