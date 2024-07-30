import React from "react";
import {
    Grid,
    useTheme,
    Typography,
    Box
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const MenuItems = ({ Icon, title, disabled = false, triggerEventAPI = null }) => {
    const {t} =useTranslation()
    const size = '20em'
    const handleClick = () => {
        triggerEventAPI()
    }
    const theme = useTheme();
    return (
        <Grid
            item
            xs={4}
            height={'33%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={"center"}
        >
            <Box sx={{ margin: 'auto' }} onClick={handleClick} >
                <Grid item sx={{
                    width: size,
                    height: size,
                    padding: '4em',
                    backgroundColor: theme.palette.primary.main,
                    alignItems:"center",
                    marginX: 'auto',
                    borderRadius: '50%',
                    opacity: disabled ? '0.5' : 1,
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon style={{ color: "white", fontSize: "12em" }} />
                    </div>
                </Grid>
                <Typography variant="h3" mt={2} textAlign={'center'}>
                    {t(title)}
                </Typography>
            </Box>
        </Grid>
    )

}