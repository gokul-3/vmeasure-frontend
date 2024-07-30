import React from "react";
import {
  Grid,
  Box,
  Alert as MuiAlert,
} from "@mui/material";

import styled from "styled-components/macro";

const Alert = styled(MuiAlert)` 
  .MuiAlert-icon {
    font-size:1.4em;
  }
`;

function PageError({ message, severity }) {

  return (
    <>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: '65vw', transform: 'translate(-50%, -50%)' }} >
        <Grid container justifyContent="center" alignItems="center" display={'flex'} margin={'auto'} >
          <Alert
            variant="standard"
            severity={severity}
            sx={{
              fontSize: '4em',
              paddingX: '1.2em',
              paddingY: '0.2em',
              fontWeight: 'bold',
              // whiteSpace: 'nowrap'
            }} >
            {message}
          </Alert>
        </Grid>
      </Box>
    </>
  )
}

export default PageError;
