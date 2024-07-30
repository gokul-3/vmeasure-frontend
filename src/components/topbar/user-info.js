import * as React from 'react';
import Popover from '@mui/material/Popover';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux'
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function UserInfoPopover({ open, anchorEl, handleClose, }) {
  const { userInfo } = useSelector((state) => state.userAuth);
  const { t } = useTranslation()
  
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => { handleClose() }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Grid container minWidth={'40em'} paddingX={5} paddingY={5} rowSpacing={4} sx={{ border: '1px solid #ccc' }}>
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <Typography variant="body2" fontSize={'2em'} fontWeight={'bold'}>
              {t('user_info.name')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontSize={'2em'} sx={{ whiteSpace: 'break-spaces', wordWrap: 'break-word' }}>
              {userInfo?.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Divider sx={{ width: '100%' }}></Divider>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={4}>
            <Typography variant="body2" fontSize={'2em'} fontWeight={'bold'}>
              {t('user_info.mail')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" fontSize={'2em'} >
              {userInfo?.email}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Popover>
  );
}
