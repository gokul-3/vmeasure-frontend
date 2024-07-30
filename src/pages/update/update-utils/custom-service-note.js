import React from 'react'
import { Trans } from 'react-i18next';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'

const CustomServiceNote = () => {
    const location = useLocation();
    const { customServiceInfo } = useSelector(state => state.customFlow);

    return (
        <>
            {
                (customServiceInfo.isAvailable && location.pathname == "/measurement") &&
                <>
                    <br />
                    <Typography Typography variant='body2' fontSize={'1.2em'} textAlign={'justify'} sx={{ color: '#f44336' }}>
                        <Trans
                            i18nKey="custom_flow_common_text.device_update_warning"
                            components={[<b></b>,]}
                        />
                    </Typography>
                </>
            }
        </>
    )
}

export default CustomServiceNote