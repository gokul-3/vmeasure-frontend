import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

export function SettingsSaveButton({ onSaveClick , disableCdn}) {

    const { t } = useTranslation();

    return (
        <Button
            variant='contained'
            onClick={onSaveClick}
            sx={{ width: '12em' }}
            disabled = {disableCdn ? disableCdn : false}
        >
            <Typography variant="body2">{t('common.button.save')}</Typography>
        </Button>
    )

}