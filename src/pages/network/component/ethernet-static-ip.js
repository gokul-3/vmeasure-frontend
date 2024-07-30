import {
    Grid,
    Typography,
    Button,
    CircularProgress,
  } from "@mui/material";
  import { useTranslation, Trans } from "react-i18next";
  import { IPSettingsPair } from "./ip-settings-data";
  import EditIcon from '@mui/icons-material/Edit';
  
  
  export function EthernetStaticIPSettings({ settings, handleEditModeChange, disableCdn,dhcpIP }) {
  
    const { t } = useTranslation();
    const circleButtonStyle = {
      width: '3em',
      height: '3em',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  
  
    const dhcpIPAddress = dhcpIP ? dhcpIP : <CircularProgress size={50} />
  
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
              disabled={disableCdn}
            >
            </Button>
          </Grid>
        </Grid>
        <Grid container item height='90%'>
          <Grid item xs={12} display={'flex'} alignItems={'center'}>
            <IPSettingsPair title='network_page.ip_details.network_mode'
              value={settings.mode ? t(`network_page.ip_details.${settings?.mode}`) : "NA"} />
          </Grid>
          <IPSettingsPair title='network_page.ip_details.ip_address'
          value={settings?.mode === 'dhcp' ? dhcpIPAddress : settings?.static_ip_details?.static_ip}
          />
          <IPSettingsPair title='network_page.ip_details.subnet' 
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.subnet : settings?.static_ip_details?.subnet}
          />
          <IPSettingsPair title='network_page.ip_details.gateway' 
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.gateway : settings?.static_ip_details?.gateway}
          />
          <IPSettingsPair title='network_page.ip_details.preferred_dns' 
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.preferred_dns : settings?.static_ip_details?.preferred_dns}
          />
          <IPSettingsPair title='network_page.ip_details.alternate_dns' 
          value={settings?.mode === 'dhcp' ? settings?.dhcp_ip_details?.alternate_dns : settings?.static_ip_details?.alternate_dns}
          />
        </Grid>
      </Grid>
    )
  }