import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Box,
  Button as MuiButton,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import CircleIcon from '@mui/icons-material/Circle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styled from 'styled-components/macro';
import VideoStream from '../../components/video-stream/video-stream';
import { saveAdditionalVideo, deleteAdditionalVideo } from '../../services/measurement.service';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import navigationController from "../../redux/reducers/nav-bar-controller";
import SuccessCheck from '../../components/success-check/success-check';
import appState from "../../redux/reducers/measurement-states";
import { ExternalInputs } from '../../constants';

const StyledCircularProgress = styled(CircularProgress)({
  "& .css-oxts8u-MuiCircularProgress-circle": {
    transition: "stroke-dashoffset 1000ms linear",
  },
});


const Button = styled(MuiButton)`
  font-size: 3em;
  padding: 0.5em 0em;
  font-weight: 600;
  svg {
    width: 2.4em;
    height: 2.4em;
  }
`;

export default function AdditionalVideo({ onAction, onComplete }) {
  const { t } = useTranslation();
  const [show] = useState(true);
  const [currentAction, setCurrentAction] = useState(null);
  const [isStreamEnabled] = useState(true);
  const [isShowExternalImage] = useState(false);
  const [externalImage] = useState("");
  const workflow = useSelector((state) => state.workflow);
  const [progress, setProgress] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const dispatch = useDispatch();
  const [isRecordingCompleted, setIsRecordingCompleted] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isBlink, setIsBlink] = useState(true)

  const { value: externalInputValue, counter: externalInputCounter } = useSelector((state) => state.externalInput);

  let duration;
  if (workflow?.workflow?.additional_video?.is_enabled) {
    duration = workflow.workflow.additional_video.duration;
  }

  const actionMapping = {
    start: 0,
    pause: 1,
    resume: 2,
    stop: 3,
    cancel: 3
  };
  let timer;

  // for circular progress bar time;
  const handleCountdown = () => {
    if (isRunning && progress >= 0) {
      timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress <= 0 ? handleCountdownEnd() : Math.max(0, prevProgress - (100 / duration))));
      }, 1000);
    } else {
      clearInterval(timer);
    }
  }

  useEffect(() => {
    setIsBlink(!isBlink)
  }, [progress])

  useEffect(() => {
    handleCountdown();
    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);


  const handleCountdownEnd = () => {
    handleVideoAction('stop');
    setIsDone(true)
    return 0
  };

  const handleVideoAction = async (actionName) => {
    try {
      onAction(true);
      const action = actionMapping[actionName];
      await saveAdditionalVideo(action);
      setCurrentAction(actionName);
      dispatch(appState.actions.updateAdditionalVideoState(actionName));
      if (actionName === 'start' || actionName === 'resume') {
        dispatch(navigationController.actions.disableNavigation());
        setIsRunning(true);
        setIsRecordingCompleted(false)
      }
      else if (actionName === 'pause') {
        setIsRunning(false)
      }
      else {
        setIsRunning(false);
        dispatch(navigationController.actions.enaleNavigation());
        setCurrentAction(actionName)
        setIsRecordingCompleted(true)
      }
    } catch (error) {
      console.error('Error during video action:', error);
    }
  };

  const handleDiscard = async () => {
    setCurrentAction(null);
    setIsRecordingCompleted(false);
    setProgress(100);
    setIsDone(false)
    await deleteAdditionalVideo(true)
  }

  const handleCancel = async () => {
    setIsCancelled(true)
    handleVideoAction('cancel');
    await deleteAdditionalVideo(true)
    onComplete();
  }

  const isFirst = useRef(true)
  const handleExternalInput = () => {
    if (isFirst.current) {
      isFirst.current = false
      return;
    }

    if (externalInputValue === ExternalInputs.NEXT) {
      if (currentAction === null || isCancelled) {
        handleVideoAction('start');
      }

      if (currentAction === 'start' || currentAction === 'resume') {
        handleVideoAction('pause');
      }

      if (currentAction === 'pause') {
        handleVideoAction('resume')
      }

      if (isRecordingCompleted && currentAction !== 'cancel') {
        onComplete();
      }
    }

    if (externalInputValue === ExternalInputs.SKIP) {
      if (currentAction === null || isCancelled) {
        handleCancel();
      }

      if (currentAction === 'start' || currentAction === 'resume') {
        handleVideoAction('stop');
      }

      if (currentAction === 'pause') {
        handleVideoAction('stop');
      }

      if (isRecordingCompleted && currentAction !== 'cancel') {
        handleDiscard()
      }
    }
  }

  useEffect(() => {
    handleExternalInput();
  }, [externalInputValue, externalInputCounter])

  return (
    <Grid
      container
      display="flex"
      alignItems="center"
      justifyContent="center"
      rowSpacing={4}
      visibility={show ? 'visible' : 'hidden'}
      height={'100%'}
    >
      <Grid item xs={12} height={'8%'}>
        <Typography
          variant="h2"
          sx={{ padding: 1 }}
        >
          {t('additional_video.title')}
        </Typography>
      </Grid>
      <Grid container item xs={12} display="flex">
        <Grid container item width={'50%'}
          sx={{
            paddingRight: 4,
            paddingLeft: 4
          }}>
          <Box
            variant="elevation"
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'stretch',
            }}
          >
            <Box width={'100%'} height={'8%'}>
              <Divider sx={{ width: '100%' }} />
            </Box>
            <Box
              width={'100%'}
              height={'90%'}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingLeft: 10
              }}
            >
              <Box justifyContent={"center"} alignItems={"center"}
                sx={{ position: "relative", display: "flex", width: "17vw", height: "17vw" }}>
                {isDone
                  ? <SuccessCheck />
                  : <>
                    <StyledCircularProgress
                      variant="determinate"
                      value={progress}
                      size={300}
                      thickness={5}
                      sx={{
                        // height: 10,
                        borderRadius: '50%',
                        boxSizing: 'border-box',
                        boxShadow: 'inset 0px 0px 0px 35px skyblue',
                      }}
                    />
                    <Typography
                      variant="h2"
                      component="div"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {(progress * duration / 100).toFixed(0)}
                    </Typography>
                  </>
                }

              </Box>
              {(currentAction === null || isCancelled) && (

                <><Button
                  onClick={() => handleVideoAction('start')}
                  variant="contained"
                  sx={{
                    minWidth: '40%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  startIcon={<PlayArrowIcon />}
                  color={'success'}
                >
                  <Typography variant="body3">
                    {t('additional_video.start')}
                  </Typography>
                </Button>
                  <Button
                    onClick={() => handleCancel()}
                    variant="contained"
                    sx={{
                      minWidth: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    startIcon={<CancelIcon />}
                    color={'error'}
                  >
                    <Typography variant="body3">
                      {t('additional_video.skip')}
                    </Typography>
                  </Button></>

              )}
              {(currentAction === 'start' || currentAction === 'resume') && (
                <>
                  <Button
                    onClick={() => handleVideoAction('pause')}
                    variant="contained"
                    sx={{
                      minWidth: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    startIcon={<PauseIcon />}
                    color={'primary'}
                  >
                    <Typography variant="body3">
                      {t('additional_video.pause')}
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => handleVideoAction('stop')}
                    variant="contained"
                    sx={{
                      minWidth: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    startIcon={<StopIcon />}
                    color={'error'}
                  >
                    <Typography variant="body3">
                      {t('additional_video.stop')}
                    </Typography>
                  </Button>
                </>
              )}
              {currentAction === 'pause' && (
                <>
                  <Button
                    onClick={() => handleVideoAction('resume')}
                    variant="contained"
                    sx={{
                      minWidth: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    startIcon={<PlayArrowIcon />}
                    color={'success'}
                  >
                    <Typography variant="body3">
                      {t('additional_video.resume')}
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => handleVideoAction('stop')}
                    variant="contained"
                    sx={{
                      minWidth: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    startIcon={<StopIcon />}
                    color={'error'}
                  >
                    <Typography variant="body3">
                      {t('additional_video.stop')}
                    </Typography>
                  </Button>
                </>
              )}
              {(isRecordingCompleted && currentAction !== 'cancel') && (
                <>
                  <Button
                    onClick={() => onComplete()}
                    variant="contained"
                    sx={{
                      minWidth: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    startIcon={<CheckCircleIcon />}
                    color={'success'}
                  >
                    <Typography variant="body3">
                      {t('additional_video.continue')}
                    </Typography>
                  </Button>
                  <Button
                    onClick={() => handleDiscard()}
                    variant="contained"
                    sx={{
                      minWidth: '40%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    startIcon={<CancelIcon />}
                    color={'error'}
                  >
                    <Typography variant="body3">
                      {t('additional_video.reset')}
                    </Typography>
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid container item xs={'auto'} width={'50%'}
          sx={
            { paddingLeft: 20 }
          }>
          {isRunning && (
            <Badge
              overlap="rectangle"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              variant="dot"
              invisible={!isRunning}
              sx={{
                position: 'absolute',
                top: 300,
                right: 170,
                width: '7%',
                height: '5%',
              }}
            >
              <Chip
                icon={<><CircleIcon style={{ display: isBlink ? 'block' : 'none' }} /><CircleIcon color='error' style={{ display: !isBlink ? 'block' : 'none' }} /></>}
                label="REC"
                color='error'
                size='large'
                sx={{ width: '100%', height: '100%', fontSize: '200%', icon: { fontSize: '200%' } }}
              />
            </Badge>
          )}
          <Paper
            variant="elevation"
            elevation={2}
            sx={{ width: '100%', padding: 15, height: '80vh' }}
          >
            <VideoStream
              isStreamEnabled={isStreamEnabled}
              isShowExternalImage={isShowExternalImage}
              externalImage={externalImage}
              isWorkareaRect={false}
              defaultSrc={'/images/white-annotated.jpg'}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
