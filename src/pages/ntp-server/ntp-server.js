import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import settings from "../../redux/reducers/settings"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import * as ntpServerService from "../../services/ntp-server.service"
import { useDispatch, useSelector } from "react-redux";
import { useKeyboard } from "../../hooks/useKeyboard";
import { openOnboardKeyboard, toggleOnboardKeyboard, closeOnboardKeyboard } from "../../services/keyboard.service";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";

function NtpServer() {
  const dispatch = useDispatch();
  const { ntp_server_list } = useSelector((state) => state.settings)
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isBackClicked, setIsBackClicked] = useState(false);
  const [customNtpServer, setCustomNtpServer] = useState('');
  const [ntpServerList, setNtpServerList] = useState(ntp_server_list);
  const [showCustomTextField, setShowCustomTextField] = useState(false);
  const [serverEditingIndex, setServerEditingIndex] = useState(-1);
  const [showKeyboard, hideKeyboard] = useKeyboard()
  const [showMsg, setShowMsg] = useState(false);
  const [result, setResult] = useState({ status: false });
  const [validationError, setValidationError] = useState(false)

  const style = {
    validation_font: { fontSize: '2.5em', display: 'flex' },
    status_code: { fontSize: '2.2em', marginTop: "3%", minWidth: "20%" },
    result_text: { fontSize: '2.2em', marginTop: "3%", minWidth: "30%" }
  }

  const validateServerAddress = (address) => {
    const ntpServerRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})+$/;
    const result = ntpServerRegex.test(address);
    setValidationError(!result);
    return result
  }

  const handleCustomNtpServerChange = (event) => {
    setCustomNtpServer(event.target.value);
    if (event.target.value.trim() === '') {
      setValidationError(true);
    } else {
      if (!validateServerAddress(event.target.value)) {
        setValidationError(true);
      }
    }
  };

  const handleAddCustomNtpServer = () => {
    if (customNtpServer && !ntpServerList.includes(customNtpServer) && !validationError) {
      setNtpServerList([...ntpServerList, customNtpServer]);
      setCustomNtpServer("");
      setShowCustomTextField(false);
      hideKeyboard();
    }
  };

  const handleToggleCustomTextField = () => {
    setShowCustomTextField(true);
    showKeyboard();
  };
  const handleSave = async () => {
    const result = await ntpServerService.setNtpServer(ntpServerList)
    setShowMsg(true);
    setResult({ status: true });
    dispatch(settings.actions.setNtpServerList(ntpServerList));

  };
  const handleLoadNtpServer = async () => {
    setShowMsg(false);
    const result = await ntpServerService.getNtpServerList();
    if (result?.status) {
      setNtpServerList(result.data?.ntpList);
    }

  };
  const handleDeleteNtpServer = (index) => {
    setShowMsg(false);
    const updatedList = [...ntpServerList];
    updatedList.splice(index, 1);
    setNtpServerList(updatedList);

  };

  const handleEditNtpServer = (index) => {
    setShowMsg(false);
    setServerEditingIndex(index);
    setCustomNtpServer(ntpServerList[index]);
    setShowCustomTextField(true);
    showKeyboard();
  };

  const handleSaveEditedNtpServer = () => {
    if (customNtpServer && !ntpServerList.includes(customNtpServer) && !validationError) {
      const updatedList = [...ntpServerList];
      updatedList[serverEditingIndex] = customNtpServer;
      setNtpServerList(updatedList);
      setServerEditingIndex(-1);
      setCustomNtpServer("");
      setShowCustomTextField(false);
      hideKeyboard();
    }
  };

  const handleCancel = () => {
    setValidationError(false);
    setServerEditingIndex(-1);
    setCustomNtpServer("");
    setShowCustomTextField(false)
  }
  const handleFocus = async () => {
    await openOnboardKeyboard()
  }

  useEffect(() => {
    handleLoadNtpServer()
  }, [])

  useEffect(() => {
    if (isBackClicked) {
      navigate(-1);
    }
  }, [isBackClicked]);

  const handleBack = () => {
    setIsBackClicked(true);
  }

  return (
    <Grid container height={"80vh"} width={"100%"} display="flex" >
      <Grid container item xs={12} display={"flex"} height={'10vh'}>
        <Grid item xs={6} display={'flex'}>
          <IconButton
            size="large"
            onClick={handleBack}
          >
            <ArrowBackIcon color="primary" sx={{ fontSize: '3em' }} />
          </IconButton>

          <Typography variant="h3" sx={{ display: 'flex', alignItems: "center" }} >
            {t('network_page.ntp_server.ntp_server_configration')}
          </Typography>
        </Grid>
        <Grid item xs={6} display={'flex'} justifyContent={'end'} paddingY={4}>
          <Button
            variant="contained"
            onClick={handleToggleCustomTextField}
            startIcon={<AddIcon sx={{ height: '2em', width: '2em' }} />}
            disabled={ntpServerList.length >= 3 || showCustomTextField}
          >
            <Typography variant="body8" >{t('common.button.add')}</Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid container item xs={12} sx={{ height: "70vh" }} >
        <Paper variant="outlined" sx={{ width: '100%', height: '95%' }}>
          <Grid
            container
            item
            xs={12}
            height={'100%'}
            rowGap={10}
            paddingX={15}
            paddingY={10}
          >
            <Grid item xs={12} alignItems={'center'} justifyContent={'left'} height={'10%'} >
              <SettingsKey name={'network_page.ntp_server.server'} />
            </Grid>
            <Grid container item xs={12} height={'90%'}>
              <List sx={{ marginLeft: 5, height: '100%', width: '100%', fontSize: '3em' }} >
                {
                  ntpServerList.map((ntpServer, index) => (
                    index === serverEditingIndex && showCustomTextField ? (
                      <ListItem key={index}>
                        <TextField
                          id="custom-ntp-server"
                          variant="outlined"
                          placeholder={t('network_page.ntp_server.enter_ntp_server')}
                          value={customNtpServer}
                          onChange={handleCustomNtpServerChange}
                          onFocus={handleFocus}
                          error={validationError}
                          sx={{ width: "86%", padding: 4 }}
                          inputProps={{ maxLength: 25 }}
                        />
                        <Grid item width={'12%'} display={'flex'} justifyContent={'space-around'}>
                          {customNtpServer.length !== 0 &&
                            <IconButton
                              edge="end"
                              aria-label="add"
                              onClick={handleSaveEditedNtpServer}
                            >
                              <CheckCircleRoundedIcon sx={{ height: '2em', width: '2em' }} color="primary" />
                            </IconButton>}
                          <IconButton
                            aria-label="cancel"
                            onClick={() => handleCancel()}
                          >
                            <CancelIcon sx={{ height: '2em', width: '2em' }} color="error" />
                          </IconButton>
                        </Grid>

                      </ListItem>
                    ) : (
                      <ListItem key={index} sx={{ marginY: '32px' }}>
                        <ListItemText sx={{ padding: 4, border: '2px solid #eee' }} primary={ntpServer} />
                        {(
                          <ListItemSecondaryAction>
                            {(ntpServer !== "") && (
                              <Stack direction="row" alignItems="center" spacing={15} marginRight={10}>
                                <IconButton
                                  aria-label="Edit"
                                  onClick={() => handleEditNtpServer(index)}
                                >
                                  <EditIcon sx={{ height: '2em', width: '2em' }} color="primary" />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDeleteNtpServer(index)}
                                >
                                  <CancelIcon sx={{ height: '2em', width: '2em' }} color="error" />
                                </IconButton>
                              </Stack>
                            )}
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    )
                  ))}
                {(ntpServerList.length === 0) && !showCustomTextField &&
                  <Typography height={'50%'} justifyContent={'center'} textAlign={'center'} alignItems={'center'} >
                    {t('network_page.ntp_server.no_server_configured')}
                  </Typography>}
                {
                  (serverEditingIndex == -1) && showCustomTextField &&
                  (
                    <ListItem>
                      <TextField
                        id="custom-ntp-server"
                        placeholder={t('network_page.ntp_server.enter_ntp_server')}
                        variant="outlined"
                        value={customNtpServer}
                        onFocus={handleFocus}
                        onChange={handleCustomNtpServerChange}
                        error={validationError}
                        sx={{ width: "100%", padding: 4 }}
                        inputProps={{ maxLength: 25 }}
                      />
                      <Grid item width={'12%'} display={'flex'} justifyContent={'space-around'}>
                        {customNtpServer.length !== 0 &&
                          <IconButton
                            edge="end"
                            aria-label="add"
                            onClick={handleAddCustomNtpServer}
                          >
                            <CheckCircleRoundedIcon sx={{ height: '2em', width: '2em' }} color="primary" />
                          </IconButton>}
                        <IconButton
                          aria-label="cancel"
                          onClick={() => handleCancel()}
                        >
                          <CancelIcon sx={{ height: '2em', width: '2em' }} color="error" />
                        </IconButton>
                      </Grid>

                    </ListItem>
                  )
                }
              </List>
            </Grid>
          </Grid>
        </Paper>
        <Grid display={'flex'} width={'100%'} flexDirection={'row'}>
          <Grid item xs={8}>
            <SettingsInfoMessage
              isShow={showMsg}
              message={result?.status ? 'common.message.data_saved_successfully' : 'common.message.failed_to_save_data'}
              status={result?.status}
            />
          </Grid>
          <Grid container item xs={12} paddingTop={5} display={'flex'} alignItems={'center'} justifyContent={'right'}>
            <Button
              variant='contained'
              onClick={handleSave}
              sx={{ width: '10em', height: '3em' }}
              disabled={showCustomTextField}
            >
              <Typography fontSize={'1.7em'}>{t('common.button.save')}</Typography>
            </Button>

          </Grid>
        </Grid>
      </Grid>
    </Grid >
  )
}

export default NtpServer;
