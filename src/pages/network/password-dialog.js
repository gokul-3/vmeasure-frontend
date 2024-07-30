import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Alert,
} from "@mui/material"
import { useTranslation } from "react-i18next";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useRef, useEffect } from "react";
import { useKeyboard } from '../../hooks/useKeyboard';
import { openOnboardKeyboard } from "../../services/keyboard.service";

export default function PasswordDialog({
  showPasswordDialog, setShowPasswordDialog, focusingNetwork, handleNetworkConnection,
  connectLoading, setFocusingNetwork, isNetworkConnectionFail, error, setIsNetworkConnectionFail
}) {

  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false)

  const anchorRef = useRef(null);

  const [showKeyboard, hideKeyboard] = useKeyboard()

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      event.stopPropagation()
    } else {
      setShowPasswordDialog(false);
      hideKeyboard()
    }
    setIsNetworkConnectionFail(false)
  }

  const handleFocus = async () => {
    await openOnboardKeyboard()
  }

  const handlePasswordChange = (event) => {
    const newvalue = event.target.value;
    setFocusingNetwork({
      ...focusingNetwork,
      password: newvalue,
    });
  };

  const handleNetworkConnect = () => {
    setIsNetworkConnectionFail(false)
    handleNetworkConnection()
  }

  useEffect(() => {
    setFocusingNetwork({
      ...focusingNetwork,
      password: "",
    });
  }, [])

  return (
    <>
      {showPasswordDialog &&
        <Grid>
          <Dialog open={showPasswordDialog}
            maxWidth='md'
            fullWidth
            disableEscapeKeyDown
            onClose={(event, reason) => handleClose(event, reason)}
            sx={{
              ".MuiDialog-container": {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid item style={{ display: 'flex', justifyContent: 'center', width: '90%' }}>
                <Typography textAlign={'center'} fontWeight={'bold'}>
                  {t('network_page.wifi_page.authentication_required')}
                </Typography>
              </Grid>
              <IconButton onClick={handleClose} disabled={connectLoading}>
                <CloseIcon sx={{ fontSize: '1.5em' }} />
              </IconButton>
            </DialogTitle>
            <DialogContent margin='auto' width='100%' style={{ display: 'grid', gap: 30, margin: 10, marginTop: 0 }}>
              <Grid container item>
                <Typography sx={{ fontWeight: 'normal', fontSize: '2.4em' }} textAlign={'center'} marginBottom={5}>
                  {t('network_page.password_for_network')}"{focusingNetwork?.ssid}".
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="password"
                  ref={anchorRef}
                  value={focusingNetwork?.password || ""}
                  type={showPassword ? 'text' : 'password'}
                  sx={{ fontSize: '3em', width: '100%', }}
                  onChange={handlePasswordChange}
                  onFocus={handleFocus}
                  disabled={connectLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <Visibility sx={{ fontSize: '2em' }} /> : <VisibilityOff sx={{ fontSize: '2em' }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid container item display={'flex'} xs={12} sx={{ justifyContent: 'space-between' }}>
                <Grid item xs={8} sx={{ minHeight: '2.5em' }}>
                  {
                    isNetworkConnectionFail &&
                    <Alert severity="warning" sx={{ padding: 2, fontSize: '2.5em' }}>
                      {t(`network_page.network_error.${error?.message}`)}
                    </Alert>
                  }
                </Grid>
                <Grid item display='flex' justifyItems={'flex-end'}>
                  <Button
                    variant="contained"
                    sx={{ fontSize: '2.5em', width: '8em', height: '2.5em' }}
                    onClick={handleNetworkConnect}
                    disabled={focusingNetwork?.password?.length <= 7 || connectLoading}
                  >
                    {connectLoading ? t('network_page.wifi_page.connecting') : t('network_page.wifi_page.connect')}
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Grid>
      } 
    </>
  )
}