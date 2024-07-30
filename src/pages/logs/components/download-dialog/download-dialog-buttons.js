import React from 'react'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { LogsDownloadStates } from "../../../../constants/constants";

function DownloadButtons({
    isCancellable,
    isConfirmable,
    cancelBtnValue,
    buttonValue,
    currentState,
    confimationHandler,
    closeHandler
}) {
    const { t } = useTranslation();
    return (
        <>
            {
                isCancellable &&
                <Button
                    onClick={closeHandler}
                    variant={currentState === LogsDownloadStates.INIT ? 'outlined' : 'contained'}
                    sx={{ width: '7em', fontSize: '2.6em', marginRight: 4 }}
                >
                    {cancelBtnValue || t('common.button.cancel')}
                </Button>
            }
            {
                isConfirmable &&
                <Button
                    onClick={confimationHandler}
                    autoFocus
                    variant="contained"
                    sx={{ width: '7em', fontSize: '2.6em' }}
                >
                    {buttonValue || t('common.button.ok')}
                </Button>
            }
        </>
    )
}

export default DownloadButtons