import React from "react"
import { Grid, Avatar, Box, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';

export function NTEPModeIcon() {
    const { t } = useTranslation();
    return (
        <Grid>
            <Avatar
                sx={{
                    bgcolor: 'white',
                    borderRadius: 1,
                    height: 110,
                    width: 110,
                    align: 'center'
                }}
                variant='square'>
                <Box
                    sx={{
                        width: '90%',
                        height: '90%',

                    }}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Typography variant="h3" color={'black'} component="h3">CC</Typography>
                </Box>
            </Avatar>
        </Grid>
    )
}