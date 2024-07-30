import * as React from 'react';
import { useState } from 'react';
import CommonTable from '../../components/table/common-table';
import { getBarcodeValidationLogs } from '../../services/logs.service';
import TableHeaderCell from '../../components/table/table-header-cell';
import TableBodyCell from '../../components/table/table-body-cell';
import { Grid, Paper, Box } from '@mui/material';
import ReadMore from '../../components/read-more';
import { useTranslation } from 'react-i18next';

import PendingDataPair from './components/pendig-data-pair';
import StatusIcon from './components/status-icon';
import UploadStateChip from './components/upload-state-chip';

export default function BarcodeValidationLogsTable() {

  const [isBarcodeValidationDataLoading, setIsBarcodeValidationDataLoading] = useState(false);

  const { t } = useTranslation();

  const [logsPendingData, setLogsPendingData] = useState({
    barcode_logs: 0,
  });

  const renderHeader = () => {
    return (
      <>
        <TableHeaderCell>{t('logs_page.barcode_validation_logs.table.status')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.barcode_validation_logs.table.date_time')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.barcode_validation_logs.table.barcode')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.barcode_validation_logs.table.api_response_code')}</TableHeaderCell>
        <TableHeaderCell sx={{ width: '25em', textAlign: 'left' }}>{t('logs_page.barcode_validation_logs.table.api_response')}</TableHeaderCell>
        <TableHeaderCell>{t('logs_page.barcode_validation_logs.table.upload_status')}</TableHeaderCell>
      </>
    )
  }

  const renderColumn = (data) => {
    return (
      <>
        <TableBodyCell><StatusIcon status={data['api_validation_status']} /></TableBodyCell>
        <TableBodyCell>{data['api_request_at']}</TableBodyCell>
        <TableBodyCell>
          <ReadMore size={10}>
            {data['barcode'] ?? t('common.message.NA')}
          </ReadMore>
        </TableBodyCell>
        <TableBodyCell>{data['api_response_code']}</TableBodyCell>
        <TableBodyCell sx={{ width: '25em', textAlign: 'left !important' }}>
          <ReadMore size={50}>
            {data['api_response']}
          </ReadMore>
        </TableBodyCell>
        <TableBodyCell>
          <UploadStateChip record_upload_state={data['record_upload_state']} />
        </TableBodyCell>
      </>
    )
  }

  const handleOnDataNeed = async (page, rowsPerPage) => {
    let result = { rows: [] }
    setIsBarcodeValidationDataLoading(true);
    try {
      result = await getBarcodeValidationLogs(page, rowsPerPage);
      setLogsPendingData(result.pending_count)
    } catch (error) { }
    setIsBarcodeValidationDataLoading(false);
    return result;
  }

  return (

    <Grid container direction="row" alignItems="center" height={'100%'} width={'90vw'}>
      <Grid container item xs={12} alignItems="center" height={'15%'} paddingBottom={5}>
        <Paper variant='outlined' sx={{ width: '100%', height: '100%', padding: 4 }}>
          <Grid container item xs={12} rowSpacing={4} >
            <Grid item xs={12}>
              <PendingDataPair
                label={t('logs_page.barcode_validation_logs.pending.records')}
                value={logsPendingData?.barcode_logs}
                autowidth
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} alignItems="center" >
        <Box sx={{ width: '90vw' }}>
          <CommonTable
            id="barcodevalidation-table"
            columnsLength={5}
            isAPIFetch={true}
            rowsPerPage={10}
            onDataNeed={handleOnDataNeed}
            isLoading={isBarcodeValidationDataLoading}
            renderHeader={renderHeader}
            renderColumns={renderColumn}
            maxHeight={'63vh'}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
