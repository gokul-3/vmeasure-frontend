import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';
import styled from 'styled-components/macro';

const SlowLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    // apply a new animation-duration to the `.bar` class
    transitionDuration: "0.5s"
  }
});

export default function ProgressButton({ timeInSeconds, startIcon, textProps = {}, fontSize = '1em', startTimer, text, nornalText, onTimerClose, clickable = false, disabled = false, ...btnProps }) {

  const disabledStyle = disabled ? { opacity: 0.4 } : {}

  const [buttonText, setButtonText] = useState('');

  const [progress, setProgress] = useState(timeInSeconds);

  const timerRef = useRef(null);

  const onClose = () => {
    clearInterval(timerRef.current);
    onTimerClose();
  }

  // This function will handle the timer progress
  const startTimerProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    };
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 0) {
          return 0;
        }

        return Math.max(oldProgress - 0.5, 0);
      });
    }, 500);
    timerRef.current = interval;
  }

  const handleProgressChange = () => {
    if (!startTimer) {
      return
    }
    if (progress === 0) {
      setButtonText(text.replace('%d', '0'));
      onClose();
    } else {
      setButtonText(text.replace('%d', Math.ceil(progress)));
    }
  }

  // This will set the timer text in button
  useEffect(() => {
    handleProgressChange()
  }, [progress])

  useEffect(()=>{
    return ()=>{
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
    }
  },[])

  useEffect(() => {
    if (startTimer) {
      setProgress(timeInSeconds);
      clearInterval(timerRef.current);
      startTimerProgress();
    } else {
      clearInterval(timerRef.current);
      setButtonText(nornalText ?? '');
    }

    if (timeInSeconds == undefined) {
      setButtonText(text)
    }
  }, [timeInSeconds, startTimer])

  const handleClick = () => {
    if (clickable && !disabled) {
      clearInterval(timerRef.current);
      onTimerClose();
    }
  }

  return (

    <Box sx={{ position: 'relative', width: '100%', height: '100%', ...disabledStyle }} onClick={handleClick}>
      <SlowLinearProgress
        sx={{ width: '100%', height: '100%', borderRadius: 1 }}
        variant='determinate'
        value={progress * (100 / timeInSeconds)}
        translate='yes'
      >
      </SlowLinearProgress>
      <Box sx={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {Boolean(startIcon) && startIcon}
        <Typography sx={{ ...textProps }}>
          {buttonText}
        </Typography>

      </Box>

    </Box>

  );
}

