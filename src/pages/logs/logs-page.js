import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Grid, Paper } from '@mui/material';
import CalibrationLogsTable from './calibration-table';
import MeasurementLogsTable from './measurement-table';
import SystemConfigLogTable from './configuration-table'
import TestMeasurementLogsTable from './test-measurement-table';
import BarcodeValidationLogsTable from './barcode-validation-table';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNetwork } from "../../hooks/useNetwork"
import { Certificates, LogsDownloadStates, USBError } from '../../constants';
import * as LogService from '../../services/logs.service';
import DownloadDialog from "./components/download-dialog";
import DownloadButton from './components/download-button';

export default function LogsPage() {
  const { t } = useTranslation()
  const [value, setValue] = useState('measurment_tab');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { workflow } = useSelector((state) => state.workflow);
  const { metrological_setting } = useSelector(state => state.settings.metrological);

  const [checkForNetwork] = useNetwork();
  const [usbDeviceList, setUSBDeviceList] = useState([]);
  const [dialogContext, setDialogContext] = useState({
    open: false,
    buttonValue: null,
    cancelBtnValue: null,
    isCancellable: false,
    isConfirmable: false,
    currentState: LogsDownloadStates.NONE,
    contentData: { message: null, additionalInfo: {} },
  })


  const updateDownloadPopup = (message, currentState, cancelBtnValue, additionalInfo) => {
    setDialogContext({
      open: true,
      buttonValue: t('common.button.confirm'),
      cancelBtnValue: t(`common.button.${cancelBtnValue}`),
      isCancellable: currentState !== LogsDownloadStates.IN_PROGRESS,
      isConfirmable: currentState === LogsDownloadStates.INIT,
      currentState: currentState,
      contentData: { message: message, additionalInfo: additionalInfo ?? {} },
    })
  }


  const hideDownloadPopup = () => {
    setDialogContext(prev => ({ ...prev, open: false }))
  }

  const downloadConfirmHandler = async (count, logTypes, selectedUsb) => {
    console.error("Final Data for log download :: ", count, logTypes, selectedUsb)
    updateDownloadPopup(null, LogsDownloadStates.IN_PROGRESS);
    const { status, error, data } = await LogService.startDownloadLogs({ count, logTypes, selectedUsb });
    if (!status) {
      updateDownloadPopup(error, LogsDownloadStates.FAILED, 'ok')
    } else {
      updateDownloadPopup(data?.message, LogsDownloadStates.SUCCESS, 'ok', data)
    }
  }


  const donwloadClickHanlder = async () => {
    try {
      if (!checkForNetwork()) {
        updateDownloadPopup(USBError.INTERNET_REQUIRED, LogsDownloadStates.FAILED, 'cancel')
        return
      }

      const usbList = await LogService.getUSBDeviceList();
      if (usbList?.length === 0) {
        updateDownloadPopup(USBError.USB_REQUIRED, LogsDownloadStates.FAILED, 'ok')
        return
      }

      setUSBDeviceList(usbList);
      updateDownloadPopup(USBError.NO_ERROR, LogsDownloadStates.INIT, 'cancel')

    } catch (err) {
      console.error("error in donwloadHanlder function ", JSON.stringify(err));
      updateDownloadPopup(USBError.UNKNOWN_ERROR, LogsDownloadStates.FAILED, 'cancel')
    }
  }

  useEffect(() => {
    if ((!workflow?.measurement_check?.is_enabled && value === 'test_measurement_tab') || (!workflow?.barcode_config?.is_api_validation_enabled && value === 'barcode_validation_tab')) {
      setValue('measurment_tab')
    }
  }, [workflow]);


  return (
    <>
      <Grid container direction="row" alignItems="center" height={'100%'}>
        <Grid item xs={12} alignItems="center" height={'100%'}>
          <Paper sx={{ width: '100%', height: '100%', position: 'relative' }} variant='outlined' >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label={t('logs_page.measurement_logs')} value="measurment_tab" />
                  <Tab label={t('logs_page.calibration_logs')} value="calibration_tab" />
                  {
                    workflow?.measurement_check?.is_enabled &&
                    <Tab label={t('logs_page.reference_box_log')} value="test_measurement_tab" />
                  }
                  {
                    workflow?.barcode_config?.is_api_validation_enabled &&
                    <Tab label={t('logs_page.barcode_validation_log')} value="barcode_validation_tab"/>
                  }
                  <Tab label={t('logs_page.configuration_log')} value="configuration_tab" />
                </TabList>
              </Box>
              <TabPanel value="measurment_tab" sx={{ height: '88%' }}>
                <MeasurementLogsTable />
              </TabPanel>
              <TabPanel value="calibration_tab">
                <CalibrationLogsTable />
              </TabPanel>
              {
                workflow?.measurement_check?.is_enabled &&
                <TabPanel value="test_measurement_tab">
                  <TestMeasurementLogsTable />
                </TabPanel>
              }
              {
                workflow?.barcode_config?.is_api_validation_enabled &&
                <TabPanel value="barcode_validation_tab">
                  <BarcodeValidationLogsTable />
                </TabPanel>
              }
              <TabPanel value="configuration_tab">
                <SystemConfigLogTable />
              </TabPanel>
            </TabContext>

            {
              // Download button
              metrological_setting === Certificates.NTEP &&
              <DownloadButton clickHandler={donwloadClickHanlder} styles={{ position: 'absolute', right: '2vw', top: '1vh' }} />
            }
          </Paper>
        </Grid>
        <DownloadDialog {...dialogContext} onClose={hideDownloadPopup} onConfirm={downloadConfirmHandler} usbList={usbDeviceList} />
      </Grid >
    </>
  );
}
