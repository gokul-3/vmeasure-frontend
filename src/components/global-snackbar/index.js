import { useSelector } from "react-redux";
import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {useSnackbar} from '../../hooks/useSnackbar'
export default function GlobalSnackbar() {

  const [showSnackbar, hideSnackbar] = useSnackbar()

  const handleClose = () => {
    hideSnackbar();
  }

  const {
    severity,
    message,
    autoHideDuration,
    vertical,
    horizontal,
    open,
  } = useSelector(state => state.snackbar)

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} variant={"filled"} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

    </>
  )
}
