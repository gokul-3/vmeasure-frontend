import React, { useEffect, useState } from "react";
import * as timezoneService from '../../services/timezone.service';
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";
import navigationController from "../../redux/reducers/nav-bar-controller";
import {
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Box,
  Chip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { SettingsSaveButton } from "../../components/button/settings-save-button";
import { PermissionModules } from "../../constants";
import usePermission from "../../hooks/usePermission";
import { rebootDevice } from "../../services/utils.service";

function TimezonePage() {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [timezoneList, setTimezoneList] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [existingTimeZone, setExistingTimeZone] = useState('');
  const [dialogOpen, changeDialogBoxState] = useState(false);
  const [inProgress, setInProgress] = useState(false)
  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_TIMEZONE_UPDATE)
  const [msgAreaProps, setMsgAreaProps] = useState({ isShow: false, status: false, msg: '' });
  const { system_settings } = useSelector((state) => state.settings);

  const handleResult = (data, isSuccess) => {
    setMsgAreaProps({
      isShow: true,
      status: data.status,
      msg: data.status ? 'time_zone_page.success_msg' : 'time_zone_page.failure_msg'
    });
    changeDialogBoxState(false);

    if (isSuccess) {
      setTimeout(() => {
        rebootDevice('timezone');
      }, 3000)
    } else {
      setInProgress(false);
      dispatch(navigationController.actions.enaleNavigation());
    }

  }

  const handleConfirmationClose = (isConfirmed) => {
    if (isConfirmed) {

      dispatch(navigationController.actions.disableNavigation());
      setInProgress(true);
      changeDialogBoxState(false);

      timezoneService.setTimezone({ selectedTimezone }).then((result) => {
        handleResult(result, true)
      }).catch((err) => {
        console.error(err);
        handleResult({ status: false }, false)
      });

    } else {
      changeDialogBoxState(false);
    }

  }

  const handleChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const handleSave = () => {
    changeDialogBoxState(true)
  }

  useEffect(() => {
    timezoneService.getTimezoneList().then(
      (result) => {
        console.log(result)
        if (result.status) {
          setTimezoneList(result.data)
        }
      })
      .catch((err) => {
        setTimezoneList([])
      })

    //selected timezone
    timezoneService.getCurrentdTimezone().then(
      (result) => {
        if (result.status) {
          setSelectedTimezone(result.data);
          setExistingTimeZone(result.data);
        }
      })
      .catch((err) => {
        setSelectedTimezone('');
        setExistingTimeZone('');
      })
  }, [])

  useEffect(() => {
    setSelectedTimezone(system_settings.time_zone);
  }, [system_settings]);

  useEffect(() => {
    
    if (hasPermission === false) {
      setMsgAreaProps({ isShow: true, msg: 'common.message.permission_denied', status: false });
    } else {
      setMsgAreaProps({ isShow: false });
    }
  }, [hasPermission])

  return (
    <>
      <ConfirmationDialog
        open={dialogOpen}
        content={t('time_zone_page.confirmation_dialog.content')}
        title={t('time_zone_page.confirmation_dialog.title')}
        buttonValue={t('time_zone_page.confirmation_dialog.ok')}
        onClose={handleConfirmationClose}
      />
      <Grid container rowSpacing={5} height={'100%'}>
        <Grid item xs={12} display={'flex'} alignContent={'center'} height={'10%'}>
          <PageTitle title={t('time_zone_page.title')} isBackNavEnabled={true} />
        </Grid>
        <Grid container item xs={12} height={'80%'}>
          <Paper variant="outlined" sx={{ width: '100%', padding: 10 }}>
            <Grid
              container
              item
              xs={12}
              height={'100%'}
              margin={'auto'}
              alignContent={'center'}
              justifyContent={'center'}
              padding={10}
            >
              <Grid item xs={6} display={'flex'} alignItems={'flex-start'} flexDirection={'column'}>
                <SettingsKey name={'time_zone_page.timezone_list'} />
              </Grid>
              <Grid item xs={6} display={'flex'} alignItems={'flex-end'} flexDirection={'column'}>
                {
                  timezoneList.length === 0
                    ?
                    <Box display={'flex'} sx={{ width: '37vw', height: '7vh' }} justifyContent={'center'} alignItems={'center'}>
                      <CircularProgress />
                    </Box>
                    : <FormControl >
                      <Select
                        value={selectedTimezone}
                        onChange={handleChange}
                        sx={{ width: '37vw', height: '7vh', }}
                        inputProps={{ readOnly: !hasPermission }}
                      >
                        {
                          timezoneList.map((timezone, index) => (
                            <MenuItem
                              key={timezone?.timezone}
                              value={timezone?.timezone}
                            >
                              <Box sx={{
                                width: '90%',
                                height: '5vh',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                                <Typography variant="body" component="span" sx={{ width: '7vw' }}>
                                  {timezone?.timezone}
                                </Typography>
                                <Chip label={timezone?.utcTime} color="primary" size="large" sx={{ fontSize: '1em', height: '4vh' }} />
                              </Box>
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                }
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid container item justifyContent={'space-between'} height={'10%'}>
          <Grid item >
            {
              <SettingsInfoMessage
                isShow={msgAreaProps.isShow}
                message={msgAreaProps.msg}
                status={msgAreaProps.status}
              />
            }
          </Grid>
          {
            <Grid item>
              {hasPermission &&
                <SettingsSaveButton
                  onSaveClick={handleSave}
                  disableCdn={timezoneList.length === 0 || existingTimeZone === selectedTimezone || inProgress} />
              }
            </Grid>
          }

        </Grid>
      </Grid >
    </>

  )
}

export default TimezonePage;
