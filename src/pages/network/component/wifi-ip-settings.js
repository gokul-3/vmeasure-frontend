import { Grid, Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

export function WifiIPSettingsPair({ title, value, disableCdn, isIpDetailsFetched }) {

  const { t } = useTranslation();

  const getDisplayValue = () => {
    if (!isIpDetailsFetched) {
      return <CircularProgress size={50} />
    } else {
      return (value || t('common.message.NA'))
    }
  }

  return (
    <Grid item xs={6} width={'100%'} display={'flex'} alignItems={'center'} >
      <Typography variant="body5" fontWeight={'bold'} sx={{ width: '50%' }}>
        {t(title)}
      </Typography>
      <Typography variant="body5" >
        {disableCdn ? t('common.message.NA') : getDisplayValue()}
      </Typography>
    </Grid>
  )
}