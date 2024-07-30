import { useRef, useState, useEffect } from 'react'
import { Button, Typography } from '@mui/material'
import { getWidgetStyle } from "../utils/wiget.utils";
import { useTranslation } from 'react-i18next';
import getIcon from './icons';
import customFlowReducer from "../../../redux/reducers/custom-workflow"
import { useDispatch } from "react-redux";

//LONG BUTTON (CUSTOMIZABLE DIMENSION)

function LongButton(props) {
    const dispatch = useDispatch();
    let style = {
        "width": "70vh",
        "height": "10vh",
        "margin": "auto",
        "variant": "contained",
        ...getWidgetStyle(props)
    }
    const { schema, formContext, value } = props
    const { triggerEventAPI } = formContext

    const handleButtonClick = () => {
        dispatch(customFlowReducer.actions.resetMessage());
        if (schema.onClick) { triggerEventAPI(schema.onClick) }
    }
    return (
        <Button variant={style["variant"]} style={style} onClick={handleButtonClick}>
            <Typography variant="body5">
                {value ?? schema.title}
            </Typography>
        </Button>
    )
}

//REGULAR BUTTON

function RegularButton(props) {
    const dispatch = useDispatch();
    let style = {
        // "width": "15vw",
        "height": "7vh",
        "margin": "auto",
        "variant": "contained",
        "fontSize": "2em",
        ...getWidgetStyle(props)
    }
    const { t } = useTranslation();
    const { schema, formContext } = props
    const { triggerEventAPI } = formContext
    const handleButtonClick = () => {
        dispatch(customFlowReducer.actions.resetMessage())
        if (schema.onClick) { triggerEventAPI(schema.onClick) }
    }
    return (
        <Button variant={style["variant"]} style={style} onClick={handleButtonClick} >
            <Typography variant="body5">
                {t(`${schema.title}`)}
            </Typography>

        </Button >
    )
}

//BUTTON WITH ICON

function ButtonWithIcon(props) {
    const dispatch = useDispatch();
    let style = {
        "width": "15vw",
        "height": "7vh",
        "margin": "auto",
        "variant": "contained",
        "fontSize": "2em",
        ...getWidgetStyle(props)
    }
    const { schema, formContext, value } = props
    const { triggerEventAPI } = formContext
    const IconComponent = getIcon(schema?.icon);
    const handleButtonClick = () => {
        dispatch(customFlowReducer.actions.resetMessage())
        if (schema.onClick) {
            triggerEventAPI(schema.onClick)
        }
    }
    return (
        <Button variant='contained' startIcon={< IconComponent style={{ fontSize: style.fontSize }} />} style={style} onClick={handleButtonClick}>
            <Typography variant="body5">
                {value ?? schema.title}
            </Typography>
        </ Button>
    )
}

//BUTTON WITH TIMER
function CounterButton(props) {
    const dispatch = useDispatch();
    const { schema, formContext } = props
    const style = {
        "variant": "contained",
        "width": "70vh",
        "height": "10vh",
        "margin": "auto",
        ...getWidgetStyle(props)
    }

    const [buttonText, setButtonText] = useState('');
    const [progress, setProgress] = useState(schema.timeInSeconds);
    const timerRef = useRef(null);

    const { triggerEventAPI } = formContext

    const onTimerClose = () => {
        dispatch(customFlowReducer.actions.resetMessage())
        clearInterval(timerRef.current);
        if (schema.onClick) {
            triggerEventAPI(schema.onClick)
        }
    };

    const startTimerProgress = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 0) {
                    return 0;
                }
                return Math.max(oldProgress - 1, 0);
            });
        }, 1000);
        timerRef.current = interval;
    };


    useEffect(() => {
        if (progress === 0) {
            onTimerClose();
        } else {
            setButtonText(`Time left: ${progress} seconds`);
        }
    }, [progress]);


    useEffect(() => {
        startTimerProgress();
    }, []);

    return (
        <Button variant="contained" style={style} onClick={onTimerClose}>
            <Typography variant="body5">
                {buttonText}
            </Typography>
        </Button>
    )
}

export { LongButton, ButtonWithIcon, CounterButton, RegularButton }