import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';

export default function AddPrinterListItem({ printer, addPrinter, }) {
  return (
    <Grid
      container
      item
      xs={12}
      marginBottom={5}
      display={'flex'}
      style={{ border: '2px solid #ccc' }}
      key={printer.info}
      onClick={() => addPrinter(printer)}
    >
      <Grid container item xs={12} display={'flex'} p={6} spacing={4} alignItems={'center'}>
        <Grid item xs={2}>
          <PrintIcon sx={{ fontSize: 100 }} />
        </Grid>
        <Grid container item xs={10} display='flex' flexDirection={'column'}>
          <Typography variant="h4">{printer.name}</Typography>
          <Grid item>
            <Chip
              label={printer.isTested ? "Verified" : "Not Verified"}
              color={printer.isTested ? 'success' : 'error'}
              variant="filled"
              size="medium"
              sx={{ fontSize: '2em', paddingY: 6, paddingX: 0, width: 'fit-content' }}
            />
            <Chip
              label={printer.class}
              color={'success'}
              variant="outlined"
              size="medium"
              sx={{ fontSize: '2em', paddingY: 6, ml: 4, width: 'fit-content' }}
            />
          </Grid>
          <Typography variant="body5">{printer.info}</Typography>
        </Grid>
      </Grid>
    </Grid >
  )
} 