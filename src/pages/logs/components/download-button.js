import React from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

function DownloadButton({ clickHandler, styles }) {
    const { t } = useTranslation()

    return (
        <Button size="large" variant="contained" onClick={clickHandler} sx={{ ...styles }}>
            <DownloadIcon sx={{ fontSize: '1.2em', marginRight:'1vh' }} /> {t('common.button.download')} 
        </Button>
    )
}

export default DownloadButton