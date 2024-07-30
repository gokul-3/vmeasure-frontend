import React from 'react'
import { useSelector } from 'react-redux';
import { SoftwareUpdateState } from '../../../constants/sw-update';
import UpdateProgressBar from '../update-utils/update-progressbar';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from 'react-i18next';


function DownloadFlow() {
    const { software_update_state, progress } = useSelector((state) => state.softwareUpdate);

    const { t } = useTranslation();

    return (
        <>
            {
                (software_update_state === SoftwareUpdateState.PREPARING ||
                    software_update_state === SoftwareUpdateState.DOWNLOADING_YML_SOURCE) &&
                <Box display="flex" flexDirection={'column'} alignItems="center" gap={20} padding={4} width={"100%"}>
                    <Typography variant="h3" align="center">
                        {t("software_update_page.initiating")}
                    </Typography>
                    <UpdateProgressBar variant="indeterminate" color="primary" sx={{ height: '2vh', width: '80%', borderRadius: 2 }} />
                </Box>
            }

            {
                (software_update_state === SoftwareUpdateState.DOWNLOADING_APPLICATION ||
                    software_update_state === SoftwareUpdateState.DOWNLOADING_SERVICES) &&
                <Box display="flex" flexDirection={'column'} alignItems="center" gap={20} padding={4} width={"100%"}>
                    <Typography variant="h3" align="center">
                        {t("software_update_page.downloading")}
                    </Typography>
                    <UpdateProgressBar progress={progress} gradiant={true} variant="determinate" color="primary" sx={{ height: '2vh', width: '80%', borderRadius: 2 }} />
                    <Typography variant="h4" align="center">
                        {t("software_update_page.percentage", { percentage: Math.floor(progress) })}
                    </Typography>
                </Box>
            }

            {
                (software_update_state === SoftwareUpdateState.VALIDATING ||
                    software_update_state === SoftwareUpdateState.COPY_ULTIMA_APP ||
                    software_update_state === SoftwareUpdateState.INSTALL_DEPENDENCIES) &&
                <Box display="flex" flexDirection={'column'} alignItems="center" gap={20} padding={4} width={"100%"}>
                    <Typography variant="h3" align="center">
                        {t("software_update_page.validating")}
                    </Typography>
                    <UpdateProgressBar variant="indeterminate" color="primary" sx={{ height: '2vh', width: '80%', borderRadius: 2 }} />
                </Box>
            }

        </>
    )
}

export default DownloadFlow;