import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';

function Pagination(props) {
    const { page, disablePreviousButton, disableNextButton, height, nextPageHandler, previousPageHandler, currentPageInfo, isLoading } = props;
    const { t } = useTranslation();

    return (
        <Box width={'auto'} height={height} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={8}>
            <Typography variant='body1' fontSize={'2em'} sx={{ opacity: (!isLoading && currentPageInfo.from !== 0 && currentPageInfo.to !== 0) ? 1 : 0.3 }}>
                <Trans
                    i18nKey='common.message.showing_count'
                    components={[<b></b>,]}
                    values={{ from: currentPageInfo.from, to: currentPageInfo.to }}
                />
            </Typography>

            <IconButton
                size="large"
                onClick={previousPageHandler}
                disabled={disablePreviousButton}
            >
                <ArrowBackIcon color="primary" sx={{ fontSize: '1.2em', fontWeight: 'bold', opacity: !disablePreviousButton ? 1 : 0.3 }} />
            </IconButton>

            <Typography variant='h5' fontSize={'2em'} sx={{ opacity: !isLoading ? 1 : 0.3 }}>
                {t('common.message.page')}  {page}
            </Typography>

            <IconButton
                size="large"
                onClick={nextPageHandler}
                disabled={disableNextButton}
            >
                <ArrowForwardIcon color="primary" sx={{ fontSize: '1.2em', opacity: !disableNextButton ? 1 : 0.3 }} />
            </IconButton>
        </Box>
    )
}

export default Pagination