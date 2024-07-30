import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Paper, Stack, Typography, Box } from '@mui/material';
import CommonTable from '../../components/table/common-table';
import * as systemInfoService from '../../services/info.service'
import { useTranslation } from 'react-i18next';
import TableHeaderCell from '../../components/table/table-header-cell';
import TableBodyCell from '../../components/table/table-body-cell';
import { useSelector } from 'react-redux';
import { Certificates, NTEPSupportModesInInch, SetUpHeight } from '../../constants';

export default function DimensionSpecification() {

  const { t } = useTranslation();
  const { unit } = useSelector((state) => state.settings);
  const { metrological_setting } = useSelector((state) => state.settings.metrological);

  const validateCetrificateMode = (certificateList) => {
    //True - only if current certificate mode available in given certificate list 
    return certificateList.includes(metrological_setting)
  }

  const renderMeasurementRangeHeader = () => {
    return (
      <>
        <TableHeaderCell>{t("dims_spec_page.dims_measurement_table.dimensions", { unit: unit.dimension_unit })}</TableHeaderCell>
        <TableHeaderCell>{t("dims_spec_page.dims_measurement_table.minimum", { unit: unit.dimension_unit })}</TableHeaderCell>
        <TableHeaderCell>{t("dims_spec_page.dims_measurement_table.maximum", { unit: unit.dimension_unit })}</TableHeaderCell>
        <TableHeaderCell>{t("dims_spec_page.dims_measurement_table.minimum_irregular", { unit: unit.dimension_unit })}</TableHeaderCell>
        <TableHeaderCell>{t("dims_spec_page.dims_measurement_table.maximum_irregular", { unit: unit.dimension_unit })}</TableHeaderCell>
      </>
    )
  }

  const renderMeasurementRangeColumns = (data) => {

    const dimensionTranslation = data['dimension'] === 'length' ? t('dims_spec_page.dims_measurement_table.length') :
      data['dimension'] === 'width' ? t('dims_spec_page.dims_measurement_table.width')
        : t('dims_spec_page.dims_measurement_table.height')

    return (
      <>
        <TableBodyCell>{dimensionTranslation}</TableBodyCell>
        <TableBodyCell>{data['min_value']}</TableBodyCell>
        <TableBodyCell>{data['max_value']}</TableBodyCell>
        <TableBodyCell>{data['min_irregular_value']}</TableBodyCell>
        <TableBodyCell>{data['max_irregular_value']}</TableBodyCell>
      </>
    )
  }

  const renderRefDataHeader = () => {
    return (
      <>
        <TableHeaderCell>{t("dims_spec_page.measurement_rangle_table.height", { unit: unit.dimension_unit })}</TableHeaderCell>
        <TableHeaderCell>{t("dims_spec_page.measurement_rangle_table.max_length", { unit: unit.dimension_unit })}</TableHeaderCell>
        <TableHeaderCell>{t("dims_spec_page.measurement_rangle_table.max_width", { unit: unit.dimension_unit })}</TableHeaderCell>
      </>
    )
  }

  const renderRefDataColumns = (data) => {
    return (
      <>
        <TableBodyCell>{data['height']}</TableBodyCell>
        <TableBodyCell>{data['max_length']}</TableBodyCell>
        <TableBodyCell>{data['max_width']}</TableBodyCell>
      </>
    )
  }

  const [range, setRange] = useState({ rows: [], mode: null });

  const [refdata, setRefData] = useState({ rows: [] });

  useEffect(() => {
    loadTables()
  }, [])

  const loadTables = () => {
    systemInfoService.getMeasurementRange()
      .then((result) => {
        setRange(result.data);
      }).catch((err) => {

      });

    systemInfoService.getDimensionPyramidData()
      .then((result) => {
        setRefData(result.data);
      }).catch((err) => {

      });
  }

  useEffect(() => {
    loadTables()
  }, [unit])

  return (
    <Grid container columnSpacing={6} height={'100%'} rowSpacing={5}>
      <Grid container item xs={12}>
        <Stack>
          <Typography variant='body5' fontWeight={'bold'} padding={3} paddingBottom={0}>
            {t('dims_spec_page.title')}
          </Typography>
          {refdata?.setup_height &&
            <Typography variant='body5' fontWeight={'bold'} padding={3} paddingBottom={0} color={'#333'}>
              {
                validateCetrificateMode([Certificates.NTEP])
                  ? t("dims_spec_page.setup_height_ntep", { setup_height: NTEPSupportModesInInch[SetUpHeight.HT_1_5] })
                  : t("dims_spec_page.setup_height", { setup_height: refdata.setup_height })
              }
            </Typography>
          }
        </Stack>
      </Grid>
      <Grid container item xs={validateCetrificateMode([Certificates.NTEP]) ? 12 : 6}>
        <Paper variant='outlined' sx={{ padding: 5, width: '100%' }}>
          <Typography variant='body2' marginBottom={5}>
            {
              validateCetrificateMode([Certificates.NTEP])
                ? t('dims_spec_page.dims_measurement_table.ntep_title')
                : t('dims_spec_page.dims_measurement_table.title')
            }
          </Typography>
          <CommonTable
            id="measurementRange"
            columnsLength={5}
            data={range}
            isLoading={false}
            showBorder={false}
            renderColumns={renderMeasurementRangeColumns}
            renderHeader={renderMeasurementRangeHeader}
            maxHeight='50vh'
          />
        </Paper>
      </Grid>
      {
        !validateCetrificateMode([Certificates.NTEP]) &&
        <Grid container item xs={6}>
          <Paper variant='outlined' sx={{ padding: 5 }}>
            <Typography variant='body2' marginBottom={5}>
              {t('dims_spec_page.measurement_rangle_table.title')}
            </Typography>
            <CommonTable
              id="reference-table"
              columnsLength={3}
              data={refdata}
              isLoading={false}
              showBorder={false}
              renderColumns={renderRefDataColumns}
              renderHeader={renderRefDataHeader}
              maxHeight='50vh'
            />
          </Paper>
        </Grid>
      }

      {
        validateCetrificateMode([Certificates.NTEP]) &&
        <Box width={'100%'} height={'10vh'} margin={5} marginTop={15}>
          <Typography variant='body5' fontWeight={'bold'} padding={3} paddingBottom={0} color={'#333'}>
            {t('dims_spec_page.limitation_title')}
          </Typography>
          <Typography variant='body4' fontWeight={'bold'} padding={3} paddingBottom={0} color={'#333'}>
            {t('dims_spec_page.ntep_limitation')}
          </Typography>
        </Box>
      }
    </Grid>
  )
}
