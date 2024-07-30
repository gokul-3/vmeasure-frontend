import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ErrorIcon from '@mui/icons-material/Error';

function QueueFullPopup() {

  const navigate = useNavigate();

  const { t } = useTranslation()

  const handleSubmit = () => {
    navigate('/logs')
  }

  const theme = useTheme();

  return (
    <Dialog
      maxWidth={'md'}
      fullWidth
      open={true}

    >
      <DialogTitle variant="h3" color={theme.palette.error.main} alignItems={'center'} display={'flex'}>
        <Typography variant="h4" display={'flex'} alignContent={'center'} color={theme.palette.error.main} fontWeight={'bold'}>
          <ErrorIcon sx={{ fontSize: '1.2em', marginRight: 2 }} color="error" />
          {t('measurement_page.queue_full_dialog.title')}
        </Typography>
      </DialogTitle>
      <DialogContent
        id="alert-dialog-description"
        sx={{
          display: 'flex',
          height: '17vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='body3' textAlign={'justify'} fontSize={'3em'}>
          {t('measurement_page.queue_full_dialog.content')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 4, paddingRight: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ paddingX: 7, minWidth: '5em' }}
          onClick={handleSubmit}
        >
          <Typography variant="body3" fontSize={32}>{t('measurement_page.queue_full_dialog.button')}</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QueueFullPopup;
