import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  useTheme,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Skeleton,
  Alert,
  Avatar,
  Chip,
  CircularProgress
} from "@mui/material";
import Icons from '../../../components/ultima-icons'
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation, Trans } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { getAnnotationImage } from "../../../services/logs.service";
import { useSelector } from "react-redux";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: '#fff',
    width: '92vw',
    height: '93vh',
    marginLeft: '7vw'
  }
}));

function DetailsGrid({ Icon, title, data, size, additionalStyleOnValue = {} }) {

  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={size} display={'flex'} justifyContent={'left'} alignItems={'center'} paddingX={3}>
        <Box display="flex" width="100%" justifyContent="space-evenly" alignItems="center" sx={{ background: '#fff', border: '1px solid #999' }} padding={5} borderRadius={4}>
          <Box display={'flex'} justifyContent={'left'} alignItems={'center'} width="100%">
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingX={5} width="5vw" height="5vw" >
              <Avatar
                sx={{ bgcolor: theme.palette.primary.main, width: '5em', height: '5em', padding: 2 }}
              >
                {Icon}
              </Avatar>
            </Box>
            <Box display={'flex'} justifyContent={'center'} alignItems={'left'} paddingX={5} flexDirection={'column'} maxWidth={'90%'}>
              <Typography variant="body2" fontSize={'2.2em'}>
                {t(title)}
              </Typography>
              <Typography variant="body2" fontSize={'3.8em'} fontWeight={'bold'} sx={additionalStyleOnValue} >
                {data ?? t('common.message.NA')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  )
}

function DetailsChip({ title, text, size, color }) {
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={size} display={'flex'} justifyContent={'left'} alignItems={'center'} paddingX={3} >
        <Box display="flex" width="100%" justifyContent="space-evenly" alignItems="center" paddingY={5}>
          <Box display={'flex'} justifyContent={'left'} alignItems={'center'} width="100%">
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingX={5}>
              <Typography variant="body2" fontSize={'2.2em'} mr={5}>
                {t(title)}
              </Typography>
              <Chip label={t(text)} color={color} sx={{ fontSize: "2.2em", width: "10vw", height: "5vh", textTransform: "capitalize" }} />
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  )
}


function MeasurementLogPopup({ measurementData, logPopupOpen, closePopup }) {

  const theme = useTheme();
  const { t } = useTranslation();
  const { demo_mode } = useSelector(state => state.applicationState);
  const [imgData, setImageData] = useState({ loading: true, imgBase64: null, error: null });

  useEffect(() => {
    if (measurementData) {
      loadAnnotationImage(measurementData.measurement_id)
    }
  }, [measurementData])

  const loadAnnotationImage = async (mid) => {
    const result = await getAnnotationImage(mid);
    if (result.status) {
      if (result.data.measurement_id == mid) {
        setImageData({
          loading: false,
          imgBase64: result.data.content,
          error: null
        })
      }
    } else {
      setImageData({
        loading: false,
        imgBase64: null,
        error: t('common.message.network_error')
      })
    }
  }
  const getUploadChipDetail = (status, returnType) => {
    let chipDetail = {
      color: "warning",
      text: t("logs_page.measurement.status.yet_to_push")
    }

    if (demo_mode.is_demo_mode_available && demo_mode.is_demo_mode_activated) {
      chipDetail.color = "warning";
      chipDetail.text = t("demo_mode.not_applicable")
    }

    else if (status === 'completed') {
      chipDetail.color = "success";
      chipDetail.text = t("logs_page.measurement.status.uploaded")
    }

    else if (status === 'in_progress') {
      chipDetail.color = "info";
      chipDetail.text = t("logs_page.measurement.status.uploading")
    }

    return chipDetail[returnType]
  }


  return (
    <StyledDialog
      maxWidth={false}
      fullWidth
      open={logPopupOpen}
    >
      <DialogTitle variant="h1">
        <Grid container width={'100%'}>
          <Grid item xs={6} display={'flex'} justifyContent={'left'} alignItems={'center'} >
            <Typography variant="body3" fontSize={35}>{t('logs_page.measurement.popup.title')}</Typography>
          </Grid>
          <Grid item xs={6} display={'flex'} justifyContent={'right'} alignItems={'center'} >
            <CancelIcon htmlColor={theme.palette.error.main} onClick={closePopup} sx={{ fontSize: '1.4em' }} />
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ height: '80vh', borderBottom: '1px solid #bbb', borderTop: '1px solid #bbb', padding: 0 }} >
        <Grid container width={'100%'} height={'100%'} xs={12} >
          <Grid item container xs={8} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Grid item container xs={12} display={'flex'} justifyContent={'left'} alignItems={'left'} id='short-height' sx={{ height: '90%' }}>

              {/* measurement id, scanned on */}
              <Grid container item xs={12} paddingX={5} display={'flex'} justifyContent={'space-between'} alignItems={'center'} sx={{ height: '5vh' }}>
                <Box display={'flex'} justifyContent={'center'} alignItems={'left'} paddingX={5} flexDirection={'column'}>
                  <Typography variant="body2" fontSize={'2.2em'}>
                    <Trans
                      i18nKey="logs_page.measurement.popup.measurement_id_with_value"
                      components={[<b></b>,]}
                      values={{ m_id: measurementData?.measurement_id }}
                    />
                  </Typography>
                </Box>
                <Box display={'flex'} justifyContent={'center'} alignItems={'left'} paddingX={5} flexDirection={'column'}>

                  <Typography variant="body2" fontSize={'2.2em'}>
                    <Trans
                      i18nKey="logs_page.measurement.popup.date_time_with_value"
                      components={[<b></b>,]}
                      values={{ date_time: measurementData?.scanned_time_local }}
                    />
                  </Typography>
                </Box>
              </Grid>

              {/* length,width,height */}
              <Grid container item xs={12} paddingX={5}>
                <DetailsGrid size={4} Icon={<Icons.BoxLengthWhiteIcon />} title={'logs_page.measurement.table.length'} data={measurementData?.length} />
                <DetailsGrid size={4} Icon={<Icons.BoxWidthWhiteIcon />} title={'logs_page.measurement.table.width'} data={measurementData?.width} />
                <DetailsGrid size={4} Icon={<Icons.BoxHeightWhiteIcon />} title={'logs_page.measurement.table.height'} data={measurementData?.height} />
              </Grid>


              {/* actual weight, object type */}
              <Grid container item xs={12} paddingX={5}>
                <DetailsGrid size={6} Icon={<Icons.ScaleWhiteIcon />} title={'logs_page.measurement.table.actual_weight'} data={measurementData?.actual_weight} />
                <DetailsGrid
                  size={6}
                  Icon={<Icons.CubicVolumeWhiteIcon />}
                  title={'logs_page.measurement.table.object_type'}
                  data={measurementData?.object_type}
                  additionalStyleOnValue={{ textTransform: "capitalize" }}
                />
              </Grid>


              {/* barcode */}
              <Grid container item xs={12} paddingX={5}>
                <DetailsGrid
                  size={12}
                  Icon={<Icons.BarcodeWhiteIcon />}
                  title={'logs_page.measurement.table.barcode'}
                  data={measurementData?.sku}
                  additionalStyleOnValue={{
                    maxWidth: '100%',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                />
              </Grid>


              {/* other info */}
              <Grid container item xs={12} paddingX={5}>
                <DetailsChip
                  title={'logs_page.measurement.popup.measurement_status'}
                  color={measurementData?.status ? "success" : "error"}
                  text={measurementData?.status ? 'logs_page.measurement.popup.success' : 'logs_page.measurement.popup.failed'}
                  size={6}
                />
                <DetailsChip
                  title={'logs_page.measurement.popup.upload_status'}
                  status={measurementData?.record_upload_states}
                  color={getUploadChipDetail(measurementData?.record_upload_state, "color")}
                  text={getUploadChipDetail(measurementData?.record_upload_state, "text")}
                  size={6}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ borderLeft: '1px solid #ddd' }}>
            <Box variant='outlined' sx={{ width: '90%', height: '100%' }} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              {
                imgData.loading &&
                <CircularProgress />
              }

              {
                Boolean(!imgData.loading && !imgData.error) &&
                <Box height={'90%'} margin={'auto'}>
                  <img src={'data:image;base64,' + imgData.imgBase64} height={'100%'} style={{ objectFit: 'contain' }} />
                </Box>
              }
              {
                Boolean(!imgData.loading && imgData.error) &&
                <Box margin={'auto'}>
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ fontSize: '1.8em' }}
                  >
                    {imgData.error}
                  </Alert>
                </Box>
              }
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: 6 }}>
        <Grid container width={'100%'}>
          <Grid item xs={12} display={'flex'} justifyContent={'left'}>
            <Typography variant="subtitle1" color={measurementData?.status ? theme.palette.success.main : theme.palette.error.main} fontSize={37} >{measurementData?.additional_info}</Typography>
          </Grid>
        </Grid>
      </DialogActions>
    </StyledDialog>
  )
}

export default MeasurementLogPopup;
