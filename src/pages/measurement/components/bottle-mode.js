import React, { useState } from "react";
import {
  Paper,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Switch from "../../../components/switch";
import ConfirmationDialog from "../../../components/dialogs/confirmation-dialog";
import { useSelector } from "react-redux";

function BottleMode({ disabled, isBottleMode, onBottleModeChange }) {

  const { t } = useTranslation()

  const { is_bottle_mode_enabled } = useSelector((state) => state.appState);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBottleModeToggle = (event) => {

    if (event.target.checked && !is_bottle_mode_enabled) {
      setDialogOpen(true);
      return;
    }

    onBottleModeChange(event.target.checked);

  }

  const handleConfirmationClose = (isProceed) => {
    onBottleModeChange(isProceed);
    setDialogOpen(false)
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        width: '100%',
        justifyContent: "space-around",
      }}>
      <Typography variant="h4">
        {t('measurement_page.bottle_mode')}
      </Typography>
      <Switch
        checked={isBottleMode}
        onChange={handleBottleModeToggle}
        disableRipple={true}
        disabled={disabled}
        sx={{ opacity: disabled ? 0.7 : 1 }}
      />
      <ConfirmationDialog
        content={t('measurement_page.bottle_mode_confirmation.content')}
        title={t('measurement_page.bottle_mode_confirmation.title')}
        open={dialogOpen}
        buttonValue={t('measurement_page.bottle_mode_confirmation.proceed')}
        isCancellable={true}
        onClose={handleConfirmationClose}
      />
    </Paper>
  )
}

export default BottleMode;
