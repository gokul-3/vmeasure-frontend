import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Grid, IconButton, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function UpdatePageHeader({onBackClick}) {

    const { t } = useTranslation();
    const { disable_navigation: isNavbarDisabled } = useSelector((state) => state.navigation);

    return (
        <Grid container item xs={12} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} height={'10%'} mt={5} >
            <IconButton
                size="large"
                onClick={onBackClick}
                disabled={isNavbarDisabled}
            >
                <ArrowBackIcon color="primary" sx={{ fontSize: '3em', opacity: !isNavbarDisabled ? 1 : 0.5 }} />
            </IconButton>
            <Typography variant="h3" >
                {t('software_update_page.page_title')}
            </Typography>
        </Grid>
    )
}

export default UpdatePageHeader