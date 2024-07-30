import * as React from 'react';
import {
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function InfoPanel({ title, content }) {

  return (
    <Box>
      <Grid container spacing={2} sx={{ borderBottom: '1px solid #ddd', paddingY: 4 }}>
        <Grid item >
          <InfoIcon sx={{ fontSize: 36 }} color='primary' />
        </Grid>
        <Grid item>
          <Typography variant='h4'>{title}</Typography>
        </Grid>
      </Grid>

      <List>
        {
          Object.entries(content).map(([key, value]) => (
            <ListItem key={key} sx={{ borderBottom: '1px solid #ddd', padding: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <ListItemText primary={<Typography component="div" sx={{ fontSize: '20px' }}>
                    {key}
                  </Typography>} />
                </Grid>
                <Grid item xs={6}>
                  <ListItemText primary={<Typography component="div" sx={{ fontSize: '20px', textAlign: 'right' }}>
                    {value}
                  </Typography>} />
                </Grid>
              </Grid>
            </ListItem>
          ))}
      </List>

    </Box>
  )
}