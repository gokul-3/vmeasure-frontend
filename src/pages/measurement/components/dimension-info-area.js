import React from "react";
import {
  Box,
  useTheme,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';
import Icons from '../../../components/ultima-icons'
import { DimensionUnit } from "../../../constants";

function DimensionInfoArea({ }) {

  const { t } = useTranslation();
  const theme = useTheme();

  const { measurement_result } = useSelector((state) => state.appState);
  const { unit } = useSelector((state) => state.settings);

  const rows = [{
    Icon: <Icons.BoxLengthWhiteIcon />,
    key: 'measurement_page.measurement_data.length',
    value: `${unit?.dimension_unit === DimensionUnit.MM ? 
      (measurement_result?.data?.measurement?.length ?? 0) : 
      (measurement_result?.data?.measurement?.length ?? 0).toFixed(1)}`
  }, {
    Icon: <Icons.BoxWidthWhiteIcon />,
    key: 'measurement_page.measurement_data.width',
    value: `${unit?.dimension_unit === DimensionUnit.MM ? 
      (measurement_result?.data?.measurement?.width ?? 0) : 
      (measurement_result?.data?.measurement?.width ?? 0).toFixed(1)}`
  }, {
    Icon: <Icons.BoxHeightWhiteIcon />,
    key: 'measurement_page.measurement_data.height',
    value: `${unit?.dimension_unit === DimensionUnit.MM ? 
      (measurement_result?.data?.measurement?.height ?? 0) : 
      (measurement_result?.data?.measurement?.height ?? 0).toFixed(1)}`
  }]

  return (
    <>
      <Paper variant="outlined" sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", borderRadius: 2 }}>

        {
          rows.map((row) =>
            <Box key={row.key} display="flex" width="100%" paddingX={7} justifyContent="space-evenly" alignItems="center">
              <div style={{ width: '45%', display: 'flex', alignItems: 'center', columnGap: 30 }}>
                <Avatar
                  sx={{ bgcolor: theme.palette.primary.main, width: '5em', height: '5em', padding: 2 }}
                >
                  {row.Icon}
                </Avatar>
                <Typography variant="body6">
                  {t(row.key)}
                </Typography>
              </div>
              <div style={{ width: '55%', textAlign: 'right', display: 'flex', alignContent: 'center', alignItems: 'baseline', justifyContent: 'right' }}>
                <Typography variant="body2" fontSize={'6em'} fontWeight={'bold'}>
                  {row.value}
                </Typography>
                <Typography variant="body2" fontSize={'3em'} fontWeight={'bold'} marginLeft={2}>
                  {unit.dimension_unit}
                </Typography>
              </div>
            </Box>
          )
        }
      </Paper>
    </>
  )
}

export default DimensionInfoArea;
