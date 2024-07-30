import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function DataPair({ label, value }) {

  return (
    <Box display={'flex'} width={'100%'}>
      <Typography variant='body5' fontWeight={'bold'} width={'50%'}>
        {label}
      </Typography>
      <Typography variant='body4' width={'50%'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}  sx={{paddingLeft: "4%"}}>
        {value}
      </Typography>
    </Box >
  )
}