import {
    CardContent,
    CardMedia,
    Typography,
    Card,
    Button,
    Paper,
    CardActions,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import { getWidgetStyle } from "../utils/wiget.utils";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { addEllipsis } from "../../../utils/string-operation";

const ImageCardWidget = (props) => {
    const { schema, formContext } = props;
    const { triggerEventAPI } = formContext;
    const clickHandler = () => {
        if (schema.onClick) {
            triggerEventAPI(schema.onClick, { uuid: schema.uuid });
        }
    };
    const schemaStyle = getWidgetStyle(props);

    const cardStyle = {
        width: "21rem",
        height: "21rem",
        padding: "1rem",
        ...schemaStyle.cardStyle
    };
    const mediaStyle = {
        width: "14rem",
        height: "14rem",
        margin: "0 auto",
        ...schemaStyle.mediaStyle
    };

    return (
        <Paper elevation={5}>
            <Card style={cardStyle} onClick={clickHandler}>
                {schema.imageURL && (
                    <CardMedia sx={mediaStyle} component="img" image={schema.imageURL} />
                )}
                <Typography mt={6} variant="h4" component="div" textAlign={"center"}>
                    {schema.title}
                </Typography>
            </Card>
        </Paper>
    );
};


const MediaCardWidget = (props) => {
    const { t } = useTranslation();
    const { schema, formContext } = props;
    const { triggerEventAPI } = formContext;

    const clickHandler = () => {
        if (schema.onClick) {
            triggerEventAPI(schema.onClick, { uuid: schema.uuid });
        }
    };

    const schemaStyle = getWidgetStyle(props);

    const cardStyle = {
        width: "30rem",
        height: "45rem",
        padding: "1rem",
        ...schemaStyle.cardStyle
    };
    const mediaStyle = {
        width: "10rem",
        height: "10rem",
        margin: "0 auto",
        ...schemaStyle.mediaStyle
    };

    return (
        <Paper elevation={5}>
            <Card style={cardStyle}>
                {schema.imageURL && (
                    <CardMedia sx={mediaStyle} component="img" image={schema.imageURL} />
                )}
                <Typography mt={7} variant="h3" component="div" textAlign={"center"}>
                    {schema.title}
                </Typography>
                {schema.content && (
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"6rem"} overflow={"hidden"}>
                        <Typography
                            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                            fontSize={"2rem"}
                            component="div"
                            textAlign={"center"}
                        >
                            {addEllipsis(schema.content, 50, false)}
                        </Typography>
                    </Box>
                )}
                {schema.listData?.length > 0 &&
                    <List mt={8} sx={{ eight: "16.5rem", overflow: "auto" }}>
                        {schema.listData.map((value, index) => (
                            <>
                                {<ListItem divider />}
                                <ListItem sx={{ padding: "0.5rem 1.5rem", display: "grid", gridTemplateColumns: "60% 40%", alignContent: "center" }}>
                                    <ListItemText primary={
                                        <Typography fontSize={"1.7rem"} fontWeight={"bold"} textAlign={"left"} variant="body1">{value.label}</Typography>
                                    } />
                                    <ListItemText primary={
                                        <Typography fontSize={"1.7rem"} textAlign={"right"} variant="body1"> {value.value} </Typography>
                                    } />
                                </ListItem>
                            </>
                        ))}

                    </List>
                }
                {schema.button && (
                    <>
                        <ListItem divider />
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Button mb={2} size="large" onClick={clickHandler}>
                                <Typography
                                    fontSize={"2rem"}
                                    fontcomponent="div"
                                    textAlign={"center"}
                                >
                                    {t("custom_flow_common_text.select")}
                                </Typography>
                            </Button>
                        </CardActions>
                    </>
                )}
            </Card>
        </Paper>
    );
};


const SimpleCardWidget = (props) => {
    const { t } = useTranslation();
    const { label, schema, formContext } = props;
    const title = label;
    const content = schema?.content;
    const button = schema?.button;
    const { triggerEventAPI } = formContext;

    const handleClick = () => {
        if (schema.onClick) {
            triggerEventAPI(schema.onClick, { cardKey: schema.uuid });
        }
    };
    return (
        <>
            <Card
                sx={{ minWidth: "300px", textAlign: "center" }}
                onClick={button ? undefined : { handleClick }}
            >
                <CardContent>
                    <Typography variant="h5" component="div">
                        {t(`${title}`)}
                    </Typography>
                    <Typography variant="body2" mt={2}>
                        {t(`${content}`)}
                    </Typography>
                </CardContent>
                {button && (
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Button size="small" onClick={{ handleClick }}>
                            {t("custom_flow_common_text.select")}
                        </Button>
                    </CardActions>
                )}
            </Card>
        </>
    );
};

export { MediaCardWidget, SimpleCardWidget, ImageCardWidget };
