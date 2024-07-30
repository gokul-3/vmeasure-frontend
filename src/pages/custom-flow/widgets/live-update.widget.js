import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from "@mui/material/LinearProgress";
import { getWidgetStyle } from "../utils/wiget.utils";
import { useTranslation } from 'react-i18next';

export const LiveLabel = (props) => {
    const { t } = useTranslation();
    const { value } = props
    const widgetStyle = { "fontWeight": "normal", ...getWidgetStyle(props) }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h2" sx={widgetStyle}>
                {t(`${value}`)}
            </Typography>
        </div>

    );
};


export const LiveProgress = (props) => {
    const { value } = props
    const widgetStyle = { height: '2vh', width: '80%', borderRadius: 2, ...getWidgetStyle(props) }
    return (
        <Box sx={{ widgetStyle }}>
            <LinearProgress value={value ?? 0} />
        </Box>
    );
};