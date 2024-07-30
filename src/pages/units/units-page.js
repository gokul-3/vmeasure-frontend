import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import * as unitService from '../../services/units.service'
import { useTranslation } from "react-i18next";
import settings from "../../redux/reducers/settings";
import { useDispatch, useSelector } from "react-redux";
import { SettingsSaveButton } from "../../components/button/settings-save-button";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { Certificates, PermissionModules } from "../../constants";
import InfoIcon from '@mui/icons-material/Info';
import UnitInfo from "./unit-info";
import usePermission from "../../hooks/usePermission";

function UnitPage() {

  const units = [
    {
      'id': 1,
      'dimension_unit': 'mm',
      'weight_unit': 'g',
      'label': 'mm - g',
      'certifications_support': [],
    },
    {
      'id': 2,
      'dimension_unit': 'cm',
      'weight_unit': 'g',
      'label': 'cm - g',
      'certifications_support': [],
    },
    {
      'id': 3,
      'dimension_unit': 'cm',
      'weight_unit': 'kg',
      'label': 'cm - kg',
      'certifications_support': [],
    },
    {
      'id': 4,
      'dimension_unit': 'in',
      'weight_unit': 'kg',
      'label': 'in - kg',
      'certifications_support': [],
    },
    {
      'id': 5,
      'dimension_unit': 'in',
      'weight_unit': 'lb',
      'label': 'in - lb',
      'certifications_support': [Certificates.NTEP],
    },
    {
      'id': 6,
      'dimension_unit': 'in',
      'weight_unit': 'lb-oz',
      'label': 'in - lb-oz',
      'certifications_support': [],
    },

    {
      'id': 7,
      'dimension_unit': 'in',
      'weight_unit': 'oz',
      'label': 'in - oz',
      'certifications_support': [],
    }
  ]

  const { dimension_unit, weight_unit } = useSelector((state) => state.settings.unit);
  const { t } = useTranslation();
  const { device_modes } = useSelector((state) => state.applicationState);
  const { metrological_setting } = useSelector((state) => state.settings.metrological);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [msgAreaProps, setMsgAreaProps] = useState({ isShow: false, status: false, msg: '' });
  const [showUnitInfo, setShowUnitInfo] = useState(false);
  const [hasPermission] = usePermission(PermissionModules.UNITS_UPDATE);
  const [currentData, setCurrentData] = useState({ unit: '' });
  const [inProgress, setInProgress] = useState(false);
  const inprogressRef = useRef(false);

  const handleSave = () => {
    if (inprogressRef.current) {
      return
    }
    if (msgAreaProps.isShow) {
      setMsgAreaProps({ ...msgAreaProps, isShow: false });
    }
    inprogressRef.current = true;
    setInProgress(true);
    const units = selectedUnit.split(':');
    unitService.setUnit({ dimension_unit: units[0], weight_unit: units[1] })
      .then((result) => {
        setMsgAreaProps({
          status: result.status,
          isShow: true,
          msg: result.status ? 'common.message.data_saved_successfully' : 'common.message.failed_to_save_data'
        });

        setCurrentData({ unit: `${units[0]}:${units[1]}` });
        inprogressRef.current = false;
        setInProgress(false);
      })
      .catch((err) => {
        inprogressRef.current = false;
        console.log(err)
      });
  }

  const handleChange = (event) => {
    setInProgress(false)
    if (msgAreaProps.isShow) {
      setMsgAreaProps({ isShow: false, });
    }
    setSelectedUnit(event.target.value);
  };

  useEffect(() => {
    loadSelectedUnit();
  }, [])

  const loadSelectedUnit = () => {
    unitService.getSelectedUnit().then(
      (result) => {
        if (result.status) {
          setSelectedUnit(`${result.data.dimension_unit}:${result.data.weight_unit}`);
          setCurrentData({ unit: `${dimension_unit}:${weight_unit}` });
        }
      })
      .catch((err) => {

      })
  }

  const validateUnit = (unit) => {
    if (metrological_setting === Certificates.NTEP && !unit.certifications_support.includes(Certificates.NTEP)) return null
    return <MenuItem
      key={unit.id}
      value={`${unit.dimension_unit}:${unit.weight_unit}`}
    >
      {unit.label}
    </MenuItem>
  }

  const closeUnitInfo = () => {
    setShowUnitInfo(false);
  }

  useEffect(() => {
    setSelectedUnit(`${dimension_unit}:${weight_unit}`);
    setCurrentData({ unit: `${dimension_unit}:${weight_unit}` });
  }, [dimension_unit, weight_unit])

  useEffect(() => {
    if (hasPermission === false) {
      setMsgAreaProps({ isShow: true, msg: 'common.message.permission_denied', status: false });
    } else {
      setMsgAreaProps({ isShow: false });
    }
  }, [hasPermission])

  return (
    <Grid container rowSpacing={5} height={'100%'}>

      {showUnitInfo && <UnitInfo open={showUnitInfo} closeHandler={closeUnitInfo} units={units} />}

      <Grid item xs={12} height={'10%'} display={'flex'} justifyContent={'space-between'}>
        <PageTitle title={t('units_page.page_title')} />
        {device_modes?.is_ntep_required &&
          <IconButton aria-label="info" onClick={() => { setShowUnitInfo(true) }}>
            <InfoIcon color="primary" sx={{ marginRight: '0.2em', fontSize: '4em' }} />
          </IconButton>
        }
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
              sx={{}}
              padding={4}
            >
              <SettingsKey name={'units_page.measurement_units'} />
              <FormControl sx={{ width: '25%' }}>
                <Select
                  value={selectedUnit}
                  onChange={handleChange}
                  inputProps={{ readOnly: !hasPermission }}
                >
                  {units.map((unit) => validateUnit(unit))}
                </Select>
              </FormControl>
              {/* </div> */}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid container item height={'10%'} justifyContent={'space-between'}>
        <Grid item>
          {
            <SettingsInfoMessage
              isShow={msgAreaProps.isShow}
              message={msgAreaProps.msg}
              status={msgAreaProps.status}
            />
          }
        </Grid>
        <Grid item>
          {hasPermission &&
            <SettingsSaveButton
              onSaveClick={handleSave}
              disableCdn={currentData.unit === selectedUnit || inProgress}
            />}
        </Grid>
      </Grid>
    </Grid >
  )
}

export default UnitPage;
