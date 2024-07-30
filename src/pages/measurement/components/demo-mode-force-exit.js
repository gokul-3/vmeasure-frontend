import React, { useEffect, useRef, useState } from 'react'
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useTranslation } from 'react-i18next';
import { rebootDevice } from '../../../services/utils.service';


export function DemoModeForceExitPopup({ open, reason }) {

  const { t } = useTranslation();

  const [seconds, setSeconds] = useState(5);

  const timerRef = useRef(5);


  const startTimer = () => {
    setInterval(() => {
      if (timerRef.current > 0) {
        timerRef.current = timerRef.current - 1
        setSeconds(timerRef.current);
      }
      if(timerRef.current === 2) {
        rebootDevice(reason).catch(() => { })
      }      

    }, 1000);
  }

  useEffect(() => {
    if (open) {
      startTimer();
    }

  }, [open])

  return (

    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
    >
      <DialogContent style={{ margin: "3vh 5vw" }}>
        <DialogContentText id="alert-dialog-description" component="span">
        <Typography variant="h3" align="left" component="p" padding={3}>
        {t("demo_mode.on_complete")}
          </Typography>
          <Typography variant="h4" align="left" component="p" padding={3}>
            {t("common.message.device_restart", { second: seconds })}
          </Typography>
        </DialogContentText>
      </DialogContent>
    </Dialog>

  )
}

