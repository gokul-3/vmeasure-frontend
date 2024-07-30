import React, { useEffect, useState } from 'react'
import { useTheme } from "@emotion/react";
import {
    FormControl,
    Grid,
    Typography,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { DownloadLogTypes } from "../../../../constants/constants";


const MenuProps = { PaperProps: { style: { fontSize: '1.4em' } } };
function DownloadFormContent({ setDownloadFields, usbList, error }) {

    const { t } = useTranslation();
    const theme = useTheme();
    const availableLogType = [...Object.values(DownloadLogTypes)];

    const [count, setCount] = useState(100);
    const [logTypes, setLogTypes] = useState([...availableLogType]);
    const [selectedUsb, setSelectedUSB] = useState({ id: null, diskSize: null, availSize: null });


    const resetFields = () => {
        setLogTypes([...availableLogType])
        setCount(100);
        setSelectedUSB({ id: null, diskSize: null, availSize: null })
        setDownloadFields({ logTypes: logTypes, count: count, usb: selectedUsb })
    }


    useEffect(() => {
        setDownloadFields({ logTypes: logTypes, count: count, usb: selectedUsb })
    }, [logTypes, count, selectedUsb]);


    useEffect(() => {
        if (usbList.length) {
            const defaultUSB = { id: usbList[0]?.id, diskSize: usbList[0]?.diskSize, availSize: usbList[0]?.availSize }
            setSelectedUSB(defaultUSB);
        };
        return () => { resetFields() }
    }, [usbList])


    const handleLogTypeChange = ({ target: { value: logType } }) => {
        setLogTypes(typeof logType === 'string' ? logType.split(',') : logType);
    };


    const handlerUSBChange = ({ target: { value: usbID } }) => {
        const currentUSB = usbList.find(usb => usb.id === usbID);
        if (currentUSB) {
            setSelectedUSB({
                id: currentUSB?.id,
                diskSize: currentUSB?.diskSize,
                availSize: currentUSB?.availSize
            });
        }
    }

    return (
        <>
            <Grid container item xs={12} justifyContent={'space-between'} alignItems={'center'} mt={7}>
                <Grid item >
                    <Typography variant='body3' fontSize={'2.5em'} fontWeight={'bold'}>
                        {t(`logs_page.download.info.log_type`)}
                    </Typography>
                </Grid>
                <Grid item>
                    <FormControl>
                        <InputLabel id="demo-multiple-checkbox-label"></InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            sx={{ width: '20vw', height: '5vh', fontSize: '2em' }}
                            multiple
                            value={logTypes}
                            onChange={handleLogTypeChange}
                            input={<OutlinedInput sx={{ fontSize: '2em' }} />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {availableLogType.map((type) => (
                                <MenuItem key={type} value={type}>
                                    <Checkbox checked={logTypes.includes(type)} size={'large'} />
                                    <ListItemText primary={type} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container item xs={12} justifyContent={'space-between'} alignItems={'center'} mt={3}>
                <Grid item >
                    <Typography variant='body3' fontSize={'2.5em'} fontWeight={'bold'}>
                        {t(`logs_page.download.info.log_count`)}
                    </Typography>
                </Grid>
                <Grid item>
                    <FormControl>
                        <Select
                            sx={{ width: '20vw', height: '5vh', fontSize: '2em' }}
                            value={count}
                            onChange={(e) => { setCount(e.target.value) }}
                        >
                            <MenuItem value={100}>Latest - 100</MenuItem>
                            <MenuItem value={500}>Latest - 500</MenuItem>
                            <MenuItem value={1000}>Latest - 1000</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container item xs={12} justifyContent={'space-between'} alignItems={'center'} mt={3} mb={5}>
                <Grid item >
                    <Typography variant='body3' fontSize={'2.5em'} fontWeight={'bold'}>
                        {t(`logs_page.download.info.usb_selection`)}
                    </Typography>
                </Grid>
                <Grid item>
                    <FormControl>
                        <Select
                            sx={{ width: '20vw', height: '5vh', fontSize: '2em' }}
                            value={selectedUsb.id}
                            onChange={handlerUSBChange}
                            disabled={usbList?.length === 0}
                        >
                            {usbList.map(usb => (
                                <MenuItem key={usb?.id} value={usb?.id}>
                                    {usb?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {
                error.show &&
                <Typography variant='body3' fontSize={'1em'} color={theme.palette.error.main} fontWeight={'bold'} mt={3}>
                    {t(`logs_page.download.error.${error.errorCode}`)}
                </Typography>
            }
        </>
    )
}

export default DownloadFormContent;