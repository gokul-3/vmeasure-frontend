import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function PendingDataPair({ label, value , autowidth}) {

  return (
    <Box display={'flex'} width={'100%'} height={'100%'} alignItems={'center'}>
      <Typography variant='body4' width={autowidth ? 'auto' : '70%'} pr={autowidth && 8}>
        {label}
      </Typography>
      <Typography variant='body4' fontWeight={'bold'}>
        {value}
      </Typography>
    </Box >
  )
}
