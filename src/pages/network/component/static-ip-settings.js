import {
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from '@mui/icons-material/Edit';
import { WifiIPSettingsPair } from "./wifi-ip-settings";
import { IPSettingsPair } from "./ip-settings-data"

export function StaticIPSettings({ settings, handleEditModeChange, disableCdn, dhcpIP, isIpDetailsFetched, currentSSID }) {

  const { t } = useTranslation();
  const circleButtonStyle = {
    width: '3em',
    height: '3em',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Grid container item height={'100%'} >
      <Grid container item xs={12} height='15%'>
        <Grid item xs={6} display={'flex'} alignItems={'center'}>
          <Typography variant="h4" >
            {t('network_page.ip_details.ip_configuration_settings')}
          </Typography>
        </Grid>
        <Grid item xs={6} display={'flex'} justifyContent={'flex-end'} >
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon sx={{ fontSize: 'large', pl: '0.2em' }} style={{ fontSize: '2em' }} />}
            sx={circleButtonStyle}
            onClick={handleEditModeChange}
            disabled={disableCdn || !isIpDetailsFetched || !currentSSID}
          >
          </Button>
        </Grid>
      </Grid>
      <Grid container item height='90%'>
        <Grid item xs={12} display={'flex'} alignItems={'center'}>
          <IPSettingsPair
            title='network_page.ip_details.network_mode'
            value={!disableCdn && settings?.mode ? t(`network_page.ip_details.${settings?.mode}`) : "NA"} />
        </Grid>
        <WifiIPSettingsPair
          title='network_page.ip_details.ip_address'
          value={settings?.mode === 'dhcp' ? dhcpIP : settings?.static_ip_details?.static_ip}
          disableCdn={disableCdn}
          isIpDetailsFetched={isIpDetailsFetched}
        />
        <WifiIPSettingsPair
          title='network_page.ip_details.subnet'
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.subnet : settings?.static_ip_details?.subnet}
          disableCdn={disableCdn}
          isIpDetailsFetched={isIpDetailsFetched}
        />
        <WifiIPSettingsPair
          title='network_page.ip_details.gateway'
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.gateway : settings?.static_ip_details?.gateway}
          disableCdn={disableCdn}
          isIpDetailsFetched={isIpDetailsFetched}
        />
        <WifiIPSettingsPair
          title='network_page.ip_details.preferred_dns'
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.preferred_dns : settings?.static_ip_details?.preferred_dns}
          disableCdn={disableCdn}
          isIpDetailsFetched={isIpDetailsFetched}
        />
        <WifiIPSettingsPair
          title='network_page.ip_details.alternate_dns'
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.alternate_dns : settings?.static_ip_details?.alternate_dns}
          disableCdn={disableCdn}
          isIpDetailsFetched={isIpDetailsFetched}
        />
      </Grid>
    </Grid>
  )
}