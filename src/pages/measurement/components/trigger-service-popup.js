import React, { useEffect } from "react";
import getIcon from "../../custom-flow/widgets/icons";
import appState from "../../../redux/reducers/measurement-states";
import ProgressButton from "../../../components/button/progress-button";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Grid,
  DialogActions,
  Box,
  useTheme,
  Button
} from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

export function TriggerServicePopup() {

  const theme = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { triggerServicePopup } = useSelector((state) => state.appState)
  const { trigger_service } = useSelector((state) => state.applicationState)

  const handleDialogClose = () => {
    dispatch(appState.actions.resetTriggerServicePopup())
  }

  const {
    showTriggerPopup,
    status,
    title,
    statusIcon,
    content
  } = triggerServicePopup;

  const IconComponent = getIcon(statusIcon);

  return (
    <Dialog
      maxWidth={'xl'}
      open={showTriggerPopup}
      p={5}
    >
      <Box display="flex" justifyContent={"center"} alignItems={"center"} flexDirection={"column"} height={"55vh"} width={"100%"} py={10}>
        <DialogTitle variant="h3">
          <Typography variant="h2" sx={{ textTransform: "uppercase" }} textAlign={'center'} color={status ? theme.palette.success.main : theme.palette.error.main} fontWeight={'bold'}>
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
          <Grid container>
            <Grid item xs={12} display='flex' justifyContent={'center'}>
              {
                statusIcon && <IconComponent style={{ fontSize: "200px", fontWeight: "bold", color: status ? theme.palette.success.main : theme.palette.error.main }} />
              }
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" fontWeight={"500"} textAlign={'center'}>
                {content}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ height: "10vh", width: "100%", justifyContent: 'center', alignItems: 'center' }} >
          {
            Number(trigger_service.popupTimer) > 0
              ?
              <Grid container display={'flex'} height={'100%'} width={'100%'} sx={{ justifyContent: 'center' }}>
                <Grid item xs={3} height={'100%'} width={'100%'} >
                  <Box height={'100%'} width={'100%'} >
                    <ProgressButton
                      onTimerClose={handleDialogClose}
                      startTimer={true}
                      text={t('common.button.close') + ' (%ds)'}
                      timeInSeconds={Number(trigger_service.popupTimer)}
                      variant="contained"
                      color="primary"
                      size="large"
                      textProps={{ fontSize: '3em' }}
                      sx={{ width: '20%', height: '100%', marginLeft: 'auto', background: "red" }}
                      clickable={true}
                    />
                  </Box>
                </Grid>
              </Grid>
              :
              <Button
                variant="contained"
                color="primary"
                sx={{ width: '20%', paddingX: 10 }}
                onClick={handleDialogClose}
              >
                <Typography variant="body4">
                  {t('common.button.close')}
                </Typography>
              </Button>
          }
        </DialogActions>
      </Box>
    </Dialog>
  )
}