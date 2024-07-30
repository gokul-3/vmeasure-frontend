import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import RefreshIcon from '@mui/icons-material/Refresh';

export function NetworkDataPair({ title, value, isLoading, isRefresh, handleRefresh, disableCdn }) {

  const { t } = useTranslation();
  return (
    <Box width={'100%'} display={'flex'} alignItems={'center'}>
      <Typography variant="body5" fontWeight={'bold'} sx={{ width: '50%' }}>
        {t(title)}
      </Typography>

      <Box display="flex" alignItems="center" width="30%">
        {isLoading
          ?
          <CircularProgress size={50} />
          :
          <Typography variant="body5" style={{ width: '100%' }}>
            {value || t('common.message.NA')}
          </Typography>
        }
      </Box>
      {
        isRefresh &&
        <IconButton size='large'  style={{ marginLeft: '20px' }} onClick={() => handleRefresh({ "isRefetch": false })} disabled={disableCdn}>
          <RefreshIcon color='primary' sx={{ fontSize: '2em' }} />
        </IconButton>
      }

    </Box>
  )
}
