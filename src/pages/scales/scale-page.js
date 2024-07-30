import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Box
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import * as scaleServices from "../../services/scale.service";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SettingsSaveButton } from "../../components/button/settings-save-button";
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { Certificates, PermissionModules, WeighingScaleReqType } from "../../constants";
import ScaleInfo from "./scale-info";
import usePermission from "../../hooks/usePermission";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

function ScalePage() {

  const { t } = useTranslation();
  const minWeightValues = [0, 10, 20, 30, 40, 50];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scaleList, setScaleList] = useState([]);
  const [msgAreaProps, setMsgAreaProps] = useState({ isShow: false, status: false, msg: '' });
  const [showScaleInfo, setShowScaleInfo] = useState(false);
  const [hasPermission] = usePermission(PermissionModules.SCALE_UPDATE);

  const { device_modes, font_size: fontSize } = useSelector(state => state.applicationState);
  const { metrological_setting } = useSelector(state => state.settings.metrological);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { weighing_scale_name, weighing_scale_unit, weighing_scale_minimum_weight, is_scale_connected } = useSelector((state) => state.settings.weighing_scale)

  const [selectedScaleSetting, setSelectedScaleSetting] = useState({
    weighing_scale_name: 'none',
    weighing_scale_minimum_weight: minWeightValues[0],
    weighing_scale_unit: 'none',
    is_connected: false
  });

  const [supportedUnits, setSupportedUnits] = useState(null);
  // For button disable during the saving process
  const [isDisable, setIsDisable] = useState(false)

  const loadScaleList = async () => {
    const result = await scaleServices.getScaleList({ type: WeighingScaleReqType.METROLOGICAL_SETTING_BASED });

    if (result.status) {
      setScaleList(result.data.rows);
    }

  }

  const loadSupportedUnitsForScale = async (scaleName) => {
    const result = await scaleServices.getSupportedUnits({ weighing_scale_name: scaleName })

    if (!result?.status) {
      return
    }
    setSupportedUnits(result?.data?.rows || []);

  }

  const handleScaleNameChange = async (event) => {

    if (event.target.value === 'none') {
      setSelectedScaleSetting({
        weighing_scale_name: 'none',
        weighing_scale_minimum_weight: minWeightValues[0],
        weighing_scale_unit: 'none',
        is_connected: false
      })
    } else {
      setSelectedScaleSetting({
        ...selectedScaleSetting,
        weighing_scale_name: event.target.value,
        is_connected: false
      });
    }
    if (msgAreaProps.isShow) {
      setMsgAreaProps({ isShow: false });
    }
  };


  useEffect(() => {
    loadSupportedUnitsForScale(selectedScaleSetting.weighing_scale_name);
  }, [selectedScaleSetting.weighing_scale_name])

  const handleScaleUnitChange = (event) => {
    setSelectedScaleSetting({
      ...selectedScaleSetting,
      weighing_scale_unit: event.target.value
    });
  }

  const handleMinWeightChange = (event) => {
    setSelectedScaleSetting({
      ...selectedScaleSetting,
      weighing_scale_minimum_weight: event.target.value
    });
  }

  const handleSaveBtnClick = () => {
    setIsDisable(true);

    if (msgAreaProps.isShow) {
      setMsgAreaProps({ isShow: false });
    }

    if (selectedScaleSetting.weighing_scale_unit == 'none') {
      setScale();
      setDialogOpen(false)
    } else {
      setDialogOpen(true)
    }
  }

  const handleConfirmationClose = (isConfirmed) => {
    if (!isConfirmed) {
      setDialogOpen(false);
      setIsDisable(false);
      return
    }
    setScale();
    setDialogOpen(false);
  }

  useEffect(() => {
    loadScaleList();
  }, [])

  const setScale = () => {
    scaleServices.setScaleSettings(selectedScaleSetting)
      .then((result) => {
        setSelectedScaleSetting({
          ...selectedScaleSetting,
          is_connected: selectedScaleSetting.weighing_scale_name === "none" ? false : result.status
        });
        setIsDisable(false);
        setMsgAreaProps({
          isShow: true,
          status: result.status,
          msg: result?.status ?
            result?.error?.is_calibration_required ? 'scale_page.weighing_scale_save_success_and_do_calibrate'
              : 'scale_page.weighing_scale_save_success'
            : `scale_page.error_messages.${result?.error?.message}`
        });
        return;
      })
      .catch((err) => { })
  }

  const closeScaleInfo = () => {
    setShowScaleInfo(false);
  }

  useEffect(() => {
    setSelectedScaleSetting({
      weighing_scale_name: weighing_scale_name,
      weighing_scale_minimum_weight: weighing_scale_minimum_weight?.toString()?.replace('g', ''),
      weighing_scale_unit: weighing_scale_unit,
      is_connected: is_scale_connected
    });
    console.error('*****************weighing_scale_name, weighing_scale_unit, weighing_scale_minimum_weight, is_scale_connected: ', weighing_scale_name, weighing_scale_unit, weighing_scale_minimum_weight, is_scale_connected)
    setIsDataLoading(false);
  }, [weighing_scale_name, weighing_scale_unit, weighing_scale_minimum_weight, is_scale_connected]);

  useEffect(() => {
    if (supportedUnits === null) {
      return
    }

    if (supportedUnits?.length === 0) {
      setSelectedScaleSetting({
        ...selectedScaleSetting,
        weighing_scale_unit: 'none'
      });

    } else

      if (!selectedScaleSetting?.weighing_scale_unit || selectedScaleSetting?.weighing_scale_unit === 'none') {
        setSelectedScaleSetting({
          ...selectedScaleSetting,
          weighing_scale_unit: supportedUnits[0]
        });
      }
  }, [supportedUnits]);

  useEffect(() => {
    if (hasPermission === false) {
      setMsgAreaProps({ isShow: true, msg: 'common.message.permission_denied', status: false });
    } else {
      setMsgAreaProps({ isShow: false });
    }
  }, [hasPermission])


  return (
    <>
      {showScaleInfo && <ScaleInfo open={showScaleInfo} closeHandler={closeScaleInfo} />}
      {!isDataLoading &&
        <Grid container rowSpacing={5} height={'100%'}  >
          <Grid item xs={12} height={'10%'} display={'flex'} justifyContent={'space-between'}>
            <PageTitle title={t('scale_page.title')} backPage={'/menu'} />
            {device_modes?.is_ntep_required &&
              <IconButton aria-label="info" onClick={() => { setShowScaleInfo(true) }}>
                <InfoIcon color="primary" sx={{ marginRight: '0.2em', fontSize: '4em' }} />
              </IconButton>
            }
          </Grid>
          <Grid container item xs={12} height={'76%'}>
            <Paper variant="outlined" sx={{ width: '100%', height: '100%' }}>
              <Grid
                container
                item
                xs={12}
                height={'100%'}
                margin={'auto'}
                alignContent={'center'}
                justifyContent={'center'}
                rowGap={10}
                padding={10}
                sx={{ backgroundColor: '#fff' }}
              >
                <Grid
                  container
                  item
                  xs={12}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  padding={4}
                  // border={'2px solid #ccc'}
                  sx={{ backgroundColor: '#fff' }}
                >
                  <SettingsKey name={'scale_page.scale'} />

                  <FormControl>
                    <Select
                      value={selectedScaleSetting.weighing_scale_name}
                      defaultValue={selectedScaleSetting.weighing_scale_name}
                      onChange={handleScaleNameChange}
                      sx={{ width: '20em' }}
                      inputProps={{ readOnly: !hasPermission }}
                    >
                      <MenuItem value={'none'} >{t('common.message.none')}</MenuItem>
                      {
                        scaleList.map((scale) => (
                          <MenuItem key={scale} value={scale}>
                            {scale}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>

                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  padding={4}
                  // border={'2px solid #ccc'}
                  sx={{ backgroundColor: '#fff' }}
                >
                  <SettingsKey name={'scale_page.scale_unit'} />
                  <FormControl>
                    <Select
                      value={selectedScaleSetting.weighing_scale_unit}
                      defaultValue={selectedScaleSetting.weighing_scale_unit}
                      onChange={handleScaleUnitChange}
                      sx={{ width: '20em' }}
                      disabled={supportedUnits?.length === 0 || selectedScaleSetting.weighing_scale_name === 'none'}
                    >
                      {
                        selectedScaleSetting.weighing_scale_name === 'none' &&
                        <MenuItem value={'none'}>{t('')}</MenuItem>
                      }
                      {
                        Boolean(supportedUnits?.length === 0 && selectedScaleSetting.weighing_scale_name !== 'none')
                        &&
                        <MenuItem value={'none'}>{t('scale_page.auto_detect_unit')}</MenuItem>
                      }{
                        Boolean(supportedUnits?.length) &&
                        supportedUnits.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                  {/* </Grid> */}
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  padding={4}
                  // border={'2px solid #ccc'}
                  sx={{ backgroundColor: '#fff' }}
                >
                  <SettingsKey name={'scale_page.default_minimum_weight'} />
                  <FormControl>
                    <Select
                      value={selectedScaleSetting.weighing_scale_minimum_weight}
                      defaultValue={selectedScaleSetting.weighing_scale_minimum_weight}
                      onChange={handleMinWeightChange}
                      sx={{ width: '20em' }}
                      disabled={selectedScaleSetting.weighing_scale_name === 'none' || metrological_setting === Certificates.NTEP}
                      inputProps={{ readOnly: !hasPermission }}
                    >
                      {
                        minWeightValues.map((value) => (
                          <MenuItem key={value} value={value}>
                            {value} g
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                  {/* </Grid> */}
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  padding={4}
                  sx={{ backgroundColor: '#fff' }}
                >
                  <SettingsKey name={'scale_page.scale_connection.title'} />
                  <Box
                    sx={{ width: (fontSize?.toUpperCase() === "DEFAULT") ? '29vw' : '40vw' }}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'flex-start'}
                  >
                    <Chip
                      label={
                        selectedScaleSetting.is_connected
                          ? t('scale_page.scale_connection.status.connected')
                          : t('scale_page.scale_connection.status.not_connected')
                      }
                      color={selectedScaleSetting.is_connected ? "success" : "error"}
                      icon={selectedScaleSetting.is_connected ? <DoneIcon sx={{ fontSize: "1.2em" }} /> : <CloseIcon sx={{ fontSize: "1.2em" }} />}
                      sx={{ fontSize: "2.4em", width: "auto", height: "6vh", padding: 5 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid >
          <Grid container item justifyContent={'space-between'} height={'14%'} columnSpacing={4}>
            <Grid item xs={10}>
              <SettingsInfoMessage
                isShow={msgAreaProps.isShow}
                message={msgAreaProps.msg}
                status={msgAreaProps.status}
              />
            </Grid>
            <Grid item xs={2} display="flex" justifyContent="flex-end" height={'70%'}>
              <SettingsSaveButton onSaveClick={handleSaveBtnClick} disableCdn={isDisable} />
            </Grid>
          </Grid>
        </Grid >}
      <ConfirmationDialog
        content={t('scale_page.confirmation_dialog.content')}
        title={t('scale_page.confirmation_dialog.title')}
        open={dialogOpen}
        buttonValue={t('scale_page.confirmation_dialog.ok')}
        isCancellable={true}
        onClose={handleConfirmationClose}
      />
    </>
  )
}

export default ScalePage;
