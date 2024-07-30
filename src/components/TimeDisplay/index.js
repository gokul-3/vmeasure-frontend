import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { getMoment } from '../../services/time.service';
import { useDispatch, useSelector } from 'react-redux';
import deviceApi from "../../redux/reducers/device-api"

const TimeDisplay = () => {

    const [currentTime, setCurrentTime] = useState('');
    const { refreshTime } = useSelector(state => state.deviceAPI);
    const dispatch = useDispatch();

    let timeout

    const updateTime = () => {
        getMoment().then((result) => {
            setCurrentTime(result.data)
        }).catch((err) => { })

        const seconds = new Date().getSeconds()
        const remainingTime = 60000 - (seconds * 1000);
        timeout = setTimeout(updateTime, remainingTime);
    };

    useEffect(() => {
        updateTime();
        return () => clearTimeout(timeout);      
    }, []);

    useEffect(()=>{
        if(refreshTime){
            clearTimeout(timeout)
            updateTime();
            dispatch(deviceApi.actions.triggerRefreshTime(false));
        }
    },[refreshTime])

    return (
        <Typography variant='body5' color={'CaptionText'} >
            {currentTime}
        </Typography>
    )
};

export default TimeDisplay;
