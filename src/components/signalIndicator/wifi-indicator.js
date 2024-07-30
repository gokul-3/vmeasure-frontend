import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';
import { WifiSignalStrength } from './wifi-signal';


export function WifiIndicator({ isConnected, isInternetAvailable = true, signalLevel}){
    if(!isConnected) {
        return <SignalWifiOffIcon sx={{fontSize:'4em'}} color='action' />
    }
    else if(isConnected && !isInternetAvailable) {
        return <SignalWifiStatusbarConnectedNoInternet4Icon sx={{fontSize:'4em'}} color= 'error' />
    }
    else {
        return <WifiSignalStrength signalLevel={signalLevel} color={true} fontSize='4em'/>
    }
}