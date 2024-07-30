import SignalWifi0BarOutlinedIcon from '@mui/icons-material/SignalWifi0BarOutlined';
import SignalWifi1BarOutlinedIcon from '@mui/icons-material/SignalWifi1BarOutlined';
import SignalWifi2BarOutlinedIcon from '@mui/icons-material/SignalWifi2BarOutlined';
import SignalWifi3BarOutlinedIcon from '@mui/icons-material/SignalWifi3BarOutlined';
import SignalWifi4BarOutlinedIcon from '@mui/icons-material/SignalWifi4BarOutlined';

/**
 * @params signalLevel indicates the signal quality of the network
 * @return the component based on the signal quality
 */
export function WifiSignalStrength({ signalLevel, color= false, fontSize = '40px' }) {

  const iconProps = {
    sx: { fontSize: fontSize }
  };

  if (color) {
    if (signalLevel < 4) {
      iconProps.color = 'primary';
    } else {
      iconProps.color = 'error'
    }
  }

  switch (signalLevel) {
    case 1:
      return <SignalWifi4BarOutlinedIcon {...iconProps} />
    case 2:
      return <SignalWifi3BarOutlinedIcon {...iconProps} />
    case 3:
      return <SignalWifi2BarOutlinedIcon {...iconProps} />
    case 4:
      return <SignalWifi1BarOutlinedIcon {...iconProps} />
    default:
      return <SignalWifi0BarOutlinedIcon {...iconProps} />
  }
}