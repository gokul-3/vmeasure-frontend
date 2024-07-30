import React from "react";
import {
  Grid,
  Button,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation, } from 'react-i18next';
import usePermission from "../../../hooks/usePermission";
import { PermissionModules } from "../../../constants";

export default function PrinterGrid({ option, handleTestPrint, handleRemovePrinter,
  handlePrinterSettings, handleActiveJobs, handleSetDefultPrinter, index, setShowMsg }) {

  const { t } = useTranslation();
  const [hasPermission] = usePermission(PermissionModules.CONFIGURATION_SYSTEM_UPDATE);

  const gridStyles = {
    border: option.isDefault ? '2px solid #1b5e20' : '2px solid #eeeeee',
    backgroundColor: option.isDefault ? '#1b5e2011' : '',
    borderRadius: 4,
    boxShadow: option.isDefault ? `#1b5e20 3px 3px 3px` : ""
  }

  return (
    <Grid
      container
      item
      xs={12}
      marginBottom={5}
      display={'flex'}
      style={gridStyles}
    >
      <Grid container item xs={12} height={'70%'} justifyContent={'space-between'}>
        <Grid container item xs={5} display={'flex'} p={6} alignItems={'center'}>
          <Grid item xs={2}>
            <PrintIcon sx={{ fontSize: 100 }} />
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h4" noWrap>{option.name}</Typography>
            <Chip
              label={option.isConnected ? "Ready" : "Disconnected"}
              color={option.isConnected ? 'success' : 'error'}
              variant="filled"
              size="medium"
              sx={{ fontSize: '2em', paddingY: 6, paddingX: 0 }}
            />
            {option.isDefault &&
              <Chip
                label='Default'
                color='success'
                variant="filled"
                size="medium"
                sx={{ fontSize: '2em', paddingY: 6, paddingX: 0, marginLeft: 2 }}
              />
            }
          </Grid>
        </Grid>

        <Grid container item xs={7} display={'flex'} alignItems={'center'} gap={4} justifyContent={'flex-end'}>
          <Button variant="contained" onClick={() => handleActiveJobs(option.name)}>
            <Typography variant='body8'>{t('configurations.printer_settings.active_jobs')}</Typography>
          </Button>
          <Button variant="contained" onClick={() => handleTestPrint(option.name)}>
            <Typography variant='body8'>{t('configurations.printer_settings.test_print')}</Typography>
          </Button>

          <Button variant="contained" onClick={() => handleSetDefultPrinter(option.name, index)} disabled={option.isDefault || !hasPermission}>
            <Typography variant='body8'>{t('configurations.printer_settings.set_as_default')}</Typography>
          </Button>

          <Grid item>
            <IconButton onClick={() => handlePrinterSettings(option.name)}>
              <SettingsIcon sx={{ fontSize: 70 }} />
            </IconButton>
          </Grid>

          <IconButton disabled = {!hasPermission} onClick={() => handleRemovePrinter(option.name)}>
            <DeleteIcon sx={{ fontSize: 70 }} />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container item xs={12} height={'30%'} display={'flex'} p={6} alignItems={'center'}>
        {option?.description &&
          <Grid container item>
            <Grid item xs={1}>
              <Typography variant="body5">{t('configurations.printer_settings.printer_model')}</Typography>
            </Grid>
            <Grid item xs={10} marginLeft={3}>
              <Typography variant="body6">{option.description}</Typography>
            </Grid>
          </Grid>
        }
        {option?.location &&
          <Grid container item>
            <Grid item xs={1}>
              <Typography variant="body5">{t('configurations.printer_settings.location')}</Typography>
            </Grid>
            <Grid item xs={10}  marginLeft={3}>
              <Typography variant="body6">{option.location}</Typography>
            </Grid>
          </Grid>
        }
      </Grid>
    </Grid >
  )
} 