import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ButtonGroup from "./custom-progress-button";
import { MessageType, UIProps } from "../../../../constants/custom-flow";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux"

const Footer = ({ pageControls, triggerEventAPI, currentPageID, isConfigPage }) => {
    const { t } = useTranslation();
    const { message } = useSelector(state => state.customFlow);

    const onPageControlClick = async (url) => {
        if (url) { await triggerEventAPI(url) }
    }

    const getColor = (messageType) => {
        return messageType === MessageType.ERROR ? "red" : "green"
    }

    return (

        <Grid container item xs={12} sx={UIProps.DefaultStyles.Footer}>
            <Box width={"100%"} height={"100%"} display={'flex'} justifyContent={'center'} alignItems={'center'} >

                <Box width={"50%"} height={"100%"} display={'flex'} justifyContent={'flex-start'} alignItems={'center'} >
                    {
                        message?.messageString &&
                        <Typography style={{ fontSize: "3em", fontWeight: "400", color: getColor(message.messageType) }}>
                            {t(`${message?.messageString}`)}
                        </Typography>
                    }
                </Box>
                <Box width={"50%"} height={"100%"} display={'flex'} justifyContent={'flex-end'} alignItems={'center'} gap={5} >
                    {
                        (pageControls && Object.keys(pageControls).length > 0) &&
                        <ButtonGroup onPageControlClick={onPageControlClick} isConfigPage={isConfigPage} pageControls={pageControls} />
                    }
                </Box>
            </Box>
        </Grid>
    )
}
export default Footer;