import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';

const LoaderDialog = () => {
    const { t } = useTranslation();
    const { loader } = useSelector(state => state.customFlow)
    return (
        <Dialog
            open={loader.active}
            aria-labelledby="workflow-dialog"
            aria-describedby="workflow-desc"
            maxWidth={'xl'}
        >
            <DialogContent
                id="alert-dialog-description"
                sx={{ display: 'flex', height: '30vh', width: '40vw', justifyContent: 'center', alignItems: 'center', }}
            >
                <Grid container display={'flex'} height={'100%'} justifyContent={'space-evenly'}>
                    <Grid item sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                        <CircularProgress size={70} />
                        <Typography variant='h3' marginLeft={5} padding={4}>
                            {t('common.message.loading_text')}
                        </Typography>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog >
    )

}
export default LoaderDialog