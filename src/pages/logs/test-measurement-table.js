import * as React from 'react';
import { useState } from 'react';
import CommonTable from '../../components/table/common-table';
import { getTestMeasurementRecords } from '../../services/logs.service';
import TableHeaderCell from '../../components/table/table-header-cell';
import TableBodyCell from '../../components/table/table-body-cell';
import { Grid, Paper, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import PendingDataPair from './components/pendig-data-pair';
import StatusIcon from './components/status-icon';
import UploadStateChip from './components/upload-state-chip';
import ReadMore from '../../components/read-more';
import { TestMeasurementStatusCode } from '../../constants/error-codes';

export default function TestMeasurementLogsTable() {

  const [isTestMeasurementLoading, setIsTestMeasurementLoading] = useState(false);

  const [refBoxPendingData, setRefBoxPendingData] = useState({
    measurement_records: 0,
    measurement_logs: 0,
  });

  const { t } = useTranslation();

  const renderHeader = (data) => {
    return (<>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.status')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.measurement_id')}</TableHeaderCell>
      <TableHeaderCell sx={{ minWidth: '10em' }}>{t('logs_page.measurement.table.date_time')}</TableHeaderCell>
      <TableHeaderCell sx={{ minWidth: '10em' }}>{t('logs_page.reference_box_logs.table.barcode')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.length')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.width')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.height')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.weight')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.expected_length')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.expected_width')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.expected_height')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.expected_weight')}</TableHeaderCell>
      <TableHeaderCell sx={{ minWidth: '20em', textAlign: 'left' }}>{t('logs_page.reference_box_logs.table.additional_info')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.reference_box_logs.table.upload_status')}</TableHeaderCell>
    </>)
  }

  const renderColumn = (data) => {
    return (
      <>
        <TableBodyCell><StatusIcon status={data['status']} /></TableBodyCell>
        <TableBodyCell>{data['measurement_id']}</TableBodyCell>
        <TableBodyCell sx={{ minWidth: '10em' }} >
          {data['scanned_time_local']}
        </TableBodyCell>
        <TableBodyCell sx={{ minWidth: '10em', wordBreak: 'break-all', textAlign: 'left' }} >
          <ReadMore size={10}>
            {data['sku'] ?? t('common.message.NA')}
          </ReadMore>
        </TableBodyCell>

        <TableBodyCell>{data['length'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['width'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['height'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['actual_weight'] ?? t('common.message.NA')}</TableBodyCell>

        <TableBodyCell>{data['expected_length'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['expected_width'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['expected_height'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['expected_weight'] ?? t('common.message.NA')}</TableBodyCell>

        <TableBodyCell sx={{ width: '25em', textAlign: 'left' }} >{t('logs_page.additional_info.test_measurement.' + TestMeasurementStatusCode[data['status_code']])}</TableBodyCell>
        <TableBodyCell>
          <UploadStateChip record_upload_state={data['record_upload_state']} />
        </TableBodyCell>
      </>
    )
  }

  const handleOnDataNeed = async (page, rowsPerPage) => {
    let result = { rows: [] }
    setIsTestMeasurementLoading(true);
    try {
      result = await getTestMeasurementRecords(page, rowsPerPage);
      setRefBoxPendingData(result.pending_count);
    } catch (error) { }
    setIsTestMeasurementLoading(false);
    return result;
  }

  return (

    <Grid container direction="row" alignItems="center" height={'100%'} width={'90vw'}>
      <Grid container item xs={12} alignItems="center" height={'15%'} paddingBottom={5}>
        <Paper variant='outlined' sx={{ width: '100%', height: '100%', padding: 4 }}>
          <Grid container item xs={12} rowSpacing={4} >
            <Grid item xs={6}>
              <PendingDataPair
                label={t('logs_page.reference_box_logs.pending.records')}
                value={refBoxPendingData?.measurement_records}
                autowidth
              />
            </Grid>
            {/* <Grid item xs={6}>
              <PendingDataPair
                label={t('logs_page.reference_box_logs.pending.logs')}
                value={refBoxPendingData.measurement_logs}
              />
            </Grid> */}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} alignItems="center">
        <Box sx={{ width: '90vw' }}>
          <CommonTable
            id="test-measurement-table"
            columnsLength={13}
            renderColumns={renderColumn}
            renderHeader={renderHeader}
            isAPIFetch={true}
            rowsPerPage={10}
            onDataNeed={handleOnDataNeed}
            isLoading={isTestMeasurementLoading}
            maxHeight={'63vh'}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
