import React from "react";
import {
  Grid,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Icons from '../../components/ultima-icons';
import { PageTitle } from "../../components/custom-text-message/page-title";
import { MenuItems } from "../../components/menu-items";
import { useSelector } from "react-redux"

function ConfigurationPage() {

  const { t } = useTranslation();
  const { device_test_modes } = useSelector((state) => state.applicationState);
  const { customServiceInfo } = useSelector(state => state.customFlow)

  
  return (
    <Grid container rowSpacing={5} height={'100%'}>
      <Grid item xs={12} height={'10%'}>
        <PageTitle title={t('configurations.page_title')} />
      </Grid>
      <Grid container item height={'90%'} >
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            padding: 10,
            minHeight: '30vh',
            height: '100%'
          }}>
          <Grid container sx={{ height: '100%', }} justifyContent={'center'} alignItems={'center'} display={'flex'} >
            <MenuItems
              Icon={Icons.ConfigurationMeasurementIcon}
              title={t('configurations.measurements.page_title')}
              href={'/menu/configuration/measurement'}
            />

            <MenuItems
              Icon={Icons.ConfigurationCalibrationIcon}
              title={t('configurations.calibration.page_title')}
              href={'/menu/configuration/calibration'}
            />

            <MenuItems
              Icon={Icons.ConfigurationTimezoneIcon}
              title={t('configurations.timezone.page_title')}
              href={'/menu/configuration/timezone'}
              disabled={device_test_modes.is_endurance_testing_enabled}
            />

            <MenuItems
              Icon={Icons.ConfigurationWhiteIcon}
              title={t('configurations.language_settings.title')}
              href={'/menu/configuration/language'}
            />

            <MenuItems
              Icon={Icons.ConfigurationPrinterIcon}
              title={t('configurations.printer_settings.page_title')}
              href={'/menu/configuration/printer'}
            />
            {customServiceInfo.isCustomSettingsEnabled &&
              <MenuItems
                Icon={Icons.ConfigurationWhiteIcon}
                title={t('configurations.custom_settings.title')}
                href={'/menu/configuration/custom-configuration'}
              />
            }
          </Grid>
        </Paper>
      </Grid>
    </Grid >
  )
}

export default ConfigurationPage;
