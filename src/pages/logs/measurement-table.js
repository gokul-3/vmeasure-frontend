import { useState, useRef } from 'react';
import CommonTable from '../../components/table/common-table';
import { useTranslation } from 'react-i18next';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { getAnnotationImage, getMeasurementRecords } from '../../services/logs.service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Paper } from '@mui/material';
import { ImagePopupViewer } from '../../components/image-viewer/image-popup';
import TableHeaderCell from '../../components/table/table-header-cell';
import TableBodyCell from '../../components/table/table-body-cell';
import { useSelector } from 'react-redux';

import PendingDataPair from './components/pendig-data-pair';
import StatusIcon from './components/status-icon';
import UploadStateChip from './components/upload-state-chip';
import ReadMore from '../../components/read-more';
import MeasurementLogPopup from "./components/measurement-log-popup"
import { MeasurementStatusCode } from '../../constants/error-codes';

export default function MeasurementLogsTable() {

  const [isMeasurementDataLoading, setIsMeasurementDataLoading] = useState(false);

  const [measurementPendingData, setMeasurementPendingData] = useState({
    measurement_records: 0,
    measurement_logs: 0,
    additional_artifacts: 0,
    additional_videos: 0
  });

  const [moreDetailsPopupOpen, setMoreDetailsPopupOpen] = useState(false);
  const [selectedMeasurementData, setSelectedMeasurementData] = useState(null)


  const { workflow } = useSelector((state) => state.workflow);

  const selectedMeasurementId = useRef()

  const handleViewIconClick = async (row) => {
    try {
      selectedMeasurementId.current = row.measurement_id;
      let selectedMeasurement = {
        ...row,
        imageData: { loading: true, imgBase64: '' }
      }
      setSelectedMeasurementData(selectedMeasurement)
      setMoreDetailsPopupOpen(true);
    } catch (error) {
      setMoreDetailsPopupOpen(false);
    }
  }

  const { t } = useTranslation();

  const closeMoreDetailPopup = () => {
    setMoreDetailsPopupOpen(false)
  }

  const renderHeader = (data) => {
    return (<>
      <TableHeaderCell>{t('logs_page.measurement.table.status')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.measurement_id')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.date_time')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.length')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.width')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.height')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.actual_weight')}</TableHeaderCell>
      <TableHeaderCell sx={{ width: '16em' }} >{t('logs_page.measurement.table.barcode')}</TableHeaderCell>
      <TableHeaderCell sx={{ width: '22em' }}>{t('logs_page.measurement.table.additional_info')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.object_type')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.upload_status')}</TableHeaderCell>
      <TableHeaderCell>{t('logs_page.measurement.table.view')}</TableHeaderCell>
    </>)
  }

  const renderColumn = (data, index) => {
    if (data['additional_info'] == null) {
      data['additional_info'] = (t('logs_page.additional_info.measurement.' + MeasurementStatusCode[data['status_code']]));
    }

    return (
      <>
        <TableBodyCell><StatusIcon status={data['status']} /></TableBodyCell>
        <TableBodyCell>{data['measurement_id']}</TableBodyCell>
        <TableBodyCell sx={{ width: '12em' }}>{data['scanned_time_local']}</TableBodyCell>
        <TableBodyCell>{data['length'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['width'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['height'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>{data['actual_weight'] ?? t('common.message.NA')}</TableBodyCell>
        <TableBodyCell sx={{ wordBreak: 'break-all', textAlign: 'left' }} >
          <ReadMore size={10}>
            {data['sku'] ?? t('common.message.NA')}
          </ReadMore>
        </TableBodyCell>
        <TableBodyCell sx={{ width: '25em', textAlign: 'left' }} >{data['additional_info']}</TableBodyCell>
        <TableBodyCell>{data['object_type'] ? data['object_type'].charAt(0).toUpperCase() + data['object_type'].slice(1) : t('common.message.NA')}</TableBodyCell>
        <TableBodyCell>
          <UploadStateChip record_upload_state={data['record_upload_state']} />
        </TableBodyCell>
        <TableBodyCell>
          <VisibilityIcon color='primary' sx={{ fontSize: '2.5em' }} onClick={() => { handleViewIconClick(data) }} />
        </TableBodyCell>
      </>
    )
  }

  const handleOnDataNeed = async (page, rowsPerPage) => {
    setIsMeasurementDataLoading(true);
    let result = { rows: [] }
    try {
      result = await getMeasurementRecords(page, rowsPerPage);
      setMeasurementPendingData(result?.pending_count);
      setIsMeasurementDataLoading(false);
      return result;
    } catch (error) { }
    setIsMeasurementDataLoading(false);
    return result
  }

  return (

    <Grid container direction="row" alignItems="center" height={'100%'}>
      <Grid container item xs={12} alignItems="center" height={'11%'}>
        <Paper variant='outlined' sx={{ width: '100%', height: '100%' }}>
          <Grid container item xs={12} height={'100%'}>
            <Grid item xs={4} padding={2}>
              <PendingDataPair
                label={t('logs_page.measurement.pending.records')}
                value={measurementPendingData?.measurement_records}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <PendingDataPair
                label={t('logs_page.measurement.pending.logs')}
                value={measurementPendingData.measurement_logs}
              />
            </Grid> */}

            {
              Boolean(workflow?.additional_image?.is_enabled || measurementPendingData?.additional_artifacts) &&
              < Grid item xs={4} padding={2}>
                <PendingDataPair
                  label={t('logs_page.measurement.pending.additional_images')}
                  value={measurementPendingData?.additional_artifacts}
                />
              </Grid>
            }
            {
              Boolean(workflow?.additional_video?.is_enabled || measurementPendingData?.additional_videos) &&
              <Grid item xs={4} padding={2}>
                <PendingDataPair
                  label={t('logs_page.measurement.pending.additional_videos')}
                  value={measurementPendingData?.additional_videos}
                />
              </Grid>
            }
          </Grid>
        </Paper>
      </Grid >
      <Grid item xs={12} alignItems="center"  height={'88%'}>
        <Box sx={{ width: '90vw' }}>
          <CommonTable
            id="measurement-table"
            isLoading={isMeasurementDataLoading}
            isAPIFetch={true}
            rowsPerPage={10}
            onDataNeed={handleOnDataNeed}
            renderHeader={renderHeader}
            renderColumns={renderColumn}
            columnsLength={12}
            maxHeight={'63vh'}
          />
        </Box>
      </Grid>
      {moreDetailsPopupOpen && <MeasurementLogPopup closePopup={closeMoreDetailPopup} logPopupOpen={moreDetailsPopupOpen} measurementData={selectedMeasurementData} />}
    </Grid >
  );
}
