
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { getWidgetStyle } from "../utils/wiget.utils";
import { useTranslation } from 'react-i18next';

//DISPLAY LABEL

const LabelWidget = (props) => {
    const { t } = useTranslation();
    const { schema } = props
    const widgetStyle = { "fontWeight": "bold", ...getWidgetStyle(props) }

    return (
        <Box width={"100%"} textAlign={"center"}>
            <Typography variant="h2" sx={widgetStyle} >
                {t(`${schema.title}`)}
            </Typography>
        </Box>
    );
};

//CLICKABLE LABEL

const ClickableLabelWidget = (props) => {
    const { t } = useTranslation();
    const { schema, } = props
    const widgetStyle = { "fontWeight": "bold", ...getWidgetStyle(props) }

    const handleLabelClick = () => { };
    return (
        <Typography variant="h2" onClick={schema.onClick ? handleLabelClick : null} sx={widgetStyle} >
            {t(`${schema.title}`)}
        </Typography>
    );
};

export { LabelWidget, ClickableLabelWidget }

