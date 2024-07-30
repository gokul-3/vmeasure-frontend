import { Typography } from '@mui/material';
import Button from '@mui/material/Button';

import { useEffect, useRef, useState } from "react";

export default function CounterButton({ timeInSeconds, fontSize='1em', startTimer, text, onTimerClose, ...btnProps }) {

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
        
        return Math.max(oldProgress - 1, 0);
      });
    }, 1000);
    timerRef.current = interval;
  }

  // This will set the timer text in button
  useEffect(() => {
    if (progress === 0) {
      setButtonText(text.replace('%d', ''));
      onClose();
    } else {
      setButtonText(text.replace('%d', progress));
    }
  }, [progress])


  useEffect(() => {
    if (startTimer) {
      setProgress(timeInSeconds);
      clearInterval(timerRef.current);
      startTimerProgress();
    } else {
      clearInterval(timerRef.current);
    }
  }, [timeInSeconds, startTimer])

  return (
    <Button {...btnProps} onClick={onClose}>
      <Typography variant="body3" fontSize={fontSize}>
        {buttonText}
      </Typography>
    </Button>

  );
}
