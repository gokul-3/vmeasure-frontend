import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { CircularProgress, Grid, Typography, useTheme, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProgressButton from '../../components/button/progress-button';

export default function WorkflowDownloadDialog({ open, isLoading, isSuccess, onClose, handleWorkflowSuccess, restrictedFeatures }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (

    <Dialog
      open={open}
      aria-labelledby="workflow-dialog"
      aria-describedby="workflow-desc"
      maxWidth={'xl'}
    >
      <DialogContent
        id="alert-dialog-description"
        sx={{ display: 'flex', height: '35vh', width: '50vw', justifyContent: 'center', alignItems: 'center', }}
      >

        {
          isLoading &&
          <Grid container display={'flex'} height={'100%'} justifyContent={'space-evenly'}>
            <Grid item sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
              <CircularProgress size={70} />
              <Typography variant='h3' marginLeft={5} padding={4}>
                {t('workflow_download.in_progress')}
              </Typography>
            </Grid>
          </Grid>
        }

        {
          !isLoading && restrictedFeatures?.length &&
          <Grid container display={'flex'} width={'100%'} height={'100%'} sx={{ padding: '3px' }}>
            <Grid container item xs={12} height="80%" >
              <Grid item xs={12} textAlign={"center"} justifyContent={'center'} alignItems={'center'} display={'flex'} >
                <Typography variant="h4" sx={{ color: 'black', padding: '4px' }}  >
                  {t('configurations.restricted_conflicts.title')}
                </Typography>
              </Grid>

              <Grid item xs={12} maxHeight="65%" sx={{ overflowY: 'auto' }} >
                {restrictedFeatures.map((item, index) => (
                  <Typography key={index} mt={4} sx={{ color: 'black', fontSize: '2rem' }}>
                    {index + 1}. {t(`configurations.restricted_conflicts.${item}`)}
                  </Typography>
                ))}
              </Grid>

            </Grid>
            <Grid item xs={12} height={'20%'}>
              <Box width={'25%'} height={'100%'} marginLeft={'auto'}>
                <ProgressButton
                  onTimerClose={handleWorkflowSuccess}
                  startTimer={true}
                  text={t('common.button.accept')}
                  timeInSeconds={10}
                  variant="contained"
                  color="primary"
                  size="large"
                  textProps={{ fontSize: '3em' }}
                  sx={{ width: '25%', height: '100%', marginLeft: 'auto' }}
                  clickable={true}
                />
              </Box>
            </Grid>
          </Grid>
        }

        {
          Boolean(!isLoading && !isSuccess) && !restrictedFeatures?.length &&
          <Grid container display={'flex'} width={'100%'} height={'100%'}>
            <Grid container item xs={12} height={'80%'} justifyContent={'center'}>
              <Grid item xs={12} margin={'auto'}>
                {
                  <>
                    <Typography variant='h3' color={theme.palette.error.main} textAlign={'center'}>
                      {t('workflow_download.workflow_download_failed')}
                    </Typography>
                    {/* <Typography variant="body2" fontSize={'2.2em'} textAlign={'center'} marginTop={5}>
                        {t('calibration_page.calibrate_failed_msg')}
                      </Typography> */}
                  </>
                }
              </Grid>

            </Grid>
            <Grid item xs={12} height={'20%'}>
              <Box width={'25%'} height={'100%'} marginLeft={'auto'}>
                <ProgressButton
                  onTimerClose={onClose}
                  startTimer={true}
                  text={t('common.button.close') + ' (%ds)'}
                  timeInSeconds={10}
                  variant="contained"
                  color="primary"
                  size="large"
                  textProps={{ fontSize: '3em' }}
                  sx={{ width: '25%', height: '100%', marginLeft: 'auto' }}
                  clickable={true}
                />
              </Box>
            </Grid>
          </Grid>
        }

      </DialogContent>
    </Dialog >

  );
}
