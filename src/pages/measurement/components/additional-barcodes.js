import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Paper,
  Alert,
  Box,
} from "@mui/material";
import { useSelector } from 'react-redux'
import { validateAdditionalBarcode } from "../../../services/measurement.service";
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from "react-i18next";
import { BarcodeDataCategory, ExternalInputs, MeasurementTriggerSrc } from "../../../constants";
import Icons from '../../../components/ultima-icons'
import { addEllipsis } from "../../../utils/string-operation";
import styled from "styled-components/macro";

const CustomWidthDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root ": {
    maxWidth: '85vw',
  },
}));

function AdditionalBarcode({ annotatedImg, mainBarcode, barcodeScan, onSubmit, onValidationComplete }) {

  const { workflow } = useSelector((state) => state.workflow);
  const { t } = useTranslation();
  const [alertMsgProps, setAlertMsgProps] = useState({ open: false, msg: '', severity: 'error' })
  const [showTimer, setShowTimer] = useState(true)
  const [barcodeList, setBarcodeList] = useState([]);
  const [isFirst, setIsFirst] = useState(true)

  const barcodeListRef = useRef([]);

  const barcodeListScrollRef = useRef();

  const { value: externalInputValue, counter: externalInputCounter } = useSelector((state) => state.externalInput);

  useEffect(() => {

    if (workflow?.addional_barcode?.is_enabled) {
      setBarcodeList([]);
    }
  }, [workflow]);

  const handleNewBarcode = async () => {

    if (isFirst) {
      setIsFirst(false);
      return;
    }
    // category: BarcodeDataCategory.REFERENCE_BOX
    if (barcodeScan?.category == BarcodeDataCategory.REFERENCE_BOX) {
      setAlertMsgProps({
        open: true,
        msg: 'measurement_notes.measurement_barcode_validate.reference_box_barcode',
        severity: 'error'
      })
      return;
    }

    if (barcodeScan?.value == mainBarcode) {
      setAlertMsgProps({
        open: true,
        msg: 'measurement_notes.measurement_barcode_validate.already_scanned',
        severity: 'error'
      })
      return;
    }

    if (barcodeScan?.value && barcodeListRef.current.indexOf(barcodeScan?.value) === -1) {
      setAlertMsgProps({ open: false, msg: '' })
      const result = await validateAdditionalBarcode(barcodeScan.value);
      onValidationComplete(result);
      if (result.status) {
        if (barcodeListRef.current.indexOf(barcodeScan.value) === -1) {
          barcodeListRef.current.push(barcodeScan.value);
          setBarcodeList([...barcodeListRef.current]);
        }

        setAlertMsgProps({
          open: true,
          msg: 'measurement_notes.measurement_barcode_validate.barcode_added_successfully',
          severity: 'success'
        });
        return
      }

      // If error message doesn't have any translation, show the message as it is
      let errorMsg = `measurement_notes.measurement_barcode_validate.${result?.error?.message || 'barcode_failed'}`
      errorMsg = t(errorMsg) === errorMsg ? result?.error?.message : errorMsg;

      setAlertMsgProps({
        open: true,
        msg: errorMsg,
        severity: 'error'
      });

    } else {
      setAlertMsgProps({
        open: true,
        msg: 'measurement_notes.measurement_barcode_validate.barcode_already_exists',
        severity: 'error'
      })
    }
  }

  useEffect(() => {
    // To avoid duplicate and empty barcode values
    handleNewBarcode().catch((err) => {
      
    })

  }, [barcodeScan])

  const handleProceedClick = () => {
    onSubmit(barcodeListRef.current)
  }

  const handleResetClick = () => {
    barcodeListRef.current = [];
    setAlertMsgProps({ open: false, msg: '' })
    setBarcodeList([])
  }

  const handleBarcodeCancelClick = (index) => {
    barcodeListRef.current.splice(index, 1)
    setBarcodeList([...barcodeListRef.current]);
  }

  useEffect(() => {
    if (barcodeListScrollRef.current?.children?.[barcodeList.length -1]?.scrollIntoView) {
      // barcodeListScrollRef.current.style.scrollHeight = (barcodeListScrollRef.current.offsetHeight + barcodeListScrollRef.current.scrollTop)+'px'
      barcodeListScrollRef.current?.children?.[barcodeList.length -1]?.scrollIntoView(true)
    }
  }, [barcodeList]);

  const isFirstInput = useRef(true)
  const handleExternalInput = () => {
    if (isFirstInput.current) {
      isFirstInput.current = false
      return;
    }

    if (showTimer) {
      if (externalInputValue === ExternalInputs.NEXT) {
        handleProceedClick();
      }

      if (externalInputValue === ExternalInputs.SKIP) {
        handleResetClick();
      }
    }
  }

  useEffect(() => {
    if (workflow.measurement_trigger.source === MeasurementTriggerSrc.MANUAL) {
      handleExternalInput();
    }
  }, [externalInputValue, externalInputCounter])


  return (
    <CustomWidthDialog
      maxWidth={'xl'}
      fullWidth
      open={showTimer}
    >
      <DialogTitle variant="h1">
        {t('measurement_page.additional_barcode.title')}
      </DialogTitle>
      <DialogContent sx={{ height: '80vh', borderBottom: '1px solid #ddd', borderTop: '1px solid #ddd', padding: 0 }}>

        <Grid container height={'100%'} width={'100%'} m={0}>
          <Grid item xs={7} height={'100%'} maxHeight={'100%'} padding={5}>
            <Box sx={{ width: '100%', marginY: '1em', height: '7%', display: 'flex' }}>
              <Typography variant="body2" fontSize={'2.8em'} >{t('measurement_page.additional_barcode.no_of_barcodes_scanned')}</Typography>
              <Typography variant="body2" fontSize={'2.8em'} fontWeight={'bold'} paddingX={5}>{barcodeList.length}</Typography>
            </Box>
            {
              Boolean(barcodeList.length) &&
              <Paper variant="outlined" sx={{ width: '100%', height: '90%', maxHeight: '90%', overflowY: 'auto', paddingX: 6, paddingY: 3, }} >
                <List ref={barcodeListScrollRef}>
                  {
                    barcodeList.map((barcode, index) => (
                      <ListItem key={index} sx={{ marginY: 5, border: '1px solid #ddd' }} >
                        <ListItemText sx={{ fontSize: '4.4em', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '0.5em' }} primary={addEllipsis(barcode, 25, false)} />
                        <CancelIcon sx={{ fontSize: 60 }} onClick={() => handleBarcodeCancelClick(index)} />
                      </ListItem>
                    ))
                  }
                </List>
              </Paper>
            }
            {
              Boolean(!barcodeList.length) &&
              <Paper variant="outlined" sx={{ width: '100%', height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                <Box width={'100%'} height={'20%'} display={'flex'} justifyContent={'center'}>
                  <Icons.BarcodeGrayIcon style={{ height: "100%", margin: 'auto' }} />
                </Box>
                <Box>
                  <Typography variant="h4" color={'#777'}>
                    {t('measurement_page.additional_barcode.add_barcode_text',)}
                  </Typography>
                </Box>
              </Paper>
            }
          </Grid>
          <Grid item xs={5} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <img src={'data:image/jpeg;base64,' + annotatedImg} style={{ objectFit: 'contain' }} height={'95%'} />
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions sx={{ padding: 4 }}>
        <Grid container width={'100%'}>

          <Grid item xs={9}>
            {
              alertMsgProps.open &&
              <Alert
                severity={alertMsgProps.severity}
                sx={{ fontSize: '2.4em', width: 'fit-content' }}
              >
                {
                  t(alertMsgProps.msg, {
                    barcode_field: 'Barcode',//workflow.barcode_config.barcode_text,
                    minimum_charcters: workflow?.barcode_config?.min_length,
                    maximum_charcters: workflow?.barcode_config?.max_length
                  })
                }
              </Alert>
            }
          </Grid>

          <Grid item xs={3} display={'flex'} justifyContent={'right'}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ paddingX: 7, marginRight: 4 }}
              onClick={handleResetClick}
            >
              <Typography variant="body3" fontSize={32}>{t('measurement_page.additional_barcode.reset')}</Typography>
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ paddingX: 7 }}
              onClick={handleProceedClick}
            >
              <Typography variant="body3" fontSize={32}>{t('measurement_page.additional_barcode.proceed')}</Typography>
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </CustomWidthDialog>
  )
}

export default AdditionalBarcode;
