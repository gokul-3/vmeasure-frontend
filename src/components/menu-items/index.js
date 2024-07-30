import React from "react";
import {
    Grid,
    useTheme,
    Typography,
    Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotificationBadge = ({ PrefixIcon }) => {
    const theme = useTheme();
    return <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 'modal',
            position: 'absolute',
            top: '5%',
            right: '5%',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: theme.palette.error.dark,
        }}
    >
        <PrefixIcon
            fontSize="large"
            sx={{
                transform: 'scale(1.8)',
                color: "pink",
            }}
        />
    </Box>
}

export const MenuItems = ({ Icon, href, title, disabled = false, PrefixIcon = null }) => {
    const size = '15em'

    const theme = useTheme();

    const handleClick = () => {
        if (!disabled) {
            navigate(href)
        }
    }

    const navigate = useNavigate();

    return (
        <Grid
            item
            xs={4}
            height={'33%'}
            display={'flex'}
            justifyContent={'center'}
        >
            <Box sx={{ margin: 'auto' }} onClick={handleClick} >
                <Grid item sx={{
                    width: size,
                    height: size,
                    padding: '2em',
                    backgroundColor: theme.palette.primary.main,
                    marginX: 'auto',
                    borderRadius: '50%',
                    opacity: disabled ? '0.5' : 1,
                    position: 'relative'
                }}>
                    {PrefixIcon && <NotificationBadge PrefixIcon={PrefixIcon} />}
                    <Icon />
                </Grid>

                <Typography variant="h3" mt={2} textAlign={'center'}>
                    {title}
                </Typography>
            </Box>
        </Grid>
    )

}