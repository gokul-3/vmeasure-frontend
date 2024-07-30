import { Grid, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function CustomNavigationPageTitle({ title, Icon, isBackNavEnabled = true, isCustomBackButton = true, handleCustomBackButton,disabled=false }) {

  const [isBackClicked, setIsBackClicked] = useState(false);
  const navigate = useNavigate()
  const { t } = useTranslation();
  useEffect(() => {
    if (isBackClicked) {
      navigate(-1);
    }
  }, [isBackClicked])

  const handleBackButton = () => {
    //handles custom function when isCustomBackButton is true, else navigating to previous page
    isCustomBackButton ? handleCustomBackButton() : setIsBackClicked(true)
  }

  return (
    <Grid container display={'flex'} alignContent={'center'} height={'100%'}>
      {
        isBackNavEnabled &&
        <Grid >
          <IconButton aria-label="delete" size="large" onClick={handleBackButton} disabled={disabled} >
            <ArrowBackIcon color="primary" sx={{ fontSize: '3em' }} />
          </IconButton>
        </Grid>
      }
      <Grid item display={'flex'} alignItems={'center'}>
        <Typography variant="h3">
          {title}
        </Typography>
      </Grid>
    </Grid >
  )
}
