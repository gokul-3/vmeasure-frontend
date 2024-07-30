import QrCode2Icon from '@mui/icons-material/QrCode2';
import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { getFormattedDims, getFormattedWeight } from '../../../utils/unit-conversion';
import { useTranslation } from 'react-i18next';

function QRPopup({ disabled }) {

  const { t } = useTranslation()

  const [open, setOpen] = useState(false);
  const { measurement_result } = useSelector((state) => state.appState);

  const { name : weighing_scale  } = useSelector((state) => state.settings.weighing_scale);

  const [qrValue, setQRValue] = useState('')

  useEffect(() => {
    const measurementUnit = measurement_result?.data?.measurement?.dimension_unit
    let value =
      `length:${getFormattedDims(measurement_result?.data?.measurement?.length, measurementUnit,1)}${measurementUnit},` +
      `width:${getFormattedDims(measurement_result?.data?.measurement?.width, measurementUnit,1)}${measurementUnit},` +
      `height:${getFormattedDims(measurement_result?.data?.measurement?.height,measurementUnit,1)}${measurementUnit}`;
    if (weighing_scale !== 'none') {
      const weight = getFormattedWeight(measurement_result?.data?.measurement?.actual_weight ?? 0, measurement_result?.data?.measurement?.weight_unit);
      let weightStr = '';
      weight.forEach((data) => {
        weightStr += data.weight + data.unit;
      })
      value += `,actualWeight:${weightStr}`;
    }
    setQRValue(value);
  }, [measurement_result])

  const handleQRClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <IconButton
        sx={{
          backgroundColor: 'white',
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: '1px',
          height: '100%',
          visibility: (disabled || !measurement_result?.status) ? 'hidden' : 'visible',
        }}
        disabled={disabled}
        onClick={handleQRClick}
      >
        <QrCode2Icon sx={{ color: disabled ? 'gray' : 'black', width: '4em', height: '4em' }} />
        {/* <img src={QrCode2Icon} /> */}
      </IconButton>
      <Dialog
        maxWidth={'sm'}
        open={open}
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {t('measurement_page.dialog_titles.qr_scan')}
          </div>
          <div>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ fontSize: '2.4em' }}></CloseIcon>
            </IconButton>
          </div>

        </DialogTitle>
        <DialogContent sx={{ height: '35vh', padding: 12, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <QRCodeCanvas size={300} value={qrValue} />,
        </DialogContent>
        <DialogActions sx={{ paddingX: 5, paddingBottom: 5 }}>

        </DialogActions>
      </Dialog>
    </>
  )
}

export default QRPopup;
