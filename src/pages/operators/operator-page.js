import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { CircularProgress } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PageError from "../../components/page-error/page-error";
import * as operatorService from "../../services/operator.service";
import * as systemInfoService from "../../services/info.service";
import * as demoModeService from "../../services/demo.service";
import userAuth from '../../redux/reducers/user-auth'
import workflow from '../../redux/reducers/workflow'
import applicationState from "../../redux/reducers/application-state";
import deviceApi from "../../redux/reducers/device-api"
import { useDispatch } from "react-redux";
import { addEllipsis } from "../../utils/string-operation";
import DemoModeConfirmation from "./demo-mode-popup";

function OperatorPage() {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loc = useLocation();
  const { isTimeSynced } = useSelector((state) => state.deviceAPI);
  const { refresh_login_page } = useSelector((state) => state.userAuth);
  const { demo_mode } = useSelector((state) => state.applicationState);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoConfigFetchCompleted, setDemoConfigFetchCompleted] = useState(false);

  const [operators, setOperators] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null)
  const [error, setError] = useState(null);
  const [timeSyncStatus, setTimeSyncStatus] = useState(false);
  const [systemVersion, setSystemVersion] = useState(null);
  const [timeSyncMsg, setTimeSyncMsg] = useState(t('operator_page.syncing_time'));
  const [operatorMsg, setOperatorMsg] = useState(t('operator_page.loading_data'));
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState(null);

  const { is_demo_mode_available, show_demo_confirmation_popup, max_allowed_demo_measurements } = demo_mode;

  const handleNetworkRouting = () => {
    navigate('/network')
  }

  const gotDemoModeConfirmation = () => {
    return isDemoConfigFetchCompleted && !show_demo_confirmation_popup
  }

  useEffect(() => {
    if (refresh_login_page && gotDemoModeConfirmation()) {
      handleRenewBtnClick();
    }
  }, [refresh_login_page, isDemoConfigFetchCompleted, show_demo_confirmation_popup])


  useEffect(() => {
    loadDemoModeConfigs()
  }, [])


  useEffect(() => {
    if (gotDemoModeConfirmation()) {
      loadSystemVersion();
      getSystemInfo(loc.state !== 'login-page' || is_demo_mode_available);
      getDeviceAppPairStatus();
      dispatch(userAuth.actions.resetState());
      dispatch(workflow.actions.clearWorkflow());
    }
  }, [loc, show_demo_confirmation_popup, isDemoConfigFetchCompleted]);


  useEffect(() => {
    if (retryCount < 5 && gotDemoModeConfirmation()) {
      handleReryMsg()
    }
  }, [retryCount])


  const loadDemoModeConfigs = async () => {
    const { status, data: configData } = await demoModeService.getDemoModeConfigs();
    const isDemoConfigFileAvailable = status && configData?.is_demo_mode_available;

    dispatch(applicationState.actions.updateDemoMeasureCounts({
      allowed: isDemoConfigFileAvailable ? (configData?.max_allowed_measurements ?? 200) : 0,
      remaining: isDemoConfigFileAvailable ? (configData?.remaining_measurements ?? 200) : 0,
    }));

    dispatch(applicationState.actions.updateDemoModeAvailableState(isDemoConfigFileAvailable));
    dispatch(applicationState.actions.updateDemoModeConfirmationPopup(isDemoConfigFileAvailable));
    setDemoConfigFetchCompleted(true);
  }

  const handleRenewBtnClick = () => {

    if (systemInfo) {
      loadOperatorList(true).catch((err) => {
        console.error('ERROR IN OPERATOR LOAD LIST', err)
      });
    } else {
      setIsLoading(true);
      setRetryCount(0)
      setError(null)
      !isTimeSynced ? setTimeSyncMsg(t('operator_page.syncing_time')) : setOperatorMsg(t('operator_page.loading_data'))
      getSystemInfo(true).catch((err) => {
        console.error('ERROR IN GET SYSTEM INFO', err)
      });
    }
    dispatch(userAuth.actions.autoRefreshLoginPage(false));
  }

  const handleOperatorBtnClick = (operator) => {
    navigate('/login', { state: { operator } })
  }

  const loadSystemVersion = async () => {
    try {
      const { status, data } = await systemInfoService.getSystemVersion();
      setSystemVersion(data?.version || '');
    } catch (error) {
      console.error('Error in loading systemVersion ', JSON.stringify(error));
    }
  }

  const getDeviceAppPairStatus = async () => {
    const { status, data } = await systemInfoService.getDeviceAppPairStatus();
    if (status) dispatch(deviceApi.actions.setPairStatus(data == 1))
  }

  /**
  * Get the system status before getting other pages
  */
  const getSystemInfo = async (is_refetch) => {
    console.info("TIME SYNC STATUS:", isTimeSynced);
    if (!isTimeSynced) { //used to sync time on boot
      setTimeSyncStatus(false);
      setIsLoading(is_refetch);

      const timeSyncData = await systemInfoService.checkTimeSyncStatus();
      setResult(timeSyncData)
      setTimeSyncStatus(true);
      if (!timeSyncData.status) {
        setRetryCount(retryCount + 1);
        return
      } else {
        dispatch(deviceApi.actions.updateTimeSync(true)); //on boot, time sync
        dispatch(deviceApi.actions.triggerRefreshTime(true));
        setError(null)
        setRetryCount(0)
      }
    }


    const result = await systemInfoService.getSystemInfo(is_refetch);
    setResult(result)
    if (result.status) {
      dispatch(userAuth.actions.updateSystemInfo(result.data));
      setSystemInfo(result.data);
      loadOperatorList(is_refetch).catch(err => { })
      setRetryCount(0)
    } else {
      setRetryCount(retryCount + 1);
    }

  }


  const handleReryMsg = async () => {
    if (retryCount >= 1 && retryCount <= 3) {
      !isTimeSynced ? setTimeSyncMsg(t('operator_page.syncing_time_1')) : setOperatorMsg(t('operator_page.loading_data_1'))
    }
    if (retryCount === 4) {
      const { data } = await systemInfoService.getSystemSerialNumber();
      if (data?.serial_number) {
        dispatch(userAuth.actions.updateSystemInfo({ "serial_number": data.serial_number }));
      }
      setSystemInfo(null);
      setError(result.error)
      setIsLoading(false);
      return;
    }
    getSystemInfo(true).catch((err) => {
      console.error('ERROR IN GET SYSTEM INFO', err)
    });
  }

  /**
  * Load the operator list once get the system status
  */
  const loadOperatorList = async (isRefresh) => {
    try {
      setIsLoading(true);
      const result = await operatorService.getOperatorList({ is_refresh: isRefresh });

      if (result.status) {
        if (result.data?.rows?.length === 0) {
          setError({ message: 'operator_not_found' });
        } else {
          setError(null)
        }
        setOperators(result.data?.rows || []);
      } else {
        setOperators([]);
        setError(result.error);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }

  }

  // TODO show backdrop on loading
  return (
    <Box width={'100%'} height={'100%'} >
      <Box width={'100%'} height={'95%'}>
        {
          (demo_mode.show_demo_confirmation_popup)
            ? <DemoModeConfirmation maxMeasurement={max_allowed_demo_measurements} />
            : <>
              {
                Boolean(isLoading) &&
                <Box height={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <CircularProgress size={70} />
                  <Typography variant='h3' marginLeft={5} padding={4} textAlign={'center'}>
                    {
                      isDemoConfigFetchCompleted
                        ? isTimeSynced ? operatorMsg : timeSyncMsg
                        : t('common.message.please_wait')
                    }
                  </Typography>
                </Box>

              }
              {
                Boolean(!isLoading && error) &&
                <PageError
                  message={
                    t(`operator_page.system_error.${error.message}`) === `operator_page.system_error.${error.message}`
                      ?
                      error.message
                      :
                      t(`operator_page.system_error.${error.message}`)
                  }
                  severity="warning"
                />
              }
              {
                Boolean(!isLoading) &&
                <Grid container height={'100%'} >
                  <Grid container display={'flex'} justifyContent={'space-between'} height={'10%'}>
                    <Grid item>
                    </Grid>
                    <Grid item>
                      <IconButton aria-label="delete" size="large" onClick={handleNetworkRouting}>
                        <InfoIcon color="primary" sx={{ marginRight: '0.2em', fontSize: '4em' }} />
                      </IconButton>
                      <IconButton aria-label="delete" size="large" onClick={handleRenewBtnClick} >
                        <AutorenewIcon color="primary" sx={{ fontSize: '4em' }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {
                    Boolean(!isLoading && !error && operators?.length) &&
                    <Grid container item xs={12} height={'90%'} display={'block'}>
                      <Grid item xs={12} marginY={2} height={'8%'}>
                        <Typography variant="h1" textAlign={'center'}>
                          {t('operator_page.title')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} height={'86%'} display={'flex'}>
                        <Paper
                          display={'flex'}
                          variant="outlined"
                          sx={{
                            margin: 'auto',
                            overflowY: 'auto',
                            textAlign: 'center',
                            width: '42vw',
                            paddingX: '4em',
                            minHeight: 'auto',
                            maxHeight: '58vh',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {
                            operators.map((operator, index) => (
                              <Box sx={{ paddingY: '3em' }} key={operator.id} >
                                <Button
                                  size="large"
                                  variant="contained"
                                  color="primary"
                                  sx={{
                                    paddingY: '0.6em',
                                    width: '37vw',
                                    textOverflow: 'clip',
                                    textAlign: 'center'
                                  }}
                                  onClick={() => { handleOperatorBtnClick(operator) }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      letterSpacing: '0.03em',
                                      textOverflow: 'ellipsis',
                                      overflow: 'hidden',
                                      width: '35vw',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                    }}>
                                    <AccountCircleIcon sx={{ fontSize: '1.1em !important', marginRight: 4 }} />
                                    {addEllipsis(operator.name, 15, false)}
                                  </Typography>

                                </Button>
                              </Box>
                            ))
                          }
                        </Paper>
                      </Grid>
                    </Grid>

                  }
                </Grid>
              }
            </>
        }

      </Box>
      <Box width={'100%'} height={'5%'} textAlign={'right'}>
        <Typography variant="body" textAlign={'center'} fontSize={'2em'} >
          {systemVersion}
        </Typography>
      </Box>
    </Box>
  )
}

export default OperatorPage;
