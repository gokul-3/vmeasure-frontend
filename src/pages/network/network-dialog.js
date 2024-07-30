import {
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  Typography,
  IconButton,
  ListItemButton,
  ListItemText,
  Button,
  Grid,
  DialogContent,
  CircularProgress,
  Alert
} from "@mui/material";
import { WifiSignalStrength } from "../../components/signalIndicator/wifi-signal";
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import DoneIcon from '@mui/icons-material/Done';
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { NetworkType } from "../../constants";

export function NetworkDialog({ showNetworks, setShowNetworks, handleNetworkRefresh,
  wifiNetworks, handleNetwork, selectedNetwork, refreshLoading, setIsNetworkNotSupported,
  isNetworkNotSupported, error
}) {

  const { t } = useTranslation();
  const myInterval = useRef();

  useEffect(() => {
    handleNetworkRefresh()
    // Call the get Network list function in every 5 seconds
    myInterval.current = setInterval(() => {
      handleNetworkRefresh(false)
    }, 5000)
    // stop the getwifiNetwork function trigger function when close this page
    return () => {
      clearInterval(myInterval.current)
    }
  }, [])

  const handleDialogClose = (event, reason) => {
    if (reason === "backdropClick") {
      event.stopPropagation()
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    setShowNetworks(false)
    setIsNetworkNotSupported(false)
  }

  const handleFocusedNetwork = (network) => {
    clearInterval(myInterval.current)
    setIsNetworkNotSupported(false)
    handleNetwork(network)
  }

  return (
    <Dialog
      open={showNetworks}
      maxWidth='sm'
      fullWidth
      disableEscapeKeyDown
      onClose={(event, reason) => handleDialogClose(event, reason)}
    >
      <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', }}>
        <Typography sx={{ my: 'auto' }}>{t('network_page.wifi_page.available_networks')}</Typography>
        <Grid item height='76px' width='76px' display='flex' alignItems='center' justifyContent='center'>
          {
            refreshLoading ?
              <CircularProgress sx={{ fontSize: '3em', }} />
              :
              <IconButton size="large" onClick={handleNetworkRefresh}>
                <RefreshIcon color="primary" sx={{ fontSize: '2em' }} />
              </IconButton>
          }
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <List sx={{ fontSize: '3em', minHeight: '6em' }}>
          {wifiNetworks.length === 0 ? (
            <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '6em' }}>
              <Typography >
                {t('network_page.wifi_page.no_available_networks')}
              </Typography>
            </Grid>
          ) : (
            wifiNetworks.map((network) => (
              <ListItem key={network?.ssid}>
                <ListItemButton
                  display={'flex'}
                  onClick={() => handleFocusedNetwork(network)}
                  key={network?.ssid}
                >
                  <WifiSignalStrength
                    signalLevel={network?.signalLevel}
                  />
                  <ListItemText primary={network?.ssid} sx={{ paddingLeft: 5 }} />
                  {network?.ssid === selectedNetwork && (
                    <DoneIcon sx={{ fontSize: '1em' }} />
                  )}
                  {(network?.networkType !== NetworkType.OPEN) && (
                    <LockIcon sx={{ fontSize: '1em' }} />
                  )}

                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ padding: 6 }}>
        <Grid container item xs={12} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={9}>
            {isNetworkNotSupported &&
              <Alert severity="warning" sx={{ padding: 0, fontSize: '2.1em' }}>
                {t(`network_page.network_error.${error?.message}`)}
              </Alert>
            }
          </Grid>
          <Grid item display='flex' justifyItems={'flex-end'}>
            <Button variant="contained" onClick={() => handleClose()}>{t('common.button.close')}</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}