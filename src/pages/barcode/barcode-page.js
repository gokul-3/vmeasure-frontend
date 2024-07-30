import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Alert as MuiAlert,
  AlertTitle,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import * as barcodeService from '../../services/barcode.service'
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { SettingsSaveButton } from "../../components/button/settings-save-button";
import { PageTitle } from "../../components/custom-text-message/page-title";
import { SettingsKey } from "../../components/custom-text-message/settings-key";
import { SettingsInfoMessage } from "../../components/custom-text-message/settings-info-msg";
import { PermissionModules } from "../../constants";
import usePermission from "../../hooks/usePermission";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components/macro";

const Alert = styled(MuiAlert)` 
  .MuiAlert-icon {
    font-size:2em;
  }
`;

function BarcodePage() {

  const { t } = useTranslation();

  const [barcodeList, setBarcodeList] = useState([]);
  const [selectedBarcode, setSelectedBarcode] = useState('none');
  const [msgAreaProps, setMsgAreaProps] = useState({ isShow: false, status: false, msg: '' });
  const [hasPermission] = usePermission(PermissionModules.BARCODE_UPDATE);

  const {
    barcode: barcode_name,
    is_barcode_connected
  } = useSelector((state) => state.settings.barcode);

  const handleSave = () => {
    if (msgAreaProps.isShow) {
      setMsgAreaProps({ ...msgAreaProps, isShow: true });
    }
    barcodeService.setBarcode({ barcode_name: selectedBarcode })
      .then((result) => {

        setMsgAreaProps({
          isShow: true,
          msg: result?.status ? 'common.message.data_saved_successfully' : result?.statusCode == 701 ? 'barcode_page.more_than_one_hid_device_connected' : 'barcode_page.unable_to_detect_barcode',
          status: result.status
        });
      })
      .catch((err) => {
        console.error(err)
      });
  }

  const handleChange = (event) => {
    if (msgAreaProps.isShow) {
      setMsgAreaProps({ ...msgAreaProps, isShow: false });
    }
    setSelectedBarcode(event.target.value);
  };

  useEffect(() => {
    loadBarcodeList();
  }, [])

  useEffect(() => {
    setSelectedBarcode(barcode_name);
  }, [barcode_name, is_barcode_connected])

  const loadBarcodeList = async () => {
    try {
      const result = await barcodeService.getBarcodeList();
      setBarcodeList(result.data.rows);
      console.error(JSON.stringify(result.data.rows))
      loadSelectedBarcode();
    } catch (error) {
      console.error('error : ', error)
    }
  }

  const loadSelectedBarcode = async () => {
    try {
      const result = await barcodeService.getSelectedBarcode();
      setSelectedBarcode(result.data.barcode_name || 'none');
    } catch (error) {
      console.error('error : ', error)
    }

  }

  useEffect(() => {

    if (hasPermission === false) {
      setMsgAreaProps({ isShow: true, msg: 'common.message.permission_denied', status: false });
    } else {
      setMsgAreaProps({ isShow: false });
    }
  }, [hasPermission])

  return (
    <Grid container rowSpacing={5} height={'100%'} >
      <Grid item xs={12} height={'10%'}>
        <PageTitle title={t('barcode_page.page_title')} />
      </Grid>
      <Grid container item xs={12} height={'76%'}>
        <Paper variant="outlined" sx={{ width: '100%' }}>
          <Grid container item xs={12} padding={10} height={'100%'} margin={'auto'}>
            <Grid container item xs={12} display={'flex'} alignItems={'end'} justifyContent={'space-between'} padding={4} height={'50%'}>
              <Grid container item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={4} sx={{ backgroundColor: '#fff' }}>
                <SettingsKey name={'barcode_page.barcode'} />

                <FormControl sx={{ width: '40%' }}>
                  <Select
                    value={selectedBarcode}
                    onChange={handleChange}
                    inputProps={{ readOnly: !hasPermission }}
                  >
                    <MenuItem value={'none'}>{t('common.message.none')}</MenuItem>
                    {
                      barcodeList.map((barcode) => (
                        <MenuItem key={barcode} value={barcode}>
                          {barcode}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid container item xs={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'} padding={4} sx={{ backgroundColor: '#fff' }}>
                <SettingsKey name={'barcode_page.barcode_connection.title'} />
                <Box
                  sx={{ width: '40%' }}
                  display={'flex'}
                  alignItems={'left'}
                >
                  <Chip
                    label={
                      is_barcode_connected
                        ? t('barcode_page.barcode_connection.status.connected')
                        : t('barcode_page.barcode_connection.status.not_connected')
                    }
                    color={is_barcode_connected ? "success" : "error"}
                    icon={is_barcode_connected ? <DoneIcon sx={{ fontSize: "1.2em" }} /> : <CloseIcon sx={{ fontSize: "1.2em" }} />}
                    sx={{ fontSize: "2.4em", width: "auto", height: "6vh", padding: 5 }}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container item xs={12} display={'flex'} alignItems={'end'} height={'50%'}>
              {
                selectedBarcode === "HID Scanner" &&
                <Alert variant="outlined" severity="info" >
                  <AlertTitle sx={{ fontSize: '1.5em' }}>{"Notes"}</AlertTitle>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="barcode_page.note_hid_scanner_line1"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="barcode_page.note_hid_scanner_line2"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'black' }}>
                    <Trans
                      i18nKey="barcode_page.note_hid_scanner_line3"
                      components={[
                        <span style={{ color: '#307EC7' }}></span>,
                      ]}
                    />
                  </Typography>
                </Alert>
              }
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid container item height={'14%'} justifyContent={'space-between'}>
        <Grid item xs={8}>
          <SettingsInfoMessage
            isShow={msgAreaProps.isShow}
            message={msgAreaProps.msg}
            status={msgAreaProps.status}
          />
        </Grid>
        <Grid item>
          <SettingsSaveButton onSaveClick={handleSave} />
        </Grid>
      </Grid>
    </Grid >
  )
}

export default BarcodePage;