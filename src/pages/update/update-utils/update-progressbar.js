import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const UpdateProgressBar = ({ progress, gradiant, ...props }) => {

  const orangeColor = { red: 255, green: 160, blue: 0 };
  const greenColor = { red: 40, green: 167, blue: 69 };

  function colorGradient(percentage, orangeClr, greenClr) {

    if (percentage >= 100) return 'rgb(' + greenClr.red + ',' + greenClr.green + ',' + greenClr.blue + ')';;
    let g = Math.round(((percentage + 1) * 100) / 100);
    if (g < 10) {
      g = '0' + g;
    }
    g = +g === 100 ? 1 : +('0.' + g)


    const color1 = orangeClr;
    const color2 = greenClr;
    const fade = g;


    const diffRed = color2.red - color1.red;
    const diffGreen = color2.green - color1.green;
    const diffBlue = color2.blue - color1.blue;

    const gradient = {
      red: parseInt(Math.floor(color1.red + (diffRed * fade)), 10),
      green: parseInt(Math.floor(color1.green + (diffGreen * fade)), 10),
      blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)), 10),
    };
    return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
  }

  return (

    <LinearProgress
      {...props}
      value={progress}
      sx={{
        '& .MuiLinearProgress-bar': { backgroundColor: gradiant ? colorGradient(progress, orangeColor, greenColor) : 'primary'},
        ...props.sx
      }}
    />
  );
};

export default UpdateProgressBar;