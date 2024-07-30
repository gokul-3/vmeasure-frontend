import React from 'react';
import GradientProgressBar from '../gradient-progress-bar';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box } from "@mui/material";
import { useSelector } from 'react-redux';
import { SoftwareUpdateState } from '../../constants/sw-update';
import { useTheme } from '@emotion/react';


const DownloadIndicator = () => {

    const {
        is_control_in_update_page,
        is_download_in_progress,
        progress,
        software_update_state
    } = useSelector((state) => state.softwareUpdate);

    const theme = useTheme();

    const isDownloadingInPrgoress = () => {
        return (
            is_download_in_progress &&
            (
                software_update_state === SoftwareUpdateState.DOWNLOADING_APPLICATION ||
                software_update_state === SoftwareUpdateState.DOWNLOADING_SERVICES ||
                software_update_state === SoftwareUpdateState.DOWNLOADING_YML_SOURCE
            )
        )
    }

    const isValidationInProgress = () => {
        return (
            is_download_in_progress &&
            (
                software_update_state === SoftwareUpdateState.COPY_ULTIMA_APP ||
                software_update_state === SoftwareUpdateState.INSTALL_DEPENDENCIES ||
                software_update_state === SoftwareUpdateState.VALIDATING
            )
        )
    }

    const isDownloadFailed = () => {
        return (
            !is_download_in_progress &&
            software_update_state === SoftwareUpdateState.FAILED
        )
    }

    const getIndicatorColor = () => {
        return isDownloadFailed() ? theme.palette.error.dark : theme.palette.primary.dark
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "2vw", flexDirection: "column" }}>
            {
                (!is_control_in_update_page && (isDownloadingInPrgoress() || isValidationInProgress() || isDownloadFailed())) &&
                <>
                    <ArrowDownwardIcon fontSize='large' color="primary" sx={{ stroke: getIndicatorColor(), strokeWidth: 1.5 }} />
                    <GradientProgressBar progress={progress} width={`100%`} height={`0.5vh`} marginTop={0} gradiant={false} color={getIndicatorColor()} />
                </>
            }
        </Box>
    )
};

export default DownloadIndicator;
