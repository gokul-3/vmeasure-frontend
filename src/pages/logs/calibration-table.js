import * as React from 'react';
import { useState } from 'react';
import CommonTable from '../../components/table/common-table';
import { useTranslation } from 'react-i18next';
import { getCalibrationRecords } from '../../services/logs.service';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TableBodyCell from '../../components/table/table-body-cell';
import TableHeaderCell from '../../components/table/table-header-cell';
import PendingDataPair from './components/pendig-data-pair';
import StatusIcon from './components/status-icon';
import UploadStateChip from './components/upload-state-chip';
import { CalibrationStatusCode } from '../../constants/error-codes';

export default function CalibrationLogsTable() {

  const [isCalibrationDataLoading, setIsCalibrationDataLoading] = useState(false);

  const [calibrationPendingData, setCalibrationPendingData] = useState({
    calibration_records: 0,
    calibration_logs: 0,
  });

  const { t } = useTranslation();

  const renderHeader = (data) => {
    return (
      <>
        <TableHeaderCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>{t('logs_page.calibration.table.status')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.calibration.table.calibration_id')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.calibration.table.date_time')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.calibration.table.height')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.calibration.table.angle')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.calibration.table.mode')}</TableHeaderCell>
        <TableHeaderCell sx={{ width: '25em' }} >{t('logs_page.calibration.table.additional_info')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.calibration.table.upload_status')}</TableHeaderCell>
      </>
    )
  }

  const renderColumn = (data) => {
    return (
      <>
        <TableBodyCell sx={{ textAlign: 'center' }} ><StatusIcon status={data['status_code'] === 300} /></TableBodyCell>
        <TableBodyCell>{data['calibration_id']}</TableBodyCell>
        <TableBodyCell sx={{ minWidth: '12em', }}>{data['scanned_time_local']}</TableBodyCell>
        <TableBodyCell>{data['height']}</TableBodyCell>
        <TableBodyCell>{data['angle']}</TableBodyCell>
        <TableBodyCell>{data['mode']}</TableBodyCell>
        <TableBodyCell sx={{ width: '25em' }}>
          {t('logs_page.additional_info.calibration.' + CalibrationStatusCode[data['status_code']], { height: data['height'], angle: data['angle'] })}
        </TableBodyCell>
        <TableBodyCell>
          <UploadStateChip record_upload_state={data['record_upload_state']} />
        </TableBodyCell>
      </>
    )
  }

  const handleOnDataNeed = async (page, rowsPerPage) => {
    let result = { rows: [] };
    setIsCalibrationDataLoading(true);
    try {
      result = await getCalibrationRecords(page, rowsPerPage);
      setCalibrationPendingData(result.pending_count);
    } catch (error) { }
    setIsCalibrationDataLoading(false);
    return result;
  }


  return (
    <Grid container direction="row" alignItems="center" height={'100%'}>
      <Grid container item xs={12} alignItems="center" height={'15%'} paddingBottom={5}>
        <Paper variant='outlined' sx={{ width: '100%', height: '100%', padding: 4 }}>
          <Grid container item xs={12} rowSpacing={4} >
            <Grid item xs={4}>
              <PendingDataPair
                label={t('logs_page.calibration.pending.records')}
                value={calibrationPendingData?.calibration_records}
                autowidth
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} alignItems="center">
        <Box sx={{ width: '90vw' }}>
          <CommonTable
            id="calibration-table"
            columnsLength={7}
            isAPIFetch={true}
            rowsPerPage={10}
            onDataNeed={handleOnDataNeed}
            isLoading={isCalibrationDataLoading}
            renderColumns={renderColumn}
            renderHeader={renderHeader}
            maxHeight={'63vh'}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
