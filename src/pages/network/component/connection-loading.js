import {
    Dialog,
    DialogContent,
    Grid,
    Typography,
    CircularProgress,

} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ConnectLoadingDialog({ open }) {

    const { t } = useTranslation()
    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent
                id="alert-dialog-description"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}
            >
                <Grid container display={'flex'} height={'100%'} justifyContent={'space-evenly'}>
                    <Grid item sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                        <CircularProgress size={70} />
                        <Typography variant='h3' marginLeft={10} padding={4}>
                            {t('network_page.wifi_page.connecting')}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}