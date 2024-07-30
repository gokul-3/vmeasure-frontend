import { Lan } from "@mui/icons-material";
import { SvgIcon } from '@mui/material';


const LanOffIcon = () => {

    /* color code for MUi primary color - #1976D2
        color code for MUi action color - #757575 */

    return (<SvgIcon sx={{ fontSize: '4em' }}>
                <Lan color='action' />
                {/* Cross line */}
                <line x1="2" y1="5" x2="32" y2="35" style={{ stroke: '#757575', strokeWidth: 2 }} />
                <line x1="5" y1="5" x2="35" y2="35" style={{ stroke: 'white', strokeWidth: 2 }} />
            </SvgIcon> );
}

export function LanIndicator({ isConnected, isInternetAvailable }) {
    if(!isConnected) {
        return <LanOffIcon />
    } 
    else if(isConnected && !isInternetAvailable) {
        return <Lan sx={{ fontSize: '4em' }} color='error' />
    }
    else {
        return <Lan sx={{fontSize: '4em'}} color='primary' />
    }
}