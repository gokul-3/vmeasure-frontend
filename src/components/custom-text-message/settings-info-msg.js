import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

export function SettingsInfoMessage({ isShow, message, status, timer = 5,severity }) {

  const { t } = useTranslation();

  return (
    <>
      {
        isShow &&
        <Alert
          severity={severity || (status ? "success" : "warning")}
          variant="standard"
          sx={{ fontSize: '3em', padding: 4, width: 'fit-content' }}
        >
          {t(`${message}`)}
        </Alert>
      }
    </>
  )
}