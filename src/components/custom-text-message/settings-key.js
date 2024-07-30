import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from '@emotion/react';

export function SettingsKey({ name, disabled }) {

  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
    <Typography variant="h3" fontWeight={'bold'} color={disabled? theme.palette.text.disabled : theme.palette.text.primary}>
      {t(name)}
    </Typography>
  )
}