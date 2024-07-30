
import { UIProps } from "../../../../constants/custom-flow";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Grid, IconButton, Typography, Box } from "@mui/material";

const Header = ({ pageTitle, handleBackButton, isBackNavEnabled, disabled }) => {
    return (
        <Grid item container sx={UIProps.DefaultStyles.header} >
            <Grid item xs={12} sx={{ height: "100%", width: "100%" }} >
                <Box width={"100%"} height={"100%"} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    {
                        isBackNavEnabled &&
                        <Grid >
                            <IconButton aria-label="delete" size="large" onClick={handleBackButton} disabled={disabled} >
                                <ArrowBackIcon color="primary" sx={{ fontSize: '3em' }} />
                            </IconButton>
                        </Grid>
                    }
                    {pageTitle && <Typography variant="h3" component="h1" >{pageTitle}</Typography>}
                </Box>
            </Grid>
        </Grid>
    )
}
export default Header;