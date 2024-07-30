import { Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { getWidgetStyle } from "../utils/wiget.utils";

//list
const ListWidget = (props) => {
    const { t } = useTranslation();
    const { value } = props

    const widgetStyle = { ...getWidgetStyle(props) }
    return (
        <Box width={"100%"} textAlign={"center"}>
            {value &&
                value.map((option, index) => (
                    <Typography key={index} variant="h3" sx={widgetStyle}>
                        {t(`${option}`)}
                    </Typography>
                ))
            }
        </Box>
    );
}

export { ListWidget }