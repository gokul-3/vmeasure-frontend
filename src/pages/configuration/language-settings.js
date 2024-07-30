import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as ConfigurationService from "../../services/configuration.service"
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";
import {
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Slider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import applicationState from "../../redux/reducers/application-state";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import { SettingsSaveButton } from "../../components/button/settings-save-button";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import styled from 'styled-components/macro';
import { LanguageValues, FontSize, PermissionModules, VolumeLevel } from "../../constants";
import usePermission from "../../hooks/usePermission";

const StyledSlider = styled(Slider)({
  '& .MuiSlider-thumb': {
    fontSize: "15px",
    height: "35px",
    width: "35px"
  },
})

export default function LanguageSettings() {

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { font_size: savedFontSize, trigger_service } = useSelector((state) => state.applicationState);
  const [selectedLanguage, setSelectedLanguage] = useState({ displayLanguage: 'en', inputLanguage: 'en' })
  const [savedLanguage, setSavedLanguage] = useState({ displayLanguage: '', inputLanguage: '' })
  const [selectedFontSize, setSelectedFontSize] = useState(FontSize.DEFAULT)
  const [selectedVolumeLevel, setSelectedVolumeLevel] = useState(0);
  const [savedVolumeLevel, setSavedVolumeLevel] = useState(0);
  const [savedTSPopupTimer,setSavedTSPopupTimer] = useState(trigger_service.popupTimer ?? 0);
  const [selectedTSPopupTimer,setSelectedTSPopupTimer] = useState(trigger_service.popupTimer ?? 0);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showMsg, setShowMsg] = useState(false)
  const [result, setResult] = useState({ status: false })
  const [secondInputLanguage, setSecondInputLanguage] = useState({});
  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_SYSTEM_UPDATE);

  const languages = [
    {
      id: 1,
      value: 'en',
      label: 'English - EN'
    },
    {
      id: 2,
      value: 'es',
      label: 'Español - ES'
    },
  ]
  const firstInputLanguage = {
    id: 1,
    value: 'en',
    label: 'English - EN'
  }

  const fontSize = [
    {
      'id': 1,
      'size': "DEFAULT",
      'label': t('configurations.FontSettings.default')
    },
    {
      'id': 2,
      'size': "LARGE",
      'label': t('configurations.FontSettings.large')
    }
  ]

  const triggerServicePopupTimer = [
    {
      id: 1,
      value: 0,
      label: "Manual"
    },
    {
      id: 2,
      value: 1,
      label: "1 Sec"
    },
    {
      id: 3,
      value: 2,
      label: "2 Sec"
    },
    {
      id: 4,
      value: 5,
      label: "5 Sec"
    },
    {
      id: 5,
      value: 10,
      label: "10 Sec"
    }
  ]

  const handleLanguageChange = (event) => {
    setShowMsg(false);
    const updateLanguage = {
      ...selectedLanguage,
      displayLanguage: event.target.value,
    }
    const selected = languages.find(lang => lang.value === event.target.value);
    if (selected.value === 'en') {
      updateLanguage.inputLanguage = 'en';
      setSecondInputLanguage({});
    }
    else {
      setSecondInputLanguage({ ...selected });
    }
    setSelectedLanguage(updateLanguage);
  }

  const handleKeyboardLanguageChange = (event) => {
    setShowMsg(false);
    const updateLanguage = {
      ...selectedLanguage,
      inputLanguage: event.target.value
    }
    setSelectedLanguage(updateLanguage)
  }

  const handleFontSizeChange = (event) => {
    setShowMsg(false);
    setSelectedFontSize(event.target.value)
  }

  const handleSliderChange = (event) => {
    setSelectedVolumeLevel(event.target.value);
  }

  const handleTriggerServiceTimerChange = (e) => {
    setSelectedTSPopupTimer(e.target.value)
  }

  const handleSave = () => {
    setIsDialogOpen(true)
  }

  const handleConfirmationClose = async (isConfirmed) => {
    setIsDialogOpen(false)
    if (isConfirmed) {
      const dataToSave = {
        "language": LanguageValues[selectedLanguage.displayLanguage],
        "inputLanguage": LanguageValues[selectedLanguage.inputLanguage],
        "fontSize": FontSize[selectedFontSize],
        "volumeLevel": selectedVolumeLevel,
        "triggerServicePopupTime":selectedTSPopupTimer
      }
      const result = await ConfigurationService.setLanguageSettings(dataToSave)
      setShowMsg(true);
      setResult(result);
      i18n.changeLanguage(selectedLanguage.displayLanguage);
      setSavedLanguage(selectedLanguage);
      setSavedVolumeLevel(selectedVolumeLevel);
      setSavedTSPopupTimer(selectedTSPopupTimer);
      dispatch(applicationState.actions.updateFontSetting(selectedFontSize));
      dispatch(applicationState.actions.updateTriggerServicePopupTime(selectedTSPopupTimer));
    }
  }

  const loadSettings = async () => {
    const loadLanguage = await ConfigurationService.getLanguageSettings();
    const updateLanguage = {
      displayLanguage: loadLanguage?.data?.language || 'en',
      inputLanguage: loadLanguage?.data?.inputLanguage || 'en',
    }
    if (updateLanguage.displayLanguage !== 'en') {
      const selected = languages.find(lang => lang.value === updateLanguage.displayLanguage);
      setSecondInputLanguage({ ...selected });
    }
    setSelectedVolumeLevel(VolumeLevel[loadLanguage?.data?.volumeLevel] || loadLanguage?.data?.volumeLevel)
    setSavedVolumeLevel(VolumeLevel[loadLanguage?.data?.volumeLevel] || loadLanguage?.data?.volumeLevel)
    setSelectedFontSize((loadLanguage?.data?.fontSize || FontSize.DEFAULT).toUpperCase())
    dispatch(applicationState.actions.updateFontSetting((loadLanguage?.data?.fontSize || FontSize.DEFAULT).toUpperCase()))
    setSavedLanguage(updateLanguage);
    setSelectedLanguage(updateLanguage);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const saveBtnDisable = (savedLanguage.displayLanguage === selectedLanguage.displayLanguage) &&
    (savedLanguage.inputLanguage === selectedLanguage.inputLanguage) && (selectedFontSize === savedFontSize)
    && (selectedVolumeLevel === savedVolumeLevel) && (savedTSPopupTimer === selectedTSPopupTimer)
  return (
    <>
      <ConfirmationDialog
        open={isDialogOpen}
        content={t('configurations.language_settings.confirmation_dialog.content')}
        title={t('configurations.language_settings.confirmation_dialog.title')}
        buttonValue={t('configurations.language_settings.confirmation_dialog.ok')}
        onClose={handleConfirmationClose}
      />
      <Grid container rowSpacing={5} height={'100%'}>
        <Grid item xs={12} display={'flex'} alignContent={'center'} height={'10%'}>
          <PageTitle title={t('configurations.language_settings.page_title')} isBackNavEnabled={true} />
        </Grid>

        <Grid container item xs={12} height={'80%'}>
          <Paper variant="outlined" sx={{ width: '100%', padding: 10, display: "flex", justifyContent: "center" }}>
            <Grid
              container
              item
              xs={12}
              height={'100%'}
              padding={10}
              sx={{ height: "45vh" }}
              rowSpacing={10}
            >
              <Grid container item xs={12}>
                <Grid item xs={6} display={'flex'} alignItems={'flex-start'} flexDirection={'column'}>
                  <SettingsKey name={'configurations.language_settings.language'} />
                </Grid>
                <Grid item xs={6} display={'flex'} alignItems={'flex-end'} flexDirection={'column'}>
                  {
                    <FormControl >
                      <Select
                        value={selectedLanguage.displayLanguage}
                        onChange={handleLanguageChange}
                        sx={{ width: '37vw', height: '7vh', }}
                        inputProps={{ readOnly: !hasPermission }}
                      >
                        {
                          languages.map((language, index) => (
                            <MenuItem key={language.id} value={language.value} >
                              {language.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  }
                </Grid>
              </Grid>

              <Grid container item xs={12}>
                <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                  <SettingsKey name={'configurations.language_settings.keyboard_language'} />
                </Grid>
                <Grid item xs={6} display={'flex'} alignItems={'flex-end'} flexDirection={'column'}>
                  {
                    <FormControl >
                      <Select
                        value={selectedLanguage.inputLanguage}
                        onChange={handleKeyboardLanguageChange}
                        sx={{ width: '37vw', height: '7vh', }}
                        inputProps={{ readOnly: !hasPermission }}
                      >
                        <MenuItem key={firstInputLanguage.id} value={firstInputLanguage.value} >
                          {firstInputLanguage.label}
                        </MenuItem>
                        {secondInputLanguage.id ? (
                          <MenuItem key={secondInputLanguage.id} value={secondInputLanguage.value} >
                            {secondInputLanguage.label}
                          </MenuItem>
                        ) : ""}
                      </Select>
                    </FormControl>
                  }
                </Grid>
              </Grid>

              <Grid container item xs={12}>
                <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                  <SettingsKey name={'configurations.FontSettings.font_size'} />
                </Grid>
                <Grid item xs={6} display={'flex'} alignItems={'flex-end'} flexDirection={'column'}>
                  {
                    <FormControl >
                      <Select
                        value={selectedFontSize}
                        onChange={handleFontSizeChange}
                        sx={{ width: '37vw', height: '7vh', }}
                        inputProps={{ readOnly: !hasPermission }}
                      >
                        {
                          fontSize.map((font) =>
                            <MenuItem key={font.id} value={font.size}>
                              {font.label}
                            </MenuItem>
                          )
                        }
                      </Select>
                    </FormControl>
                  }
                </Grid>
              </Grid>
              {
                Boolean(trigger_service.status && trigger_service.isPopupRequired) &&
                <Grid container item xs={12}>
                  <Grid item xs={6} display={'flex'} alignItems={'flex-start'} flexDirection={'column'}>
                    <SettingsKey name={'configurations.tigger_service.popup_timer'} />
                  </Grid>
                  <Grid item xs={6} display={'flex'} alignItems={'flex-end'} flexDirection={'column'}>
                    {
                      <FormControl >
                        <Select
                          value={selectedTSPopupTimer}
                          onChange={handleTriggerServiceTimerChange}
                          sx={{ width: '37vw', height: '7vh', }}
                          inputProps={{ readOnly: !hasPermission }}
                        >
                          {
                            triggerServicePopupTimer.map((timer, index) => (
                              <MenuItem key={timer.id} value={timer.value} >
                                {timer.label}
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    }
                  </Grid>
                </Grid>
              }
              <Grid container item xs={12} display={'flex'} justifyContent={'center'}>
                <Grid item xs={6} display={'flex'} flexDirection={'column'}>
                  <SettingsKey name={'configurations.VolumeSetting.title'} />
                </Grid>
                <Grid item xs={6} display={'flex'} alignItems={'flex-end'} justifyContent={'center'} flexDirection={'column'} height={"7vh"}>
                  <StyledSlider
                    value={selectedVolumeLevel}
                    valueLabelDisplay="auto"
                    shiftStep={30}
                    step={10}
                    marks
                    min={0}
                    max={100}
                    sx={{ width: '37vw', height: "1.5vh", }}
                    onChange={handleSliderChange}
                  />
                </Grid>
              </Grid>

            </Grid>
          </Paper>
        </Grid>

        <Grid container item justifyContent={'space-between'} height={'10%'}>
          <Grid item>
            <SettingsInfoMessage
              isShow={showMsg}
              message={result?.status ? 'common.message.data_saved_successfully' : 'common.message.failed_to_save_data'}
              status={result?.status}
            />
          </Grid>
          <Grid item>
            {hasPermission &&
              <SettingsSaveButton
                onSaveClick={handleSave}
                disableCdn={saveBtnDisable}
              />
            }
          </Grid>
        </Grid>
      </Grid>
    </>

  )
}

