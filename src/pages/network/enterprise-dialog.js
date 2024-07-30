import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert
} from "@mui/material"
import { useTranslation } from "react-i18next";
import WifiIcon from '@mui/icons-material/Wifi';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { NetworkEnterpriseData } from "../../constants";

export default function WiFiEnterpriseDialog({
  showEnterprise, setShowEnterprise, enterpriseData, handleEnterpriseChange, handleNetworkConnection,
  focusingNetwork, connectLoading, isNetworkConnectionFail, error, setIsNetworkConnectionFail,
  handleEnterpriseDialogClose
}) {

  const buttonDisabled = connectLoading || !(enterpriseData.username && (enterpriseData.password?.length >= 8))
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }

  const handleDialogClose = (event, reason) => {
    if (reason === "backdropClick") {
      event.stopPropagation()
    } else {
      handleEnterpriseDialogClose()
      setShowEnterprise(false)
    }
    setIsNetworkConnectionFail(false)
  }

  const handleNetworkConnect = () => {
    setIsNetworkConnectionFail(false)
    handleNetworkConnection()
  }

  const selectStyles = {
    select: {
      fontSize: '0.7em',
      width: '17em',
      height: '2.3em'
    },
    fields: {
      fontSize: '0.7em',
      width: '47%',
      display: 'flex',
      alignItems: 'center'
    },
    textField: {
      fontSize: '0.7em',
      width: '17em',
    }
  };

  return (
    <Dialog open={showEnterprise}
      onClose={(event, reason) => handleDialogClose(event, reason)}
      maxWidth='md'
      fullWidth
      disableEscapeKeyDown
    >
      <DialogContent sx={{ fontSize: '3em', overflow: 'hidden', height: 'auto' }}>
        <Grid container mx={3}>
          <Grid container item gap={5}>
            <Grid item>
              <WifiIcon sx={{ fontSize: '2em' }} />
            </Grid>
            <Grid item my='auto'>
              <Typography variant="h5">
                {t('network_page.wifi_page.authentication_required')}
              </Typography>
              <Typography variant="h6">
                {t('network_page.password_for_network')}"{focusingNetwork.ssid}".
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} gap={5.5} padding={5} paddingTop={0}>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.wifi_security')}
              </Typography>
              <Select
                name='wifiSecurity'
                value={enterpriseData.wifiSecurity}
                onChange={handleEnterpriseChange}
                sx={selectStyles.select}
              >
                {NetworkEnterpriseData.wifiSecurityList.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.authentication')}
              </Typography>
              <Select
                name="authentication"
                value={enterpriseData.authentication}
                onChange={handleEnterpriseChange}
                sx={selectStyles.select}
              >
                {NetworkEnterpriseData.authenticationList.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.anonymousIdentity')}
              </Typography>
              <TextField
                name="anonymousIdentity"
                value={enterpriseData.anonymousIdentity}
                onChange={handleEnterpriseChange}
                sx={selectStyles.textField}
                disabled = {connectLoading}
              />
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.domain')}
              </Typography>
              <TextField
                name="domain"
                value={enterpriseData.domain}
                onChange={handleEnterpriseChange}
                sx={selectStyles.textField}
                disabled = {connectLoading}
              />
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.ca_certificate')}
              </Typography>
              <Select
                name="caCertificate"
                value={enterpriseData.caCertificate}
                onChange={handleEnterpriseChange}
                sx={selectStyles.select}
                disabled
              >
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
              </Select>
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields} style={{ width: '88%' }}>
                {t('network_page.wifi_page.enterprise.ca_certificate_password')}
              </Typography>
              <Grid item container >
                <TextField
                  name="caCertificatePassword"
                  value={enterpriseData.caCertificatePassword}
                  onChange={handleEnterpriseChange}
                  sx={selectStyles.textField}
                  disabled
                  // type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel control={<Checkbox disabled />} label={
                  <Typography variant="h6">
                    {t('network_page.wifi_page.enterprise.no_ca_is_required')}
                  </Typography>} />
              </Grid>
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.peap_version')}
              </Typography>
              <Select
                name="peapVersion"
                value={enterpriseData.peapVersion}
                onChange={handleEnterpriseChange}
                sx={selectStyles.select}
              >
                {NetworkEnterpriseData.peapVersionList.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.inner_authentication')}
              </Typography>
              <Select
                name="innerAuthentication"
                value={enterpriseData.innerAuthentication}
                onChange={handleEnterpriseChange}
                sx={selectStyles.select}
              >
                {NetworkEnterpriseData.innerAuthenticationList.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.username')}
              </Typography>
              <TextField
                name="username"
                value={enterpriseData.username}
                onChange={handleEnterpriseChange}
                sx={selectStyles.textField}
                disabled = {connectLoading}
              />
            </Grid>
            <Grid item width={'100%'} display={'flex'}>
              <Typography sx={selectStyles.fields}>
                {t('network_page.wifi_page.enterprise.password')}
              </Typography>
              <TextField
                name="password"
                value={enterpriseData.password}
                onChange={handleEnterpriseChange}
                type={showPassword ? 'text' : 'password'}
                sx={selectStyles.textField}
                disabled = {connectLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" >
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: 5, paddingRight: 10, paddingTop : 0}} >
        <Grid container item display={'flex'} rowGap={2} xs={12} sx={{ justifyContent: 'space-between' }}>
          <Grid item xs={7} sx={{minHeight:'2.5em'}}>
            {isNetworkConnectionFail &&
              <Alert severity="warning" sx={{ padding: 0, fontSize: '2.1em' }}>
                {t(`network_page.network_error.${error?.message}`)}
              </Alert>
            }
          </Grid>
          <Grid item display='flex' columnGap={3} justifyItems={'flex-end'} alignItems={'center'}>
            <Button variant="outlined" sx={{ width: '7em', height: '2.5em' }} onClick={handleDialogClose} disabled={connectLoading}>
              {t('common.button.cancel')}
            </Button>
            <Button variant="contained" sx={{ width: '7em', height: '2.5em' }} onClick={handleNetworkConnect} disabled={buttonDisabled}>
              {t(connectLoading ? 'network_page.wifi_page.connecting' : 'network_page.wifi_page.connect')}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}