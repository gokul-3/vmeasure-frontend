import React, { useState } from 'react'
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog"
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { forceUnpairDeviceApp } from '../../services/device-api.service';
import deviceAPI from "../../redux/reducers/device-api"
import { PageTitle } from '../../components/custom-text-message/page-title';

function DesktopAppPage() {

  const { t } = useTranslation();
  const { pairedStatus } = useSelector(state => state.deviceAPI);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showConfirmation, setShowConfirmation] = useState(false)

  const proceedHandler = async () => {
    setShowConfirmation(false);
    await forceUnpairDeviceApp();
    dispatch(deviceAPI.actions.setPairStatus(false));
    navigate("/menu");
  }

  const popupCloseHandler = (isConfirmed) => {
    isConfirmed ? proceedHandler() : setShowConfirmation(false);
  }

  return (
    <Grid container rowSpacing={5} height={'100%'} >

      <ConfirmationDialog 
        open={showConfirmation}
        title={t('desktop_app.unpair_confirmation.title')}
        content={t('desktop_app.unpair_confirmation.confirmation')}
        buttonValue={t('desktop_app.unpair_confirmation.ok_button_text')}
        onClose={popupCloseHandler}
      />

      <Grid item xs={12} height={'8%'}>
        <PageTitle title={t('desktop_app.page_title')} />
      </Grid>
      <Grid container item xs={12} height={'80%'}>
        <Paper variant="outlined" sx={{ width: '100%' }}>
          <Grid
            container
            item
            xs={12}
            padding={10}
            height={'100%'}
            margin={'auto'}
            alignContent={'center'}
            justifyContent={'center'}
          >
            <Grid
              container
              item
              xs={12}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              padding={4}
            >
              <Typography variant="h3" display={'flex'} >
                {t('desktop_app.pair_status_lable_text')}
              </Typography>
              {
                pairedStatus ?
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    gap={10}
                  >
                    <Typography variant="h3" display={'flex'} color={theme.palette.success.main} >
                      {t('desktop_app.paired')}
                    </Typography>
                    <Button variant="contained" color={"error"} size="large" sx={{ minWidth: '8em' }} onClick={()=>setShowConfirmation(true)}>
                      <Typography variant="body3" fontSize={'1.5em'}>{t('desktop_app.unpair')}</Typography>
                    </Button>
                  </Box>
                  :
                  <Typography variant="h3" display={'flex'} color={theme.palette.error.main} >
                    {t('desktop_app.not_paired')}
                  </Typography>
              }
            </Grid>

          </Grid>
        </Paper>
      </Grid>
    </Grid>

  )
}

export default DesktopAppPage