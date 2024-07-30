import React from "react";
import {
  Grid,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import usePermission from "../../../hooks/usePermission";
import { PermissionModules } from "../../../constants";

export default function JobsDialog({ showDialog, setShowDialog, activeJobs,
  handleCancelAllJobs, handleDeleteJob, disableCancel, showDialogMsg, result }) {

  const { t } = useTranslation();
  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_SYSTEM_UPDATE);

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
        sx={{ display: 'flex', }}
      >
        <Typography variant='h3' sx={{ margin: 'auto' }}>{t('configurations.printer_settings.active_jobs')}</Typography>

        <IconButton onClick={() => setShowDialog(false)}>
          <CloseIcon sx={{ fontSize: 60 }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ minHeight: '20vh' }}>
        {!activeJobs?.length &&
          <Grid container item display={'flex'} justifyContent={'center'} minHeight={'20vh'} alignItems={'center'}>
            <Typography textAlign='center' variant="body5">{t('configurations.printer_settings.no_active_jobs')}</Typography>
          </Grid>
        }
        {activeJobs?.length > 0 &&
          <>
            {activeJobs.map((job, index) => (
              <div key={job.jobId}>
                <Grid container item xs={12} display={'flex'} p={6} marginBottom={5}>
                  <Grid item xs={11} style={{ display: 'flex', margin: 'auto' }}>
                    <Typography variant="body5" sx={{ my: 'auto' }} >{job.jobId}</Typography>
                  </Grid>
                  <Grid item xs={1} display='flex' justifyContent={'flex-end'}>
                    <IconButton disabled={!hasPermission} onClick={() => handleDeleteJob(job.jobId)}>
                      <DeleteIcon sx={{ fontSize: 60 }} />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider />
              </div>
            ))}

            <Grid container item xs={12} sx={{ justifyContent: 'space-between' }}>
              <Grid item xs={9} paddingTop={6}>
                {showDialogMsg &&
                  <Alert severity={result.status ? 'success' : 'warning'} variant="body5" sx={{ padding: 0 }}>
                    {t(`configurations.printer_settings.printer_error.${result.msg}`)}
                  </Alert>
                }
              </Grid>
              <Grid item xs={3} display='flex' justifyItems={'flex-end'} paddingTop={6}>
                <Button variant='contained'
                  style={{ fontSize: '2.5em' }}
                  onClick={() => handleCancelAllJobs()}
                  disabled={disableCancel || !hasPermission}
                >
                  {t('configurations.printer_settings.clear_all')}
                </Button>
              </Grid>
            </Grid>
          </>
        }
      </DialogContent>
    </Dialog>
  )
} 