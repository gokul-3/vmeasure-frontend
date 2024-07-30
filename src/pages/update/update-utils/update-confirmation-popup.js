import React from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';


function UpdateConfirmationPopup({ open, closeHandler, proceedHandler }) {

  const theme = useTheme();
  const { t } = useTranslation();

  return (

    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ margin: "1vh 2vh" }}
      >
        <Typography variant="h3" align="left" >
          {t("software_update_page.confirmation.title")}
        </Typography>
      </DialogTitle>
      <DialogContent style={{ margin: "1vh 2vh 0px 2vh" }}>

        <DialogContentText id="alert-dialog-description" component="span">
          <Typography variant="body" align="left" component="p">
            {t("software_update_page.confirmation.content1")}
          </Typography>

          <Typography variant="body" align="left" component="p" sx={{ marginTop: "2vh", fontWeight: 'bold' }} color={theme.palette.success.main}>
            {t("software_update_page.confirmation.content2")}
          </Typography>
        </DialogContentText>

      </DialogContent>
      <DialogActions style={{ margin: "3vh 2vh 2vh 2vh" }}>
        <Button variant="outlined" size="large" sx={{ width: '10em', marginRight: '2vh' }} onClick={closeHandler}>
          <Typography variant="body3" fontSize={'1.4em'}>{t("software_update_page.confirmation.cancel")}</Typography>
        </Button>
        <Button variant="contained" size="large" sx={{ width: '10em' }} onClick={proceedHandler}>
          <Typography variant="body3" fontSize={'1.4em'}>{t("software_update_page.confirmation.proceed")}</Typography>
        </Button>

      </DialogActions>
    </Dialog>

  )
}

export default UpdateConfirmationPopup