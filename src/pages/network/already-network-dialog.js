import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Button,
  Grid,
} from "@mui/material"
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
//This component displays a dialog for connecting to an already connected network that don't need password to connect

export default function AlreadyConnectedNetwork({ showAlreadyConnected, setShowAlreadyConnected,
  handleForgetConnection, handleAlreadyConnectedNetwork, connectLoading, forgetLoading }) {

  const { t } = useTranslation();

  const handleDialogClose = (event, reason) => {
    if (reason === "backdropClick") {
      event.stopPropagation()
    } else setShowAlreadyConnected(false)
  }

  return (
    <>
      <Grid>
        <Dialog open={showAlreadyConnected}
          maxWidth='sm'
          fullWidth
          disableEscapeKeyDown
          onClose={(event, reason) => handleDialogClose(event, reason)}
        >
          <DialogTitle sx={{ margin: '0.2em 0em',display:'flex' ,width:'100%', paddingLeft: "2em"}}>
            <Typography width='90%' textAlign='center' my='auto' fontSize={'1em'}>
              <b>{t('network_page.wifi_page.action_required')}</b>
            </Typography>
            <IconButton onClick={handleDialogClose} sx={{width:'10%',justifyContent:'flex-end',display:'flex'}}>
              <CloseIcon sx={{ fontSize: '2em' }}/>
            </IconButton>
          </DialogTitle>
          <DialogContent width='100%' padding='3' sx={{minHeight: '13em',gap:'4em'}}>
            <Grid item xs={12} fontSize={'3em'} marginBottom={8}>
              <Typography textAlign={'center'}>
                {t('network_page.wifi_page.this_network_is_already_connected')}
              </Typography>
            </Grid>
            <Grid sx={{ alignItems: 'flex-end', display: 'flex', justifyContent:'space-between',gap :'2em', marginTop : "2.2em"}}>
              <Button variant="outlined" sx={{ width: '10em', height: '2.5em' }} onClick={handleForgetConnection} disabled = {forgetLoading || connectLoading}>
                {forgetLoading ?  t('network_page.wifi_page.forgetting') :t('network_page.wifi_page.forget_connection')}
              </Button>
              <Button variant="contained"  sx={{ width: '10em', height: '2.5em' }} onClick={handleAlreadyConnectedNetwork}>
                {connectLoading ? t('network_page.wifi_page.connecting') : t('network_page.wifi_page.connect')}
              </Button>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </>
  )
}