import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import styled from 'styled-components/macro';
import usePermission from "../../../../hooks/usePermission";
import LinearProgress from '@mui/material/LinearProgress';
import customFlowReducer from "../../../../redux/reducers/custom-workflow"
import { Typography } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { PermissionModules } from "../../../../constants"

const SlowLinearProgress = styled(LinearProgress)(({ theme, transitionDuration }) => ({
    "& .MuiLinearProgress-bar": {
        transitionDuration: transitionDuration
    }
}));


export default function ButtonGroup({ onPageControlClick, isConfigPage, pageControls }) {
    const { t } = useTranslation();
    const { disablePageAction, customServiceInfo, currentPageID } = useSelector(state => state.customFlow);
    const [hasPermission] = usePermission(PermissionModules.CUSTOM_CONFIGURATION_UPDATE);

    const { isCustomSettingsEnabled, defaultConfigurationPage } = customServiceInfo
    const hideButton = (isConfigPage && isCustomSettingsEnabled && currentPageID !== defaultConfigurationPage && !hasPermission)

    return (
        <>
            {
                Object.keys(pageControls).map((button) => {
                    return pageControls?.[button] && !hideButton &&
                        <Box key={button} minWidth={"12vw"} height={"70%"}>
                            <CustomProgressButton
                                timeInSeconds={pageControls?.[button]?.autoTrigger?.timer}
                                startTimer={pageControls?.[button]?.autoTrigger?.status}
                                text={t(`${pageControls?.[button]?.name}`)}
                                onTimerClose={() => { onPageControlClick(pageControls?.[button]?.onClick) }}
                                disabled={disablePageAction || pageControls?.[button]?.disabled}
                                buttonStyle={{ height: '100%', width: '100%' }}
                                textStyle={{ color: "#fff", fontSize: "2em" }}
                                buttonName={button}
                            />
                        </Box >
                })
            }
        </>
    )
}


function CustomProgressButton({
    timeInSeconds,
    startTimer = false,
    text,
    onTimerClose,
    disabled = false,
    buttonStyle = {},
    textStyle = {},
    buttonName = null,
}) {
    const timerRef = useRef();
    const progressStep = 0.5;
    const dispatch = useDispatch();
    const disabledStyle = disabled ? { opacity: 0.4 } : {}
    const [progress, setProgress] = useState(timeInSeconds);
    const { value: keyValue, counter } = useSelector(state => state.externalInput)

    const clearProgress = () => {
        if (timerRef.current) clearInterval(timerRef.current)
    }

    const handleClick = () => {
        if (!disabled) {
            dispatch(customFlowReducer.actions.resetMessage())
            clearInterval(timerRef.current);
            onTimerClose();
        }
    }

    const startProgress = () => {
        clearProgress()
        timerRef.current = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress <= progressStep) {
                    clearProgress()
                    return 0;
                }
                return Math.max(oldProgress - progressStep, 0);
            });
        }, 500);
    }

    //first one to run
    useEffect(() => {
        if (!startTimer && timeInSeconds === undefined) {
            setProgress(1) //make the button active here
        }

        else if (startTimer && !disabled && timeInSeconds === 0) {
            handleClick()
        }

        else if (startTimer && !disabled) {
            setProgress(timeInSeconds);
            clearProgress();
            startProgress();
        }

        return clearProgress
    }, [timeInSeconds, startTimer])


    useEffect(() => {
        if (progress === 0 && startTimer) { handleClick() }
    }, [progress, startTimer]);

    useEffect(() => {
        if (keyValue && (counter > 0) && (
            (keyValue === "skip" && buttonName === "nextCtl")
        )) {
            handleClick()
        }
    }, [keyValue, counter])

    return (
        <Button sx={{ position: 'relative', width: '100%', height: '100%', ...buttonStyle, ...disabledStyle }} onClick={handleClick}>
            <SlowLinearProgress
                sx={{ width: '100%', height: '100%', borderRadius: 1 }}
                variant='determinate'
                value={(progress * (100 / (timeInSeconds ?? progress)))}
                translate='yes'
                transitionDuration={`${progressStep}s`}
            >
            </SlowLinearProgress>
            <Box sx={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ ...textStyle }}>
                    {text}
                </Typography>
            </Box>
        </Button>

    );
}

