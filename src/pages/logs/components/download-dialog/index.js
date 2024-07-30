import { useState, useEffect } from 'react';
import { DownloadLogTypes, LogsDownloadStates, USBError } from "../../../../constants/constants";
import { useNetwork } from '../../../../hooks/useNetwork';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  DownloadInProgress,
  DownloadFailed,
  DownloadSuccess
} from "./download-dialog-states";
import DialogHeader from "./download-dialog-header";
import DownloadFrom from "./download-dialog-form";
import DownloadButtons from "./download-dialog-buttons";

function DownloadDialog({
  open,
  onClose,
  onConfirm,
  buttonValue,
  cancelBtnValue,
  isCancellable = false,
  isConfirmable = false,
  currentState,
  contentData = { message: null, additionalInfo: {} },
  usbList = []
}) {

  const availableLogType = [...Object.values(DownloadLogTypes)];
  const [checkForNetwork] = useNetwork();


  const [error, setError] = useState({ show: false, errorCode: null });
  const [downloadFields, setDownloadFields] = useState({
    logTypes: availableLogType,
    count: 100,
    usb: { id: null, diskSize: null, availSize: null },
  })


  const confimationHandler = () => {
    if (!checkForNetwork()) {
      setError({ show: true, errorCode: USBError.INTERNET_REQUIRED });
    }

    else if (downloadFields.logTypes.length === 0) {
      setError({ show: true, errorCode: USBError.LOG_TYPE_REQUIRED });
    }

    else if (downloadFields.usb.availSize?.toString() === '0') {
      setError({ show: true, errorCode: USBError.LOW_USB_STORAGE })
    }

    else {
      setError({ show: false, errorCode: null });
      onConfirm(downloadFields.count, downloadFields.logTypes, downloadFields.usb.id)
    }
  }


  const closeHandler = () => {
    setError({ show: false, errorCode: null });
    onClose();
  }


  return (
    <Dialog
      open={open}
      maxWidth={'md'}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ sx: { padding: 4 } }}
    >
      <DialogTitle id="alert-dialog-title">
        <DialogHeader currentState={currentState} usb={downloadFields.usb} />
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} justifyContent={'center'} alignItems={'flex-start'} flexDirection={'column'} mt={5} mb={5}>

          {
            currentState === LogsDownloadStates.SUCCESS &&
            <DownloadSuccess contentData={contentData} />
          }

          {
            currentState === LogsDownloadStates.FAILED &&
            <DownloadFailed contentData={contentData} />
          }

          {
            currentState === LogsDownloadStates.IN_PROGRESS &&
            <DownloadInProgress />
          }

          {currentState === LogsDownloadStates.INIT &&
            <DownloadFrom {...{ setDownloadFields, usbList, error }} />
          }

        </Box>
      </DialogContent>
      <DialogActions>
        <DownloadButtons {...{ isCancellable, isConfirmable, cancelBtnValue, buttonValue, currentState, confimationHandler, closeHandler }} />
      </DialogActions>
    </Dialog >
  );
}


export default DownloadDialog