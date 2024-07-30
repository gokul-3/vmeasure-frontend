import { Grid, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function PageTitle({ title, Icon, isBackNavEnabled = true, backPage = null }) {

  const [isBackClicked, setIsBackClicked] = useState(false);
  const navigate = useNavigate()
  const { t } = useTranslation();

  useEffect(() => {
    if (isBackClicked) {
      navigate(backPage === null ? -1 : backPage);
    }
  }, [isBackClicked])

  const handleBackButton = () => {
    setIsBackClicked(true);
  }

  return (
    <Grid container display={'flex'} alignContent={'center'} height={'100%'}>
      {
        isBackNavEnabled &&
        <Grid item>
          <IconButton aria-label="delete" size="large" onClick={handleBackButton} disabled={isBackClicked} >
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
