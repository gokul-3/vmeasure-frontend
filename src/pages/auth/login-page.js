import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Typography,
  Box,
  Paper,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";

import InfoIcon from '@mui/icons-material/Info';
import MuiAlert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from "react-redux";
import userAuth from '../../redux/reducers/user-auth';
import applicationState from "../../redux/reducers/application-state";
import customWorkflow from "../../redux/reducers/custom-workflow";
import settings from '../../redux/reducers/settings';
import LoginKeyboard from '../../components/keyboards/login-keyboard'
import styled from "styled-components/macro";
import WorkflowDownloadDialog from "./workflow-download";
import workflow from '../../redux/reducers/workflow'
import { getSelectedUnit } from "../../services/units.service";
import { getCurrentScaleSettings } from "../../services/scale.service";
import { getSelectedBarcode } from "../../services/barcode.service";
import { getMetroLogicalSettings } from "../../services/configuration.service";
import { downloadWorkflow } from '../../services/workflow.service';

const Alert = styled(MuiAlert)` 

`;


function LoginPage() {

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [operator, setOperator] = useState({ name: '', id: '' })
  const [pin, setPin] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const workflowDataRef = useRef(null)

  const { isLoading: isAuthLoading, error: authError, success: authSuccess } = useSelector((state) => state.userAuth)
  const { isLoading: isWorkflowLoading, error: workflowError, status: workflowDownloadStatus, restricted_features } = useSelector((state) => state.workflow)
  const { autoLoginRequest, operator: operatorFromDeviceApp } = useSelector((state) => state.deviceAPI);

  const [disableBackButton, setDisableBackButton] = useState(false);

  const handleWorkflowSuccess = () => {
    dispatch(workflow.actions.onWorkflowDonwloadSuccess(workflowDataRef.current));
    dispatch(applicationState.actions.updateDeviceModeAndPermission(workflowDataRef.current));
    dispatch(customWorkflow.actions.updateCustomServiceInfo(workflowDataRef.current));
  }

  const handleWorkflowDownloadSuccess = (workflowData) => {
    if (workflowData?.data?.resticted_features?.length) {
      workflowDataRef.current = workflowData
      dispatch(workflow.actions.onWorkflowRestrictedConflicts(workflowData?.data?.resticted_features));
    } else {
      dispatch(workflow.actions.onWorkflowDonwloadSuccess(workflowData));
      dispatch(applicationState.actions.updateDeviceModeAndPermission(workflowData));
      dispatch(customWorkflow.actions.updateCustomServiceInfo(workflowData));
    }
  }

  const handleWorkflowDownloadFailure = (workflowData) => {
    dispatch(workflow.actions.onWorkflowDownloadFailure(workflowData));
    dispatch(applicationState.actions.resetDeviceModeAndPermission());
  }

  const handleAuthSuccess = async () => {
    //start downloading workflow
    try {
      dispatch(workflow.actions.onWorkflowDownloadStarted());
      const workflowResponse = await downloadWorkflow();
      if (workflowResponse.status) {
        handleWorkflowDownloadSuccess(workflowResponse);
      } else {
        handleWorkflowDownloadFailure(workflowResponse)
      }
    } catch (error) {
      console.error('here it errr : ', error); //console.error to send logs to application log
      const errorData = error?.response?.data?.message ? error.response.data.message : error.message
      handleWorkflowDownloadFailure(errorData)
    }

  }


  useEffect(() => {
    if (autoLoginRequest) {
      setOperator(operatorFromDeviceApp)
    } else {
      setOperator(location?.state?.operator)
    }
    return () => {
      setOperator({ name: '', id: '' })
    }
  }, [autoLoginRequest, location]);

  useEffect(() => {
    if (isAuthLoading) {
      setDisableBackButton(true);
    }

    if (authError) {
      setPin('');
      setShowError(true);
      setErrorMsg(authError);
      setDisableBackButton(false);
    }
    if (authSuccess) {
      handleAuthSuccess();
    }

    if (authSuccess && isWorkflowLoading) {
      setWorkflowDialogOpen(true);
    }

  }, [isAuthLoading, authError, authSuccess]);

  useEffect(() => {
    if (authSuccess && isWorkflowLoading) {
      setWorkflowDialogOpen(true);
    }

    if (authSuccess && isWorkflowLoading && workflowDownloadStatus) {
      setWorkflowDialogOpen(false);
    }

  }, [isWorkflowLoading, workflowError, workflowDownloadStatus]);

  const handleBackButton = () => {
    navigate('/', { state: 'login-page' })
  }

  const handleNetworkRouting = () => {
    navigate('/network')
  }

  const handleOnChange = (input) => {
    setPin(input);
  };

  const handleKeyPress = (btn) => {
    if (btn === '{enter}') {
      setShowError(false);
      dispatch(userAuth.extraActions.userLogin({ id: operator.id, pin: pin }))
      setDisableBackButton(true);
    } else if (btn === '{bksp}') {
      setPin(pin.substring(0, pin.length - 1));
    } else {
      setPin(pin + btn)
    }
  }

  const handleWorkflowClose = () => {
    dispatch(userAuth.extraActions.userLogout())
    dispatch(workflow.actions.clearWorkflow())
    setWorkflowDialogOpen(false);
    navigate('/')
  }

  return (
    <Grid container height={'100%'}>
      <Grid container item xs={12} display={'flex'} justifyContent={'space-between'}  >
        <Grid item >
          <IconButton aria-label="delete" size="large" onClick={handleBackButton} disabled={disableBackButton} >
            <ArrowBackIcon color="primary" sx={{ fontSize: '4em' }} />
          </IconButton>
        </Grid>
        <Grid item alignItems={'center'} display={'flex'}>
          <Typography variant="h1" textAlign={'center'}>
            {t('login_page.title')}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton aria-label="delete" size="large" onClick={handleNetworkRouting}>
            <InfoIcon color="primary" sx={{ fontSize: '4em' }} />
          </IconButton>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper
          display={'flex'}
          variant="outlined"
          sx={{
            padding: '1.5em 3em',
            margin: 'auto',
            minWidth: '20em',
            maxWidth: '60em',
            justifyContent: 'left'
          }}
        >
          <Stack direction={'row'}>
            <Box>
              <AccountBoxIcon color="primary" sx={{ fontSize: '13.7em' }} />
            </Box>
            <Box padding={3} display={'flex'} flexDirection={'column'} justifyContent={'space-around'}>

              <Typography variant="h3" mt={2} mb={4} sx={{ wordBreak: 'break-all', wordWrap: 'break-word' }}>
                {operator?.name}
              </Typography>

              {
                (!authSuccess && !autoLoginRequest) &&
                <TextField
                  name="pin"
                  type="password"
                  size="medium"
                  sx={{ padding: '0em', }}
                  inputProps={{
                    sx: { fontSize: '5em', height: '1em', paddingY: '0em' },
                  }}
                  value={pin}
                  disabled={isAuthLoading}
                />}

            </Box>
          </Stack>
        </Paper>

      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'center'}   >
        <Box padding={3} height={'3em'}>
          {
            showError &&
            < Alert
              severity="error"
              variant="filled"
              sx={{ fontSize: '1.8em' }}
            >
              {
                t(`login_page.${errorMsg}`) !== `login_page.${errorMsg}`
                  ?
                  t(`login_page.${errorMsg}`)
                  :
                  errorMsg
              }
            </Alert>
          }
          {
            isAuthLoading &&
            < Alert
              severity="info"
              variant="filled"
              sx={{ fontSize: '1.8em' }}
            >
              {t('login_page.authenticating')}
            </Alert>
          }
        </Box>
      </Grid>
      <Grid item xs={12} display={'flex'} justifyContent={'center'}   >
        <Box padding={3}>
          <Alert
            severity={authSuccess ? "success" : "info"}
            variant="filled"
            sx={{ fontSize: '1.8em', visibility: autoLoginRequest ? 'visible' : 'hidden' }}
          >
            {t('desktop_app.auto_login_request')}
          </Alert>
        </Box>
      </Grid>
      {

        <Grid item xs={12} display={'flex'} justifyContent={'center'} visibility={(authSuccess || autoLoginRequest) ? 'hidden' : 'visible'} >
          <LoginKeyboard
            handleOnChange={handleOnChange}
            handleKeyPress={handleKeyPress}
            disabled={isAuthLoading}
            pinLength={pin.length}
          />
        </Grid>
      }
      <WorkflowDownloadDialog
        open={workflowDialogOpen}
        isLoading={isWorkflowLoading}
        isSuccess={workflowDownloadStatus}
        onClose={handleWorkflowClose}
        handleWorkflowSuccess={handleWorkflowSuccess}
        restrictedFeatures={restricted_features}
      />
    </Grid >
  )
}

export default LoginPage;
