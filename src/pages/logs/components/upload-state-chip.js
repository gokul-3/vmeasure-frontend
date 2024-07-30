import { Chip } from "@mui/material"
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

export default function UploadStateChip({ record_upload_state }) {

    const { demo_mode } = useSelector(state => state.applicationState)
    const { t } = useTranslation();

    if (demo_mode.is_demo_mode_available && demo_mode.is_demo_mode_activated) {
        return <Chip
            label={t("demo_mode.not_applicable")}
            color="warning"
            variant="filled"
            sx={{ fontSize: '1em', paddingY: 6, paddingX: 0 }}
        />
    } else if (record_upload_state === 'completed') {
        return <Chip
            label={t("logs_page.measurement.status.uploaded")}
            color="success"
            variant="filled"
            sx={{ fontSize: '1em', paddingY: 6, paddingX: 0 }}
        />
    } else if (record_upload_state === 'in_progress') {
        return <Chip
            label={t("logs_page.measurement.status.uploading")}
            color="info"
            variant="filled"
            sx={{ fontSize: '1em', paddingY: 6, paddingX: 0 }}
        />
    } else {
        return <Chip
            label={t("logs_page.measurement.status.yet_to_push")}
            color="warning"
            variant="filled"
            sx={{ fontSize: '1em', paddingY: 6, paddingX: 0 }}
        />
    }
}