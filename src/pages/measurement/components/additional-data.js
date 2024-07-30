import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
  Chip
} from "@mui/material";
import Icons from '../../../components/ultima-icons'
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { getFormattedDims, getFormattedWeight } from "../../../utils/unit-conversion";
import { DimensionUnit } from "../../../constants";

export default function AdditionalResultData({ }) {

  const { t } = useTranslation();
  const { workflow } = useSelector((state) => state.workflow);
  const { measurement_result } = useSelector((state) => state.appState);
  const { unit } = useSelector((state) => state.settings);
  const theme = useTheme();
  const [data, setData] = useState(null);

  useEffect(() => {

    let field = workflow?.ui_config?.additional_result?.field

    if (!workflow?.ui_config?.additional_result?.is_enabled) {
      field = 'volumetric_weight'
    }

    if (field === 'volumetric_weight') {
      setData({
        Icon: <Icons.VolumetricWeightWhiteIcon />,
        title: 'measurement_page.measurement_data.volumetric_weight',
        data: getFormattedWeight(measurement_result?.data?.measurement?.volumetric_weight || 0, unit.weight_unit),
        unit: unit.weight_unit
      });
    } else if (field === 'cubic_volume') {
      setData({
        Icon: <Icons.CubicVolumeWhiteIcon />,
        title: 'measurement_page.measurement_data.cubic_volume',
        data: [{
          weight: `${getFormattedDims(measurement_result?.data?.measurement?.cubic_volume, unit.dimension_unit, 2)}`,
          unit: unit.dimension_unit
        }],
        is_cubic_unit: true
      });
    } else if (field === 'real_volume') {
      setData({
        Icon: <Icons.RealVolumeWhiteIcon />,
        title: 'measurement_page.measurement_data.real_volume',
        data: [{
          weight: `${getFormattedDims(measurement_result?.data?.measurement?.real_volume, unit.dimension_unit, 2)}`,
          unit: unit.dimension_unit,
        }],
        is_cubic_unit: true
      });
    }
  }, [measurement_result, unit]);

  return (
    <>{
      data &&
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          opacity: workflow?.ui_config?.additional_result?.is_enabled ? 1 : 0.7
        }}>
        <Box sx={{ width: '35%', display: 'flex', justifyContent: 'center', textAlign: 'center', height: '100%', }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: '70%',
              height: '70%',
              margin: 'auto',
              padding: 4
            }}
          >
            {data.Icon}
          </Avatar>
        </Box>
        <Box sx={{ width: '60%', textAlign: 'center' }}>
          <Stack alignItems="center">
            <div style={{ width: '100%', display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="body6" sx={{whiteSpace:'nowrap'}}>
                {t(data.title)}
              </Typography>
                
              {
              data.title === "measurement_page.measurement_data.real_volume" &&
              <Chip
                  style={{
                  marginLeft: "0.5vw",
                  borderRadius: "5px",
                  fontSize: "1.1vw",
                  fontWeight: "700",
                  }}
                  label="BETA"
                  color="primary"
              />
              }
            </div>
            <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignContent: 'center', alignItems: 'baseline', justifyContent: 'center' }}>
              {
                data.data.map((weightData) => {
                  return <div key={weightData.unit} style={{ display: 'flex', alignItems: 'baseline', }}>
                    <Typography variant="body2" fontSize={'5em'} fontWeight={'bold'}>
                      {weightData.weight}
                    </Typography>
                    <Typography variant="body2" fontSize={'3em'} fontWeight={'bold'} marginX={3} whiteSpace={'nowrap'} >
                      {weightData.unit} {data.is_cubic_unit && <sup>3</sup>}
                    </Typography>
                  </div>
                })
              }
            </div>

          </Stack>
        </Box>
      </Paper>
    }
    </>
  )
}

