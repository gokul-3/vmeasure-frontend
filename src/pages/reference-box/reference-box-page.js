import * as React from 'react';
import { useState, useEffect } from 'react';
import CommonTable from '../../components/table/common-table';
import { useTranslation } from 'react-i18next';
import { getMeasureCountAfterReferenceBox, getReferenceBoxList } from '../../services/reference-box.service';
import { Grid, Paper } from '@mui/material';
import TableHeaderCell from '../../components/table/table-header-cell';
import TableBodyCell from '../../components/table/table-body-cell';
import { PageTitle } from "../../components/custom-text-message/page-title";
import PendingDataPair from '../logs/components/pendig-data-pair';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

export default function MeasurementLogsTable() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isRefBoxDataLoading, setIsRefBoxDataLoading] = useState(false);
  const [referenceBoxes, setReferenceBoxes] = useState({ rows: [] });
  const [referenceBoxMeasureCountData, setReferenceBoxMeasureCountData] = useState({
    max_measurement_count: 0,
    current_measurement_count:0
  });
  const { workflow } = useSelector((state) => state.workflow);

  const renderHeader = () => {
    return (
      <>
        <TableHeaderCell>{t('reference_box_page.table.name')}</TableHeaderCell>
        <TableHeaderCell>{t('reference_box_page.table.barcode')}</TableHeaderCell>
        <TableHeaderCell>{t('reference_box_page.table.length')}</TableHeaderCell>
        <TableHeaderCell>{t('reference_box_page.table.width')}</TableHeaderCell>
        <TableHeaderCell>{t('reference_box_page.table.height')}</TableHeaderCell>
        <TableHeaderCell>{t('reference_box_page.table.actual_weight')}</TableHeaderCell>
        <TableHeaderCell>{t('reference_box_page.table.dimension_tolerance')}</TableHeaderCell>
        <TableHeaderCell>{t('reference_box_page.table.weight_tolerance')}</TableHeaderCell>
      </>
    )
  }

  const renderColumn = (data) => {
    return (
      <>
        <TableBodyCell sx={{ maxWidth: '15em', wordBreak: 'break-all' }}>{data['name']}</TableBodyCell>
        <TableBodyCell sx={{ maxWidth: '15em', wordBreak: 'break-all' }}>{data['barcode']}</TableBodyCell>
        <TableBodyCell>{data['length']}</TableBodyCell>
        <TableBodyCell>{data['width']}</TableBodyCell>
        <TableBodyCell>{data['height']}</TableBodyCell>
        <TableBodyCell>{data['weight']}</TableBodyCell>
        <TableBodyCell>{data['dimension_tolerence']}</TableBodyCell>
        <TableBodyCell>{data['weight_tolerence']}</TableBodyCell>
      </>
    )
  }


  useEffect(() => {
    if (!workflow?.measurement_check?.is_enabled) {
      navigate('/menu')
    }
    fetchReferenceBoxData().catch((err) => { })
  }, [workflow])

  const fetchReferenceBoxData = async () => {
    try {
      setIsRefBoxDataLoading(true);
      const result = await getReferenceBoxList();
      const measureCount = await getMeasureCountAfterReferenceBox();
      setReferenceBoxMeasureCountData(measureCount?.data)
      setReferenceBoxes(result.data)
      setIsRefBoxDataLoading(false);
    } catch (error) {
      setReferenceBoxMeasureCountData({
        max_measurement_count: 0,
        current_measurement_count:0
      });
      setIsRefBoxDataLoading(false);
      setReferenceBoxes({ rows: [] })
    }
  }

  return (
    <Grid container height={'100%'} display={'block'}>
      <Grid item xs={12} height={'8%'}>
        <PageTitle title={t('reference_box_page.title')} />
      </Grid>
      <Grid item xs={12} height={'92%'}>
        <Paper sx={{ width: '100%', height: '100%', padding: 4 }} variant='outlined'>
          <Paper variant='outlined' sx={{ width: '100%', height: '10%', padding: 2 }}>
            <Grid container item xs={12} height={'100%'}>
              <Grid item xs={6}>
                <PendingDataPair
                  label={t('reference_box_page.max_measurement_count')}
                  value={referenceBoxMeasureCountData?.max_measurement_count ?? 0}
                  autowidth
                />
              </Grid>
              <Grid item xs={6}>
                <PendingDataPair
                  label={t('reference_box_page.measure_count_after_reference_box')}
                  value={referenceBoxMeasureCountData?.current_measurement_count ?? 0}
                  autowidth
                />
              </Grid>
            </Grid>
          </Paper>
          <Grid container item xs={12} height={'90%'}>
            <CommonTable
              id="reference-box-table"
              data={referenceBoxes}
              isLoading={isRefBoxDataLoading}
              columnsLength={7}
              renderColumns={renderColumn}
              renderHeader={renderHeader}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid >
  );
}
