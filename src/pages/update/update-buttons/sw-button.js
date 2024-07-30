import React from 'react'
import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function SoftwareButton({ text, variant="contained", onClick }) {
    const { t } = useTranslation();
    return (
        <Button variant={variant} size="large" sx={{ minWidth: '11em', padding: '0.5em' }} onClick={onClick}>
            <Typography variant="body3" fontSize={'1.6em'}>{text}</Typography>
        </Button>
    )
}

export default SoftwareButton