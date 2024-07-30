import { Box, Typography, Chip ,Grid} from '@mui/material'
import { getWidgetStyle } from "../utils/wiget.utils";
import { getFieldStyle, getWrapperStyle, getLabelStyle } from '../../../constants/custom-flow';
import { useTranslation } from 'react-i18next';

//CHIP

const ChipWidget = (props) => {
    const { schema, formContext } = props
    const { t } = useTranslation();
    //default styles can be overridden by custom service
    const widgetStyle = { width: "2vh", height: "3vh", backgroundColor: 'rgba(128, 128, 128, 0.6)', ...getWidgetStyle(props) }
    const isFullWidth = formContext?.isFullWidth
    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(schema.title)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <Chip label={t(`${schema.title}`)} style={widgetStyle} />
                </Box>
            </Grid>
        </Grid>

    )
}

//CLICKABLE CHIP

const ClickableChipWidget = (props) => {
    const { schema, formContext } = props
    const { triggerEventAPI, isFullWidth } = formContext
    const { t } = useTranslation();
    //default styles can be overridden by custom service
    const widgetStyle = { width: "20vh", height: "6vh", backgroundColor: 'rgba(128, 128, 128, 0.6)', ...getWidgetStyle(props) }
    const handleClick = () => {
        if (schema.onClick) { triggerEventAPI(schema.onClick) }
    };

    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(schema.title)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <Chip label={t(`${schema.title}`)} style={widgetStyle} onClick={handleClick} />
                </Box>
            </Grid>
        </Grid>

    )
}

//DELETABLE CHIP
function DeletableChip(props) {
    const { t } = useTranslation();
    const { schema, formContext } = props
    const { triggerEventAPI, isFullWidth } = formContext
    const handleDelete = () => {
        //trigger delete
        if (schema.onClick) { triggerEventAPI(schema.onClick) }
    };
    const widgetStyle = { width: "20vh", height: "6vh", backgroundColor: 'rgba(128, 128, 128, 0.6)', ...getWidgetStyle(props) }
    return (
        <Grid container xs={12} sx={getWrapperStyle(isFullWidth)}>
            <Grid item xs={6} >
                <Box sx={getLabelStyle(isFullWidth)}>
                    <Typography variant="h3">
                        {t(schema.title)}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} >
                <Box sx={getFieldStyle(isFullWidth)}>
                    <Chip
                        label={t(`${schema.title}`)}
                        style={widgetStyle}
                        onDelete={handleDelete}
                    />
                </Box>
            </Grid>
        </Grid>

    )
}
export { ChipWidget, ClickableChipWidget, DeletableChip }