import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Button as MuiButton,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import VideoStream from "../../components/video-stream/video-stream";
import CaptureIcon from '@mui/icons-material/CameraAlt';
import ReCaptureIcon from '@mui/icons-material/FlipCameraIos';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getCaptureImage } from "../../services/stream.service";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import WhiteCapturedImage from "../../assets/images/white-captured.jpg"
import styled from "styled-components/macro";
import ResetIcon from '@mui/icons-material/RestartAlt';
import { ExternalInputs } from "../../constants";
import ProgressButton from "../../components/button/progress-button";
import { addEllipsis } from "../../utils/string-operation";
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";

const Button = styled(MuiButton)`
  font-size:3em;
  padding: 0.5em 0em;
  font-weight: 600;
  svg {
    width: 2.4em;
    height: 2.4em;
  }

`
// TODO need to address PX values

// is_enabled: configData.is_show_additional_images_details,
// title: configData.additional_images_page_title,
// desc: configData.additional_images_page_description,
// preview_timeout: configData.additional_images_preview_timeout,
// is_skip_enabled: configData.is_skip_additional_image_capture_enabled,
// is_capture_on_measurement: configData.is_capture_additional_image_on_measurement_enabled,
// additional_images_titles: []

export default function AdditionalImage({ onAction, onComplete }) {

  const { t } = useTranslation();
  const { device_camera_modes: { is_4k_available } } = useSelector(state => state.applicationState);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [currentProcessImageIndex, setCurrentProcessImageIndex] = useState(0);
  const [isStreamEnabled, setIsStreamEnabled] = useState(true);
  const [isShowExternalImage, setIsShowExternalImage] = useState(false);
  const [externalImage, setExternalImage] = useState({ content: null, path: null })
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [isCaptureInProgress, setIsCaptureInProgress] = useState(false);

  const handleNext = async () => {

    if (isStreamEnabled) {
      return
    }

    if (currentProcessImageIndex >= additionalImages.length) {
      return
    }
    const data = [...additionalImages];
    data[currentProcessImageIndex].is_completed = true;
    data[currentProcessImageIndex].content = externalImage.content;
    data[currentProcessImageIndex].path = externalImage.path;
    setCurrentProcessImageIndex(currentProcessImageIndex + 1);
    setAdditionalImages([...data])
    setIsStreamEnabled(true);
    onActionCall({ event: "next" });
  }

  const handleSkip = () => {
    if (!workflow.additional_image.is_skip_enabled || currentProcessImageIndex >= additionalImages.length) {
      return
    }
    const data = [...additionalImages];
    data[currentProcessImageIndex].is_completed = true;
    data[currentProcessImageIndex].is_skipped = true;
    setCurrentProcessImageIndex(currentProcessImageIndex + 1);
    setAdditionalImages([...data])
    setIsStreamEnabled(true);
    onActionCall({ event: "skip" });
  }

  const is4KRequired = () => {
    return workflow?.additional_image?.additional_images_titles?.[currentProcessImageIndex]?.is_4k_enabled === 1;
  }

  const onActionCall = (actionData) => {
    const data = additionalImages.map((record) => {
      return {
        image_name: record.img_title,
        image_id: record.img_id,
        is_skipped: record.is_skipped,
        image_path: record.path,
        is4K: record?.is_4k_enabled
      }
    })
    onAction({ data: data, action: actionData })
  }

  const handleCapture = () => {

    setIsCaptureInProgress(true);
    onActionCall({ event: "capture" });
    const param = { is_4k_enabled: is4KRequired() && is_4k_available }
    getCaptureImage(param).then((result) => {
      if (!result.status) {
        setIsCaptureInProgress(false);
        return
      }
      setIsStreamEnabled(false);
      setIsShowExternalImage(true);
      setExternalImage({ content: result.data.frame, path: result.data.path });
      const data = [...additionalImages];
      data[currentProcessImageIndex].content = result.data.frame;
      data[currentProcessImageIndex].path = result.data.path;
      setAdditionalImages([...data]);
      setIsCaptureInProgress(false);
    }).catch((err) => {
      console.error(err)
    })
  }

  const handleReCapture = () => {
    const data = [...additionalImages];
    data[currentProcessImageIndex].content = null;
    data[currentProcessImageIndex].path = null;
    setAdditionalImages([...data])
    setIsShowExternalImage(false);
    setIsStreamEnabled(true);
    onActionCall({ event: "recapture" });
  };


  const handleResetBtnClick = () => {
    setOpenConfirmationDialog(true);
  }

  const handleConfirmationClose = (status) => {

    if (status) {
      loadAdditionalImageState();
      setIsStreamEnabled(true);
      setIsShowExternalImage(false);
      setExternalImage({ content: null, path: '' });
      setCurrentProcessImageIndex(0);
    }

    setOpenConfirmationDialog(false);
  };

  const { workflow } = useSelector((state) => state.workflow);

  const { value: externalInputValue, counter: externalInputCounter } = useSelector((state) => state.externalInput);

  const loadAdditionalImageState = () => {
    const data = []

    workflow?.additional_image?.additional_images_titles?.forEach((title, index) => {
      if (!title.is_capture_on_measurement) {
        data.push({
          img_title: title.title,
          img_id: title.id,
          is_skipped: false,
          path: '',
          is_completed: false,
          content: null,
          is4K: title?.is_4k_enabled
        });
      }

    });

    setAdditionalImages(data);
  }

  useEffect(() => {
    // These data should be in workflow config redux
    loadAdditionalImageState();
  }, [workflow.additional_image.is_enabled])

  useEffect(() => {

    if (currentProcessImageIndex && additionalImages.length === currentProcessImageIndex) {
      const data = additionalImages.map((record) => {
        return {
          image_name: record.img_title,
          image_id: record.img_id,
          is_skipped: record.is_skipped,
          image_path: record.path,
          is4K: record?.is_4k_enabled
        }
      })
      onComplete(data);
    }

  }, [currentProcessImageIndex]);

  const isFirst = useRef(true)
  const handleExternalInput = () => {
    if (isFirst.current) {
      isFirst.current = false
      return;
    }

    if (externalInputValue === ExternalInputs.ENTER) {

      if (isStreamEnabled) {
        handleCapture();
      } else {
        handleReCapture();
      }
    } else if (externalInputValue === ExternalInputs.SKIP) {
      if (isStreamEnabled) {
        handleSkip();
      }
    } else if (externalInputValue === ExternalInputs.NEXT) {
      if (!isStreamEnabled) {
        handleNext();
      }
    }
  }

  useEffect(() => {
    handleExternalInput();
  }, [externalInputValue, externalInputCounter])


  const videoRef = useRef();
  const previewRef = useRef();
  const gridRef = useRef();
  const btnRef = useRef()

  const timeoutRef = useRef()

  const [show, setShow] = useState(true)

  const setButtonGridRef = () => {

    if (btnRef.current && videoRef.current.offsetWidth > 100) {
      btnRef.current.style.width = videoRef.current.offsetWidth + 'px';
      timeoutRef.current = null;
    } else {
      timeoutRef.current = setTimeout(setButtonGridRef, 50);
    }
  }

  useEffect(() => {
    timeoutRef.current = setTimeout(setButtonGridRef, 50);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [workflow.additional_image.is_enabled]);

  return (
    <>
      <Grid container display="flex" padding={2} rowSpacing={4} visibility={show ? 'visible' : 'hidden'}>
        <Grid container item xs={12}>
          {/* Set the title from workflow config redux */}
          <Typography variant="h3">{workflow.additional_image.title}</Typography>
        </Grid>
        <Grid container item xs={12} ref={gridRef} display={'flex'} justifyContent={'space-between'} >
          {/* Note: This width will be change after page load */}

          {/* the below grid has captured image prevuiew */}
          <Grid container item width={"60%"} ref={previewRef} >
            <Paper
              variant="elevation"
              elevation={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 5,
                width: '100%',
              }}>
              <Typography paddingY={4} variant="h3"> {t('additional_images.captured_image_preview')}</Typography>
              <Divider></Divider>
              <Box width={'100%'} height={'100%'} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
                {
                  additionalImages.map((additionalImage, index) => (
                    <Box key={index} display={'flex'} flexDirection={'column'} rowGap={3} sx={{ width: '30%', height: '100%' }} >
                      <Typography
                        variant="body2"
                        fontWeight={'bold'}
                        sx={{
                          wordBreak: 'break-all',
                          wordWrap: 'break-word',
                          height: '20%',
                          display: 'flex',
                          verticalAlign: 'bottom',
                          alignItems: 'flex-end',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}>
                        {addEllipsis(additionalImage.img_title, 30, false)}
                      </Typography>
                      {

                        Boolean(additionalImage.is_completed && additionalImage.is_skipped) &&
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '31.9em', backgroundColor: '#eee' }} >
                          <Typography variant="body2" fontWeight={'bold'} paddingY={4}>
                            {t('additional_images.image_skipped')}
                          </Typography>
                        </div>
                      }
                      {
                        Boolean(additionalImage.content && !additionalImage.is_skipped) &&
                        <img src={'data:image/jpeg;base64,' + additionalImage.content} style={{ 'objectFit': 'contain', width: '100%' }}></img>
                      }
                      {
                        Boolean(!additionalImage.content && !additionalImage.is_skipped) &&
                        <div style={{
                          alignItems: 'center',
                          backgroundColor: '#eee',
                          display: 'flex',
                          height: '31.9em',
                          justifyContent: 'center',
                          border: currentProcessImageIndex === index ? '1em solid yellow' : 'none'
                        }} >
                          <Typography variant="h5" paddingY={4}>
                            {t('additional_images.yet_to_capture')}
                          </Typography>
                        </div>
                      }
                    </Box>
                  ))
                }
              </Box>
              <Box display={'flex'} justifyContent={'left'} alignItems={'center'} sx={{ width: "100%", height: "15%", textAlign: "left" }} paddingLeft={5}>
                {
                  (is4KRequired() && !is_4k_available) &&
                  <Typography color={'red'} fontSize={'32px'}>
                    <Trans
                      i18nKey="additional_images.4k_not_supported"
                      components={[<br />,]}
                    />
                  </Typography>
                }
              </Box>
            </Paper>
          </Grid >

          {/* the below grid has video stream */}
          <Grid container item xs={'auto'} width={'30%'}>
            <Paper variant="elevation" ref={videoRef} elevation={2} sx={{ padding: 2, height: '70vh' }}>
              <VideoStream
                isStreamEnabled={isStreamEnabled}
                isShowExternalImage={isShowExternalImage}
                externalImage={externalImage.content}
                isWorkareaRect={false}
                defaultSrc={WhiteCapturedImage}
                is4KEnabled={is4KRequired() && is_4k_available}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* button container region */}
        <Grid container item xs={12} display={'flex'} justifyContent={'space-between'}>
          <Grid item xs={3}>
            <Button
              onClick={handleResetBtnClick}
              variant="contained"
              fullWidth
              disabled={currentProcessImageIndex === 0}
              startIcon={<ResetIcon />}
            >
              {t('additional_images.buttons.reset')}
            </Button>
          </Grid>
          {
            currentProcessImageIndex < additionalImages.length &&
            <Grid display={'flex'} item ref={btnRef} width={'37%'} >
              {/* preview_timeout */}
              <Box sx={{ width: '50%', paddingRight: 2 }}>
                {
                  isStreamEnabled &&

                  <Button
                    onClick={handleSkip}
                    variant="contained"
                    color="info"
                    fullWidth
                    startIcon={<SkipNextIcon />}
                    disabled={!workflow.additional_image.is_skip_enabled || isCaptureInProgress}
                  >
                    {t('additional_images.buttons.skip')}
                  </Button>
                }

                {

                  !isStreamEnabled &&

                  <Button
                    onClick={handleReCapture}
                    variant="contained"
                    color={"info"}
                    fullWidth
                    startIcon={<ReCaptureIcon />}
                  >
                    {t('additional_images.buttons.re_capture')}
                  </Button>
                }
              </Box>
              <Box sx={{ width: '50%', paddingLeft: 2 }}>

                {
                  isStreamEnabled &&
                  <Button
                    onClick={handleCapture}
                    variant="contained"
                    color={"success"}
                    fullWidth
                    disabled={isCaptureInProgress}
                    startIcon={<CaptureIcon />}
                  >
                    {t('additional_images.buttons.capture')}
                  </Button>
                }
                {
                  (!isStreamEnabled && workflow?.additional_image?.preview_timeout === 0) &&
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                  >
                    {t('additional_images.buttons.next')}
                  </Button>
                }

                {
                  (!isStreamEnabled && workflow?.additional_image?.preview_timeout > 0) &&
                  <ProgressButton
                    onClick={handleNext}
                    startIcon={<CheckCircleIcon style={{ fontSize: '4em', marginRight: '0.2em', color: 'white' }} />}
                    text={t('additional_images.buttons.next') + ' (%ds)'}
                    textProps={{ fontSize: '3em', fontWeight: '600', color: 'white' }}
                    onTimerClose={handleNext}
                    startTimer={true}
                    timeInSeconds={workflow?.additional_image?.preview_timeout}
                    clickable={true}
                  >
                  </ProgressButton>
                }

              </Box>
            </Grid>
          }
        </Grid>
      </Grid >
      <ConfirmationDialog
        title={t("additional_images.reset_confirmation.title")}
        content={t("additional_images.reset_confirmation.content")}
        onClose={handleConfirmationClose}
        open={openConfirmationDialog}
      />
    </>
  )
}
