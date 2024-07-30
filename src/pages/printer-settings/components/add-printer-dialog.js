import {
  Dialog,
  DialogTitle,
  Typography,
  Grid,
  DialogContent,
  IconButton,
  Divider,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddPrinterListItem from './add-printer-grid';
import PrintIcon from '@mui/icons-material/Print';

export function AddPrinterDialog({ printerDetails, showDialog, setShowDialog, addPrinter, handleReload }) {
  const { t } = useTranslation()

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick') {
      event.stopPropagation()
    } else {
      setShowDialog(false)
    }
  }

  return (
    <Dialog
      open={showDialog}
      maxWidth='md'
      fullWidth
      disableEscapeKeyDown
      onClose={(event, reason) => handleDialogClose(event, reason)}
    >
      <DialogTitle
        id='alert-dialog-title'
        sx={{ display: 'flex' }}
      >
        <IconButton onClick={handleReload}>
          <RefreshIcon sx={{ fontSize: '2.5em' }} />
        </IconButton>

        <Grid container item style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Typography variant='h4' sx={{ my: 'auto' }}>{t('configurations.printer_settings.add_printer')}</Typography>
        </Grid>

        <IconButton onClick={() => setShowDialog(false)}>
          <CloseIcon sx={{ fontSize: '2.5em' }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2, height: '75vh' }}>
        {
          printerDetails?.printers.length
            ?
            printerDetails?.printers.map((printer, index) => (
              <AddPrinterListItem
                printer={printer}
                addPrinter={addPrinter}
                key={printer.name}
              />
            ))
            :
            <Grid container item style={{ height: '100%' }} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              <PrintIcon sx={{ fontSize: 250 }} color="disabled" />
              <Typography variant='h4'>{t('configurations.printer_settings.no_printers')}</Typography>
            </Grid>
        }
      </DialogContent>
    </Dialog>
  )
}
