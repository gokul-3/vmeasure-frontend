import React from 'react'
import { useTheme } from "@emotion/react";
import { Trans, useTranslation } from "react-i18next";
import { Grid, Typography, CircularProgress } from "@mui/material";

export function DownloadSuccess({ contentData }) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <Typography variant='body3' fontSize={'2.5em'} color={theme.palette.success.main} fontWeight={'bold'}>
        {t(`logs_page.download.${contentData.message}`)}
      </Typography>

      <Typography variant='body3' fontSize={'2.2em'} mt={5}>
        <Trans
          i18nKey="logs_page.download.donwload_path"
          values={{ donwload_path: contentData?.additionalInfo?.donwload_path }}
          components={[<b></b>,]}
        />
      </Typography>
    </>
  )
}

export function DownloadFailed({ contentData }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <>
      <Typography variant='body3' fontSize={'2.5em'} color={theme.palette.error.main} fontWeight={'bold'}>
        {t(`logs_page.download.error.${contentData.message}`)}
      </Typography>
    </>
  )
}


export function DownloadInProgress() {
  const { t } = useTranslation();
  return (
    <>
      <Grid container item xs={12} justifyContent={'flex-start'} alignItems={'center'} mt={5} gap={10}>
        <Grid item >
          <CircularProgress size={70} />
        </Grid>
        <Grid item>
          <Typography variant='body3' fontSize={'2.5em'} fontWeight={'bold'}>
            {t(`logs_page.download.in_progress`)}
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}