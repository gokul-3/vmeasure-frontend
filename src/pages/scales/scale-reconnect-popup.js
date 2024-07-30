import React, { useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux'
import ErrorIcon from '@mui/icons-material/Error';
import settings from "../../redux/reducers/settings"
import { PreDefinedPages } from "../../constants/custom-flow";

const ScaleReconnectPopup = ({ isMeasurePage = false, resetScaleDialog = () => { }, is_scale_detached, is_scale_detected, scale_reconnect_with_error, emptyCurrentMeasurePage = () => { } }) => {
  console.info("INSIDE ScaleReconnectPopup:", is_scale_detached, is_scale_detected)
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { customServiceInfo, pageAttribute } = useSelector(state => state.customFlow);
  const theme = useTheme()
  const handleSubmit = () => {
    dispatch(settings.actions.resetReconnectPopup(false))
    dispatch(settings.actions.setReconnectWithError(false))
    resetScaleDialog();
    if (location.pathname != "/menu/calibration") {
      navigate('/menu/calibration');
    }
  }

  const goToScaleSettings = () => {
    dispatch(settings.actions.resetReconnectPopup(false))
    dispatch(settings.actions.setReconnectWithError(false))
    resetScaleDialog()
    if (location.pathname != "/menu/scale") {
      navigate('/menu/scale');
    }
  }

  const handleScaleDetached = () => {
    dispatch(settings.actions.resetReconnectPopup(false))
    dispatch(settings.actions.setReconnectWithError(false))
    resetScaleDialog()
    if (location.pathname != "/menu/scale") {
      navigate('/menu/scale');
    }
  }

  useEffect(() => {
    emptyCurrentMeasurePage()
  }, [])

  return (
    <Dialog
      maxWidth={'md'}
      fullWidth
      open={true}
    >
      <DialogTitle variant="h3">
        <Typography variant="h3" display={'flex'} alignContent={'center'} color={theme.palette.error.main} fontWeight={'bold'}>
          <ErrorIcon sx={{ fontSize: '1.5em', marginRight: 2 }} color="error" />
          {is_scale_detected && t('scale_reconnect_dialog.title')}
          {!is_scale_detected && is_scale_detached && t('scale_reconnect_dialog.scale_detached')}
        </Typography>
      </DialogTitle>
      <DialogContent
        id="alert-dialog-description"
        sx={{
          display: 'flex',
          // height: '20vh',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '0.7rem'
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            {scale_reconnect_with_error && <Typography variant='body2' fontSize={'3em'} textAlign={'justify'}>
              {t(`scale_page.error_messages.${scale_reconnect_with_error}`)} {isMeasurePage && t('scale_reconnect_dialog.content_2')}
            </Typography>}
            {!scale_reconnect_with_error && is_scale_detected && <Typography variant='body2' fontSize={'3em'} textAlign={'justify'}>
              {t('scale_reconnect_dialog.content')} {isMeasurePage && t('scale_reconnect_dialog.content_2')}
            </Typography>}
            {!scale_reconnect_with_error && !is_scale_detected && is_scale_detached && <Typography variant='body2' fontSize={'3em'} textAlign={'justify'}>
              {t('scale_reconnect_dialog.detach_content')} {isMeasurePage && t('scale_reconnect_dialog.content_2')}
            </Typography>}
            {
              (customServiceInfo.isAvailable && location.pathname == "/measurement") &&
              <>
                <br />
                <Typography Typography variant='body2' fontSize={'3em'} textAlign={'justify'} sx={{ paddingTop: 5, color: '#f44336' }}>
                  <Trans
                    i18nKey="custom_flow_common_text.scale_navigate_warning"
                    components={[<b></b>,]}
                  />
                </Typography>
              </>
            }
          </Grid>
          <Grid item xs={12} display={'flex'} justifyContent={'right'}>

          </Grid>
        </Grid>


      </DialogContent>
      {is_scale_detected && <DialogActions sx={{ paddingBottom: 4, paddingRight: 4 }}>
        {!scale_reconnect_with_error && <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: "20px" }}
          onClick={handleSubmit}
        >
          <Typography variant="body3" fontSize={32}>
            {t('scale_reconnect_dialog.button')}
          </Typography>
        </Button>
        }
        <Button
          variant="contained"
          color="primary"

          onClick={goToScaleSettings}
        >
          <Typography variant="body3" fontSize={32}>
            {t('scale_reconnect_dialog.button_2')}
          </Typography>
        </Button>
      </DialogActions>}
      {!is_scale_detected && is_scale_detached && <DialogActions sx={{ paddingBottom: 4, paddingRight: 4 }}>
        <Button
          variant="contained"
          color="primary"

          onClick={handleScaleDetached}
        >
          <Typography variant="body3" fontSize={32}>
            {t('scale_reconnect_dialog.button_2')}
          </Typography>
        </Button>
      </DialogActions>}

    </Dialog>
  )
}

export default ScaleReconnectPopup;
