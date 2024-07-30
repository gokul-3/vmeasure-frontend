import React from 'react';
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { Typography } from '@mui/material'
import { Trans } from 'react-i18next';
import UpdateProgressBar from '../update-utils/update-progressbar';

function CheckUpdate() {
    return (
        <Box display="flex" flexDirection={'column'} alignItems="center" gap={30} padding={4} width={"100%"}>
            <Typography variant="h3" align="center">
                <Trans
                    i18nKey="software_update_page.update_checking_for_update"
                    components={[<br />,]}
                />
            </Typography>
            <UpdateProgressBar variant="indeterminate" color="primary" sx={{ height: '2vh', width: '80%', borderRadius: 2 }} />
        </Box>
    )
}

export default CheckUpdate