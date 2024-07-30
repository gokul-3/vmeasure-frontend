import { Grid, Box, IconButton } from '@mui/material'
import { MenuItems } from './icons/menu-icons'
import { getWidgetStyle, getWidgetAttributes } from "../utils/wiget.utils";
import getIcon from './icons';
import { useTranslation } from 'react-i18next';

//ICON DISPLAY
function IconWidget(props) {
    const widgetStyle = { fontSize: 100, "margin": "auto", ...getWidgetStyle(props) }
    const IconComponent = getIcon(props?.schema?.icon)
    return (
        <div>
            <IconComponent style={widgetStyle} />
        </div>
    );
}

//ICON WITH TITLE
function TitledIconWidget(props) {
    const { t } = useTranslation();
    const widgetStyle = { "width": "70vh", "height": "10vh", "margin": "auto", ...getWidgetStyle(props) }
    let fontStyle = { "fontSize": "20px", "fontWeight": "bold", "color": "black" }
    const { labelPosition } = getWidgetAttributes(props) || 'top'
    const IconComponent = getIcon(props.schema?.icon);
    return (
        <div>
            <Grid container>
                <Box style={{ display: 'flex', flexDirection: labelPosition === 'top' ? 'column' : 'column-reverse', alignItems: "center" }}>
                    <label style={fontStyle}>{t(`${props.schema?.title}`)}</label>
                    <IconComponent style={widgetStyle}></IconComponent>
                </Box>
            </Grid>
        </div>
    );
}


//CLICKABLE ICON
function ClickableIconWidget(props) {
    const { schema, formContext } = props
    const widgetStyle = { "width": "70vh", "height": "10vh", "margin": "auto", ...getWidgetStyle(props) }
    const { triggerEventAPI } = formContext

    const handleIconClick = () => {
        triggerEventAPI(schema.onClick)
    }
    const IconComponent = getIcon(schema?.icon)
    return (
        <div>
            <IconButton onClick={schema.onClick ? handleIconClick : null}>
                <IconComponent style={widgetStyle} />
            </IconButton>

        </div>

    );
}
function ClickableTitledIconWidget(props) {
    const { t } = useTranslation();
    const { schema,formContext } = props
    const { triggerEventAPI } = formContext
    let fontStyle = {
        "fontSize": "3rem",
        "fontWeight": "bold",
        "color": "black"
    }
    const widgetStyle = { "width": "70vh", "height": "10vh", "margin": "auto", "backgroundColor": 'transparent', ...getWidgetStyle(props) }
    const { labelPosition } = getWidgetAttributes(props) || 'top'
    const IconComponent = getIcon(schema?.icon);


    const handleIconClick = () => {
        triggerEventAPI(schema.onClick)
    };

    return (
        <Grid container>
            <div style={{ display: 'flex', flexDirection: labelPosition === 'top' ? 'column' : 'column-reverse', alignItems: "center" }}>
                <label style={fontStyle}>{t(`${schema?.title}`)}</label>
                <IconButton style={widgetStyle} onClick={schema.onClick ? handleIconClick : null}>
                    <IconComponent style={widgetStyle} />
                </IconButton>
            </div>
        </Grid>
    );
}

function MenuIconWidget(props) {
    const { schema,formContext } = props
    const { triggerEventAPI } = formContext

    const IconComponent = getIcon(schema?.icon)
    const handleIconClick = () => {
        triggerEventAPI(schema.onClick)
    };
    return (
        <Grid container sx={{ height: '100%', }} justifyContent={'center'} alignItems={'center'} display={'flex'} >
                <MenuItems
                    Icon={IconComponent}
                    title={schema?.title}
                    triggerEventAPI={handleIconClick}
                />
        </Grid>
    );
}


export { IconWidget, ClickableIconWidget, TitledIconWidget, ClickableTitledIconWidget,MenuIconWidget }