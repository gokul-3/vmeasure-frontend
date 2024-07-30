import React from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

function UpdateAvailable({ version, releaseNotes }) {
    const { t } = useTranslation();
    return (
        <Box sx={{ width: '90%', height: '60vh', padding: 10, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h3" align="center" sx={{ height: '15%' }}>
                {t("software_update_page.new_updates_available")}
            </Typography>

            <Box sx={{ height: '15%', width: '90%', display: 'flex', alignItems: 'flex-start', justifyContent: 'left',  }}>
                <Typography variant="h4" mt={3} >
                    {t("software_update_page.version")}
                </Typography>
                <Typography variant="h4" mt={3} sx={{ paddingLeft: `5vw` }}>
                    {version}
                </Typography>
            </Box>
            <Typography variant="h4" mt={3} sx={{ height: '15%' }}>
                {t("software_update_page.feature")}
            </Typography>
            <Box sx={{ height: '70%', overflowY: "auto", overflowX: "hidden" }}>
                <List >
                    {
                        releaseNotes.map((releaseNote, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <ArrowRightIcon sx={{ fontSize: '48px' }} />
                                </ListItemIcon>
                                <ListItemText >
                                    <Typography variant="body5">
                                        {releaseNote?.trim()}
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        </Box >

    )
}

export default UpdateAvailable