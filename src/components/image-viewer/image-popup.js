import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Skeleton,
  Alert,
} from "@mui/material";
import { t } from "i18next";

export function ImagePopupViewer({ show, title, isLoading, imgBase64, onClose, error }) {

  return (
    <Dialog
      maxWidth={'md'}
      open={show}
    >
      <DialogTitle borderBottom={'1px solid #ccc'} >{title}</DialogTitle>
      <DialogContent sx={{ height: '70vh', display: 'flex', justifyContent: 'center' }}>
        {
          isLoading &&
          <Skeleton variant="rectangular" height={'100%'} width={'100%'} />
        }
        {
          Boolean(!isLoading && !error) &&
          <Box margin={'auto'} height={'100%'} sx={{ padding: 4, paddingBottom: 0 }}>
            <img src={'data:image;base64,' + imgBase64} height={'100%'} style={{ objectFit: 'contain' }} />
          </Box>
        }
        {
          Boolean(!isLoading && error) &&
          <Box margin={'auto'}>
            <Alert
              severity="error"
              variant="filled"
              sx={{ fontSize: '1.8em' }}
            >
              {error}
            </Alert>
          </Box>
        }

      </DialogContent>
      <DialogActions sx={{ paddingRight: 8, paddingBottom: 8 }}>
        <Button
          variant="contained"
          width={'100%'}
          onClick={onClose}
          sx={{ fontSize: '2.2em' }}
        >
          {t('common.button.close')}
        </Button>
      </DialogActions>
    </Dialog >
  )
}


